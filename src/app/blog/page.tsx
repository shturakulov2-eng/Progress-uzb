import type { Metadata } from "next";

import { BlogPageClient } from "@/components/shared/blog-page-client";
import {
  toPublicBlogPost,
  type BlogPostRecord,
} from "@/lib/blog";
import { hasSupabaseConfig } from "@/lib/supabase-config";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Marketing blog — SMM va sotuv | Samarqand",
  description:
    "Samarqanddagi marketing agentligidan SMM, sotuv va brend o‘sishi bo‘yicha maqolalar. Progress.uzb blogi.",
  keywords: [
    "SMM Samarqand",
    "marketing blog",
    "sotuv",
    "brending",
    "Progress.uzb",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Marketing blog — SMM va sotuv | Samarqand",
    description:
      "SMM, marketing va sotuv haqida amaliy maqolalar. Progress.uzb — Samarqand.",
    url: "/blog",
  },
};

async function getPublishedPosts() {
  if (!hasSupabaseConfig()) return [];

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("blog page load error", error);
      return [];
    }

    return ((data ?? []) as BlogPostRecord[]).map(toPublicBlogPost);
  } catch (error) {
    console.error("blog page unexpected", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return <BlogPageClient posts={posts} />;
}
