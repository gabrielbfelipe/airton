/**
 * Curvas de easing do sistema.
 *
 * Os valores aqui são os mesmos dos prompts de referência do motionsites.ai —
 * não são aproximações. A assinatura de movimento do site depende deles.
 */

/** Curva de saída suave usada em quase todo reveal. */
export const EASE_OUT_EXPO = "cubic-bezier(.22, 1, .36, 1)";

/** Curva mais longa e dramática — logo voando, título subindo. */
export const EASE_OUT_QUINT = "cubic-bezier(.16, 1, .3, 1)";

/** Equivalentes para GSAP (que não aceita a string CSS). */
export const GSAP_EASE_OUT_EXPO = "expo.out";
export const GSAP_EASE_OUT_QUINT = "power4.out";

/**
 * easeInOutCubic — a única curva usada nas animações dirigidas por JS
 * (expansão do portal, reveal da máscara).
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Dirige um valor de 0 a 1 ao longo de `duration` ms com easeInOutCubic,
 * chamando `setter` a cada frame. Resolve quando termina.
 *
 * Retorna também um `cancel` para abortar — essencial para não deixar
 * rAF órfão quando o componente desmonta no meio de uma transição.
 */
export function animateValue(
  setter: (v: number) => void,
  duration: number,
): Promise<void> & { cancel: () => void } {
  let raf = 0;
  let cancelled = false;

  const promise = new Promise<void>((resolve) => {
    const start = performance.now();

    const step = (now: number) => {
      if (cancelled) return resolve();
      const linear = Math.min(1, (now - start) / duration);
      setter(easeInOutCubic(linear));
      if (linear < 1) {
        raf = requestAnimationFrame(step);
      } else {
        resolve();
      }
    };

    raf = requestAnimationFrame(step);
  }) as Promise<void> & { cancel: () => void };

  promise.cancel = () => {
    cancelled = true;
    cancelAnimationFrame(raf);
  };

  return promise;
}

/**
 * Interpolação linear com amortecimento independente de framerate.
 * `dt` em ms, limitado a 40ms para não dar salto quando a aba volta do background.
 */
export function damp(current: number, target: number, dt: number, rate: number): number {
  return current + (target - current) * Math.min(1, dt * rate);
}

/** Taxa de amortecimento do tilt do portal (prompt 1: `dt * .009`). */
export const TILT_DAMP_RATE = 0.009;

/** Taxa de amortecimento do cursor customizado (prompt 1: lerp 0.2/frame). */
export const CURSOR_LERP = 0.2;
