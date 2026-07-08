"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { defaultLocale, getContent, isLocale } from "@/content/index";
import type { Locale, SiteContent } from "@/content/types";

const STORAGE_KEY = "progress-locale";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  content: SiteContent;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const loggedHydration = useRef(false);
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const nextLocale = stored && isLocale(stored) ? stored : defaultLocale;

    setLocaleState(nextLocale);
    document.documentElement.lang = nextLocale;

    // #region agent log
    fetch("http://127.0.0.1:7536/ingest/f1d1b59d-dd24-43d5-8599-1dfaa67eee90", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "786579",
      },
      body: JSON.stringify({
        sessionId: "786579",
        runId: "post-fix",
        hypothesisId: "B",
        location: "language-context.tsx:mount",
        message: "Locale hydrated from storage after mount",
        data: {
          defaultLocale,
          storedLocale: stored,
          appliedLocale: nextLocale,
          htmlLang: document.documentElement.lang,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;

    if (loggedHydration.current) return;
    loggedHydration.current = true;

    // #region agent log
    fetch("http://127.0.0.1:7536/ingest/f1d1b59d-dd24-43d5-8599-1dfaa67eee90", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "786579",
      },
      body: JSON.stringify({
        sessionId: "786579",
        runId: "post-fix",
        hypothesisId: "C",
        location: "language-context.tsx:locale-effect",
        message: "Locale effect synced to document",
        data: { locale, htmlLang: document.documentElement.lang },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const content = useMemo(() => getContent(locale), [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, content }),
    [locale, setLocale, content],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
