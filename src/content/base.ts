export const baseSiteConfig = {
  name: "Progress.uzb",
  shortName: "Progress",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://progress.uzb",
  phoneDisplay: "+998 93 963 32 63",
  phoneHref: "tel:+998939633263",
  phones: [
    { display: "+998 93 963 32 63", href: "tel:+998939633263" },
    { display: "+998 97 000 64 00", href: "tel:+998970006400" },
  ],
  email: "hello@progress.uzb",
  mapLabel: "Xarita / Geolokatsiya",
  mapHref: "https://maps.google.com/?q=Tashkent",
  social: {
    instagram: "https://instagram.com/",
    telegram: "https://t.me/",
  },
  socialProof: {
    projects: "120+",
    clients: "50+",
    experience: "6+",
    satisfaction: "95%",
  },
} as const;
