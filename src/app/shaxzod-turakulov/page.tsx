import type { Metadata } from "next";

import { ShaxzodProfilePage } from "@/components/shared/shaxzod-profile-page";

export const metadata: Metadata = {
  title: "Shaxzod Turakulov — marketolog Samarqand",
  description:
    "Shaxzod Turakulov — Samarqanddagi Progress.uzb asoschisi. SMM, marketing va sotuv tizimlari. Aniq raqamlar va avtomatlashtirish orqali o‘sish.",
  keywords: [
    "Shaxzod Turakulov",
    "marketolog Samarqand",
    "SMM Samarqand",
    "Progress.uzb",
  ],
  alternates: {
    canonical: "/shaxzod-turakulov",
  },
  openGraph: {
    title: "Shaxzod Turakulov — marketolog Samarqand",
    description:
      "Progress.uzb asoschisi. Samarqandda SMM, marketing va sotuv tizimlari.",
    url: "/shaxzod-turakulov",
  },
};

export default function ShaxzodTurakulovPage() {
  return <ShaxzodProfilePage />;
}
