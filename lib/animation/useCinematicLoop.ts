"use client";

import { useEffect, type RefObject } from "react";

/**
 * Loop manual de vídeo com fade de entrada e saída.
 *
 * Portado do prompt 2 do motionsites.ai. O atributo `loop` nativo corta seco
 * no fim do arquivo e o salto é visível — é a marca registrada de site amador.
 * Aqui monitoramos `currentTime` por requestAnimationFrame, baixamos a opacidade
 * antes do fim, reiniciamos com uma pausa curta e subimos de novo.
 */

type Options = {
  /** Duração do fade, em segundos. */
  fade?: number;
  /** Pausa antes de reiniciar, em ms. Evita o flash do primeiro frame. */
  restartDelay?: number;
  /** Quando falso, o vídeo é pausado e o loop não roda. */
  enabled?: boolean;
};

export function useCinematicLoop(
  ref: RefObject<HTMLVideoElement | null>,
  { fade = 0.5, restartDelay = 100, enabled = true }: Options = {},
): void {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (!enabled) {
      video.pause();
      video.style.opacity = "1";
      return;
    }

    let raf = 0;
    let restartTimer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;

    const tick = () => {
      if (disposed) return;
      const { currentTime, duration } = video;

      if (Number.isFinite(duration) && duration > fade * 2) {
        let opacity = 1;

        if (currentTime < fade) {
          // Entrada
          opacity = currentTime / fade;
        } else if (currentTime > duration - fade) {
          // Saída
          opacity = Math.max(0, (duration - currentTime) / fade);
        }

        video.style.opacity = opacity.toFixed(3);
      }

      raf = requestAnimationFrame(tick);
    };

    const onEnded = () => {
      video.style.opacity = "0";
      restartTimer = setTimeout(() => {
        if (disposed) return;
        video.currentTime = 0;
        void video.play().catch(() => {
          /* autoplay bloqueado: o poster permanece visível */
        });
      }, restartDelay);
    };

    video.addEventListener("ended", onEnded);
    video.style.opacity = "0";
    void video.play().catch(() => {
      /* autoplay bloqueado: o poster permanece visível */
    });
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      if (restartTimer) clearTimeout(restartTimer);
      video.removeEventListener("ended", onEnded);
    };
  }, [ref, fade, restartDelay, enabled]);
}
