"use client";

import { COVERAGE, whatsappLink } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

export function Coverage() {
  return (
    <section
      id="cobertura"
      aria-label="Área de atendimento"
      className="relative w-full overflow-hidden bg-navy-900/25 py-24 sm:py-32"
    >
      {/* Malha de fundo: sugere mapa sem fingir precisão cartográfica. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--color-cyan) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-[1600px] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-20 lg:px-14">
        <div>
          <Reveal as="p" className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
            Onde atendemos
          </Reveal>
          <Reveal
            as="h2"
            variant="title"
            delay={0.1}
            className="font-display mt-4 text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.92]"
          >
            {COVERAGE.base} e região.
          </Reveal>
          <Reveal
            as="p"
            delay={0.25}
            className="mt-6 text-sm leading-relaxed text-paper/70 sm:text-base"
          >
            Base em {COVERAGE.base}, com atendimento em {COVERAGE.cities.length} cidades
            do entorno. Não encontrou a sua na lista? Manda mensagem — provavelmente
            atendemos.
          </Reveal>
          <Reveal delay={0.35} className="mt-8">
            <a
              href={whatsappLink(
                "Olá, Airton! Vim pelo site. Vocês atendem na minha cidade?",
              )}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Chamar"
              className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3.5 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.03]"
            >
              Confirmar minha cidade
              <span aria-hidden>→</span>
            </a>
          </Reveal>
        </div>

        <ul className="grid grid-cols-2 gap-x-6 gap-y-0 self-center sm:grid-cols-3">
          {COVERAGE.cities.map((city, i) => (
            <Reveal
              key={city}
              as="li"
              delay={i * 0.05}
              className="flex items-center gap-3 border-b border-paper/10 py-3.5"
            >
              <span
                aria-hidden
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  city === COVERAGE.base
                    ? "bg-cyan [animation:frost-pulse_2.4s_ease-in-out_infinite]"
                    : "bg-paper/30"
                }`}
              />
              <span
                className={`text-sm ${
                  city === COVERAGE.base ? "font-semibold text-paper" : "text-paper/65"
                }`}
              >
                {city}
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
