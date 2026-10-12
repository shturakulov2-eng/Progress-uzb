import { isAllowedAdminEmail } from "@/lib/admin-access";
import {
  makeExcerpt,
  slugifyTitle,
  toPublicBlogPost,
  type BlogPostRecord,
  type PublicBlogPost,
} from "@/lib/blog";
import {
  formatZodError,
  publishBlogSchema,
  updateBlogSchema,
} from "@/lib/blog-validation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { hasSupabaseConfig } from "@/lib/supabase-config";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

async function requireBrowserAdmin() {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !isAllowedAdminEmail(user.email)) {
    throw new Error("Unauthorized");
  }

  return supabase;
}

export async function fetchPublishedPosts(limit?: number) {
  if (!hasSupabaseConfig()) return [] as PublicBlogPost[];

  const supabase = createSupabaseBrowserClient();
  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (limit && limit > 0) {
    query = query.limit(Math.min(limit, 100));
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message || "Unable to load blog posts.");
  }

  return ((data ?? []) as BlogPostRecord[]).map(toPublicBlogPost);
}

export async function uploadBlogImage(file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Only JPEG, PNG, WEBP, or GIF images are allowed.");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 5MB or smaller.");
  }

  const supabase = await requireBrowserAdmin();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;

  const { error } = await supabase.storage.from("blog").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message || "Unable to upload image.");
  }

  return path;
}

export async function publishBlogPost(input: {
  title: string;
  body: string;
  imagePath: string;
  excerpt?: string;
  author?: string;
}) {
  const parsed = publishBlogSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(formatZodError(parsed.error));
  }

  const supabase = await requireBrowserAdmin();
  const { title, body, imagePath } = parsed.data;
  const excerpt = parsed.data.excerpt?.trim() || makeExcerpt(body);
  const author = parsed.data.author?.trim() || null;
  const slug = `${slugifyTitle(title)}-${Date.now().toString(36)}`;
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      slug,
      title,
      excerpt,
      body,
      image_path: imagePath,
      author,
      status: "published",
      published_at: now,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(
      error?.message ||
        "Unable to publish blog post. Check Supabase blog_posts table and RLS.",
    );
  }

  return toPublicBlogPost(data as BlogPostRecord);
}

export async function updateBlogPost(
  id: string,
  input: {
    title: string;
    body: string;
    imagePath?: string;
    excerpt?: string;
    author?: string;
  },
) {
  if (!id.trim()) {
    throw new Error("Post id is required.");
  }

  const parsed = updateBlogSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(formatZodError(parsed.error));
  }

  const supabase = await requireBrowserAdmin();
  const { title, body, imagePath } = parsed.data;
  const excerpt = parsed.data.excerpt?.trim() || makeExcerpt(body);
  const author = parsed.data.author?.trim() || null;

  const updates: Record<string, string | null> = {
    title,
    excerpt,
    body,
    author,
    updated_at: new Date().toISOString(),
  };

  if (imagePath) {
    updates.image_path = imagePath;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(
      error?.message ||
        "Unable to update blog post. Check Supabase blog_posts table and RLS.",
    );
  }

  return toPublicBlogPost(data as BlogPostRecord);
}

export async function deleteBlogPost(id: string) {
  if (!id.trim()) {
    throw new Error("Post id is required.");
  }

  const supabase = await requireBrowserAdmin();
  const { data: existing, error: fetchError } = await supabase
    .from("blog_posts")
    .select("id, image_path")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    throw new Error("Unable to delete blog post.");
  }

  if (!existing) {
    throw new Error("Post not found.");
  }

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) {
    throw new Error(error.message || "Unable to delete blog post.");
  }

  const imagePath = (existing as { image_path?: string }).image_path;
  if (
    imagePath &&
    !imagePath.startsWith("http://") &&
    !imagePath.startsWith("https://")
  ) {
    const { error: storageError } = await supabase.storage
      .from("blog")
      .remove([imagePath]);

    if (storageError) {
      console.error("blog delete storage cleanup error", storageError);
    }
  }
}
