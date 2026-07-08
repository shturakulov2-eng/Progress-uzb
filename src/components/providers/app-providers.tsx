"use client";

import type { ReactNode } from "react";

import { HydrationProbe } from "@/components/debug/hydration-probe";
import { LanguageProvider } from "@/context/language-context";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <HydrationProbe />
      {children}
    </LanguageProvider>
  );
}
