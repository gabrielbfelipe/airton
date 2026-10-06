"use client";

import { useState } from "react";
import { FAQ } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="duvidas"
      aria-label="Perguntas frequentes"
      className="w-full bg-ink py-24 sm:py-32"
    >
      <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20 lg:px-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal as="p" className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
            Dúvidas frequentes
          </Reveal>
          <Reveal
            as="h2"
            variant="title"
            delay={0.1}
            className="font-display mt-4 text-[clamp(2.25rem,6vw,4.25rem)] leading-[0.92]"
          >
            O que todo mundo pergunta.
          </Reveal>
        </div>

        <dl className="border-t border-paper/15">
          {FAQ.map((item, i) => {
            const expanded = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.05} className="border-b border-paper/15">
                <dt>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : i)}
                    aria-expanded={expanded}
                    aria-controls={`faq-${i}`}
                    data-cursor={expanded ? "Fechar" : "Abrir"}
                    className="flex w-full items-start gap-5 py-6 text-left transition-colors hover:text-cyan"
                  >
                    <span className="flex-1 text-base font-medium leading-snug sm:text-lg">
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className={`mt-0.5 shrink-0 text-xl font-thin transition-transform duration-500 ${
                        expanded ? "rotate-45" : "rotate-0"
                      }`}
                    >
                      +
                    </span>
                  </button>
                </dt>
                <dd
                  id={`faq-${i}`}
                  hidden={!expanded}
                  className="m-0 max-w-2xl pb-7 pr-10 text-sm leading-relaxed text-paper/70"
                >
                  {item.a}
                </dd>
              </Reveal>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
