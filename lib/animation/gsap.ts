"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Observer } from "gsap/Observer";
import { Draggable } from "gsap/Draggable";
import { Flip } from "gsap/Flip";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

/**
 * Registro único dos plugins do GSAP.
 *
 * Desde a versão 3.13 todos os plugins — inclusive SplitText e DrawSVG, que
 * antes eram exclusivos do Club — são gratuitos, também para uso comercial.
 * Nada de token privado ou registry customizado.
 */
let registered = false;

if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(
    ScrollTrigger,
    SplitText,
    Observer,
    Draggable,
    Flip,
    DrawSVGPlugin,
  );
  registered = true;
}

export { gsap, ScrollTrigger, SplitText, Observer, Draggable, Flip, DrawSVGPlugin };
