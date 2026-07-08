import { baseSiteConfig } from "@/content/base";
import { contentEn } from "@/content/site.en";

export const siteConfig = {
  ...baseSiteConfig,
  description: contentEn.siteConfig.description,
  location: contentEn.siteConfig.location,
};
