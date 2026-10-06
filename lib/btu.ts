/**
 * Cálculo de capacidade térmica em BTU/h.
 *
 * Usa a regra de carga térmica praticada no mercado brasileiro para
 * ambientes residenciais e pequenos comerciais, com pé-direito padrão de 2,70 m:
 *
 *   carga base .......... 600 BTU/h por m² (ambiente sem incidência solar direta)
 *                         800 BTU/h por m² (com incidência solar direta)
 *   ocupação ............ +600 BTU/h por pessoa acima da segunda
 *   carga dissipada ..... +600 BTU/h por aparelho que gera calor
 *   pé-direito .......... proporcional, quando acima de 2,70 m
 *
 * O resultado é arredondado para cima até a capacidade comercial disponível —
 * subdimensionar faz o aparelho trabalhar sem parar e nunca atingir a
 * temperatura; superdimensionar liga e desliga demais e não desumidifica.
 */

export type SunExposure = "sombra" | "sol";

export type BtuInput = {
  /** Área do ambiente em m². */
  area: number;
  /** Número de pessoas no ambiente, em uso típico. */
  people: number;
  /** Incidência solar direta durante o período de uso. */
  sun: SunExposure;
  /** Aparelhos que dissipam calor: TV, computador, forno, geladeira. */
  appliances: number;
  /** Pé-direito em metros. Padrão 2.7. */
  ceilingHeight?: number;
};

export type BtuResult = {
  /** Carga térmica calculada, sem arredondamento. */
  raw: number;
  /** Capacidade comercial recomendada. */
  recommended: number;
  /** Capacidade comercial imediatamente acima, quando existir. */
  nextUp: number | null;
  /** Como a capacidade é escrita no mercado: "12.000 BTUs". */
  label: string;
  /** Composição da conta, para exibir ao usuário. */
  breakdown: { label: string; value: number }[];
  /** Observação técnica contextual. */
  note: string;
};

/** Capacidades comerciais efetivamente vendidas no Brasil. */
export const COMMERCIAL_CAPACITIES = [
  7000, 9000, 12000, 18000, 22000, 24000, 30000, 36000, 48000, 60000,
] as const;

const BTU_PER_M2 = { sombra: 600, sol: 800 } as const;
const BTU_PER_EXTRA_PERSON = 600;
const BTU_PER_APPLIANCE = 600;
const STANDARD_CEILING = 2.7;

export function formatBtu(value: number): string {
  return `${value.toLocaleString("pt-BR")} BTUs`;
}

export function calculateBtu(input: BtuInput): BtuResult {
  const area = Math.max(1, input.area);
  const people = Math.max(1, input.people);
  const appliances = Math.max(0, input.appliances);
  const ceiling = input.ceilingHeight ?? STANDARD_CEILING;

  const basePerM2 = BTU_PER_M2[input.sun];
  const base = area * basePerM2;
  const extraPeople = Math.max(0, people - 2) * BTU_PER_EXTRA_PERSON;
  const extraAppliances = appliances * BTU_PER_APPLIANCE;

  const subtotal = base + extraPeople + extraAppliances;

  // Pé-direito alto aumenta o volume de ar a resfriar, proporcionalmente.
  const ceilingFactor = ceiling > STANDARD_CEILING ? ceiling / STANDARD_CEILING : 1;
  const raw = Math.round(subtotal * ceilingFactor);

  // Tolerância de 5%: uma carga de 12.600 não justifica pular de 12.000 para
  // 18.000. O próprio mercado especifica a capacidade logo abaixo quando a
  // diferença cabe na margem de operação do aparelho — e o cliente não paga
  // 50% a mais por 5% de carga.
  const withinTolerance = COMMERCIAL_CAPACITIES.find(
    (capacity) => raw > capacity && raw <= capacity * 1.05,
  );

  const recommended =
    withinTolerance ??
    COMMERCIAL_CAPACITIES.find((capacity) => capacity >= raw) ??
    COMMERCIAL_CAPACITIES[COMMERCIAL_CAPACITIES.length - 1];

  const index = COMMERCIAL_CAPACITIES.indexOf(
    recommended as (typeof COMMERCIAL_CAPACITIES)[number],
  );
  const nextUp =
    index >= 0 && index < COMMERCIAL_CAPACITIES.length - 1
      ? COMMERCIAL_CAPACITIES[index + 1]
      : null;

  const breakdown = [
    {
      label: `${area} m² × ${basePerM2} BTU/m² (${input.sun === "sol" ? "com sol direto" : "sem sol direto"})`,
      value: base,
    },
  ];

  if (extraPeople > 0) {
    breakdown.push({
      label: `${people - 2} pessoa${people - 2 > 1 ? "s" : ""} além das 2 previstas`,
      value: extraPeople,
    });
  }

  if (extraAppliances > 0) {
    breakdown.push({
      label: `${appliances} aparelho${appliances > 1 ? "s" : ""} que gera${appliances > 1 ? "m" : ""} calor`,
      value: extraAppliances,
    });
  }

  if (ceilingFactor > 1) {
    breakdown.push({
      label: `Pé-direito de ${ceiling.toFixed(2).replace(".", ",")} m`,
      value: raw - subtotal,
    });
  }

  let note: string;
  if (raw > COMMERCIAL_CAPACITIES[COMMERCIAL_CAPACITIES.length - 1]) {
    note =
      "A carga ultrapassa o maior split comercial. O caminho aqui é dividir o ambiente em mais de um aparelho ou partir para um sistema multi-split. Vale conversar.";
  } else if (withinTolerance) {
    note = `A conta dá ${formatBtu(raw)} — ${Math.round(((raw - recommended) / recommended) * 100)}% acima do ${formatBtu(recommended)}. Essa diferença cabe na margem de operação do aparelho e não justifica subir de capacidade. Na visita a gente confirma.`;
  } else if (recommended - raw > 4000) {
    note = `A conta dá ${formatBtu(raw)}. O ${formatBtu(recommended)} é a capacidade comercial mais próxima acima — a folga é normal e trabalha a favor do aparelho.`;
  } else {
    note = `A conta dá ${formatBtu(raw)} e o ${formatBtu(recommended)} cobre com margem adequada. Esta é a indicação para o seu ambiente.`;
  }

  return {
    raw,
    recommended,
    nextUp,
    label: formatBtu(recommended),
    breakdown,
    note,
  };
}
