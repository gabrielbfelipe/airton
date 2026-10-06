"use client";

import { BRAND, CONTACT, COVERAGE, SERVICES, whatsappLink } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-paper/10 bg-ink">
      {/* Chamada final */}
      <div className="mx-auto w-full max-w-[1600px] px-5 py-20 sm:px-8 sm:py-28 lg:px-14">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
          {BRAND.city} · {BRAND.state}
        </p>
        <h2 className="font-display mt-4 max-w-[14ch] text-[clamp(2.5rem,9vw,7rem)] leading-[0.88]">
          {BRAND.slogan.replace(".", "")}
        </h2>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={whatsappLink(
              "Olá, Airton! Vim pelo site e gostaria de um orçamento.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Chamar"
            className="inline-flex items-center gap-2 rounded-full bg-paper px-7 py-4 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.03]"
          >
            Chamar no WhatsApp
            <span aria-hidden>→</span>
          </a>
          <a
            href={CONTACT.phoneHref}
            className="inline-flex items-center gap-2 rounded-full border border-paper/35 px-7 py-4 font-mono text-sm transition-colors hover:border-cyan hover:text-cyan"
          >
            {CONTACT.phoneDisplay}
          </a>
        </div>
      </div>

      {/* Colunas */}
      <div className="border-t border-paper/10">
        <div className="mx-auto grid w-full max-w-[1600px] gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-14">
          <div>
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-mark.svg" alt="" className="h-9 w-9" />
              <span className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold">{BRAND.name}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-cyan">
                  {BRAND.descriptor}
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-[26ch] text-sm leading-relaxed text-paper/55">
              {BRAND.tagline} em {BRAND.city} e região.
            </p>
          </div>

          <nav aria-label="Serviços">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/45">
              Serviços
            </h3>
            <ul className="mt-5 grid gap-2.5">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <a
                    href="#oservico"
                    className="text-sm text-paper/70 transition-colors hover:text-cyan"
                  >
                    {service.short}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/45">
              Atendimento
            </h3>
            <ul className="mt-5 grid gap-2.5 text-sm text-paper/70">
              <li>
                <a
                  href={CONTACT.phoneHref}
                  className="font-mono transition-colors hover:text-cyan"
                >
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>{CONTACT.hours.label}</li>
              <li className="text-paper/50">Orçamento sem custo</li>
              <li className="text-paper/50">Garantia por escrito</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/45">
              Cidades atendidas
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-paper/55">
              {COVERAGE.cities.join(" · ")}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-2 px-5 py-6 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-14">
          <p>
            © {year} {BRAND.legal}. {BRAND.city}/{BRAND.state}.
          </p>
          <p>Imagens ilustrativas de banco livre de direitos.</p>
        </div>
      </div>
    </footer>
  );
}
