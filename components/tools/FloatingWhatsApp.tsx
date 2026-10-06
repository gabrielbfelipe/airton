"use client";

import { useEffect, useState } from "react";
import { CONTACT, whatsappLink } from "@/lib/site";

/**
 * Mensagem pré-preenchida por seção.
 *
 * Quem está lendo sobre higienização e clica no botão não deveria ter que
 * digitar o que quer: a mensagem já chega escrita, e o Airton recebe um lead
 * com contexto em vez de um "oi".
 */
const MESSAGES: Record<string, string> = {
  inicio: "Olá, Airton! Vim pelo site e gostaria de um orçamento.",
  ar: "Olá, Airton! Vim pelo site. Quero higienizar meu ar condicionado — está com cheiro e faz tempo que não limpo.",
  servicos:
    "Olá, Airton! Vim pelo site e gostaria de um orçamento para climatizar um ambiente.",
  oservico: "Olá, Airton! Vim pelo site e queria saber mais sobre os serviços.",
  processo:
    "Olá, Airton! Vim pelo site. Quero entender como funciona a instalação e agendar uma visita.",
  calculadora:
    "Olá, Airton! Vim pelo site. Fiz o cálculo de BTUs e gostaria de um orçamento de instalação.",
  cobertura: "Olá, Airton! Vim pelo site. Vocês atendem na minha cidade?",
  orcamento: "Olá, Airton! Vim pelo site e quero fechar um orçamento.",
  duvidas: "Olá, Airton! Vim pelo site e fiquei com uma dúvida.",
};

const DEFAULT_MESSAGE = MESSAGES.inicio;

function isWithinHours(): boolean {
  const now = new Date();
  const day = now.getDay(); // 0 = domingo
  const hour = now.getHours();
  if (day === 0) return false;
  if (day === 6) return hour >= 8 && hour < 13;
  return hour >= 8 && hour < 18;
}

export function FloatingWhatsApp() {
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [visible, setVisible] = useState(false);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    setOnline(isWithinHours());

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[id]"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        // A seção mais visível manda na mensagem.
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top) setMessage(MESSAGES[top.target.id] ?? DEFAULT_MESSAGE);
      },
      { threshold: [0.25, 0.5, 0.75] },
    );

    sections.forEach((section) => observer.observe(section));

    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="Chamar"
      aria-label={`Falar com o Airton no WhatsApp — ${CONTACT.phoneDisplay}`}
      className={`fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-wa py-3 pl-3 pr-5 text-ink shadow-[0_8px_30px_rgba(0,0,0,.45)] transition-all duration-500 hover:scale-[1.04] sm:bottom-7 sm:right-7 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-ink/10">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-ink" aria-hidden>
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm4.52 13.99c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07s.9 2.4 1.02 2.56c.12.17 1.75 2.67 4.25 3.75.59.25 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29Z" />
        </svg>
        {online && (
          <span
            aria-hidden
            className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-wa bg-paper"
          />
        )}
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-bold">Pedir orçamento</span>
        <span className="text-[11px] font-medium opacity-70">
          {online ? "Atendendo agora" : CONTACT.hours.label}
        </span>
      </span>
    </a>
  );
}
