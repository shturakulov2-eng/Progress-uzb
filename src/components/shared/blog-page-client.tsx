"use client";

import { BlogSection } from "@/components/shared/blog-section";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import type { PublicBlogPost } from "@/lib/blog";

export function BlogPageClient({ posts }: { posts: PublicBlogPost[] }) {
  const { content } = useLanguage();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[linear-gradient(180deg,#f6f8ff_0%,#ffffff_30%,#eef4ff_100%)] dark:bg-[linear-gradient(180deg,#0b1220_0%,#0f172a_38%,#0b1220_100%)]">
      <header className="section-shell flex items-center justify-between gap-4 py-5 sm:gap-6">
        <a
          href="/#blog"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "shrink-0 px-3.5 py-2 text-xs sm:px-4 sm:text-sm",
          )}
        >
          {content.sections.blog.backToHome}
        </a>
        <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
          <LanguageSwitcher className="w-auto [&>button]:h-9 [&>button]:gap-1.5 [&>button]:px-3 [&>button]:text-xs sm:[&>button]:h-10 sm:[&>button]:px-3.5 sm:[&>button]:text-sm" />
          <ThemeToggle className="!size-9 sm:!size-10" />
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
