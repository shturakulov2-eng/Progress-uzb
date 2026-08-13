import type { Metadata } from "next";

import { ShaxzodProfilePage } from "@/components/shared/shaxzod-profile-page";

export const metadata: Metadata = {
  title: "Shaxzod Turakulov",
  description:
    "Biznesni tizimlashtirish va natijaviy marketing. Aniq raqamlar, moliyaviy mantiq va avtomatlashtirilgan tizimlar orqali barqaror o'sish.",
  alternates: {
    canonical: "/shaxzod-turakulov",
  },
};

export default function ShaxzodTurakulovPage() {
  return <ShaxzodProfilePage />;
}
