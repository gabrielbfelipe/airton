"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AMBIENTES, AMBIENTES_BY_ID } from "@/lib/site";
import { animateValue, damp, TILT_DAMP_RATE } from "@/lib/animation/easings";
import {
  drawCover,
  drawShade,
  resizeCanvas,
  tracePortalPath,
  TILT_MAX_X,
  TILT_MAX_Y,
} from "@/lib/animation/projection";
import { allowsHeavyCanvas, allowsVideo, useMotionTier } from "@/lib/motion-profile";

/** Raio do canto da janela, em px, quando ela está em repouso. */
const CORNER_RADIUS = 90;
/** Duração da expansão da janela até preencher a seção. */
const EXPAND_MS = 1100;
/** Duração da reabertura da máscara no novo ambiente. */
const REVEAL_MS = 1050;

/**
 * Portal de Ambientes.
 *
 * O coração visual do site. Em vez de rotacionar um card com transform 3D —
 * que gira a imagem junto e entrega o truque — pintamos um retângulo
 * arredondado PROJETADO num canvas e o usamos como `clip()`. A mídia é
 * desenhada travada na seção, então o que se move é a janela, não a imagem.
 *
 * Mecânica portada do prompt 1 do motionsites.ai.
 */
export function PortalAmbientes() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const portalRef = useRef<HTMLButtonElement>(null);
  const portalVideoRef = useRef<HTMLVideoElement>(null);
  const portalImageRef = useRef<HTMLImageElement>(null);

  const [currentId, setCurrentId] = useState(AMBIENTES[0].id);
  const [busy, setBusy] = useState(false);
  const [switching, setSwitching] = useState(0);

  const tier = useMotionTier();
  const canvasAllowed = allowsHeavyCanvas(tier);
  const videoAllowed = allowsVideo(tier);

  const current = AMBIENTES_BY_ID[currentId];
  const next = AMBIENTES_BY_ID[current.next];

  /* Estado de animação fora do React: estes valores mudam a 60fps e não
     podem passar por re-render. */
  const anim = useRef({
    rotX: 0,
    rotY: 0,
    targetX: 0,
    targetY: 0,
    expansion: 0,
    maskScale: 1,
    lastTime: 0,
    busy: false,
  });

  /* ---------------------------------------------------------------- */
  /* Loop de desenho                                                   */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (!canvasAllowed) return;

    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    let ctx = canvasRef.current?.getContext("2d") ?? null;
    let raf = 0;

    const fit = () => {
      const { width, height } = section.getBoundingClientRect();
      ctx = resizeCanvas(canvas, width, height);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(section);

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      if (!ctx) return;

      const state = anim.current;
      const dt = state.lastTime ? Math.min(40, time - state.lastTime) : 16;
      state.lastTime = time;

      // Amortecimento do tilt, independente de framerate.
      state.rotX = damp(state.rotX, state.targetX, dt, TILT_DAMP_RATE);
      state.rotY = damp(state.rotY, state.targetY, dt, TILT_DAMP_RATE);

      const bounds = section.getBoundingClientRect();
      const viewW = bounds.width;
      const viewH = bounds.height;
      ctx.clearRect(0, 0, viewW, viewH);

      const portal = portalRef.current;
      if (!portal) return;

      const rect = portal.getBoundingClientRect();
      const rectCx = rect.left - bounds.left + rect.width / 2;
      const rectCy = rect.top - bounds.top + rect.height / 2;

      const e = state.expansion;
      const cx = rectCx + (viewW / 2 - rectCx) * e;
      const cy = rectCy + (viewH / 2 - rectCy) * e;

      const baseW = rect.width + (viewW - rect.width) * e;
      const baseH = rect.height + (viewH - rect.height) * e;

      const scale = e ? 1 : state.maskScale;
      const w = baseW * scale;
      const h = baseH * scale;
      if (w <= 1 || h <= 1) return;

      const radius = CORNER_RADIUS * (1 - e) * scale;
      const rx = state.rotX * (1 - e);
      const ry = state.rotY * (1 - e);

      const media: HTMLVideoElement | HTMLImageElement | null =
        videoAllowed && portalVideoRef.current?.readyState
          ? portalVideoRef.current
          : portalImageRef.current;

      if (!media) return;

      ctx.save();
      tracePortalPath(ctx, w, h, radius, rx, ry, cx, cy);
      ctx.clip();
      ctx.fillStyle = "#030303";
      ctx.fillRect(0, 0, viewW, viewH);
      drawCover(ctx, media, viewW, viewH);
      if (e > 0) drawShade(ctx, viewW, viewH);
      ctx.restore();
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [canvasAllowed, videoAllowed]);

  /* ---------------------------------------------------------------- */
  /* Tilt pelo ponteiro                                                */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (!canvasAllowed) return;
    const section = sectionRef.current;
    if (!section) return;

    const onMove = (event: PointerEvent) => {
      if (anim.current.busy || event.pointerType !== "mouse") return;
      const bounds = section.getBoundingClientRect();
      anim.current.targetY =
        ((event.clientX - bounds.left) / bounds.width - 0.5) * (TILT_MAX_Y * 2);
      anim.current.targetX =
        ((event.clientY - bounds.top) / bounds.height - 0.5) * -(TILT_MAX_X * 2);
    };

    const onLeave = () => {
      anim.current.targetX = 0;
      anim.current.targetY = 0;
    };

    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);

    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, [canvasAllowed]);

  /* ---------------------------------------------------------------- */
  /* Viagem entre ambientes                                            */
  /* ---------------------------------------------------------------- */

  const travel = useCallback(async () => {
    if (anim.current.busy) return;

    // Sem canvas, a troca é instantânea — continua funcionando, só não encena.
    if (!canvasAllowed) {
      setCurrentId(current.next);
      setSwitching((n) => n + 1);
      return;
    }

    anim.current.busy = true;
    setBusy(true);
    anim.current.targetX = 0;
    anim.current.targetY = 0;

    try {
      // A janela engole a seção, revelando o próximo ambiente.
      await animateValue((v) => (anim.current.expansion = v), EXPAND_MS);

      setCurrentId(current.next);
      setSwitching((n) => n + 1);

      // Dois frames para o React comitar o novo estado antes de reabrir.
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);

      anim.current.expansion = 0;
      anim.current.maskScale = 0;
      await animateValue((v) => (anim.current.maskScale = v), REVEAL_MS);
    } finally {
      anim.current.expansion = 0;
      anim.current.maskScale = 1;
      anim.current.busy = false;
      setBusy(false);
    }
  }, [canvasAllowed, current.next]);

  /* Troca a fonte do portal sempre que o ambiente comita. */
  useEffect(() => {
    const video = portalVideoRef.current;
    if (!video || !videoAllowed) return;
    if (video.getAttribute("src") !== next.media) {
      video.setAttribute("src", next.media);
      video.load();
      void video.play().catch(() => {});
    }
  }, [next.media, videoAllowed]);

  return (
    <section
      ref={sectionRef}
      id="servicos"
      aria-label="Ambientes que climatizamos"
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-ink"
    >
      {/* Fundo: o ambiente atual */}
      <div className="absolute inset-0" aria-hidden>
        {AMBIENTES.map((ambiente) => (
          <div
            key={ambiente.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              ambiente.id === currentId ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ambiente.poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            {videoAllowed && ambiente.id === currentId && (
              <video
                src={ambiente.media}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </div>
        ))}
        {/* Três camadas de scrim: o ambiente precisa aparecer, mas quem
            manda na hierarquia é o texto técnico. */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/75" />
        <div className="absolute inset-0 bg-ink/35" />
      </div>

      {/* Canvas da máscara */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[3]"
      />

      {/* Fontes de pixel do portal: existem só para o canvas amostrar */}
      <div className="pointer-events-none invisible absolute h-px w-px overflow-hidden" aria-hidden>
        <video ref={portalVideoRef} muted loop playsInline preload="auto" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={portalImageRef} src={next.poster} alt="" />
      </div>

      {/* --------------------------------------------------------- */}
      {/* Chrome                                                     */}
      {/* --------------------------------------------------------- */}

      <div
        className={`relative z-[4] mx-auto flex min-h-[100svh] w-full max-w-[1600px] flex-col px-5 pb-10 pt-24 transition-[opacity,filter] duration-500 sm:px-8 lg:px-14 ${
          busy ? "pointer-events-none opacity-0 blur-lg" : "opacity-100 blur-0"
        }`}
      >
        <header className="mb-8 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
            Onde entregamos conforto
          </p>
          <h2 className="font-display mt-3 text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
            Cada ambiente pede
            <br />
            uma conta diferente.
          </h2>
        </header>

        <div className="flex flex-1 flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          {/* Lista de ambientes */}
          <nav
            key={switching}
            aria-label="Ambientes"
            className="order-2 flex shrink-0 flex-row flex-wrap gap-x-5 gap-y-2 lg:order-1 lg:w-44 lg:flex-col"
          >
            {AMBIENTES.map((ambiente, i) => {
              const active = ambiente.id === currentId;
              return (
                <button
                  key={ambiente.id}
                  type="button"
                  onClick={() => !busy && setCurrentId(ambiente.id)}
                  data-cursor="Ver"
                  style={{ animationDelay: `${0.02 + i * 0.03}s` }}
                  className={`flex items-center gap-2 text-left transition-colors [animation:menu-row_.58s_var(--ease-expo)_both] ${
                    active
                      ? "text-lg font-bold text-paper"
                      : "text-base text-paper/55 hover:text-paper/90"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`block rounded-full bg-cyan transition-all ${
                      active ? "h-3 w-3" : "h-0 w-0"
                    }`}
                  />
                  {ambiente.name}
                </button>
              );
            })}
          </nav>

          {/* O portal */}
          <div className="order-1 mx-auto w-full max-w-[320px] lg:order-2 lg:mx-0">
            <div className="mb-3 flex items-end justify-between text-sm">
              <span className="text-paper/60">Próximo:</span>
              <span className="flex items-baseline gap-2">
                <span className="font-mono text-paper/60">{next.number}</span>
                <strong className="text-lg font-bold">{next.name}</strong>
              </span>
            </div>

            <button
              ref={portalRef}
              type="button"
              onClick={travel}
              disabled={busy}
              data-cursor="Entrar"
              aria-label={`Ir para ${next.name}`}
              className="relative block w-full cursor-pointer border-0 bg-transparent p-0 [aspect-ratio:320/350]"
            >
              {/* Quando o canvas não roda, o próprio botão mostra a imagem. */}
              {!canvasAllowed && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={next.poster}
                  alt={next.name}
                  className="h-full w-full rounded-[90px] object-cover"
                />
              )}
            </button>
          </div>

          {/* Conteúdo do ambiente atual */}
          <div key={`facts-${currentId}`} className="order-3 flex-1 lg:max-w-[520px]">
            <h3 className="font-display pb-2 text-[clamp(2.75rem,7vw,5rem)] leading-[0.85] [animation:title-rise_1.05s_var(--ease-quint)_both]">
              {current.name.toUpperCase()}
            </h3>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-paper/70 [animation:fact-rise_.72s_var(--ease-expo)_.3s_both]">
              {current.intro}
            </p>

            <dl className="mt-6">
              {current.facts.map(([term, detail], i) => (
                <div
                  key={term}
                  style={{ animationDelay: `${0.52 + i * 0.16}s` }}
                  className="grid gap-x-4 gap-y-1 border-b border-paper/20 py-3 last:border-b-0 sm:grid-cols-[138px_1fr] [animation:fact-rise_.72s_var(--ease-expo)_both]"
                >
                  <dt className="text-sm font-bold text-cyan">{term}</dt>
                  <dd className="m-0 text-sm leading-relaxed text-paper/75">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
