"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BlogAdmin } from "@/components/admin/blog-admin";
import { isAllowedAdminEmail } from "@/lib/admin-access";
import { fetchPublishedPosts } from "@/lib/blog-client";
import type { PublicBlogPost } from "@/lib/blog";
import { hasSupabaseConfig } from "@/lib/supabase-config";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export function AdminBlogGate() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [posts, setPosts] = useState<PublicBlogPost[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!hasSupabaseConfig()) {
        router.replace("/admin/login?error=config");
        return;
      }

      try {
        const supabase = createSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user || !isAllowedAdminEmail(user.email)) {
          router.replace("/admin/login");
          return;
        }

        const published = await fetchPublishedPosts();
        if (cancelled) return;
        setEmail(user.email ?? "");
        setPosts(published);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Unable to open admin.");
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-sm text-red-200">
        {error}
      </main>
    );
  }

  if (!email || !posts) {
    return <main className="min-h-screen bg-slate-950" />;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6f8ff_0%,#ffffff_40%,#eef4ff_100%)]">
      <BlogAdmin adminEmail={email} initialPosts={posts} />
    </main>
  );
}
