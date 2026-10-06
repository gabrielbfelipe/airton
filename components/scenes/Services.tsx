"use client";

import { useState } from "react";
import { SERVICES, whatsappLink } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

/** Ícones desenhados para os quatro serviços do cartão. */
const ICONS: Record<string, React.ReactNode> = {
  instalacao: (
    <>
      <rect x="3" y="5" width="18" height="8" rx="2" />
      <path d="M6 13v2M12 13v3M18 13v2" />
      <path d="M6.5 9h11" />
    </>
  ),
  higienizacao: (
    <>
      <path d="M12 3c2.5 3.2 4 5.6 4 7.7A4 4 0 0 1 8 10.7C8 8.6 9.5 6.2 12 3Z" />
      <path d="M4 17c2 1.3 4 1.3 6 0s4-1.3 6 0 4 1.3 4 0" />
      <path d="M4 21c2 1.3 4 1.3 6 0s4-1.3 6 0 4 1.3 4 0" />
    </>
  ),
  filtros: (
    <>
      <path d="M4 5h16l-6 7v7l-4-2v-5L4 5Z" />
      <path d="M8.5 8.5h7" />
    </>
  ),
  manutencao: (
    <>
      <path d="M14.7 6.3a4 4 0 0 1 5 5l-9.4 9.4a2.1 2.1 0 0 1-3-3l9.4-9.4Z" />
      <path d="M14.7 6.3 11 2.6M3 11l3.7 3.7" />
    </>
  ),
};

export function Services() {
  const [open, setOpen] = useState<string>(SERVICES[0].id);

  return (
    <section
      id="oservico"
      aria-label="Serviços"
      className="relative w-full bg-ink py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-14">
        <Reveal as="p" className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
          O que fazemos
        </Reveal>
        <Reveal
          as="h2"
          variant="title"
          delay={0.1}
          className="font-display mt-4 max-w-[18ch] text-[clamp(2.25rem,7vw,5.5rem)] leading-[0.9]"
        >
          Quatro serviços. Um critério só.
        </Reveal>
        <Reveal
          as="p"
          delay={0.25}
          className="mt-6 max-w-xl text-sm leading-relaxed text-paper/70 sm:text-base"
        >
          Toda etapa é verificada e entregue funcionando na sua frente. Nada de
          &quot;depois eu volto para ajustar&quot;.
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-paper/15 bg-paper/10">
          {SERVICES.map((service, i) => {
            const expanded = open === service.id;
            return (
              <Reveal key={service.id} delay={0.1 + i * 0.08} className="bg-ink">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? "" : service.id)}
                    aria-expanded={expanded}
                    aria-controls={`painel-${service.id}`}
                    data-cursor={expanded ? "Fechar" : "Abrir"}
                    className="group flex w-full items-center gap-4 px-5 py-6 text-left transition-colors hover:bg-paper/[0.04] sm:gap-6 sm:px-8"
                  >
                    <span className="font-mono text-xs text-cyan sm:text-sm">
                      {service.index}
                    </span>

                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden
                      className={`h-7 w-7 shrink-0 fill-none stroke-[1.4] transition-colors sm:h-8 sm:w-8 ${
                        expanded ? "stroke-cyan" : "stroke-paper/50"
                      }`}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {ICONS[service.id]}
                    </svg>

                    <span className="font-display flex-1 text-2xl leading-none sm:text-4xl">
                      {service.title}
                    </span>

                    <span
                      aria-hidden
                      className={`shrink-0 text-2xl font-thin transition-transform duration-500 ${
                        expanded ? "rotate-45" : "rotate-0"
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>

                <div
                  id={`painel-${service.id}`}
                  hidden={!expanded}
                  className="grid gap-8 px-5 pb-8 sm:grid-cols-2 sm:px-8 sm:pl-[4.75rem]"
                >
                  <p className="text-sm leading-relaxed text-paper/75">
                    {service.description}
                  </p>
                  <ul className="grid gap-2.5">
                    {service.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-3 text-sm leading-relaxed text-paper/60"
                      >
                        <span aria-hidden className="mt-1.5 h-1 w-4 shrink-0 bg-cyan" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={whatsappLink(
                      `Olá, Airton! Vim pelo site e gostaria de um orçamento de ${service.short.toLowerCase()}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="Chamar"
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-paper/35 px-5 py-2.5 text-sm transition-colors hover:border-cyan hover:text-cyan sm:col-span-2"
                  >
                    Pedir orçamento de {service.title.toLowerCase()}
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
