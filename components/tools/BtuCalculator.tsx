"use client";

import { useMemo, useState } from "react";
import { calculateBtu, formatBtu, type SunExposure } from "@/lib/btu";
import { whatsappLink } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

const SUN_OPTIONS: { value: SunExposure; label: string; hint: string }[] = [
  { value: "sombra", label: "Pouco sol", hint: "Janela na sombra ou voltada para o sul" },
  { value: "sol", label: "Sol direto", hint: "Sol da tarde batendo na janela ou na laje" },
];

function Stepper({
  label,
  hint,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <output
          htmlFor={id}
          className="font-mono text-base font-semibold tabular-nums text-cyan"
        >
          {value.toLocaleString("pt-BR")}
          {suffix}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-paper/20 accent-[var(--color-cyan)]"
      />
      {hint && <p className="mt-2 text-xs text-paper/45">{hint}</p>}
    </div>
  );
}

export function BtuCalculator() {
  const [area, setArea] = useState(15);
  const [people, setPeople] = useState(2);
  const [appliances, setAppliances] = useState(1);
  const [ceiling, setCeiling] = useState(2.7);
  const [sun, setSun] = useState<SunExposure>("sol");

  const result = useMemo(
    () => calculateBtu({ area, people, sun, appliances, ceilingHeight: ceiling }),
    [area, people, sun, appliances, ceiling],
  );

  const message = [
    "Olá, Airton! Vim pelo site e usei a calculadora de BTUs.",
    "",
    `• Ambiente: ${area} m², pé-direito de ${ceiling.toFixed(2).replace(".", ",")} m`,
    `• Pessoas: ${people}`,
    `• Incidência de sol: ${sun === "sol" ? "sol direto" : "pouco sol"}`,
    `• Aparelhos que geram calor: ${appliances}`,
    "",
    `Resultado: ${result.label} (carga calculada de ${formatBtu(result.raw)}).`,
    "",
    "Gostaria de um orçamento de instalação.",
  ].join("\n");

  return (
    <section
      id="calculadora"
      aria-label="Calculadora de BTUs"
      className="w-full bg-ink py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-14">
        <Reveal as="p" className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
          Ferramenta
        </Reveal>
        <Reveal
          as="h2"
          variant="title"
          delay={0.1}
          className="font-display mt-4 max-w-[16ch] text-[clamp(2.25rem,7vw,5.5rem)] leading-[0.9]"
        >
          Quantos BTUs o seu ambiente precisa?
        </Reveal>
        <Reveal
          as="p"
          delay={0.2}
          className="mt-6 max-w-xl text-sm leading-relaxed text-paper/70 sm:text-base"
        >
          Subdimensionar faz o aparelho trabalhar sem parar e nunca chegar na
          temperatura. Superdimensionar liga e desliga demais e não desumidifica o
          ambiente. A conta certa economiza nos dois sentidos.
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-paper/15 bg-paper/10 lg:grid-cols-2">
          {/* Entradas */}
          <div className="grid gap-7 bg-ink p-7 sm:p-10">
            <Stepper
              label="Área do ambiente"
              value={area}
              min={5}
              max={80}
              suffix=" m²"
              onChange={setArea}
              hint="Largura × comprimento do cômodo."
            />
            <Stepper
              label="Pessoas no ambiente"
              value={people}
              min={1}
              max={20}
              onChange={setPeople}
              hint="Use o pico de ocupação, não a média."
            />
            <Stepper
              label="Aparelhos que geram calor"
              value={appliances}
              min={0}
              max={12}
              onChange={setAppliances}
              hint="TV, computador, forno, geladeira."
            />
            <Stepper
              label="Pé-direito"
              value={ceiling}
              min={2.4}
              max={5}
              step={0.1}
              suffix=" m"
              onChange={setCeiling}
              hint="Acima de 2,70 m a carga sobe proporcionalmente."
            />

            <fieldset className="border-0 p-0">
              <legend className="mb-3 text-sm font-medium">Incidência de sol</legend>
              <div className="grid grid-cols-2 gap-3">
                {SUN_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-xl border p-4 transition-colors ${
                      sun === option.value
                        ? "border-cyan bg-cyan/10"
                        : "border-paper/20 hover:border-paper/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="sol"
                      value={option.value}
                      checked={sun === option.value}
                      onChange={() => setSun(option.value)}
                      className="sr-only"
                    />
                    <span className="block text-sm font-semibold">{option.label}</span>
                    <span className="mt-1 block text-xs leading-snug text-paper/50">
                      {option.hint}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {/* Resultado */}
          <div className="flex flex-col justify-between gap-8 bg-navy-900/40 p-7 sm:p-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-paper/50">
                Capacidade recomendada
              </p>
              <p
                key={result.recommended}
                className="font-display mt-3 text-[clamp(3.5rem,11vw,7rem)] leading-none text-cyan [animation:fact-rise_.5s_var(--ease-expo)_both]"
              >
                {result.recommended.toLocaleString("pt-BR")}
              </p>
              <p className="font-mono text-base text-paper/70">BTUs</p>

              <dl className="mt-8 border-t border-paper/15">
                {result.breakdown.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-4 border-b border-paper/10 py-2.5"
                  >
                    <dt className="text-xs leading-snug text-paper/60">{row.label}</dt>
                    <dd className="m-0 shrink-0 font-mono text-sm tabular-nums text-paper/85">
                      +{row.value.toLocaleString("pt-BR")}
                    </dd>
                  </div>
                ))}
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-sm font-semibold">Carga total</dt>
                  <dd className="m-0 font-mono text-sm font-semibold tabular-nums text-cyan">
                    {result.raw.toLocaleString("pt-BR")}
                  </dd>
                </div>
              </dl>

              <p className="mt-5 text-xs leading-relaxed text-paper/55">{result.note}</p>
            </div>

            <div>
              <a
                href={whatsappLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Chamar"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-paper px-6 py-4 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.02]"
              >
                Enviar este cálculo no WhatsApp
                <span aria-hidden>→</span>
              </a>
              <p className="mt-3 text-center text-xs text-paper/40">
                O resultado já vai escrito na mensagem. É uma estimativa — a
                confirmação final sai na visita técnica.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
