import { z } from "zod";

import { contentEn } from "@/content/site.en";
import type { SiteContent } from "@/content/types";
import { sanitizeText } from "@/lib/utils";

export function createLeadSchema(validation: SiteContent["validation"]) {
  return z.object({
    fullName: z
      .string()
      .min(2, validation.fullNameMin)
      .max(120, validation.fullNameMax)
      .transform(sanitizeText),
    companyName: z
      .string()
      .min(2, validation.companyNameMin)
      .max(120, validation.companyNameMax)
      .transform(sanitizeText),
    businessType: z
      .string()
      .min(2, validation.businessTypeMin)
      .max(120, validation.businessTypeMax)
      .transform(sanitizeText),
    phoneNumber: z
      .string()
      .min(7, validation.phoneNumberMin)
      .max(30, validation.phoneNumberMax)
      .regex(/^[+\d\s()-]+$/, validation.phoneNumberInvalid)
      .transform((value) => sanitizeText(value).replace(/\s+/g, " ")),
    website: z.string().max(0).optional().default(""),
  });
}

export function createServiceInquirySchema(content: SiteContent) {
  return z.object({
    source: z.literal("service-inquiry"),
    fullName: z
      .string()
      .min(2, content.validation.fullNameMin)
      .max(120, content.validation.fullNameMax)
      .transform(sanitizeText),
    phoneNumber: z
      .string()
      .min(7, content.validation.phoneNumberMin)
      .max(30, content.validation.phoneNumberMax)
      .regex(/^[+\d\s()-]+$/, content.validation.phoneNumberInvalid)
      .transform((value) => sanitizeText(value).replace(/\s+/g, " ")),
    problem: z
      .string()
      .min(10, content.serviceInquiry.problemMin)
      .max(1000, content.serviceInquiry.problemMax)
      .transform(sanitizeText),
    website: z.string().max(0).optional().default(""),
  });
}

export type LeadFormValues = z.input<ReturnType<typeof createLeadSchema>>;
export type LeadInput = z.output<ReturnType<typeof createLeadSchema>>;
export type ServiceInquiryFormValues = z.input<
  ReturnType<typeof createServiceInquirySchema>
>;
export type ServiceInquiryInput = z.output<
  ReturnType<typeof createServiceInquirySchema>
>;

export const leadSchema = createLeadSchema(contentEn.validation);
export const serviceInquirySchema = createServiceInquirySchema(contentEn);
