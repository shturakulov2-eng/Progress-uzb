export type BrandLogo = {
  name: string;
  src: string;
  /**
   * light — white/light marks: invert in light mode
   * colorOnBlack — colored art that may sit on dark pixels: blend modes
   * color — full-color logos
   */
  tone?: "light" | "colorOnBlack" | "color";
  /** Fixed solid tint for both themes (CSS mask) */
  tint?: string;
  /** Theme-specific solid tint (CSS mask) */
  tintTheme?: { light: string; dark: string };
  /** Fixed gradient tint: left → right (CSS mask) */
  tintGradient?: { from: string; to: string };
  /** Force mark to pure white in dark mode */
  whiteInDark?: boolean;
  /** Slight size bump for narrow marks (default 1) */
  scale?: number;
  /** Show brand name text beside the mark (icon + wordmark as one unit) */
  showName?: boolean;
};

/** Cache-bust after asset normalize (?v=2 / ?v=3) */
export const brandLogos: BrandLogo[] = [
  { name: "Kolizey", src: "/brands/Kolizey.png?v=2", tone: "light" },
  {
    name: "Ishonch Mebel",
    src: "/brands/ishonch-mebel.png?v=4",
    tintTheme: { light: "#211f1f", dark: "#ffffff" },
  },
  {
    name: "Tropic Palma",
    src: "/brands/tropic-palma.png?v=3",
    tint: "#137e41",
  },
  { name: "Milliy", src: "/brands/milliy-logo.png?v=2", tone: "color" },
  { name: "Fox Pipes", src: "/brands/fox-pipes.png?v=2", tone: "color" },
  { name: "Primo", src: "/brands/Primo.png?v=2", tone: "colorOnBlack" },
  {
    name: "Chagurt",
    src: "/brands/Chagurt.png?v=3",
    tintGradient: { from: "#179D50", to: "#0E4E29" },
  },
  { name: "Neo", src: "/brands/Neo.png?v=2", tone: "color" },
  {
    name: "IELTS Center",
    src: "/brands/ielts-center.png?v=2",
    tone: "color",
    scale: 1.22,
  },
  { name: "Sofana", src: "/brands/Sofana.png?v=3", tint: "#a1a1a1" },
  {
    name: "Emin",
    src: "/brands/Emin.png?v=3",
    tone: "color",
    whiteInDark: true,
  },
  { name: "Pena Max", src: "/brands/pena-max.png?v=3", tint: "#019cdc" },
  {
    name: "Texnoya",
    src: "/brands/Texnoya.png?v=2",
    tone: "color",
    showName: true,
  },
];
