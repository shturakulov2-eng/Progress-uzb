import { z } from "zod";

export const blogPostFieldsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Sarlavha kamida 3 ta belgidan iborat bo‘lishi kerak.")
    .max(160, "Sarlavha 160 belgidan oshmasligi kerak."),
  excerpt: z
    .string()
    .trim()
    .max(400, "Qisqa matn 400 belgidan oshmasligi kerak.")
    .optional(),
  body: z
    .string()
    .trim()
    .min(20, "To‘liq matn kamida 20 ta belgidan iborat bo‘lishi kerak.")
    .max(20000, "To‘liq matn juda uzun (max 20000 belgi)."),
  imagePath: z
    .string()
    .trim()
    .min(1, "Cover image is required.")
    .max(500, "Image path is too long.")
    .optional(),
  author: z
    .string()
    .trim()
    .max(80, "Muallif nomi 80 belgidan oshmasligi kerak.")
    .optional(),
});

export const publishBlogSchema = blogPostFieldsSchema.extend({
  imagePath: z
    .string()
    .trim()
    .min(1, "Cover image is required.")
    .max(500, "Image path is too long."),
});

export const updateBlogSchema = blogPostFieldsSchema;

export function formatZodError(error: z.ZodError) {
  const issues =
    error.issues ??
    (JSON.parse(error.message) as Array<{ message?: string }>);
  const first = issues[0];
  if (!first?.message) return "Invalid blog post payload.";
  return first.message;
}

export function validateBlogPostInput(input: {
  title: string;
  excerpt?: string;
  body: string;
  requireImage?: boolean;
  hasImage?: boolean;
}) {
  const title = input.title.trim();
  const body = input.body.trim();
  const excerpt = input.excerpt?.trim();

  if (title.length < 3) {
    return "Sarlavha kamida 3 ta belgidan iborat bo‘lishi kerak.";
  }
  if (title.length > 160) {
    return "Sarlavha 160 belgidan oshmasligi kerak.";
  }
  if (body.length < 20) {
    return "To‘liq matn kamida 20 ta belgidan iborat bo‘lishi kerak.";
  }
  if (body.length > 20000) {
    return "To‘liq matn juda uzun (max 20000 belgi).";
  }
  if (excerpt && excerpt.length > 400) {
    return "Qisqa matn 400 belgidan oshmasligi kerak.";
  }
  if (input.requireImage && !input.hasImage) {
    return "Cover image is required.";
  }
  return null;
}
