"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap";
import { allowsHeavyCanvas, allowsVideo, useMotionTier } from "@/lib/motion-profile";
import { resizeCanvas } from "@/lib/animation/projection";

type Particle = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  seed: number;
};

const COUNT = 420;

/**
 * "O ar que você respira."
 *
 * A cena que justifica o preço do serviço. O concorrente vende "limpeza";
 * aqui a gente mostra o que existe dentro de uma evaporadora que nunca foi
 * higienizada e o que acontece quando ela é.
 *
 * O scroll dirige a progressão: partículas densas e amareladas à esquerda,
 * varridas para fora à direita, deixando um ar azul e limpo.
 */
export function AirQuality() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  const tier = useMotionTier();
  const canvasAllowed = allowsHeavyCanvas(tier);
  const videoAllowed = allowsVideo(tier);

  /* Progressão dirigida pelo scroll. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      });

      // Os dois blocos de texto trocam no meio do caminho.
      gsap.to(beforeRef.current, {
        opacity: 0,
        filter: "blur(10px)",
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "25% top",
          end: "50% top",
          scrub: 0.6,
        },
      });

      gsap.fromTo(
        afterRef.current,
        { opacity: 0, filter: "blur(10px)", y: 30 },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "50% top",
            end: "75% top",
            scrub: 0.6,
          },
        },
      );

      return () => trigger.kill();
    }, section);

    return () => ctx.revert();
  }, []);

  /* Campo de partículas. */
  useEffect(() => {
    if (!canvasAllowed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx = canvas.getContext("2d");
    let raf = 0;
    let particles: Particle[] = [];
    let w = 0;
    let h = 0;

    const seed = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      ctx = resizeCanvas(canvas, w, h);

      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 2.6,
        vx: -0.08 + Math.random() * 0.16,
        vy: -0.12 + Math.random() * 0.06,
        seed: Math.random() * Math.PI * 2,
      }));
    };

    seed();
    const observer = new ResizeObserver(seed);
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      if (!ctx || !w || !h) return;

      ctx.clearRect(0, 0, w, h);
      const p = progress.current;

      // A varredura entra em cena na metade e empurra tudo para fora.
      const sweep = Math.max(0, (p - 0.35) / 0.5);

      for (const particle of particles) {
        particle.x += particle.vx + sweep * 7;
        particle.y += particle.vy + Math.sin(time * 0.0006 + particle.seed) * 0.22;

        if (particle.x > w + 20) particle.x = -20;
        if (particle.x < -20) particle.x = w + 20;
        if (particle.y < -20) particle.y = h + 20;

        const alpha = (1 - sweep) * (0.12 + particle.r * 0.1);
        if (alpha <= 0.002) continue;

        // Amarelado e sujo antes, azul e limpo depois.
        const hue = 42 + p * 160;
        const sat = 55 - p * 25;
        ctx.fillStyle = `hsla(${hue}, ${sat}%, 62%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [canvasAllowed]);

  return (
    <section
      ref={sectionRef}
      id="ar"
      aria-label="O ar que você respira"
      className="relative h-[280vh] w-full bg-ink"
    >
      <div className="sticky top-0 flex h-[100svh] w-full items-center overflow-hidden">
        {/* Fundo atmosférico */}
        <div className="absolute inset-0 -z-10" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/poster/atmosfera-ar.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          {videoAllowed && (
            <video
              src="/video/atmosfera-ar.mp4"
              muted
              loop
              playsInline
              autoPlay
              preload="none"
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/60" />
        </div>

        <canvas ref={canvasRef} aria-hidden className="absolute inset-0" />

        {/* Assenta a coluna de texto sem apagar as partículas do resto da tela. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-ink via-ink/75 to-transparent lg:w-3/5"
        />

        <div className="relative mx-auto grid w-full max-w-[1600px] px-5 sm:px-8 lg:px-14">
          {/* Os dois estados ocupam a mesma célula do grid e trocam no scroll. */}
          <div ref={beforeRef} className="col-start-1 row-start-1 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#e0a84f]">
              Antes da higienização
            </p>
            <h2 className="font-display mt-4 text-[clamp(2.25rem,6.5vw,5rem)] leading-[0.92]">
              O que vive dentro do seu ar condicionado.
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-paper/75 sm:text-base">
              A serpentina trabalha úmida e escura o ano inteiro. É o ambiente
              perfeito para o biofilme: a camada onde fungos, bactérias e ácaros
              se instalam. O cheiro de mofo ao ligar não é do aparelho — é disso.
              E cada ciclo sopra tudo de volta no ambiente.
            </p>
            <ul className="mt-6 grid gap-2 text-sm text-paper/60">
              <li>· Crise de rinite e tosse que pioram com o aparelho ligado</li>
              <li>· Cheiro que volta minutos depois de ligar</li>
              <li>· Serpentina obstruída gela menos e consome mais</li>
            </ul>
          </div>

          <div ref={afterRef} className="col-start-1 row-start-1 max-w-2xl opacity-0">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
              Depois da higienização
            </p>
            <h2 className="font-display mt-4 text-[clamp(2.25rem,6.5vw,5rem)] leading-[0.92]">
              Ar que não entrega que o aparelho está ligado.
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-paper/75 sm:text-base">
              Evaporadora desmontada, serpentina, turbina, bandeja e dreno lavados
              com produto bactericida. Sem cheiro, sem resíduo voltando ao ambiente
              e com a troca térmica que o aparelho tinha quando era novo.
            </p>
            <ul className="mt-6 grid gap-2 text-sm text-paper/60">
              <li>· Ar sem odor desde o primeiro ciclo</li>
              <li>· Capacidade de gelar recuperada</li>
              <li>· Queda real no consumo de energia</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
