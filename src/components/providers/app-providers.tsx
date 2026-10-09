"use client";

import type { ReactNode } from "react";

import { CursorGlow } from "@/components/shared/cursor-glow";
import { GlobalLeadPopup } from "@/components/shared/global-lead-popup";
import { SupabaseAuthRecoveryListener } from "@/components/admin/supabase-auth-recovery-listener";
import { LanguageProvider } from "@/context/language-context";
import { ThemeProvider } from "@/context/theme-context";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SupabaseAuthRecoveryListener />
        <CursorGlow />
        {children}
        <GlobalLeadPopup />
      </LanguageProvider>
    </ThemeProvider>
  );
}
