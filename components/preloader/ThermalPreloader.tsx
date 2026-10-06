"use client";

import { useEffect, useRef, useState } from "react";

const START_TEMP = 40;
const END_TEMP = 18;
/** Duração alvo da sequência, em ms. */
const SEQUENCE_MS = 3000;
/** Tempo do voo do logo até o slot do header. */
const DOCK_MS = 2000;

type Props = {
  /** Chamado uma única vez quando a sequência termina. */
  onComplete: () => void;
};

/**
 * Preloader térmico.
 *
 * Reinterpreta o contador 0→100% do prompt 1: em vez de porcentagem de
 * carregamento — que não diz nada a ninguém — o número é a temperatura do
 * ambiente caindo de 40 °C para 18 °C enquanto o vídeo mostra o aparelho
 * sendo ligado. O logo flutua no centro e voa para o slot do header.
 */
export function ThermalPreloader({ onComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [temp, setTemp] = useState(START_TEMP);
  const [leaving, setLeaving] = useState(false);
  const [docked, setDocked] = useState(false);
  const [settled, setSettled] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    let raf = 0;
    let finished = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const started = performance.now();

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);

      setTemp(END_TEMP);
      setLeaving(true);
      setDocked(true);
      document.body.classList.remove("is-locked");
      onComplete();

      timers.push(setTimeout(() => setGone(true), 750));
      timers.push(setTimeout(() => setSettled(true), DOCK_MS));
    };

    /* Relógio independente do vídeo: se o autoplay for bloqueado — e em iOS
       com economia de bateria ele é —, a sequência roda do mesmo jeito. */
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / SEQUENCE_MS);
      setTemp(Math.round(START_TEMP - (START_TEMP - END_TEMP) * progress));
      if (progress >= 1) finish();
      else raf = requestAnimationFrame(tick);
    };

    document.body.classList.add("is-locked");
    raf = requestAnimationFrame(tick);

    if (video) {
      const onMeta = () => {
        // Encaixa a duração do clipe na janela de 3s da sequência.
        if (Number.isFinite(video.duration) && video.duration > 0) {
          video.playbackRate = Math.max(0.25, video.duration / (SEQUENCE_MS / 1000));
        }
        void video.play().catch(() => {});
      };
      if (video.readyState >= 1) onMeta();
      else video.addEventListener("loadedmetadata", onMeta, { once: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      document.body.classList.remove("is-locked");
    };
  }, [onComplete]);

  return (
    <>
      {/* Camada do vídeo — some depois que a sequência termina */}
      <div
        aria-label="Carregando"
        className={`fixed inset-0 overflow-hidden bg-black transition-opacity duration-700 ${
          settled ? "pointer-events-none opacity-0" : "opacity-100"
        } ${docked ? "z-0" : "z-50"}`}
      >
        <video
          ref={videoRef}
          src="/video/hero-ar.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden
          className={`absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-b from-transparent to-black transition-opacity duration-500 ${
            docked ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>

      {/* Logo: flutua no centro, depois voa para o slot do header */}
      <div
        aria-hidden
        className={`fixed ${settled ? "z-[5]" : "z-[52]"}`}
        style={{
          left: docked ? "clamp(20px, 5vw, 56px)" : "50%",
          top: docked ? "clamp(22px, 3vh, 30px)" : "50%",
          width: docked ? "38px" : "84px",
          height: docked ? "38px" : "84px",
          transform: docked ? "none" : "translate(-50%, -50%)",
          transition: `left ${DOCK_MS}ms cubic-bezier(.16,1,.3,1), top ${DOCK_MS}ms cubic-bezier(.16,1,.3,1), width ${DOCK_MS}ms cubic-bezier(.16,1,.3,1), height ${DOCK_MS}ms cubic-bezier(.16,1,.3,1), transform ${DOCK_MS}ms cubic-bezier(.16,1,.3,1)`,
          willChange: "left, top, width, height, transform",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-mark.svg" alt="" className="h-full w-full" />
      </div>

      {/* Termômetro */}
      {!gone && (
        <div
          aria-live="polite"
          aria-label={`Resfriando: ${temp} graus`}
          className="fixed bottom-[clamp(22px,3.1vh,28px)] left-1/2 z-[52] flex -translate-x-1/2 items-end gap-1 leading-none"
          style={
            leaving
              ? { animation: "preload-count-out .75s cubic-bezier(.22,1,.36,1) both" }
              : undefined
          }
        >
          <span className="font-display text-[64px] font-thin tabular-nums text-paper">
            {temp}
          </span>
          <span className="pb-2 text-2xl text-paper/80">°C</span>
        </div>
      )}
    </>
  );
}
