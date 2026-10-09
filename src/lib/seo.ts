import type { Metadata } from "next";

import { baseSiteConfig } from "@/content/base";
import { siteConfig } from "@/content/site";

/** Target search queries for Progress.uzb (Samarkand marketing agency). */
export const seoKeywords = [
  "SMM Samarqand",
  "SMM Samarkand",
  "SMM Самарканд",
  "Marketing Samarqand",
  "Marketing Samarkand",
  "Marketing Самарканд",
  "SMM agentligi Samarqand",
  "marketing agentligi Samarqand",
  "маркетинговое агентство Самарканд",
  "targeting Samarqand",
  "targеt Самарканд",
  "brending Samarqand",
  "branding Samarkand",
  "sayt yasash Samarqand",
  "website yasash Samarqand",
  "reklama Samarqand",
  "digital marketing Uzbekistan",
  "Progress.uzb",
] as const;

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "SMM va Marketing agentligi Samarqand | Progress.uzb",
    template: "%s | Progress.uzb",
  },
  description:
    "Samarqanddagi SMM va marketing agentligi. SMM, targeting, brending, website yasash, landing page va sotuv tizimlari. Progress.uzb — SMM Samarkand, Marketing Samarqand.",
  keywords: [...seoKeywords],
  applicationName: siteConfig.name,
  authors: [{ name: "Progress.uzb", url: siteConfig.url }],
  creator: "Progress.uzb",
  publisher: "Progress.uzb",
  category: "marketing",
  other: {
    "geo.region": "UZ-SA",
    "geo.placename": "Samarkand",
    "geo.position": `${baseSiteConfig.address.latitude};${baseSiteConfig.address.longitude}`,
    ICBM: `${baseSiteConfig.address.latitude}, ${baseSiteConfig.address.longitude}`,
  },
  openGraph: {
    title: "SMM va Marketing agentligi Samarqand | Progress.uzb",
    description:
      "Samarqandda SMM, targeting, brending, sayt yasash va sotuv tizimlari. Mahalliy marketing agentligi — Progress.uzb.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "uz_UZ",
    alternateLocale: ["ru_RU", "en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SMM va Marketing agentligi Samarqand | Progress.uzb",
    description:
      "SMM Samarkand, Marketing Samarqand — targeting, brending, website yasash va sotuv tizimlari.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export function getLocalBusinessSchema() {
  const { address, social } = baseSiteConfig;

  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    name: siteConfig.name,
    alternateName: [
      "Progress.uzb",
      "Progress Marketing Agentligi",
      "Progress Group",
    ],
    description:
      "Samarqanddagi SMM va marketing agentligi: SMM, targeting, brending, website yasash, landing page, sotuv bo‘limini qurish va avtomatlashtirish.",
    url: siteConfig.url,
    telephone: siteConfig.phoneDisplay,
    email: siteConfig.email,
    image: `${siteConfig.url}/opengraph-image`,
    logo: `${siteConfig.url}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.localityEn,
      addressRegion: "Samarkand Region",
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: address.latitude,
      longitude: address.longitude,
    },
    hasMap: siteConfig.mapHref,
    areaServed: [
      { "@type": "City", name: "Samarkand" },
      { "@type": "City", name: "Samarqand" },
      { "@type": "AdministrativeArea", name: "Samarkand Region" },
      { "@type": "Country", name: "Uzbekistan" },
    ],
    priceRange: "$$",
    sameAs: [social.instagram, social.telegram, social.youtube],
    knowsAbout: [...seoKeywords],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "SMM va marketing xizmatlari Samarqand",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "SMM Samarqand",
            areaServed: "Samarkand",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Marketing Samarqand",
            areaServed: "Samarkand",
          },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Targeting / Performance marketing" },
        },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Brending" } },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Website / landing page yasash" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Sotuv bo'limini qurish" },
        },
      ],
    },
  };
}

export function getFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Samarqandda SMM agentligi bormi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ha. Progress.uzb — Samarqanddagi SMM va marketing agentligi. Instagram, Telegram va YouTube uchun SMM, targeting, brending va sayt yasash xizmatlarini ko‘rsatamiz.",
        },
      },
      {
        "@type": "Question",
        name: "Marketing agentligi Samarqandda nima qiladi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Progress.uzb marketing strategiyasi, SMM, targeting, brending, website yasash va sotuv bo‘limini qurishni bitta tizimda beradi. Manzil: Bo‘ston saroy ko‘chasi, 24, Samarqand.",
        },
      },
      {
        "@type": "Question",
        name: "SMM Samarkand xizmati qancha turadi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Narx biznes hajmi va vazifaga qarab belgilanadi. Bepul konsultatsiyada aniq reja va smeta beramiz — progressgroup.uz orqali ariza qoldiring.",
        },
      },
    ],
  };
}
