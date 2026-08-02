import { BlogAdmin } from "@/components/admin/blog-admin";
import { requireAdmin } from "@/lib/auth";
import {
  toPublicBlogPost,
  type BlogPostRecord,
} from "@/lib/blog";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function AdminBlogPage() {
  const user = await requireAdmin();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error("Unable to load published posts.");
  }

  const posts = ((data ?? []) as BlogPostRecord[]).map(toPublicBlogPost);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6f8ff_0%,#ffffff_40%,#eef4ff_100%)]">
      <BlogAdmin adminEmail={user.email ?? ""} initialPosts={posts} />
    </main>
  );
}
