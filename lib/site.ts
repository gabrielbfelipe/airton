/**
 * Fonte única de verdade do site AIRTON — Climatização.
 * Todo dado de negócio vive aqui. Nenhum componente hardcoda telefone,
 * serviço ou cidade: tudo vem deste módulo.
 */

export const BRAND = {
  name: "AIRTON",
  descriptor: "Climatização",
  full: "AIRTON — Climatização",
  legal: "Airton Climatização",
  tagline: "Instalação e Higienização de Ar Condicionado",
  slogan: "Ambientes mais limpos, gelados e saudáveis.",
  city: "Araraquara",
  state: "SP",
  /** Coordenadas do centro de Araraquara/SP. */
  geo: { lat: -21.7946, lng: -48.1758 },
} as const;

export const CONTACT = {
  /** Formato E.164 sem símbolos — usado nos links wa.me */
  whatsappRaw: "5516992624249",
  /** Exibição humana */
  phoneDisplay: "(16) 99262-4249",
  /** href de discagem */
  phoneHref: "tel:+5516992624249",
  hours: {
    label: "Seg a Sáb, 8h às 18h",
    /** schema.org openingHours */
    schema: ["Mo-Fr 08:00-18:00", "Sa 08:00-13:00"],
  },
} as const;

/**
 * Monta um link wa.me com mensagem pré-preenchida.
 * Usado pelo botão flutuante, pela calculadora de BTUs e pelo orçamento.
 */
export function whatsappLink(message: string): string {
  return `https://wa.me/${CONTACT.whatsappRaw}?text=${encodeURIComponent(message)}`;
}

/* ------------------------------------------------------------------ */
/* Serviços — os quatro do cartão de visita                            */
/* ------------------------------------------------------------------ */

export type Service = {
  id: string;
  index: string;
  title: string;
  short: string;
  description: string;
  bullets: string[];
};

export const SERVICES: Service[] = [
  {
    id: "instalacao",
    index: "[01]",
    title: "Instalação",
    short: "Instalação de Ar Condicionado",
    description:
      "Projeto, dimensionamento e instalação completa de splits e multi-splits. Vácuo na linha, teste de estanqueidade e acabamento que respeita o seu ambiente.",
    bullets: [
      "Dimensionamento correto em BTUs antes de furar a parede",
      "Vácuo de linha com bomba — nunca purga com o próprio gás",
      "Infraestrutura embutida ou aparente com acabamento alinhado",
      "Teste de carga e entrega com o aparelho em operação",
    ],
  },
  {
    id: "higienizacao",
    index: "[02]",
    title: "Higienização",
    short: "Higienização Completa",
    description:
      "Limpeza profunda da evaporadora e da condensadora com produto bactericida. Remove o biofilme onde fungos e ácaros se alojam — a origem real do cheiro de mofo.",
    bullets: [
      "Desmontagem da evaporadora e lavagem da serpentina",
      "Produto bactericida e fungicida de grau técnico",
      "Limpeza da turbina, da bandeja e do dreno",
      "Condensadora lavada e aletas realinhadas",
    ],
  },
  {
    id: "filtros",
    index: "[03]",
    title: "Filtros",
    short: "Limpeza de Filtros",
    description:
      "Filtro saturado sufoca o aparelho: consome mais energia, gela menos e devolve ao ambiente tudo o que deveria reter. Limpeza e troca quando o elemento já não recupera.",
    bullets: [
      "Lavagem, secagem e recolocação no mesmo atendimento",
      "Avaliação do estado real do elemento filtrante",
      "Orientação de periodicidade conforme o seu ambiente",
      "Queda imediata no consumo de energia",
    ],
  },
  {
    id: "manutencao",
    index: "[04]",
    title: "Manutenção",
    short: "Manutenção Preventiva",
    description:
      "Checagem de pressão, carga de gás, dreno, elétrica e fixação. Preventiva custa uma fração do que custa trocar um compressor queimado.",
    bullets: [
      "Medição de pressão e verificação da carga de gás",
      "Desobstrução do dreno antes do vazamento aparecer",
      "Inspeção elétrica, de fixação e de ruído",
      "Relatório do que foi verificado em cada visita",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Ambientes — a cadeia navegada pelo Portal                           */
/* ------------------------------------------------------------------ */

export type Ambiente = {
  id: string;
  name: string;
  number: string;
  /** Próximo ambiente da cadeia. A sequência é circular. */
  next: string;
  /** Vídeo de fundo deste ambiente. */
  media: string;
  poster: string;
  /** Linha de apoio exibida acima dos fatos. */
  intro: string;
  /** Pares rótulo/valor — é aqui que o domínio técnico aparece. */
  facts: [string, string][];
};

export const AMBIENTES: Ambiente[] = [
  {
    id: "sala",
    name: "Sala",
    number: "[01]",
    next: "quarto",
    media: "/video/ambiente-sala.mp4",
    poster: "/img/poster/ambiente-sala.jpg",
    intro: "O ambiente com a maior carga térmica da casa — e o mais errado na hora de dimensionar.",
    facts: [
      ["Carga térmica:", "De 600 a 800 BTU/h por m², conforme o sol da tarde bater ou não na janela."],
      ["Posicionamento:", "O fluxo precisa cruzar o ambiente. Apontado direto para o sofá, resfria uma pessoa e deixa o resto da sala quente."],
      ["Ruído:", "Evaporadoras atuais partem de 19 dB(A) em modo noturno — abaixo do ruído de uma conversa sussurrada."],
      ["Dreno:", "Caimento mínimo de 1 cm por metro até a saída. Sem isso, a água volta e aparece na parede."],
    ],
  },
  {
    id: "quarto",
    name: "Quarto",
    number: "[02]",
    next: "jantar",
    media: "/video/ambiente-quarto.mp4",
    poster: "/img/poster/ambiente-quarto.jpg",
    intro: "Aqui o aparelho fica ligado oito horas seguidas com a porta fechada. Higienização deixa de ser estética.",
    facts: [
      ["Carga térmica:", "600 BTU/h por m² em quarto sem incidência solar direta. Superdimensionar faz o aparelho ligar e desligar sem desumidificar."],
      ["Posicionamento:", "Fluxo passando acima da cama, nunca apontado para o travesseiro. Ar direto no rosto a noite toda resseca a via aérea."],
      ["Higienização:", "A cada 6 meses. Com alérgico, criança pequena ou animal no quarto, a cada 3."],
      ["Modo noturno:", "Reduz a rotação da turbina e eleva a temperatura em 1 °C por hora — gasta menos e não gela demais de madrugada."],
    ],
  },
  {
    id: "jantar",
    name: "Sala de Jantar",
    number: "[03]",
    next: "escritorio",
    media: "/video/ambiente-jantar.mp4",
    poster: "/img/poster/ambiente-jantar.jpg",
    intro: "Ambiente de ocupação variável: dimensionar pela média é o erro que aparece justamente no dia do almoço de família.",
    facts: [
      ["Ocupação:", "Some 600 BTU/h por pessoa acima da segunda. Mesa para oito significa 3.600 BTU/h só de gente."],
      ["Posicionamento:", "Fora do eixo da mesa. Fluxo direto esfria o prato antes de a refeição terminar."],
      ["Pé-direito:", "Acima de 2,70 m, a carga sobe proporcionalmente. Ambiente integrado com escada costuma passar despercebido."],
      ["Integração:", "Sala e jantar sem divisória contam como um único ambiente no cálculo, não como dois."],
    ],
  },
  {
    id: "escritorio",
    name: "Escritório",
    number: "[04]",
    next: "sala",
    media: "/video/ambiente-escritorio.mp4",
    poster: "/img/poster/ambiente-escritorio.jpg",
    intro: "Equipamento ligado o dia inteiro, gente entrando e saindo. É onde o filtro satura mais rápido.",
    facts: [
      ["Carga dissipada:", "Cada computador em uso contínuo acrescenta cerca de 600 BTU/h à conta. Cinco estações são 3.000 BTU/h."],
      ["Ocupação:", "Dimensione pelo pico de pessoas, não pela média do dia."],
      ["Filtros:", "A cada 30 dias em ambiente de alta circulação. Filtro saturado eleva o consumo e derruba a capacidade de gelar."],
      ["Preventiva:", "Visita trimestral com medição de pressão e inspeção elétrica. Sai muito mais barato que trocar um compressor."],
    ],
  },
];

export const AMBIENTES_BY_ID = Object.fromEntries(
  AMBIENTES.map((ambiente) => [ambiente.id, ambiente]),
) as Record<string, Ambiente>;

/* ------------------------------------------------------------------ */
/* Cobertura — Araraquara e região                                     */
/* ------------------------------------------------------------------ */

export const COVERAGE = {
  base: "Araraquara",
  cities: [
    "Araraquara",
    "Américo Brasiliense",
    "Santa Lúcia",
    "São Carlos",
    "Ibaté",
    "Matão",
    "Gavião Peixoto",
    "Rincão",
    "Motuca",
    "Nova Europa",
    "Boa Esperança do Sul",
    "Tabatinga",
    "Dobrada",
    "Descalvado",
    "Ribeirão Bonito",
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Marcas com atendimento técnico                                      */
/* ------------------------------------------------------------------ */

export const BRANDS_SERVICED = [
  "Daikin",
  "LG",
  "Samsung",
  "Midea",
  "Elgin",
  "Gree",
  "Fujitsu",
  "Springer",
  "Carrier",
  "TCL",
  "Philco",
  "Consul",
] as const;

/* ------------------------------------------------------------------ */
/* Provas e números                                                    */
/* ------------------------------------------------------------------ */

export const STATS = [
  { value: 100, suffix: "%", label: "Atendimentos com garantia por escrito" },
  { value: 24, suffix: "h", label: "Retorno máximo para orçamento" },
  { value: 15, suffix: "", label: "Cidades atendidas na região" },
  { value: 12, suffix: "", label: "Marcas com atendimento técnico" },
];

export const TESTIMONIALS = [
  {
    quote:
      "Chamei por causa do cheiro de mofo que não saía. Ele desmontou a evaporadora inteira na minha frente e mostrou o que tinha ali dentro. Nunca mais voltou o cheiro.",
    author: "Juliana M.",
    place: "Araraquara — Vila Xavier",
  },
  {
    quote:
      "Instalou dois splits em casa. Fez vácuo na linha, coisa que o instalador anterior nem tinha feito. A diferença no gelo foi absurda.",
    author: "Rodrigo P.",
    place: "São Carlos — Centro",
  },
  {
    quote:
      "Pontual, explicou cada passo e deixou o serviço limpo. Já contratei a preventiva dos três aparelhos do escritório.",
    author: "Camila T.",
    place: "Américo Brasiliense",
  },
  {
    quote:
      "Pedi orçamento pelo WhatsApp num domingo e no dia seguinte já estava marcado. Preço justo e serviço impecável.",
    author: "Anderson L.",
    place: "Matão",
  },
];

/* ------------------------------------------------------------------ */
/* FAQ — também alimenta o schema FAQPage                              */
/* ------------------------------------------------------------------ */

export const FAQ = [
  {
    q: "De quanto em quanto tempo preciso higienizar o ar-condicionado?",
    a: "Em residência, a cada 6 meses. Em ambiente comercial, com muita gente circulando, ou em casa com animal, criança pequena ou alguém alérgico, o ideal é a cada 3 meses. Filtro é diferente: deve ser lavado todo mês pelo próprio usuário.",
  },
  {
    q: "O aparelho está pingando água dentro de casa. É grave?",
    a: "Na maioria das vezes é o dreno obstruído por sujeira acumulada — resolvido na hora. Mas também pode ser caimento errado da instalação ou gelo formado por falta de gás. Vale uma avaliação antes que a água atinja a parede ou a tomada.",
  },
  {
    q: "Qual a diferença entre limpar o filtro e fazer a higienização completa?",
    a: "O filtro é a tela que você mesmo retira e lava. A higienização completa é a desmontagem da evaporadora para lavar a serpentina, a turbina, a bandeja e o dreno com produto bactericida. O cheiro de mofo vem justamente do biofilme nessas peças — limpar só o filtro não resolve.",
  },
  {
    q: "Vocês fazem a infraestrutura da instalação também?",
    a: "Sim. Furação, tubulação de cobre, dreno, elétrica e suporte. A infraestrutura pode ser embutida na alvenaria ou aparente com acabamento em canaleta, conforme o seu ambiente.",
  },
  {
    q: "Como funciona o orçamento?",
    a: "Pelo WhatsApp, sem custo. Você descreve o serviço e, se precisar, manda uma foto do ambiente. Para instalação, use a calculadora de BTUs aqui do site — o cálculo já chega pronto junto com o pedido.",
  },
  {
    q: "Atendem fora de Araraquara?",
    a: "Sim. Atendemos toda a região: São Carlos, Américo Brasiliense, Matão, Ibaté, Santa Lúcia, Gavião Peixoto e outras cidades próximas. Confirme a sua pelo WhatsApp.",
  },
  {
    q: "O serviço tem garantia?",
    a: "Tem. Toda instalação e manutenção sai com garantia por escrito. Se algo apresentar problema dentro do prazo, o retorno é sem custo.",
  },
];

/* ------------------------------------------------------------------ */
/* Capítulos — navegação lateral e progresso de scroll                 */
/* ------------------------------------------------------------------ */

export const CHAPTERS = [
  { id: "inicio", label: "Início" },
  { id: "ar", label: "O ar que você respira" },
  { id: "servicos", label: "Serviços" },
  { id: "processo", label: "Processo" },
  { id: "resultado", label: "Antes & Depois" },
  { id: "calculadora", label: "Calculadora" },
  { id: "depoimentos", label: "Depoimentos" },
  { id: "cobertura", label: "Cobertura" },
  { id: "orcamento", label: "Orçamento" },
  { id: "duvidas", label: "Dúvidas" },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];
