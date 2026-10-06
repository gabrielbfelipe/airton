"use client";

import { useState } from "react";
import { COVERAGE, SERVICES, whatsappLink } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

type Answers = {
  servico: string;
  local: string;
  aparelhos: number;
  cidade: string;
  nome: string;
  quando: string;
};

const LOCAIS = [
  { value: "Residência", hint: "Casa ou apartamento" },
  { value: "Comércio", hint: "Loja, escritório, clínica" },
];

const QUANDO = ["O quanto antes", "Nesta semana", "Neste mês", "Só pesquisando preço"];

const STEPS = ["Serviço", "Ambiente", "Cidade", "Contato"] as const;

export function QuoteWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    servico: "",
    local: "",
    aparelhos: 1,
    cidade: COVERAGE.base,
    nome: "",
    quando: "",
  });

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  /** Cada etapa só libera a seguinte quando está respondida. */
  const canAdvance = [
    Boolean(answers.servico),
    Boolean(answers.local),
    Boolean(answers.cidade),
    answers.nome.trim().length >= 2 && Boolean(answers.quando),
  ][step];

  const message = [
    `Olá, Airton! Vim pelo site e gostaria de um orçamento.`,
    "",
    `• Serviço: ${answers.servico}`,
    `• Local: ${answers.local}`,
    `• Aparelhos: ${answers.aparelhos}`,
    `• Cidade: ${answers.cidade}`,
    `• Nome: ${answers.nome.trim()}`,
    `• Prazo: ${answers.quando}`,
  ].join("\n");

  const isLast = step === STEPS.length - 1;

  return (
    <section
      id="orcamento"
      aria-label="Pedir orçamento"
      className="w-full bg-navy-900/25 py-24 sm:py-32"
    >
      <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-20 lg:px-14">
        <div>
          <Reveal as="p" className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
            Orçamento
          </Reveal>
          <Reveal
            as="h2"
            variant="title"
            delay={0.1}
            className="font-display mt-4 text-[clamp(2.25rem,6vw,4.25rem)] leading-[0.92]"
          >
            Quatro perguntas e pronto.
          </Reveal>
          <Reveal
            as="p"
            delay={0.2}
            className="mt-6 text-sm leading-relaxed text-paper/70"
          >
            Nada de formulário interminável. Responda o essencial e a mensagem chega
            no WhatsApp do Airton já organizada — o retorno sai em até 24 horas.
          </Reveal>
        </div>

        <div className="rounded-2xl border border-paper/15 bg-ink p-6 sm:p-10">
          {/* Progresso */}
          <ol className="mb-9 flex gap-2" aria-label="Etapas">
            {STEPS.map((label, i) => (
              <li key={label} className="flex-1">
                <span
                  className={`block h-1 rounded-full transition-colors duration-500 ${
                    i <= step ? "bg-cyan" : "bg-paper/15"
                  }`}
                />
                <span
                  className={`mt-2 block text-[11px] transition-colors ${
                    i === step ? "text-paper" : "text-paper/40"
                  }`}
                  aria-current={i === step ? "step" : undefined}
                >
                  {label}
                </span>
              </li>
            ))}
          </ol>

          {/* A `key` remonta o bloco a cada etapa, reiniciando a animação. */}
          <div key={step} className="[animation:fact-rise_.5s_var(--ease-expo)_both]">
            {step === 0 && (
              <fieldset className="border-0 p-0">
                <legend className="mb-5 text-lg font-medium">
                  Que serviço você precisa?
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {SERVICES.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => {
                        set("servico", service.short);
                        setStep(1);
                      }}
                      data-cursor="Escolher"
                      className={`rounded-xl border p-5 text-left transition-colors ${
                        answers.servico === service.short
                          ? "border-cyan bg-cyan/10"
                          : "border-paper/20 hover:border-paper/45"
                      }`}
                    >
                      <span className="font-display block text-xl">{service.title}</span>
                      <span className="mt-1 block text-xs text-paper/50">
                        {service.short}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <fieldset className="border-0 p-0">
                <legend className="mb-5 text-lg font-medium">
                  Onde é, e quantos aparelhos?
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {LOCAIS.map((local) => (
                    <button
                      key={local.value}
                      type="button"
                      onClick={() => set("local", local.value)}
                      data-cursor="Escolher"
                      className={`rounded-xl border p-5 text-left transition-colors ${
                        answers.local === local.value
                          ? "border-cyan bg-cyan/10"
                          : "border-paper/20 hover:border-paper/45"
                      }`}
                    >
                      <span className="font-display block text-xl">{local.value}</span>
                      <span className="mt-1 block text-xs text-paper/50">
                        {local.hint}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-7">
                  <div className="flex items-baseline justify-between">
                    <label htmlFor="aparelhos" className="text-sm font-medium">
                      Quantidade de aparelhos
                    </label>
                    <output className="font-mono text-base font-semibold text-cyan">
                      {answers.aparelhos}
                    </output>
                  </div>
                  <input
                    id="aparelhos"
                    type="range"
                    min={1}
                    max={15}
                    value={answers.aparelhos}
                    onChange={(e) => set("aparelhos", Number(e.target.value))}
                    className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-paper/20 accent-[var(--color-cyan)]"
                  />
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <div>
                <label htmlFor="cidade" className="mb-5 block text-lg font-medium">
                  Em qual cidade?
                </label>
                <select
                  id="cidade"
                  value={answers.cidade}
                  onChange={(e) => set("cidade", e.target.value)}
                  className="w-full rounded-xl border border-paper/20 bg-ink px-5 py-4 text-base text-paper transition-colors focus:border-cyan"
                >
                  {COVERAGE.cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                  <option value="Outra cidade">Outra cidade</option>
                </select>
                <p className="mt-3 text-xs text-paper/45">
                  Não achou a sua? Escolha &quot;Outra cidade&quot; — a gente confirma
                  no atendimento.
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-7">
                <div>
                  <label htmlFor="nome" className="mb-2.5 block text-lg font-medium">
                    Como podemos te chamar?
                  </label>
                  <input
                    id="nome"
                    type="text"
                    value={answers.nome}
                    onChange={(e) => set("nome", e.target.value)}
                    placeholder="Seu nome"
                    autoComplete="given-name"
                    className="w-full rounded-xl border border-paper/20 bg-ink px-5 py-4 text-base text-paper placeholder:text-paper/30 focus:border-cyan"
                  />
                </div>

                <fieldset className="border-0 p-0">
                  <legend className="mb-3 text-sm font-medium">
                    Para quando você precisa?
                  </legend>
                  <div className="flex flex-wrap gap-2.5">
                    {QUANDO.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => set("quando", option)}
                        data-cursor="Escolher"
                        className={`rounded-full border px-5 py-2.5 text-sm transition-colors ${
                          answers.quando === option
                            ? "border-cyan bg-cyan/10 text-paper"
                            : "border-paper/20 text-paper/70 hover:border-paper/45"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}
          </div>

          {/* Navegação */}
          <div className="mt-10 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="text-sm text-paper/60 transition-colors hover:text-paper disabled:pointer-events-none disabled:opacity-0"
            >
              ← Voltar
            </button>

            {isLast ? (
              <a
                href={canAdvance ? whatsappLink(message) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!canAdvance}
                data-cursor="Chamar"
                className={`inline-flex items-center gap-2 rounded-full bg-wa px-7 py-3.5 text-sm font-semibold text-ink transition-all duration-300 ${
                  canAdvance
                    ? "hover:scale-[1.03]"
                    : "pointer-events-none opacity-40"
                }`}
              >
                Enviar no WhatsApp
                <span aria-hidden>→</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance}
                data-cursor="Avançar"
                className="inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3.5 text-sm font-semibold text-ink transition-all duration-300 hover:scale-[1.03] disabled:pointer-events-none disabled:opacity-40"
              >
                Continuar
                <span aria-hidden>→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
