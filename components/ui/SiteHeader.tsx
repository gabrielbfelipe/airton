"use client";

import { useEffect, useState } from "react";
import { BRAND, CONTACT, whatsappLink } from "@/lib/site";

const NAV = [
  { href: "#servicos", label: "Ambientes" },
  { href: "#oservico", label: "Serviços" },
  { href: "#processo", label: "Processo" },
  { href: "#calculadora", label: "Calculadora" },
];

type Props = {
  /** O logo só aparece depois que o do preloader termina o voo. */
  logoVisible: boolean;
};

export function SiteHeader({ logoVisible }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        scrolled ? "bg-ink/70 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-14">
        {/* O slot onde o logo do preloader aterrissa. */}
        <a
          href="#inicio"
          aria-label={`${BRAND.full} — início`}
          className={`flex shrink-0 items-center gap-2.5 transition-opacity duration-300 ${
            logoVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-mark.svg" alt="" className="h-[38px] w-[38px]" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold tracking-tight">
              {BRAND.name}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-cyan">
              {BRAND.descriptor}
            </span>
          </span>
        </a>

        <div className="flex items-center gap-3">
          <nav
            aria-label="Navegação principal"
            className="hidden items-center rounded-full border border-paper/35 bg-paper/10 p-1 backdrop-blur-xl lg:flex"
          >
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-cursor="Ver"
                className="rounded-full px-5 py-2 text-sm leading-none text-paper/80 transition-colors hover:bg-paper hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href={whatsappLink(
              `Olá, Airton! Vim pelo site e gostaria de falar sobre ar condicionado em ${BRAND.city}.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Chamar"
            className="hidden rounded-full bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.03] sm:inline-block"
          >
            Falar agora
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="rounded-full border border-paper/35 bg-paper/10 px-5 py-2.5 text-sm backdrop-blur-xl lg:hidden"
          >
            {open ? "Fechar" : "Menu"}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        hidden={!open}
        className="border-t border-paper/10 bg-ink/95 backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Navegação mobile" className="flex flex-col px-5 py-3 sm:px-8">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-paper/10 py-3 text-base last:border-b-0"
            >
              {item.label}
            </a>
          ))}
          <a
            href={CONTACT.phoneHref}
            className="py-3 font-mono text-sm text-cyan"
          >
            {CONTACT.phoneDisplay}
          </a>
        </nav>
      </div>
    </header>
  );
}
