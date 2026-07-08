import type { Metadata } from "next";

import { siteConfig } from "@/content/site";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Progress.uzb | Premium Marketing Agency in Samarkand",
    template: "%s | Progress.uzb",
  },
  description:
    "Progress.uzb is a premium digital marketing agency in Samarkand delivering branding, SMM, performance marketing, websites, automation, and AI solutions.",
  keywords: [
    "marketing agency samarkand",
    "digital marketing uzbekistan",
    "branding agency samarkand",
    "website development uzbekistan",
    "smm agency samarkand",
    "lead generation agency",
  ],
  openGraph: {
    title: "Progress.uzb | Premium Marketing Agency in Samarkand",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Progress.uzb | Premium Marketing Agency in Samarkand",
    description: siteConfig.description,
  },
  alternates: {
    canonical: "/",
  },
};

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phoneDisplay,
    email: siteConfig.email,
    image: `${siteConfig.url}/opengraph-image.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Samarkand",
      addressCountry: "UZ",
    },
    areaServed: ["Samarkand", "Uzbekistan"],
    priceRange: "$$",
  };
}
