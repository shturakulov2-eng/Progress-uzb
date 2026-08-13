import type { Locale } from "@/content/types";

export type ShaxzodPhotoSlot = {
  /** Path under /public. Empty = show placeholder until photo is added. */
  src: string;
  alt: string;
  /** Layout hint for the UI */
  aspect: "portrait" | "landscape" | "square";
};

export type ShaxzodProfile = {
  metaDescription: string;
  backLabel: string;
  name: string;
  tagline: string;
  role: string;
  intro: string;
  heroCta: string;
  nav: {
    biography: string;
    mentors: string;
    journey: string;
    ecosystem: string;
    vacancies: string;
    contact: string;
  };
  portraitSrc: string;
  photos: {
    biography: ShaxzodPhotoSlot;
    mentors: ShaxzodPhotoSlot;
    journey: ShaxzodPhotoSlot;
    ecosystem: ShaxzodPhotoSlot;
    vacancies: ShaxzodPhotoSlot;
    contact: ShaxzodPhotoSlot;
  };
  mission: {
    eyebrow: string;
    title: string;
    body: string;
  };
  biography: {
    eyebrow: string;
    title: string;
    facts: { label: string; value: string }[];
    educationTitle: string;
    education: string[];
    careerTitle: string;
    career: string[];
    galleryLabel: string;
    gallery: { src: string; alt: string }[];
  };
  mentors: {
    eyebrow: string;
    title: string;
    intro: string;
    names: string[];
  };
  journey: {
    eyebrow: string;
    title: string;
    items: { period: string; name: string; description: string }[];
  };
  ecosystem: {
    eyebrow: string;
    title: string;
    items: { name: string; description: string }[];
  };
  vacancies: {
    eyebrow: string;
    title: string;
    intro: string;
    roles: string[];
    internshipTitle: string;
    internshipBody: string;
    cta: string;
    ctaHref: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    addressLabel: string;
    address: string;
    phoneLabel: string;
    phoneDisplay: string;
    phoneHref: string;
  };
  footer: {
    progressNavTitle: string;
    profileNavTitle: string;
    phonesTitle: string;
    socialTitle: string;
    youtubeLabel: string;
  };
};

/** Shared media paths — drop files into public/shaxzod/ to fill placeholders. */
export const shaxzodMedia = {
  portrait: "/shaxzod/portrait.png?v=7",
  biography: "/shaxzod/biography-1.jpg",
  mentors: "/shaxzod/mentors.jpg",
  journey: "/shaxzod/journey.jpg",
  ecosystem: "/shaxzod/ecosystem.jpg",
  vacancies: "/shaxzod/vacancies.jpg?v=1",
  contact: "/shaxzod/contact.jpg",
} as const;

const galleryFiles = [
  "01-classroom.png",
  "02-portrait-car.png",
  "03-brands.png",
  "04-sales-board.png",
  "05-conference-group.png",
  "06-certificate.png",
  "07-awards-group.png",
  "08-office-study.png",
  "09-computer-lab.png",
  "10-grant-edu.png",
] as const;

function biographyGallery(alts: string[]): { src: string; alt: string }[] {
  return galleryFiles.map((file, index) => ({
    src: `/shaxzod/gallery/${file}`,
    alt: alts[index] ?? "",
  }));
}

const mentors = [
  "Azizjon G'apparov",
  "Jamshid Hasanov",
  "Alisher Isayev",
  "Sherzod Tursunov",
];

const journeyItemsUz: ShaxzodProfile["journey"]["items"] = [
  {
    period: "2015",
    name: "Sladkiy silindr",
    description:
      "Ilk tadbirkorlik tajribasi — snack va shirinliklar. Biznes va bozor bilan birinchi amaliy tanishuv hamda bankrotlik sabog'i.",
  },
  {
    period: "2019",
    name: "Dizayn agentlik",
    description:
      "0 so'm bilan boshlangan. Birinchi mijozdan $300 zarar va 4 oyda tarqalgan jamoa — sheriklik va shartnoma saboqlari.",
  },
  {
    period: "2020–2021",
    name: "Gibkiy kamen",
    description:
      "8 oy ishlab chiqarish yo'nalishi. Yangi mahsulotni bozorga olib kirish qimmatligi sababli sherikchilikdan chiqilgan.",
  },
  {
    period: "2020–2022",
    name: "Progress SMM va Dizayn agentligi",
    description:
      "0 so'mdan 50+ mijoz, jamoa 9 kishigacha. Fokus yo'qolishi ortidan jamoa tarqalgan — strategik fokusning ahamiyati.",
  },
  {
    period: "2020–2022",
    name: "Rim ustunlari va Kolizey brendi",
    description:
      "$650 bilan boshlanib, keyinchalik «Kolizey» brendi ostida yangi bosqichga olib chiqilgan ishlab chiqarish biznesi.",
  },
  {
    period: "2021–2022",
    name: "Qanot Edu o'quv markazi",
    description:
      "Ta'lim sohasida ish boshlab, operatsion jarayonlarni o'rganganidan so'ng, vaqt talabi sababli sotilgan.",
  },
  {
    period: "2021–2022",
    name: "Hadya",
    description:
      "Joynamoz va kitob to'plamlari. Instagram orqali ilk to'liq onlayn sotuv voronkasi — e-commerce tajribasi.",
  },
  {
    period: "2023",
    name: "Sabit / Saturn",
    description:
      "$15 000 investitsiya, ~$100 000 savdo. Nasiya va qarzdorlik sababli $13 500 zarar — moliya sabog'i.",
  },
  {
    period: "2023–Hozirda",
    name: "Progress Marketing Agentligi",
    description:
      "Qayta shakllantirilgan flagman: 3 kishidan 17 kishigacha kengaygan marketing agentligi.",
  },
  {
    period: "2024–Hozirda",
    name: "Spinewell",
    description:
      "$3 000 investitsiya, 6 oyda tizimlashtirilib strategik boshqaruvga o'tkazilgan. Samarqandda soha yetakchisi.",
  },
  {
    period: "2025–2026",
    name: "Process Sales",
    description:
      "Sotuv bo'limlarini qurish va autsors. Kadrlarni tizimlashtirish maqsadida vaqtincha to'xtatilgan.",
  },
  {
    period: "2025",
    name: "Mazmun Branding",
    description: "Progress Group tarkibidagi brending subkorxonasi.",
  },
  {
    period: "2025–Hozirda",
    name: "Proaktika",
    description:
      "Zamonaviy kasblar maktabi — jamoa uchun malakali kadrlarni tayyorlovchi ichki akademiya.",
  },
  {
    period: "2025–Hozirda",
    name: "Profinder HR",
    description:
      "Rekrutingdan boshlanib, bizneslarni tizimlashtirish yo'nalishida faoliyat yuritayotgan HR agentligi.",
  },
  {
    period: "2025–Hozirda",
    name: "Giftique",
    description: "Onlayn sovg'alar va mavsumiy tovarlar e-commerce loyihasi.",
  },
  {
    period: "2026–Hozirda",
    name: "Texnoya",
    description: "Maishiy texnikalar savdosi yo'nalishi.",
  },
  {
    period: "2026–Hozirda",
    name: "Penamax",
    description: "Penoblok va pena urish xizmatlari loyihasi.",
  },
  {
    period: "2026–Hozirda",
    name: "Procode IT",
    description: "Progress Group tarkibidagi IT va dasturiy yechimlar jamoasi.",
  },
];

const ecosystemUz: ShaxzodProfile["ecosystem"]["items"] = [
  {
    name: "Progress Marketing",
    description:
      "Performance marketing, content marketing va shaxsiy brendni rivojlantirish",
  },
  {
    name: "ProCode",
    description:
      "IT yechimlar, veb-saytlar, avtomatlashtirish va integratsiyalar",
  },
  {
    name: "Profit Finance",
    description: "Moliyaviy hisob, foyda diagnostikasi va moliyaviy intizom",
  },
  {
    name: "Process Sales",
    description: "Sotuv bo'limlarini noldan qurish va KPI tizimlarini joriy etish",
  },
  {
    name: "Profinder",
    description: "HR tizimlashtirish, recruiting va kadrlar tanlovi",
  },
  {
    name: "Proaktika",
    description: "Amaliy va zamonaviy kasblar akademiyasi",
  },
  {
    name: "Prod-Action",
    description:
      "Production: reklama roliklari, reels-makerlik, suratga olish va kontent",
  },
];

const vacanciesUz = [
  "Content Maker",
  "Sotuv menejeri",
  "Targetolog",
  "Performance marketolog",
  "Marketolog",
  "Marketolog assistenti",
  "Video montaj ustasi",
  "Video operator",
];

function photoSlots(
  alts: {
    biography: string;
    mentors: string;
    journey: string;
    ecosystem: string;
    vacancies: string;
    contact: string;
  },
): ShaxzodProfile["photos"] {
  // biography is filled; other section srcs stay empty until photos are added.
  // Drop files into public/shaxzod/ using names from shaxzodMedia, then set src.
  return {
    biography: {
      src: shaxzodMedia.biography,
      alt: alts.biography,
      aspect: "portrait",
    },
    mentors: {
      src: "",
      alt: alts.mentors,
      aspect: "landscape",
    },
    journey: {
      src: "",
      alt: alts.journey,
      aspect: "landscape",
    },
    ecosystem: {
      src: "",
      alt: alts.ecosystem,
      aspect: "landscape",
    },
    vacancies: {
      src: shaxzodMedia.vacancies,
      alt: alts.vacancies,
      aspect: "square",
    },
    contact: {
      src: "",
      alt: alts.contact,
      aspect: "landscape",
    },
  };
}

const contentUz: ShaxzodProfile = {
  metaDescription:
    "Biznes egalariga aniq raqamlar, moliyaviy mantiq va avtomatlashtirilgan tizimlar orqali barqaror o'sishni ta'minlash.",
  backLabel: "Progress.uzb",
  name: "Shaxzod Turakulov",
  tagline: "Biznesni tizimlashtirish va natijaviy marketing",
  role: "Strateg, Marketolog",
  intro:
    "2019-yildan buyon loyiha boshqaruvi, marketing, biznes yo‘nalishlarida faoliyat yuritib kelaman. Kasbimni, insonlarni, tajriba va bilim ulashishni yaxshi ko‘raman.",
  heroCta: "Men bilan bog'lanish",
  nav: {
    biography: "Biografiya",
    mentors: "Ustozlar",
    journey: "Bizneslar",
    ecosystem: "Ekotizim",
    vacancies: "Vakansiyalar",
    contact: "Aloqa",
  },
  portraitSrc: shaxzodMedia.portrait,
  photos: photoSlots({
    biography: "Shaxzod Turakulov — Progress Marketing avtomobili yonida",
    mentors: "Ustozlar bilan",
    journey: "Biznes yo'li",
    ecosystem: "Progress Group ekotizimi",
    vacancies: "Jamoa va vakansiyalar",
    contact: "Ofis va aloqa",
  }),
  mission: {
    eyebrow: "Oliy maqsad",
    title: "Bo'sh va'dalar emas — barqaror o'sish",
    body: "Biznes egalariga bo'sh va'dalar va yuzaki marketing emas, balki aniq raqamlar, moliyaviy mantiq hamda avtomatlashtirilgan tizimlar orqali barqaror va xavfsiz o'sishni ta'minlash.",
  },
  biography: {
    eyebrow: "Biografiya",
    title: "Biografiya va ta'lim",
    facts: [
      { label: "Tug'ilgan joyi", value: "Samarqand shahri" },
      { label: "Tug'ilgan sana", value: "16-oktyabr, 1999-yil" },
      {
        label: "Qiziqishlar",
        value: "Marketing, sotuv, biznes, avtomatizatsiya, tizimlashtirish",
      },
    ],
    educationTitle: "Ta'lim bosqichlari",
    education: [
      "Samarqand shahridagi 31-maktabni a'lo baholar bilan tamomlagan.",
      "Akademik litseyda ta'limni muvaffaqiyatli davom ettirgan.",
      "2018–2022 yillarda «Silk Road» Xalqaro Turizm Universitetining Marketing yo'nalishida davlat granti asosida tahsil olib, 97% o'zlashtirish (a'lo diplom) bilan tugatgan.",
    ],
    careerTitle: "Karyera va tajriba",
    career: [
      "7 yildan ortiq amaliy marketing va biznes strategiyalari.",
      "70 dan ortiq yirik va o'rta biznes loyihalarida ishtirok.",
      "20 ga yaqin shaxsiy va sheriklikdagi bizneslarda startap, o'sish, inqiroz va tizimlashtirish tajribasi.",
    ],
    galleryLabel: "Galereya",
    gallery: biographyGallery([
      "Shaxzod Turakulov darsda avtomatlashtirish dasturini tushuntirmoqda",
      "Shaxzod Turakulov Progress Marketing avtomobili yonida",
      "Ofisda ish jarayoni va hamkor brendlar",
      "Sotuv va marketing tizimini doskada tushuntirish",
      "Xalqaro konferensiyada guruh surati",
      "Turizm konferensiyasida 1-o'rin sertifikati",
      "Universitet yutuqlari va grantlar bilan guruh surati",
      "Ofisda kitob o'qiyotgan payt",
      "Kompyuter laboratoriyasida hamkasblar bilan",
      "Grant Edu o'quv markazi oldida",
    ]),
  },
  mentors: {
    eyebrow: "Ustozlar",
    title: "Ustozlarim",
    intro:
      "Biznes va hayot yo'limda bilim, tajriba hamda to'g'ri dunyoqarash shakllanishida munosib hissa qo'shgan ustozlarim:",
    names: mentors,
  },
  journey: {
    eyebrow: "10 yillik yo'l",
    title: "Shaxsiy bizneslar va tadbirkorlik tajribasi",
    items: journeyItemsUz,
  },
  ecosystem: {
    eyebrow: "Progress Group",
    title: "Progress Group ekotizimi",
    items: ecosystemUz,
  },
  vacancies: {
    eyebrow: "Jamoamizga qo'shiling",
    title: "Vakansiyalar",
    intro:
      "Biz mas'uliyatli, o'z ustida ishlashdan qochmaydigan va natijaga ishlaydigan mutaxassislarni jamoamizga taklif etamiz:",
    roles: vacanciesUz,
    internshipTitle: "Stajirovka dasturi",
    internshipBody:
      "Tajribasi kam, lekin intilishi va intizomi kuchli bo'lgan yoshlar uchun maxsus stajirovka va amaliyot o'tash imkoniyati bor.",
    cta: "Ariza yuborish",
    ctaHref: "/#contact",
  },
  contact: {
    eyebrow: "Aloqa",
    title: "Aloqa va joylashuv",
    addressLabel: "Manzil",
    address:
      "Samarqand viloyati, Samarqand shahri, Bo'ston saroy ko'chasi (Spartak), 24-uy",
    phoneLabel: "Telefon",
    phoneDisplay: "+998 93 963 33 63",
    phoneHref: "tel:+998939633363",
  },
  footer: {
    progressNavTitle: "Progress Marketing",
    profileNavTitle: "Shaxzod Turakulov",
    phonesTitle: "Telefon raqamlar",
    socialTitle: "Ijtimoiy tarmoqlar",
    youtubeLabel: "YouTube",
  },
};

const contentEn: ShaxzodProfile = {
  metaDescription:
    "Helping business owners achieve sustainable growth through clear numbers, financial logic, and automated systems.",
  backLabel: "Progress.uzb",
  name: "Shaxzod Turakulov",
  tagline: "Business systematization and performance marketing",
  role: "Strategist, Marketer",
  intro:
    "Since 2019 I have been working in project management, marketing, and business. I love my craft, people, and sharing experience and knowledge.",
  heroCta: "Contact me",
  nav: {
    biography: "Biography",
    mentors: "Mentors",
    journey: "Businesses",
    ecosystem: "Ecosystem",
    vacancies: "Vacancies",
    contact: "Contact",
  },
  portraitSrc: shaxzodMedia.portrait,
  photos: photoSlots({
    biography: "Shaxzod Turakulov beside the Progress Marketing car",
    mentors: "With mentors",
    journey: "Business journey",
    ecosystem: "Progress Group ecosystem",
    vacancies: "Team and vacancies",
    contact: "Office and contact",
  }),
  mission: {
    eyebrow: "Mission",
    title: "Not empty promises — sustainable growth",
    body: "Helping business owners achieve stable, safe growth through clear numbers, financial logic, and automated systems — not empty promises or surface-level marketing.",
  },
  biography: {
    eyebrow: "Biography",
    title: "Biography and education",
    facts: [
      { label: "Born in", value: "Samarkand" },
      { label: "Date of birth", value: "October 16, 1999" },
      {
        label: "Interests",
        value: "Marketing, sales, business, automation, systematization",
      },
    ],
    educationTitle: "Education",
    education: [
      "Graduated from School No. 31 in Samarkand with excellent grades.",
      "Continued successfully at an academic lyceum.",
      "2018–2022: studied Marketing at Silk Road International University of Tourism on a state grant and graduated with a 97% excellence diploma.",
    ],
    careerTitle: "Career and experience",
    career: [
      "7+ years in practical marketing and business strategy.",
      "Hands-on work across 70+ mid-size and large business projects.",
      "Experience in ~20 personal and partnership businesses: startup, growth, crisis, and systematization.",
    ],
    galleryLabel: "Gallery",
    gallery: biographyGallery([
      "Shaxzod Turakulov teaching automation software in class",
      "Shaxzod Turakulov beside the Progress Marketing car",
      "Office work and partner brands",
      "Explaining a sales and marketing system on a whiteboard",
      "Group photo at an international conference",
      "First-place certificate at a tourism conference",
      "Group photo with university awards and grants",
      "Reading in the office",
      "With colleagues in a computer lab",
      "In front of the Grant Edu learning center",
    ]),
  },
  mentors: {
    eyebrow: "Mentors",
    title: "My mentors",
    intro:
      "Teachers who shaped my knowledge, experience, and worldview in business and life:",
    names: mentors,
  },
  journey: {
    eyebrow: "A 10-year path",
    title: "Personal businesses and entrepreneurial experience",
    items: [
      {
        period: "2015",
        name: "Sladkiy silindr",
        description:
          "First entrepreneurship — snacks and sweets. First real market lesson, including bankruptcy.",
      },
      {
        period: "2019",
        name: "Design agency",
        description:
          "Started from zero. $300 loss on the first client and a team that dissolved in 4 months — partnership lessons.",
      },
      {
        period: "2020–2021",
        name: "Gibkiy kamen",
        description:
          "8 months in manufacturing. Left the partnership due to high cost of bringing a new product to market.",
      },
      {
        period: "2020–2022",
        name: "Progress SMM & Design agency",
        description:
          "From zero to 50+ clients, team of 9. Dissolved after losing focus — the cost of unclear strategy.",
      },
      {
        period: "2020–2022",
        name: "Roman columns & Kolizey brand",
        description:
          "Started with $650 and later scaled under the Kolizey manufacturing brand.",
      },
      {
        period: "2021–2022",
        name: "Qanot Edu learning center",
        description:
          "Entered education, learned the operations, then sold due to heavy time demands.",
      },
      {
        period: "2021–2022",
        name: "Hadya",
        description:
          "Prayer mats and book sets. First full online sales funnel via Instagram.",
      },
      {
        period: "2023",
        name: "Sabit / Saturn",
        description:
          "~$15k invested, ~$100k in sales, then $13.5k loss due to receivables — a finance lesson.",
      },
      {
        period: "2023–Present",
        name: "Progress Marketing Agency",
        description:
          "Rebuilt flagship agency: grown from 3 to 17 people.",
      },
      {
        period: "2024–Present",
        name: "Spinewell",
        description:
          "$3k investment, systematized in 6 months, now a category leader in Samarkand.",
      },
      {
        period: "2025–2026",
        name: "Process Sales",
        description:
          "Building sales departments and outsourcing. Temporarily paused for talent systematization.",
      },
      {
        period: "2025",
        name: "Mazmun Branding",
        description: "Branding sub-company within Progress Group.",
      },
      {
        period: "2025–Present",
        name: "Proaktika",
        description:
          "Modern skills school — internal academy for training strong specialists.",
      },
      {
        period: "2025–Present",
        name: "Profinder HR",
        description:
          "Started in recruiting; now focuses on business systematization via HR.",
      },
      {
        period: "2025–Present",
        name: "Giftique",
        description: "Online gifts and seasonal e-commerce.",
      },
      {
        period: "2026–Present",
        name: "Texnoya",
        description: "Home appliances retail.",
      },
      {
        period: "2026–Present",
        name: "Penamax",
        description: "Foam block and foam spraying services.",
      },
      {
        period: "2026–Present",
        name: "Procode IT",
        description: "IT and software solutions team within Progress Group.",
      },
    ],
  },
  ecosystem: {
    eyebrow: "Progress Group",
    title: "Progress Group ecosystem",
    items: [
      {
        name: "Progress Marketing",
        description:
          "Performance marketing, content marketing, and personal brand growth",
      },
      {
        name: "ProCode",
        description: "IT solutions, websites, automation, and integrations",
      },
      {
        name: "Profit Finance",
        description: "Financial accounting, profit diagnostics, and discipline",
      },
      {
        name: "Process Sales",
        description: "Building sales departments from zero and KPI systems",
      },
      {
        name: "Profinder",
        description: "HR systematization, recruiting, and talent selection",
      },
      {
        name: "Proaktika",
        description: "Practical academy for modern professions",
      },
      {
        name: "Prod-Action",
        description:
          "Production: ads, reels, filming, and content creation",
      },
    ],
  },
  vacancies: {
    eyebrow: "Join the team",
    title: "Open roles",
    intro:
      "We invite responsible specialists who keep growing and work for results:",
    roles: [
      "Content Maker",
      "Sales manager",
      "Targetologist",
      "Performance marketer",
      "Marketer",
      "Marketing assistant",
      "Video editor",
      "Video operator",
    ],
    internshipTitle: "Internship program",
    internshipBody:
      "A special internship path for motivated, disciplined young people with limited experience.",
    cta: "Submit application",
    ctaHref: "/#contact",
  },
  contact: {
    eyebrow: "Contact",
    title: "Contact and location",
    addressLabel: "Address",
    address:
      "Samarkand region, Samarkand city, Bo'ston saroy street (Spartak), 24",
    phoneLabel: "Phone",
    phoneDisplay: "+998 93 963 33 63",
    phoneHref: "tel:+998939633363",
  },
  footer: {
    progressNavTitle: "Progress Marketing",
    profileNavTitle: "Shaxzod Turakulov",
    phonesTitle: "Phone numbers",
    socialTitle: "Social networks",
    youtubeLabel: "YouTube",
  },
};

const contentRu: ShaxzodProfile = {
  metaDescription:
    "Помогаем владельцам бизнеса достигать устойчивого роста через точные цифры, финансовую логику и автоматизированные системы.",
  backLabel: "Progress.uzb",
  name: "Shaxzod Turakulov",
  tagline: "Систематизация бизнеса и результативный маркетинг",
  role: "Стратег, маркетолог",
  intro:
    "С 2019 года работаю в управлении проектами, маркетинге и бизнес-направлениях. Люблю свою профессию, людей и делиться опытом и знаниями.",
  heroCta: "Связаться со мной",
  nav: {
    biography: "Биография",
    mentors: "Наставники",
    journey: "Бизнесы",
    ecosystem: "Экосистема",
    vacancies: "Вакансии",
    contact: "Контакты",
  },
  portraitSrc: shaxzodMedia.portrait,
  photos: photoSlots({
    biography: "Шахзод Туракулов у автомобиля Progress Marketing",
    mentors: "С наставниками",
    journey: "Бизнес-путь",
    ecosystem: "Экосистема Progress Group",
    vacancies: "Команда и вакансии",
    contact: "Офис и контакты",
  }),
  mission: {
    eyebrow: "Миссия",
    title: "Не пустые обещания — устойчивый рост",
    body: "Помогаем владельцам бизнеса обеспечивать стабильный и безопасный рост через точные цифры, финансовую логику и автоматизированные системы — а не через пустые обещания и поверхностный маркетинг.",
  },
  biography: {
    eyebrow: "Биография",
    title: "Биография и образование",
    facts: [
      { label: "Место рождения", value: "город Самарканд" },
      { label: "Дата рождения", value: "16 октября 1999 года" },
      {
        label: "Интересы",
        value: "Маркетинг, продажи, бизнес, автоматизация, систематизация",
      },
    ],
    educationTitle: "Образование",
    education: [
      "Окончил школу №31 в Самарканде с отличными оценками.",
      "Успешно продолжил обучение в академическом лицее.",
      "2018–2022: учился на направлении Marketing в Международном университете туризма «Silk Road» на государственном гранте, окончил с дипломом отличия (97%).",
    ],
    careerTitle: "Карьера и опыт",
    career: [
      "Более 7 лет в практическом маркетинге и бизнес-стратегии.",
      "Участие в 70+ средних и крупных бизнес-проектах.",
      "Опыт в ~20 личных и партнёрских бизнесах: стартап, рост, кризис и систематизация.",
    ],
    galleryLabel: "Галерея",
    gallery: biographyGallery([
      "Шахзод Туракулов объясняет программу автоматизации на занятии",
      "Шахзод Туракулов у автомобиля Progress Marketing",
      "Работа в офисе и бренды-партнёры",
      "Объяснение системы продаж и маркетинга на доске",
      "Групповое фото на международной конференции",
      "Сертификат за 1 место на конференции по туризму",
      "Групповое фото с университетскими наградами и грантами",
      "Чтение книги в офисе",
      "С коллегами в компьютерной лаборатории",
      "У учебного центра Grant Edu",
    ]),
  },
  mentors: {
    eyebrow: "Наставники",
    title: "Мои наставники",
    intro:
      "Люди, которые внесли вклад в знания, опыт и мировоззрение на пути бизнеса и жизни:",
    names: mentors,
  },
  journey: {
    eyebrow: "10-летний путь",
    title: "Личные бизнесы и предпринимательский опыт",
    items: [
      {
        period: "2015",
        name: "Sladkiy silindr",
        description:
          "Первый предпринимательский опыт — снеки и сладости. Первый урок рынка и банкротства.",
      },
      {
        period: "2019",
        name: "Дизайн-агентство",
        description:
          "Старт с нуля. $300 убытка с первого клиента и распад команды за 4 месяца — уроки партнёрства.",
      },
      {
        period: "2020–2021",
        name: "Gibkiy kamen",
        description:
          "8 месяцев в производстве. Вышел из партнёрства из-за высокой стоимости вывода продукта на рынок.",
      },
      {
        period: "2020–2022",
        name: "Progress SMM и дизайн-агентство",
        description:
          "С нуля до 50+ клиентов, команда до 9 человек. Распад после потери фокуса — цена отсутствия стратегии.",
      },
      {
        period: "2020–2022",
        name: "Римские колонны и бренд Kolizey",
        description:
          "Старт с $650, затем новый этап под брендом Kolizey в производстве.",
      },
      {
        period: "2021–2022",
        name: "Учебный центр Qanot Edu",
        description:
          "Вошёл в образование, изучил операционку и продал бизнес из-за высокой нагрузки по времени.",
      },
      {
        period: "2021–2022",
        name: "Hadya",
        description:
          "Продажа намазлыков и книжных наборов. Первая полная онлайн-воронка через Instagram.",
      },
      {
        period: "2023",
        name: "Sabit / Saturn",
        description:
          "~$15 000 инвестиций, ~$100 000 продаж, затем $13 500 убытка из-за дебиторки — урок финансов.",
      },
      {
        period: "2023–н.в.",
        name: "Progress Marketing Agency",
        description:
          "Пересобранный флагман: рост с 3 до 17 человек.",
      },
      {
        period: "2024–н.в.",
        name: "Spinewell",
        description:
          "$3 000 инвестиций, за 6 месяцев систематизирован и переведён на стратегическое управление. Лидер ниши в Самарканде.",
      },
      {
        period: "2025–2026",
        name: "Process Sales",
        description:
          "Построение отделов продаж и аутсорс. Временно приостановлен для систематизации кадров.",
      },
      {
        period: "2025",
        name: "Mazmun Branding",
        description: "Брендинговая субкомпания в составе Progress Group.",
      },
      {
        period: "2025–н.в.",
        name: "Proaktika",
        description:
          "Школа современных профессий — внутренняя академия для подготовки кадров.",
      },
      {
        period: "2025–н.в.",
        name: "Profinder HR",
        description:
          "Начали с рекрутинга; сейчас — систематизация бизнеса через HR.",
      },
      {
        period: "2025–н.в.",
        name: "Giftique",
        description: "Онлайн-подарки и сезонный e-commerce.",
      },
      {
        period: "2026–н.в.",
        name: "Texnoya",
        description: "Продажа бытовой техники.",
      },
      {
        period: "2026–н.в.",
        name: "Penamax",
        description: "Пеноблоки и услуги пеноизоляции.",
      },
      {
        period: "2026–н.в.",
        name: "Procode IT",
        description: "IT и программные решения в составе Progress Group.",
      },
    ],
  },
  ecosystem: {
    eyebrow: "Progress Group",
    title: "Экосистема Progress Group",
    items: [
      {
        name: "Progress Marketing",
        description:
          "Performance marketing, контент-маркетинг и развитие личного бренда",
      },
      {
        name: "ProCode",
        description: "IT-решения, сайты, автоматизация и интеграции",
      },
      {
        name: "Profit Finance",
        description: "Фин учёт, диагностика прибыли и финансовая дисциплина",
      },
      {
        name: "Process Sales",
        description: "Построение отдела продаж с нуля и KPI-системы",
      },
      {
        name: "Profinder",
        description: "HR-систематизация, recruiting и подбор кадров",
      },
      {
        name: "Proaktika",
        description: "Практическая академия современных профессий",
      },
      {
        name: "Prod-Action",
        description:
          "Production: рекламные ролики, reels, съёмка и контент",
      },
    ],
  },
  vacancies: {
    eyebrow: "Присоединяйтесь к команде",
    title: "Вакансии",
    intro:
      "Приглашаем ответственных специалистов, которые растут и работают на результат:",
    roles: [
      "Content Maker",
      "Менеджер по продажам",
      "Таргетолог",
      "Performance-маркетолог",
      "Маркетолог",
      "Ассистент маркетолога",
      "Видеомонтажёр",
      "Видеооператор",
    ],
    internshipTitle: "Программа стажировки",
    internshipBody:
      "Особый путь стажировки для мотивированных и дисциплинированных молодых людей с небольшим опытом.",
    cta: "Подать заявку",
    ctaHref: "/#contact",
  },
  contact: {
    eyebrow: "Контакты",
    title: "Контакты и локация",
    addressLabel: "Адрес",
    address:
      "Самаркандская область, город Самарканд, улица Бостон сарой (Спартак), дом 24",
    phoneLabel: "Телефон",
    phoneDisplay: "+998 93 963 33 63",
    phoneHref: "tel:+998939633363",
  },
  footer: {
    progressNavTitle: "Progress Marketing",
    profileNavTitle: "Shaxzod Turakulov",
    phonesTitle: "Телефоны",
    socialTitle: "Соцсети",
    youtubeLabel: "YouTube",
  },
};

const profileMap: Record<Locale, ShaxzodProfile> = {
  uz: contentUz,
  en: contentEn,
  ru: contentRu,
};

export function getShaxzodProfile(locale: Locale): ShaxzodProfile {
  return profileMap[locale] ?? contentUz;
}
