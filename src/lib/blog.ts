export type BlogPostRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  image_path: string;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PublicBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  image: string;
  publishedAt: string | null;
};

export function slugifyTitle(title: string) {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0400-\u04ff\s-]/gi, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

  return base || `post-${Date.now()}`;
}

export function makeExcerpt(body: string, maxLength = 180) {
  const cleaned = body.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 1).trimEnd()}…`;
}

export function getPublicImageUrl(imagePath: string) {
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return imagePath;

  return `${url}/storage/v1/object/public/blog/${imagePath}`;
}

export function toPublicBlogPost(row: BlogPostRecord): PublicBlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    image: getPublicImageUrl(row.image_path),
    publishedAt: row.published_at,
  };
}
