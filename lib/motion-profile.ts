"use client";

import { useEffect, useState } from "react";

/**
 * Perfil de movimento do dispositivo.
 *
 * Este é o mecanismo que impede o site de morrer num celular modesto —
 * que é exatamente o aparelho de boa parte dos clientes do Airton.
 *
 * - `cinematic`: tudo ligado. WebGL, portal canvas com tilt, partículas, vídeo.
 * - `reduced`:   sem 3D e sem canvas de partículas; vídeo e reveals continuam.
 * - `static`:    só imagem e transições mínimas. A página segue completa e vendendo.
 */
export type MotionTier = "cinematic" | "reduced" | "static";

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

export function detectMotionTier(): MotionTier {
  if (typeof window === "undefined") return "static";

  // Preferência explícita do usuário vence qualquer heurística de hardware.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "static";
  }

  const nav = navigator as NavigatorWithHints;

  // Economia de dados: nada de baixar vídeo.
  if (nav.connection?.saveData) return "static";

  const effectiveType = nav.connection?.effectiveType;
  if (effectiveType === "slow-2g" || effectiveType === "2g") return "static";
  if (effectiveType === "3g") return "reduced";

  const memory = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  if (memory < 4 || cores < 4) return "reduced";

  // Telas de toque estreitas: vídeo e reveals sim, WebGL não.
  // Rodar three.js num celular intermediário derruba o scroll inteiro.
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (coarse || window.innerWidth < 1024) return "reduced";

  return "cinematic";
}

/**
 * Retorna o perfil do dispositivo, ou `null` enquanto ainda não foi medido.
 *
 * Componentes pesados devem renderizar o fallback estático enquanto for `null` —
 * assim nunca montamos WebGL para desmontar logo em seguida.
 */
export function useMotionTier(): MotionTier | null {
  const [tier, setTier] = useState<MotionTier | null>(null);

  useEffect(() => {
    setTier(detectMotionTier());

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setTier(detectMotionTier());
    query.addEventListener("change", onChange);

    return () => query.removeEventListener("change", onChange);
  }, []);

  return tier;
}

/** Atalhos de leitura, para o código de componente ficar declarativo. */
export const allowsWebGL = (tier: MotionTier | null) => tier === "cinematic";
export const allowsVideo = (tier: MotionTier | null) =>
  tier === "cinematic" || tier === "reduced";
export const allowsHeavyCanvas = (tier: MotionTier | null) => tier === "cinematic";
