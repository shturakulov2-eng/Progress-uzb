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
  mapHref:
    "https://www.google.com/maps/place/39%C2%B039'35.9%22N+66%C2%B057'46.0%22E/@39.659982,66.962769,16z/data=!4m4!3m3!8m2!3d39.659982!4d66.962769",
  mapEmbedSrc:
    "https://www.google.com/maps?q=39.659982,66.962769&z=16&hl=uz&output=embed",
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
