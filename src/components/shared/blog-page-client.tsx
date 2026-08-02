"use client";

import Link from "next/link";

import { BlogSection } from "@/components/shared/blog-section";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useLanguage } from "@/context/language-context";
import type { PublicBlogPost } from "@/lib/blog";

export function BlogPageClient({ posts }: { posts: PublicBlogPost[] }) {
  const { content } = useLanguage();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[linear-gradient(180deg,#f6f8ff_0%,#ffffff_30%,#eef4ff_100%)] dark:bg-[linear-gradient(180deg,#0b1220_0%,#0f172a_38%,#0b1220_100%)]">
      <header className="section-shell flex items-center justify-between py-5">
        <Link
          href="/#blog"
          className="text-sm font-semibold text-[#0C3272] dark:text-blue-300"
        >
          ← Progress.uzb
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <main>
        <BlogSection
          blog={content.sections.blog}
          posts={posts}
          sectionId={false}
        />
      </main>
    </div>
  );
}
