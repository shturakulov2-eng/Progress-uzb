import { contentEn } from "@/content/site.en";
import { contentRu } from "@/content/site.ru";
import { contentUz } from "@/content/site.uz";
import type { Locale, SiteContent } from "@/content/types";

export const defaultLocale: Locale = "uz";

export const locales: Locale[] = ["uz", "en", "ru"];

export const localeLabels: Record<Locale, string> = {
  uz: "O'zbek",
  en: "English",
  ru: "Русский",
};

const contentMap: Record<Locale, SiteContent> = {
  uz: contentUz,
  en: contentEn,
  ru: contentRu,
};

export function getContent(locale: Locale): SiteContent {
  return contentMap[locale] ?? contentMap[defaultLocale];
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
