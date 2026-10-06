"use client";

import { useEffect, useRef } from "react";
import { STATS } from "@/lib/site";
import { gsap } from "@/lib/animation/gsap";

/** Contadores que sobem quando entram em cena. */
export function Numbers() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
        const target = Number(node.dataset.count);
        const counter = { value: 0 };

        gsap.to(counter, {
          value: target,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 85%", once: true },
          onUpdate: () => {
            node.textContent = String(Math.round(counter.value));
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      aria-label="Nossos números"
      className="w-full border-y border-paper/10 bg-ink py-16 sm:py-20"
    >
      <div
        ref={rootRef}
        className="mx-auto grid w-full max-w-[1600px] grid-cols-2 gap-x-6 gap-y-10 px-5 sm:px-8 lg:grid-cols-4 lg:px-14"
      >
        {STATS.map((stat) => (
          <div key={stat.label}>
            <p className="font-display flex items-baseline text-[clamp(3rem,8vw,5.5rem)] leading-none text-cyan">
              {/* O valor fica no HTML para quem não executa JS. */}
              <span data-count={stat.value} className="tabular-nums">
                {stat.value}
              </span>
              <span>{stat.suffix}</span>
            </p>
            <p className="mt-3 max-w-[22ch] text-xs leading-relaxed text-paper/60 sm:text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
