"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animation/gsap";
import { useMotionTier } from "@/lib/motion-profile";

const STEPS = [
  {
    n: "01",
    title: "Contato",
    text: "Você descreve o serviço pelo WhatsApp e manda uma foto do ambiente, se ajudar. Para instalação, a calculadora daqui do site já adianta o dimensionamento.",
  },
  {
    n: "02",
    title: "Diagnóstico",
    text: "Avaliação do ambiente: medida real, incidência de sol, ocupação, ponto elétrico disponível e por onde a tubulação e o dreno vão passar.",
  },
  {
    n: "03",
    title: "Infraestrutura",
    text: "Furação, tubulação de cobre, dreno com caimento mínimo de 1 cm por metro e ponto elétrico dimensionado para a carga do aparelho.",
  },
  {
    n: "04",
    title: "Instalação",
    text: "Fixação nivelada, conexões com torque correto e vácuo de linha com bomba — nunca purga com o próprio gás. Em seguida, teste de estanqueidade.",
  },
  {
    n: "05",
    title: "Entrega",
    text: "Teste de carga com o aparelho em operação, limpeza do local, orientação de uso e manutenção, e a garantia por escrito na sua mão.",
  },
];

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const tier = useMotionTier();

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Em tela estreita ou com movimento reduzido, o trilho vira rolagem
    // horizontal nativa — continua navegável, sem sequestrar o scroll.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || window.innerWidth < 768) return;

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, [tier]);

  return (
    <section
      ref={sectionRef}
      id="processo"
      aria-label="Como funciona"
      className="relative w-full overflow-hidden bg-navy-900/25 py-24 md:h-[100svh] md:overflow-hidden md:py-0"
    >
      <div className="flex h-full flex-col justify-center">
        <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-14">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
            Como funciona
          </p>
          <h2 className="font-display mt-3 max-w-[20ch] text-[clamp(2rem,5.5vw,4rem)] leading-[0.95]">
            Cinco etapas, nenhuma pulada.
          </h2>
        </div>

        <div
          ref={trackRef}
          className="mt-12 flex gap-6 overflow-x-auto px-5 pb-4 sm:gap-8 sm:px-8 md:overflow-visible md:pb-0 lg:px-14"
        >
          {STEPS.map((step) => (
            <article
              key={step.n}
              className="relative flex w-[78vw] shrink-0 flex-col justify-between rounded-2xl border border-paper/15 bg-ink/60 p-7 backdrop-blur-sm sm:w-[58vw] md:w-[30vw] md:min-w-[340px]"
            >
              <div>
                <span className="font-display block text-[clamp(3.5rem,7vw,6rem)] leading-none text-cyan/25">
                  {step.n}
                </span>
                <h3 className="font-display mt-2 text-2xl sm:text-3xl">{step.title}</h3>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-paper/70">{step.text}</p>
            </article>
          ))}
        </div>

        {/* A tubulação que o scroll vai traçando */}
        <div className="mx-auto mt-8 w-full max-w-[1600px] px-5 sm:px-8 lg:px-14">
          <svg
            viewBox="0 0 1200 24"
            preserveAspectRatio="none"
            aria-hidden
            className="h-6 w-full"
          >
            <path
              d="M0 12h260c20 0 20-8 40-8s20 8 40 8h300c20 0 20 8 40 8s20-8 40-8h440"
              fill="none"
              stroke="rgba(255,255,255,.12)"
              strokeWidth="2"
            />
            <path
              ref={lineRef}
              d="M0 12h260c20 0 20-8 40-8s20 8 40 8h300c20 0 20 8 40 8s20-8 40-8h440"
              fill="none"
              stroke="var(--color-cyan)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
