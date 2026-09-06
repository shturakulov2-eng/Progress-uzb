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
      <header className="section-shell flex items-center justify-between py-5">
        <a
          href="/#blog"
          className={cn(buttonVariants({ variant: "secondary" }), "px-5 py-2.5")}
        >
          {content.sections.blog.backToHome}
        </a>
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
