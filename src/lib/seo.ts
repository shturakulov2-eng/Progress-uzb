import type { Metadata } from "next";

import { siteConfig } from "@/content/site";

/** Target search queries for Progress.uzb (Samarkand marketing agency). */
export const seoKeywords = [
  "Marketing",
  "Marketing samarkand",
  "Marketing samarqand",
  "SMM",
  "SMM samarkand",
  "SMM samarqand",
  "Brending",
  "Branding",
  "Rebrand",
  "Branding samarkand",
  "Brending samarkand",
  "Sotuv",
  "Website yasash",
  "Vebsayt yasash",
  "Avtomatlashtirish",
  "Sotuv bo'limini qurib berish",
  "Sotuvni oshirish",
  "Marketing xizmatlari",
  "Marketing ximatlari",
  "Avtomatlashtirish, sun'iy intellekt integratsiya qilish",
  "Landing page",
  "IT yechimlar",
  "marketing agentligi samarqand",
  "digital marketing uzbekistan",
  "smm agentligi samarqand",
] as const;

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default:
      "Progress.uzb | Marketing, SMM, Branding & Website Yasash — Samarkand / Samarqand",
    template: "%s | Progress.uzb",
  },
  description:
    "Samarqanddagi marketing agentligi: SMM, brending/branding, rebrand, website va vebsayt yasash, landing page, sotuvni oshirish, sotuv bo‘limini qurish, avtomatlashtirish, sun’iy intellekt integratsiyasi va IT yechimlar. Progress.uzb — Marketing Samarkand / Marketing Samarqand.",
  keywords: [...seoKeywords],
  openGraph: {
    title:
      "Progress.uzb | Marketing, SMM, Branding — Samarkand / Samarqand",
    description:
      "Marketing, SMM, brending, website yasash, landing page, sotuvni oshirish, avtomatlashtirish va AI/IT yechimlar — Samarqand, O‘zbekiston.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Progress.uzb | Marketing, SMM, Branding — Samarkand / Samarqand",
    description:
      "Marketing Samarkand, SMM, brending, vebsayt yasash, landing page, sotuv va avtomatlashtirish xizmatlari.",
  },
  alternates: {
    canonical: "/",
  },
};

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    alternateName: ["Progress.uzb", "Progress Marketing Agentligi"],
    description:
      "Marketing, SMM, branding/brending, website yasash, landing page, sotuvni oshirish, avtomatlashtirish, sun'iy intellekt integratsiyasi va IT yechimlar — Samarqand.",
    url: siteConfig.url,
    telephone: siteConfig.phoneDisplay,
    email: siteConfig.email,
    image: `${siteConfig.url}/opengraph-image.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Samarkand",
      addressRegion: "Samarkand",
      addressCountry: "UZ",
    },
    areaServed: [
      { "@type": "City", name: "Samarkand" },
      { "@type": "City", name: "Samarqand" },
      { "@type": "Country", name: "Uzbekistan" },
    ],
    priceRange: "$$",
    knowsAbout: [
      "Marketing",
      "Marketing Samarkand",
      "Marketing Samarqand",
      "SMM",
      "SMM Samarkand",
      "SMM Samarqand",
      "Brending",
      "Branding",
      "Rebrand",
      "Branding Samarkand",
      "Brending Samarkand",
      "Sotuv",
      "Website yasash",
      "Vebsayt yasash",
      "Avtomatlashtirish",
      "Sotuv bo'limini qurib berish",
      "Sotuvni oshirish",
      "Marketing xizmatlari",
      "Sun'iy intellekt integratsiya",
      "Landing page",
      "IT yechimlar",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Marketing xizmatlari",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Marketing" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "SMM" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Branding / Brending" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Rebrand" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Website / Vebsayt yasash" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Landing page" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sotuvni oshirish" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sotuv bo'limini qurib berish" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Avtomatlashtirish" } },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Avtomatlashtirish va sun'iy intellekt integratsiya",
          },
        },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "IT yechimlar" } },
      ],
    },
  };
}
