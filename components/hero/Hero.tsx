"use client";

import { useEffect, useRef } from "react";
import { BRAND, CONTACT, whatsappLink } from "@/lib/site";
import { useCinematicLoop } from "@/lib/animation/useCinematicLoop";
import { allowsVideo, useMotionTier } from "@/lib/motion-profile";
import { gsap, SplitText } from "@/lib/animation/gsap";

const HERO_VIDEO = "/video/hero-sala.mp4";
const HERO_POSTER = "/img/poster/hero-sala.jpg";

const CTA_MESSAGE =
  "Olá, Airton! Vim pelo site e gostaria de um orçamento de ar condicionado.";

type HeroProps = {
  /** Só anima depois que o preloader sai de cena. */
  ready: boolean;
};

export function Hero({ ready }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  const tier = useMotionTier();
  const videoAllowed = allowsVideo(tier);

  useCinematicLoop(videoRef, { enabled: videoAllowed && ready });

  /* Título palavra a palavra. */
  useEffect(() => {
    const headline = headlineRef.current;
    if (!headline || !ready) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(headline, { opacity: 1 });
      return;
    }

    let split: SplitText | null = null;
    let tween: gsap.core.Tween | null = null;

    // Dividir antes da fonte carregar mede a métrica errada e o texto salta.
    const run = () => {
      split = new SplitText(headline, {
        type: "lines,words",
        linesClass: "overflow-hidden pb-[0.08em]",
      });

      gsap.set(headline, { opacity: 1 });
      tween = gsap.from(split.words, {
        yPercent: 115,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.045,
        delay: 0.15,
      });
    };

    void document.fonts.ready.then(run);

    return () => {
      tween?.kill();
      split?.revert();
    };
  }, [ready]);

  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[100svh] w-full flex-col justify-end overflow-hidden bg-ink"
    >
      {/* Fundo cinematográfico */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_POSTER}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover"
        />
        {videoAllowed && ready && (
          <video
            ref={videoRef}
            src={HERO_VIDEO}
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0"
          />
        )}
        {/* Duas camadas: uma assenta o texto, outra tinge o ambiente de azul. */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/35 to-ink" />
        <div className="absolute inset-0 bg-navy-900/25 mix-blend-multiply" />
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-5 pb-14 pt-32 sm:px-8 sm:pb-20 lg:px-14">
        <p
          className="font-mono text-[11px] uppercase tracking-[0.32em] text-cyan sm:text-xs"
          style={{
            animation: ready ? "reveal-down .9s var(--ease-expo) .1s both" : "none",
            opacity: ready ? undefined : 0,
          }}
        >
          {BRAND.city} · {BRAND.state} — e região
        </p>

        <h1
          ref={headlineRef}
          data-animated
          className="font-display mt-5 max-w-[16ch] text-[clamp(2.75rem,9.5vw,8.5rem)] leading-[0.88] tracking-[-0.03em] opacity-0"
        >
          Ambientes mais limpos,{" "}
          <span className="text-cyan">gelados</span> e{" "}
          <span className="text-cyan">saudáveis</span>.
        </h1>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <p
            className="max-w-xl text-sm leading-relaxed text-paper/75 sm:text-base"
            style={{
              animation: ready ? "fact-rise .8s var(--ease-expo) .9s both" : "none",
              opacity: ready ? undefined : 0,
            }}
          >
            Instalação, higienização e manutenção de ar condicionado com método
            técnico: dimensionamento correto antes de furar a parede, vácuo de linha
            com bomba e garantia por escrito. Do primeiro furo à entrega com o
            aparelho já gelando.
          </p>

          <div
            className="flex flex-wrap items-center gap-3"
            style={{
              animation: ready ? "fact-rise .8s var(--ease-expo) 1.1s both" : "none",
              opacity: ready ? undefined : 0,
            }}
          >
            <a
              href={whatsappLink(CTA_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Chamar"
              className="inline-flex items-center gap-2.5 rounded-full bg-paper px-7 py-4 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.03]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-wa" aria-hidden>
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07s.9 2.4 1.02 2.56c.12.17 1.75 2.67 4.25 3.75.59.25 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29Z" />
              </svg>
              Pedir orçamento
            </a>

            <a
              href="#calculadora"
              data-cursor="Calcular"
              className="inline-flex items-center gap-2 rounded-full border border-paper/40 bg-paper/5 px-7 py-4 text-sm font-medium text-paper backdrop-blur-md transition-colors duration-300 hover:border-paper/70 hover:bg-paper/10"
            >
              Calcular meus BTUs
            </a>
          </div>
        </div>

        <p
          className="mt-8 font-mono text-xs text-paper/45"
          style={{
            animation: ready ? "fact-rise .8s var(--ease-expo) 1.25s both" : "none",
            opacity: ready ? undefined : 0,
          }}
        >
          {CONTACT.phoneDisplay} · {CONTACT.hours.label}
        </p>
      </div>
    </section>
  );
}
