"use client";

import { BRANDS_SERVICED } from "@/lib/site";

/**
 * Marquee das marcas atendidas.
 *
 * A lista é duplicada e o trilho corre -50%: no ponto de emenda os dois blocos
 * são idênticos, então o loop não tem costura visível.
 */
export function Trust() {
  const brands = [...BRANDS_SERVICED, ...BRANDS_SERVICED];

  return (
    <section
      aria-label="Marcas com atendimento técnico"
      className="relative w-full overflow-hidden border-y border-paper/10 bg-navy-900/40 py-7"
    >
      <p className="mb-5 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-paper/45">
        Atendimento técnico para as principais marcas
      </p>

      <div
        className="flex w-max gap-12 px-6 [animation:marquee_38s_linear_infinite] motion-reduce:[animation:none] sm:gap-16"
        aria-hidden
      >
        {brands.map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="font-display shrink-0 text-xl font-bold tracking-tight text-paper/35 transition-colors sm:text-2xl"
          >
            {brand}
          </span>
        ))}
      </div>

      {/* Lista real para leitor de tela, já que o marquee é decorativo. */}
      <p className="sr-only">
        Marcas atendidas: {BRANDS_SERVICED.join(", ")}.
      </p>

      {/* Desvanece as bordas para o trilho não "nascer" no corte. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent"
      />
    </section>
  );
}
