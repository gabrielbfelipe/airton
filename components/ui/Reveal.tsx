"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

export type RevealVariant = "rise" | "title" | "side" | "down";

type RevealProps = {
  children: ReactNode;
  /** Tag renderizada. Importante para manter a semântica sob a animação. */
  as?: ElementType;
  variant?: RevealVariant;
  /** Atraso em segundos — é assim que se constrói o escalonamento. */
  delay?: number;
  className?: string;
  /** Fração visível necessária para disparar. */
  threshold?: number;
};

/**
 * Entrada padrão de todo conteúdo do site: desfoque + deslocamento.
 *
 * Usa IntersectionObserver em vez de ScrollTrigger de propósito — são dezenas
 * de elementos na página, e o IO custa uma fração do orçamento de frame.
 * O ScrollTrigger fica reservado às cenas com pin e scrub.
 */
export function Reveal({
  children,
  as: Tag = "div",
  variant = "rise",
  delay = 0,
  className = "",
  threshold = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.classList.add("is-revealed", "is-settled");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.classList.add("is-revealed");
        // Solta o will-change assim que a animação termina.
        node.addEventListener("animationend", () => node.classList.add("is-settled"), {
          once: true,
        });
        observer.disconnect();
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
