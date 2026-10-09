"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { localeLabels, locales } from "@/content/index";
import type { Locale } from "@/content/types";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

const localeCodes: Record<Locale, string> = {
  uz: "UZ",
  en: "EN",
  ru: "RU",
};

export function LanguageSwitcher({
  className,
  dropUp = false,
  compact = false,
}: {
  className?: string;
  dropUp?: boolean;
  compact?: boolean;
}) {
  const { locale, setLocale, content } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={content.common.selectLanguage}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "inline-flex w-full items-center justify-between rounded-full border border-slate-200 bg-white/90 font-medium text-slate-700 shadow-sm transition hover:border-[#0C3272] hover:text-[#0C3272] dark:border-white/20 dark:bg-white/10 dark:text-slate-200 dark:hover:border-white/40 dark:hover:text-white",
          compact
            ? "h-9 gap-1 px-2.5 text-xs"
            : "h-11 gap-2 px-4 text-sm",
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          {compact ? null : <Globe className="size-4" />}
          <span>{compact ? localeCodes[locale] : localeLabels[locale]}</span>
        </span>
        <ChevronDown
          className={cn(
            "transition-transform",
            compact ? "size-3.5" : "size-4",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={content.common.selectLanguage}
          className={cn(
            "absolute left-0 z-[100] min-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40",
            dropUp ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          {locales.map((item) => {
            const isActive = item === locale;

            return (
              <li key={item} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => {
                    setLocale(item as Locale);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition",
                    isActive
                      ? "bg-[#0C3272]/8 font-semibold text-[#0C3272] dark:bg-blue-400/15 dark:text-blue-300"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800",
                  )}
                >
                  {localeLabels[item]}
                  {isActive ? <Check className="size-4" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
