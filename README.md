# AIRTON — Climatização

Site institucional de alta performance visual para **AIRTON — Climatização**,
instalação e higienização de ar condicionado em **Araraquara/SP e região**.

Experiência single-page com preloader térmico, máscara em canvas com perspectiva,
cenas dirigidas por scroll e três ferramentas de captação: calculadora de BTUs,
orçamento multi-step e WhatsApp contextual.

---

## Rodando o projeto

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm start          # serve o build
```

Requer Node 20+.

---

## Stack

| Peça | Uso |
|---|---|
| **Next.js 15** (App Router) + React 19 | base, SSR, rotas de metadata |
| **TypeScript** strict | — |
| **Tailwind CSS v4** | tokens via `@theme` em `app/globals.css` |
| **GSAP 3.15** | ScrollTrigger, SplitText, DrawSVG, Draggable, Flip, Observer |
| **Lenis** | smooth scroll, conduzido pelo ticker do GSAP |
| **Three.js / R3F** | instalado para evolução 3D (ver *Próximos passos*) |

Desde o GSAP 3.13 todos os plugins são gratuitos, inclusive para uso comercial —
não existe token privado nem registry customizado neste projeto.

---

## Onde mexer

### Dados do negócio — `lib/site.ts`

**Fonte única de verdade.** Telefone, serviços, cidades atendidas, FAQ,
depoimentos e os textos dos ambientes vivem só aqui. Nenhum componente
repete essas informações.

Para trocar o WhatsApp, por exemplo, basta `CONTACT.whatsappRaw` e
`CONTACT.phoneDisplay` — todos os links `wa.me` do site se atualizam juntos.

### Sistema de movimento — `lib/animation/`

| Arquivo | Responsabilidade |
|---|---|
| `easings.ts` | curvas exatas do sistema e `animateValue` (rAF com easeInOutCubic) |
| `projection.ts` | matemática da janela do portal: retângulo arredondado projetado, focal 850, `drawCover` travado na tela |
| `useCinematicLoop.ts` | loop de vídeo com fade manual — elimina o corte seco do `loop` nativo |
| `useLenis.ts` | smooth scroll sincronizado com o ScrollTrigger |
| `gsap.ts` | registro único dos plugins |

### Perfil de movimento — `lib/motion-profile.ts`

O mecanismo que impede o site de travar num celular modesto. Classifica o
dispositivo em três níveis:

- **`cinematic`** — tudo ligado: canvas com tilt, partículas, vídeo.
- **`reduced`** — sem canvas pesado; vídeo e reveals continuam.
- **`static`** — só imagem. **A página segue completa e vendendo.**

`prefers-reduced-motion: reduce`, `saveData` e conexão 2G caem direto em
`static`. Ponteiro grosso ou largura abaixo de 1024px caem em `reduced`.

### Cálculo de BTUs — `lib/btu.ts`

Carga térmica pela regra praticada no mercado brasileiro (600/800 BTU/h por m²,
+600 por pessoa acima da segunda, +600 por aparelho que dissipa calor, ajuste
proporcional de pé-direito), arredondada para a capacidade comercial com
**tolerância de 5%** — uma carga de 12.600 indica 12.000, não 18.000.

---

## Estrutura

```
app/
  layout.tsx          fontes, metadata, JSON-LD (HVACBusiness + FAQPage)
  page.tsx            composição das cenas e as fases do preloader
  globals.css         tokens Tailwind v4, keyframes, utilitário de reveal
  icon.svg · sitemap.ts · robots.ts

components/
  preloader/ThermalPreloader   contador 40 °C → 18 °C, logo voando ao header
  hero/Hero                    vídeo em loop por fade + SplitText
  portal/PortalAmbientes       máscara em canvas com perspectiva e tilt
  scenes/                      AirQuality · Services · Process · Trust ·
                               Numbers · Testimonials · Coverage · Faq
  tools/                       BtuCalculator · QuoteWizard · FloatingWhatsApp
  ui/                          SiteHeader · SiteFooter · CustomCursor ·
                               Reveal · CinematicVideo

lib/                           site.ts · btu.ts · motion-profile.ts · animation/
public/brand · public/video · public/img/poster
```

---

## Mídia

Vídeos e posters são de **banco livre de direitos (Pexels)**, com licença que
permite uso comercial sem atribuição. Estão versionados em `public/video` e
`public/img/poster`, carregados sob demanda por `IntersectionObserver`.

Quando o Airton tiver material próprio, basta substituir os arquivos mantendo
os nomes — nenhum código precisa mudar.

O logo em `public/brand/logo-mark.svg` foi **reconstruído em vetor** a partir do
cartão de visita impresso, para ficar nítido em qualquer tamanho e animável.

---

## Acessibilidade e SEO

- JSON-LD `HVACBusiness` com as 15 cidades em `areaServed`, e `FAQPage`.
- Headings semânticos reais por trás de toda animação.
- O cursor customizado só monta com ponteiro fino e sem `prefers-reduced-motion`.
- `<noscript>` revela qualquer conteúdo que dependeria de animação.
- Verificado sem scroll horizontal em 390px, 768px e 1440px.

---

## Próximos passos sugeridos

1. **Google Business Profile** — maior alavanca de busca local, independe do site.
2. Registrar `airtonclimatizacao.com.br` e publicar na Vercel.
3. Substituir o material de banco por fotos e vídeos reais dos serviços.
4. Comprimir os vídeos com `ffmpeg` (WebM/VP9 + AV1) — hoje somam ~21 MB.
5. Split 3D interativo no hero com React Three Fiber (as dependências já estão
   instaladas).
6. Fase 2: planos de manutenção recorrente e painel de leads.

---

## Nota sobre o cartão impresso

O cartão de visita atual traz **"MAIIS"** onde deveria ser **"MAIS"**
("ambientes mais limpos"). O site já sai com a grafia correta — vale corrigir
antes da próxima tiragem.
