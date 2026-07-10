"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { localeLabels, locales } from "@/content/index";
import type { Locale } from "@/content/types";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
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
        className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-[#0C3272] hover:text-[#0C3272]"
      >
        <Globe className="size-4" />
        <span>{localeLabels[locale]}</span>
        <ChevronDown
          className={cn("size-4 transition-transform", open && "rotate-180")}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={content.common.selectLanguage}
          className="absolute right-0 z-[100] mt-2 min-w-[160px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10"
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
                      ? "bg-[#0C3272]/8 font-semibold text-[#0C3272]"
                      : "text-slate-700 hover:bg-slate-50",
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
