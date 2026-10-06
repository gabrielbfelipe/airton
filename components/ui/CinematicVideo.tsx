"use client";

import { useEffect, useRef, useState } from "react";
import { useCinematicLoop } from "@/lib/animation/useCinematicLoop";
import { allowsVideo, useMotionTier } from "@/lib/motion-profile";

type CinematicVideoProps = {
  src: string;
  poster: string;
  className?: string;
  /** Duração do fade de entrada e saída, em segundos. */
  fade?: number;
  /** Margem de pré-carregamento em relação à viewport. */
  rootMargin?: string;
};

/**
 * Vídeo de fundo com loop manual em fade.
 *
 * Três comportamentos importantes:
 *  1. O `src` só é atribuído quando o elemento se aproxima da viewport — sem
 *     isso, oito vídeos começariam a baixar no primeiro paint.
 *  2. O loop é manual (useCinematicLoop), então não existe o corte seco do
 *     atributo `loop` nativo.
 *  3. Em perfil `static` o vídeo nem é criado: fica só o poster.
 */
export function CinematicVideo({
  src,
  poster,
  className = "",
  fade = 0.5,
  rootMargin = "200px",
}: CinematicVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  const tier = useMotionTier();
  const videoAllowed = allowsVideo(tier);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || !videoAllowed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [videoAllowed, rootMargin]);

  useCinematicLoop(videoRef, { fade, enabled: videoAllowed && near });

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* O poster é o LCP: sempre presente, nunca espera o vídeo. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />

      {videoAllowed && near && (
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="auto"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-0"
        />
      )}
    </div>
  );
}
