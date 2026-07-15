"use client";

import type { ReactNode } from "react";

import { HydrationProbe } from "@/components/debug/hydration-probe";
import { CursorGlow } from "@/components/shared/cursor-glow";
import { LanguageProvider } from "@/context/language-context";
import { ThemeProvider } from "@/context/theme-context";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HydrationProbe />
        <CursorGlow />
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}
