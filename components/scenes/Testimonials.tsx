"use client";

import { useState } from "react";
import { TESTIMONIALS } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const total = TESTIMONIALS.length;
  const go = (delta: number) => setIndex((i) => (i + delta + total) % total);

  return (
    <section
      id="depoimentos"
      aria-label="Depoimentos de clientes"
      className="w-full bg-ink py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-14">
        <Reveal as="p" className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
          Quem já chamou
        </Reveal>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal variant="title" delay={0.1} className="min-h-[14rem] sm:min-h-[16rem]">
            <blockquote key={index} className="max-w-4xl">
              <p className="font-display text-[clamp(1.6rem,4.2vw,3.25rem)] leading-[1.08] [animation:fact-rise_.7s_var(--ease-expo)_both]">
                &ldquo;{TESTIMONIALS[index].quote}&rdquo;
              </p>
              <footer className="mt-6 flex items-center gap-3 text-sm text-paper/60 [animation:fact-rise_.7s_var(--ease-expo)_.15s_both]">
                <span aria-hidden className="h-px w-8 bg-cyan" />
                <cite className="not-italic">
                  <strong className="font-semibold text-paper">
                    {TESTIMONIALS[index].author}
                  </strong>
                  {" · "}
                  {TESTIMONIALS[index].place}
                </cite>
              </footer>
            </blockquote>
          </Reveal>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              data-cursor="Anterior"
              aria-label="Depoimento anterior"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-paper/30 transition-colors hover:border-cyan hover:text-cyan"
            >
              <span aria-hidden>←</span>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              data-cursor="Próximo"
              aria-label="Próximo depoimento"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-paper/30 transition-colors hover:border-cyan hover:text-cyan"
            >
              <span aria-hidden>→</span>
            </button>
            <span className="ml-2 font-mono text-sm text-paper/50">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
