export type Locale = "uz" | "en" | "ru";

export type SectionCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

export type SiteContent = {
  locale: Locale;
  siteConfig: {
    description: string;
    location: string;
  };
  navigation: { label: string; href: string }[];
  heroMetrics: { value: string; label: string }[];
  hero: {
    navTagline: string;
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    strategyLabel: string;
    strategyTitle: string;
    locatedIn: string;
    videoQuote: string;
    showcaseCards: { title: string; description: string }[];
  };
  sections: {
    whyChoose: SectionCopy;
    services: SectionCopy;
    process: SectionCopy;
    portfolio: SectionCopy & { projectPreview: string };
    results: SectionCopy;
    testimonials: SectionCopy & { whatClientsSay: string; sideQuote: string };
    faq: SectionCopy;
    finalCta: {
      eyebrow: string;
      title: string;
      description: string;
      cta: string;
    };
    contact: {
      badge: string;
      title: string;
      description: string;
      phoneLabel: string;
      servicesLabel: string;
      servicesValue: string;
    };
  };
  differentiators: { title: string; description: string }[];
  services: { title: string; description: string; items: string[] }[];
  processSteps: string[];
  portfolioItems: { name: string; category: string; description: string }[];
  statistics: { value: number; suffix: string; label: string }[];
  testimonials: { name: string; company: string; review: string }[];
  faqs: { question: string; answer: string }[];
  form: {
    fullName: string;
    companyName: string;
    businessType: string;
    phoneNumber: string;
    placeholders: {
      fullName: string;
      companyName: string;
      businessType: string;
      phoneNumber: string;
    };
    submit: string;
    submitting: string;
    success: string;
    errorGeneric: string;
    errorNetwork: string;
  };
  popup: {
    eyebrow: string;
    title: string;
    description: string;
    close: string;
  };
  common: {
    freeConsultation: string;
    backToTop: string;
    previousTestimonial: string;
    nextTestimonial: string;
    showTestimonial: string;
    primaryNav: string;
    selectLanguage: string;
  };
  validation: {
    fullNameMin: string;
    fullNameMax: string;
    companyNameMin: string;
    companyNameMax: string;
    businessTypeMin: string;
    businessTypeMax: string;
    phoneNumberMin: string;
    phoneNumberMax: string;
    phoneNumberInvalid: string;
  };
};
