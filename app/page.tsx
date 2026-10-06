"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { ThermalPreloader } from "@/components/preloader/ThermalPreloader";
import { Hero } from "@/components/hero/Hero";
import { Trust } from "@/components/scenes/Trust";
import { Services } from "@/components/scenes/Services";
import { Numbers } from "@/components/scenes/Numbers";
import { Testimonials } from "@/components/scenes/Testimonials";
import { Coverage } from "@/components/scenes/Coverage";
import { Faq } from "@/components/scenes/Faq";
import { BtuCalculator } from "@/components/tools/BtuCalculator";
import { QuoteWizard } from "@/components/tools/QuoteWizard";
import { FloatingWhatsApp } from "@/components/tools/FloatingWhatsApp";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { useLenis } from "@/lib/animation/useLenis";
import { allowsVideo, useMotionTier } from "@/lib/motion-profile";

/* Cenas com canvas e ScrollTrigger: saem do bundle inicial, mas continuam
   renderizando no servidor. O canvas e os triggers vivem em useEffect, que
   nunca roda no servidor — manter o texto no HTML é o que a busca local lê. */
const AirQuality = dynamic(() =>
  import("@/components/scenes/AirQuality").then((m) => m.AirQuality),
);
const PortalAmbientes = dynamic(() =>
  import("@/components/portal/PortalAmbientes").then((m) => m.PortalAmbientes),
);
const Process = dynamic(() =>
  import("@/components/scenes/Process").then((m) => m.Process),
);

/** O logo leva 2s voando do centro até o header. */
const DOCK_MS = 2000;

type Phase = "loading" | "revealing" | "ready";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("loading");
  const tier = useMotionTier();

  useLenis(tier === "cinematic");

  const onPreloaderDone = useCallback(() => setPhase("revealing"), []);

  useEffect(() => {
    if (phase !== "revealing") return;
    // Só desmonta o preloader depois que o logo aterrissa no header.
    const timer = setTimeout(() => setPhase("ready"), DOCK_MS + 150);
    return () => clearTimeout(timer);
  }, [phase]);

  /* Sem vídeo não há sequência de abertura para mostrar: entra direto. */
  const skipPreloader = tier !== null && !allowsVideo(tier);

  useEffect(() => {
    if (skipPreloader) setPhase("ready");
  }, [skipPreloader]);

  const started = phase !== "loading";

  return (
    <>
      <CustomCursor />

      {phase !== "ready" && !skipPreloader && (
        <ThermalPreloader onComplete={onPreloaderDone} />
      )}

      <SiteHeader logoVisible={phase === "ready"} />

      <main>
        <Hero ready={started} />
        <Trust />
        <AirQuality />
        <PortalAmbientes />
        <Services />
        <Process />
        <Numbers />
        <BtuCalculator />
        <Testimonials />
        <Coverage />
        <QuoteWizard />
        <Faq />
      </main>

      <SiteFooter />
      <FloatingWhatsApp />
    </>
  );
}
