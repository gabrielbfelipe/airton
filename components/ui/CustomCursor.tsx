"use client";

import { useEffect, useRef } from "react";
import { CURSOR_LERP } from "@/lib/animation/easings";

/**
 * Cursor customizado: ponto de 12px que acompanha o ponteiro na hora,
 * e um anel de 36px que persegue com amortecimento.
 *
 * O rótulo é contextual: qualquer elemento com `data-cursor="Ver"` faz o anel
 * crescer e a palavra aparecer embaixo. Portado do prompt 1 do motionsites.ai.
 *
 * Nunca monta em dispositivo de toque — não há ponteiro para substituir, e
 * esconder o cursor nativo num tablet com mouse seria um bug de acessibilidade.
 */
export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return;

    const root = rootRef.current;
    const orbit = orbitRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!root || !orbit || !dot || !label) return;

    document.body.classList.add("has-custom-cursor");

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const orbitPos = { ...pointer };
    let raf = 0;
    let visible = false;

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;

      if (!visible) {
        visible = true;
        root.classList.add("is-visible");
      }

      // O ponto acompanha sem atraso: é ele que dá a sensação de precisão.
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;

      const target = (event.target as HTMLElement | null)?.closest?.("[data-cursor]");
      const text = target?.getAttribute("data-cursor");

      if (text) {
        label.textContent = text;
        root.classList.add("is-enter");
      } else {
        root.classList.remove("is-enter");
      }
    };

    const onLeave = () => {
      visible = false;
      root.classList.remove("is-visible", "is-enter");
    };

    const loop = () => {
      orbitPos.x += (pointer.x - orbitPos.x) * CURSOR_LERP;
      orbitPos.y += (pointer.y - orbitPos.y) * CURSOR_LERP;
      orbit.style.transform = `translate3d(${orbitPos.x}px, ${orbitPos.y}px, 0)`;
      label.style.transform = `translate3d(${orbitPos.x}px, ${orbitPos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onLeave);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] h-px w-px opacity-0 transition-opacity duration-200 [&.is-visible]:opacity-100"
    >
      <span
        ref={orbitRef}
        className="absolute left-0 top-0 block h-9 w-9 rounded-full border border-white/70 bg-white/20 backdrop-blur-[2px] transition-[width,height,margin,background-color] duration-300 [.is-enter_&]:-ml-[22px] [.is-enter_&]:-mt-[22px] [.is-enter_&]:h-11 [.is-enter_&]:w-11 [.is-enter_&]:bg-white/30"
        style={{ marginLeft: "-18px", marginTop: "-18px" }}
      />
      <span
        ref={dotRef}
        className="absolute left-0 top-0 block h-3 w-3 rounded-full bg-white"
        style={{ marginLeft: "-6px", marginTop: "-6px" }}
      />
      <span
        ref={labelRef}
        className="absolute left-0 top-0 whitespace-nowrap text-sm font-medium tracking-wide text-white opacity-0 transition-opacity duration-200 [.is-enter_&]:opacity-100"
        style={{ marginLeft: "0", marginTop: "28px", translate: "-50% 0" }}
      />
    </div>
  );
}
