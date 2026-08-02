"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import type { SiteContent } from "@/content/types";
import type { PublicBlogPost } from "@/lib/blog";

type BlogCopy = SiteContent["sections"]["blog"];

type BlogSectionProps = {
  blog: BlogCopy;
  posts?: PublicBlogPost[];
  limit?: number;
  viewAllHref?: string;
  sectionId?: string | false;
};

export function BlogSection({
  blog,
  posts: initialPosts,
  limit,
  viewAllHref,
  sectionId = "blog",
}: BlogSectionProps) {
  const [posts, setPosts] = useState<PublicBlogPost[]>(initialPosts ?? []);
  const [loading, setLoading] = useState(initialPosts === undefined);
  const [activePost, setActivePost] = useState<PublicBlogPost | null>(null);

  useEffect(() => {
    if (initialPosts !== undefined) {
      setPosts(initialPosts);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const query = limit ? `?limit=${limit}` : "";

    async function loadPosts() {
      setLoading(true);
      try {
        const response = await fetch(`/api/blog${query}`);
        const json = (await response.json()) as {
          posts?: PublicBlogPost[];
        };
        if (!cancelled) {
          setPosts(json.posts ?? []);
        }
      } catch {
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadPosts();
    return () => {
      cancelled = true;
    };
  }, [initialPosts, limit]);

  useEffect(() => {
    if (!activePost) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActivePost(null);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activePost]);

  const sectionProps =
    sectionId === false
      ? {}
      : { id: sectionId };

  return (
    <>
      <section {...sectionProps} className="section-shell py-14 sm:py-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={blog.eyebrow}
            title={blog.title}
            description={blog.description}
          />
          {viewAllHref ? (
            <Link
              href={viewAllHref}
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#0C3272] transition hover:gap-3 dark:text-blue-300"
            >
              {blog.viewAll}
              <ArrowRight className="size-4" />
            </Link>
          ) : null}
        </div>

        {loading ? (
          <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: limit && limit > 0 ? Math.min(limit, 3) : 3 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-[28px] bg-slate-200/70 dark:bg-slate-800/70"
                />
              ),
            )}
          </div>
        ) : posts.length === 0 ? (
          <p className="mt-10 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Hozircha blog postlar yo‘q. Admin panel orqali Publish qiling.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="glass-card group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/60 transition duration-300 hover:-translate-y-1 hover:border-[#0C3272]/20 hover:shadow-[0_24px_70px_rgba(12,50,114,0.14)] dark:border-white/10 dark:hover:border-blue-300/25"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    unoptimized
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {post.excerpt}
                  </p>
                  <div className="mt-5">
                    <Button
                      type="button"
                      variant="secondary"
                      className="gap-2 px-5 py-2.5"
                      onClick={() => setActivePost(post)}
                    >
                      {blog.readMore}
                      <ArrowUpRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {activePost ? (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={activePost.title}
          >
            <div
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
              onClick={() => setActivePost(null)}
            />

            <motion.div
              className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-white/60 bg-white shadow-2xl shadow-black/30 sm:rounded-[32px] dark:border-white/10 dark:bg-slate-950"
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <button
                type="button"
                onClick={() => setActivePost(null)}
                aria-label={blog.closeLabel}
                className="absolute right-4 top-4 z-20 flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 transition hover:bg-white dark:border-white/15 dark:bg-slate-900/90 dark:text-white/80 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="size-4" />
              </button>

              <div className="relative aspect-[16/9] overflow-hidden bg-slate-200 dark:bg-slate-800">
                <Image
                  src={activePost.image}
                  alt={activePost.title}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              </div>

              <div className="space-y-4 p-5 sm:p-8">
                <h3 className="pr-10 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                  {activePost.title}
                </h3>
                <div className="space-y-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-300">
                  {activePost.body.split("\n\n").map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
