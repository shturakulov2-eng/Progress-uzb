export const baseSiteConfig = {
  name: "Progress.uzb",
  shortName: "Progress",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://progress.uzb",
  phoneDisplay: "+998 90 000 00 00",
  phoneHref: "tel:+998900000000",
  email: "hello@progress.uzb",
  socialProof: {
    projects: "120+",
    clients: "50+",
    experience: "6+",
    satisfaction: "95%",
  },
} as const;
