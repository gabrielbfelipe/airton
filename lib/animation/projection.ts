/**
 * Projeção em perspectiva falsa para a máscara do Portal de Ambientes.
 *
 * Portado da mecânica central do prompt 1 do motionsites.ai. A ideia:
 * em vez de rotacionar um card com `transform: rotate3d` (que gira a imagem
 * junto), desenhamos um retângulo arredondado projetado num canvas e usamos
 * ele como `clip()`. A mídia é pintada travada na tela (screen-locked), então
 * o que se move é a JANELA, não a imagem — o efeito de paralaxe real.
 */

/** Distância focal da projeção. Valor exato do prompt de referência. */
export const FOCAL = 850;

/** Amplitude máxima do tilt, em graus. */
export const TILT_MAX_Y = 37.4 / 2; // ±18.7° no eixo vertical (mouse em X)
export const TILT_MAX_X = 33 / 2; //  ±16.5° no eixo horizontal (mouse em Y)

export type Point = readonly [number, number];

/**
 * Gera os pontos de um retângulo arredondado em coordenadas locais
 * centradas na origem. Cada canto é percorrido em 10 passos, produzindo
 * ~44 pontos — densidade suficiente para a curva não facetar na projeção.
 */
export function roundedRectPoints(w: number, h: number, r: number): Point[] {
  const radius = Math.min(r, w / 2, h / 2);
  const hw = w / 2;
  const hh = h / 2;
  const HALF_PI = Math.PI / 2;

  /** [centroX, centroY, ânguloInicial, ânguloFinal] de cada canto. */
  const corners: readonly [number, number, number, number][] = [
    [hw - radius, -hh + radius, -HALF_PI, 0], // superior direito
    [hw - radius, hh - radius, 0, HALF_PI], // inferior direito
    [-hw + radius, hh - radius, HALF_PI, Math.PI], // inferior esquerdo
    [-hw + radius, -hh + radius, Math.PI, Math.PI * 1.5], // superior esquerdo
  ];

  const STEPS = 10;
  const points: Point[] = [];

  for (const [cx, cy, from, to] of corners) {
    for (let i = 0; i <= STEPS; i++) {
      const angle = from + ((to - from) * i) / STEPS;
      points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
    }
  }

  return points;
}

/**
 * Projeta um ponto local em coordenadas de tela aplicando rotação
 * em dois eixos e divisão perspectiva.
 *
 * @param rx rotação no eixo X, em graus
 * @param ry rotação no eixo Y, em graus
 * @param cx centro de destino na tela
 * @param cy centro de destino na tela
 */
export function project(
  x: number,
  y: number,
  rx: number,
  ry: number,
  cx: number,
  cy: number,
): Point {
  const ax = (rx * Math.PI) / 180;
  const ay = (ry * Math.PI) / 180;

  const xx = x * Math.cos(ay);
  const yy = y * Math.cos(ax);
  const z = x * Math.sin(ay) - y * Math.sin(ax);
  const p = FOCAL / (FOCAL + z);

  return [cx + xx * p, cy + yy * p];
}

/**
 * Traça o caminho da janela projetada no contexto 2D, pronto para `clip()`.
 */
export function tracePortalPath(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  radius: number,
  rx: number,
  ry: number,
  cx: number,
  cy: number,
): void {
  const local = roundedRectPoints(w, h, radius);

  ctx.beginPath();
  local.forEach(([x, y], i) => {
    const [sx, sy] = project(x, y, rx, ry, cx, cy);
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  });
  ctx.closePath();
}

/**
 * Desenha a mídia em modo "cover" preenchendo a viewport inteira,
 * centralizada e travada na tela. É o que faz a imagem NÃO acompanhar
 * o tilt da janela.
 */
export function drawCover(
  ctx: CanvasRenderingContext2D,
  media: HTMLVideoElement | HTMLImageElement,
  viewW: number,
  viewH: number,
): void {
  const mw =
    media instanceof HTMLVideoElement ? media.videoWidth : media.naturalWidth;
  const mh =
    media instanceof HTMLVideoElement ? media.videoHeight : media.naturalHeight;

  if (!mw || !mh) return;

  const scale = Math.max(viewW / mw, viewH / mh);
  const w = mw * scale;
  const h = mh * scale;

  ctx.drawImage(media, (viewW - w) / 2, (viewH - h) / 2, w, h);
}

/**
 * Gradiente inferior que assenta o conteúdo sobre a mídia.
 * Mesmos stops do prompt: transparente em 52% da altura, 88% de preto na base.
 */
export function drawShade(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  viewH: number,
): void {
  const gradient = ctx.createLinearGradient(0, viewH * 0.52, 0, viewH);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, "rgba(0, 0, 0, .88)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, viewH * 0.52, viewW, viewH * 0.48);
}

/**
 * Redimensiona um canvas respeitando o devicePixelRatio, limitado a 2.
 * Acima disso o custo de fill-rate não compensa em tela de celular.
 */
export function resizeCanvas(
  canvas: HTMLCanvasElement,
  viewW: number,
  viewH: number,
): CanvasRenderingContext2D | null {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = viewW * dpr;
  canvas.height = viewH * dpr;
  canvas.style.width = `${viewW}px`;
  canvas.style.height = `${viewH}px`;

  const ctx = canvas.getContext("2d");
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}
