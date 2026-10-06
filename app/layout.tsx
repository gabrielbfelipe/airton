import type { Metadata, Viewport } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import { BRAND, CONTACT, COVERAGE, FAQ, SERVICES } from "@/lib/site";
import "./globals.css";

/* Display condensado — o eixo `wdth` é o que permite o título monumental. */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
  display: "swap",
});

const SITE_URL = "https://airtonclimatizacao.com.br";
const DESCRIPTION =
  "Instalação, higienização e manutenção de ar condicionado em Araraquara e região. Vácuo de linha, limpeza profunda da evaporadora e garantia por escrito. Orçamento pelo WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.full} — Ar Condicionado em ${BRAND.city} e Região`,
    template: `%s · ${BRAND.full}`,
  },
  description: DESCRIPTION,
  keywords: [
    "ar condicionado Araraquara",
    "instalação de ar condicionado Araraquara",
    "higienização de ar condicionado",
    "limpeza de ar condicionado Araraquara",
    "manutenção de ar condicionado",
    "instalador de split Araraquara",
    "ar condicionado São Carlos",
    "ar condicionado Américo Brasiliense",
  ],
  authors: [{ name: BRAND.legal }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: BRAND.full,
    title: `${BRAND.full} — ${BRAND.slogan}`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.full} — ${BRAND.slogan}`,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: "#050a14",
  colorScheme: "dark",
};

/** Schema.org — o que coloca o Airton no mapa das buscas locais. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HVACBusiness",
      "@id": `${SITE_URL}#business`,
      name: BRAND.full,
      alternateName: BRAND.legal,
      description: DESCRIPTION,
      url: SITE_URL,
      telephone: `+${CONTACT.whatsappRaw}`,
      priceRange: "$$",
      image: `${SITE_URL}/brand/logo-mark.svg`,
      slogan: BRAND.slogan,
      address: {
        "@type": "PostalAddress",
        addressLocality: BRAND.city,
        addressRegion: BRAND.state,
        addressCountry: "BR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: BRAND.geo.lat,
        longitude: BRAND.geo.lng,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:00",
          closes: "18:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "08:00",
          closes: "13:00",
        },
      ],
      areaServed: COVERAGE.cities.map((city) => ({
        "@type": "City",
        name: city,
        containedInPlace: { "@type": "State", name: "São Paulo" },
      })),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Serviços de climatização",
        itemListElement: SERVICES.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.short,
            description: service.description,
          },
        })),
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}#faq`,
      mainEntity: FAQ.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${inter.variable} ${mono.variable}`}>
      <head>
        {/* Sem JS as animações nunca disparam. Em vez de deixar títulos em
            opacity:0 para sempre, o conteúdo simplesmente aparece. */}
        <noscript>
          <style>{`[data-reveal],[data-animated]{opacity:1!important;animation:none!important}`}</style>
        </noscript>
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          // O conteúdo é estático e vem do nosso próprio módulo de dados.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
