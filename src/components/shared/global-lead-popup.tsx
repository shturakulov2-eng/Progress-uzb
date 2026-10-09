"use client";

import { usePathname } from "next/navigation";

import { LeadPopup } from "@/components/shared/lead-popup";
import { useLanguage } from "@/context/language-context";

export function GlobalLeadPopup() {
  const { content } = useLanguage();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/blog/admin")) {
    return null;
  }

  return <LeadPopup content={content} />;
}
