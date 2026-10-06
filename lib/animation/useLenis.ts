"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

/**
 * Smooth scroll do Lenis conduzido pelo ticker do GSAP.
 *
 * Deixar os dois com rAF próprio causa um frame de descompasso entre a posição
 * de scroll e o cálculo do ScrollTrigger — o sintoma é o conteúdo "pinado"
 * tremendo. Um único ticker resolve.
 */
export function useLenis(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Em toque, o scroll nativo é melhor que qualquer emulação.
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [enabled]);
}
