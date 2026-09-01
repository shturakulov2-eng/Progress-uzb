"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { BlogPostModal } from "@/components/shared/blog-post-modal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import type { SiteContent } from "@/content/types";
import type { PublicBlogPost } from "@/lib/blog";
import { cn } from "@/lib/utils";

type BlogCopy = SiteContent["sections"]["blog"];

type BlogSectionProps = {
  blog: BlogCopy;
  posts?: PublicBlogPost[];
  limit?: number;
  viewAllHref?: string;
  sectionId?: string | false;
};

const STACK_CARD_TRANSFORMS = [
  { rotate: -10, x: -6, y: 0, zIndex: 1 },
  { rotate: 4, x: 4, y: -10, zIndex: 2 },
  { rotate: -4, x: 0, y: -20, zIndex: 3 },
] as const;

const GRID_WITH_STACK =
  "sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(16rem,22rem)] xl:grid-cols-[repeat(3,minmax(0,1fr))_minmax(18rem,24rem)]";
const GRID_DEFAULT = "sm:grid-cols-2 lg:grid-cols-3";

function buildStackPreviewPosts(
  allPosts: PublicBlogPost[],
  displayLimit: number,
  count = 3,
): PublicBlogPost[] {
  const withImages = allPosts.filter((post) => post.image);
  if (withImages.length === 0) return [];

  const preferred = withImages.slice(displayLimit);
  const seen = new Set<string>();
  const result: PublicBlogPost[] = [];

  for (const post of [...preferred, ...withImages]) {
    if (result.length >= count) break;
    if (seen.has(post.id)) continue;
    seen.add(post.id);
    result.push(post);
  }

  let index = 0;
  while (result.length < count) {
    const post = withImages[index % withImages.length];
    result.push({ ...post, id: `${post.id}-stack-${result.length}` });
    index += 1;
  }

  return result.slice(0, count);
}

function BlogViewAllStack({
  href,
  label,
  stackPosts,
}: {
  href: string;
  label: string;
  stackPosts: PublicBlogPost[];
}) {
  const cards = stackPosts.slice(0, 3);

  return (
    <Link
      href={href}
      aria-label={label}
      className="group/stack flex h-full min-h-[16rem] w-full max-w-[20rem] flex-col items-center justify-center gap-6 transition duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C3272]/40 focus-visible:ring-offset-2 sm:min-h-[18rem] sm:max-w-[22rem] sm:gap-7 lg:translate-x-3 lg:max-w-none xl:translate-x-5 2xl:translate-x-6 dark:focus-visible:ring-blue-300/50"
    >
      <div className="relative h-56 w-48 sm:h-64 sm:w-56 lg:h-[17.5rem] lg:w-[15.75rem] xl:h-[19rem] xl:w-[17rem]">
        {cards.map((post, index) => {
          const transform = STACK_CARD_TRANSFORMS[index];

          return (
            <div
              key={post.id}
              className="absolute left-1/2 top-1/2 w-[96%] transition duration-300"
              style={{
                zIndex: transform.zIndex,
                transform: `translate(-50%, -50%) rotate(${transform.rotate}deg) translate(${transform.x}px, ${transform.y}px)`,
              }}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/70 shadow-[0_14px_36px_rgba(12,50,114,0.18)] transition duration-300 group-hover/stack:shadow-[0_18px_44px_rgba(12,50,114,0.24)] dark:border-white/15 dark:shadow-[0_14px_36px_rgba(0,0,0,0.35)]">
                <Image
                  src={post.image}
                  alt=""
                  fill
                  unoptimized
                  aria-hidden="true"
                  className="object-cover"
                  sizes="280px"
                />
              </div>
            </div>
          );
        })}
      </div>

      <span className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-[#0C3272] px-5 py-3 text-base font-semibold tracking-tight text-white shadow-[0_12px_32px_rgba(12,50,114,0.28)] transition duration-300 group-hover/stack:scale-[1.03] sm:px-6 sm:py-3.5 sm:text-lg dark:bg-blue-400 dark:text-slate-950">
        {label}
        <ArrowRight className="size-4 shrink-0 sm:size-[1.125rem]" aria-hidden="true" />
      </span>
    </Link>
  );
}

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

  const showViewAllStack = Boolean(viewAllHref);
  const displayLimit = limit && limit > 0 ? limit : posts.length;
  const fetchLimit =
    showViewAllStack && limit && limit > 0 ? limit + 3 : limit;

  useEffect(() => {
    if (initialPosts !== undefined) {
      setPosts(initialPosts);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const query = fetchLimit ? `?limit=${fetchLimit}` : "";

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
  }, [initialPosts, fetchLimit]);

  const sectionProps = sectionId === false ? {} : { id: sectionId };
  const visiblePosts =
    limit && limit > 0 ? posts.slice(0, displayLimit) : posts;
  const stackPosts =
    showViewAllStack && posts.length > 0
      ? buildStackPreviewPosts(posts, displayLimit)
      : [];
  const gridClassName = cn(
    "mt-10 grid gap-6 sm:mt-12",
    showViewAllStack ? GRID_WITH_STACK : GRID_DEFAULT,
  );
  const skeletonCount =
    limit && limit > 0 ? Math.min(limit, 3) : 3;

  return (
    <>
      <section {...sectionProps} className="section-shell py-14 sm:py-20">
        <SectionHeading
          eyebrow={blog.eyebrow}
          title={blog.title}
          description={blog.description}
        />

        {loading ? (
          <div className={gridClassName}>
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-[28px] bg-slate-200/70 dark:bg-slate-800/70"
              />
            ))}
            {showViewAllStack ? (
              <div className="flex min-h-[16rem] items-center justify-end pb-8 sm:col-span-2 sm:pr-2 sm:pb-0 lg:col-span-1 lg:min-h-[18rem] lg:justify-end lg:pr-0 xl:pr-2">
                <div className="h-56 w-48 animate-pulse rounded-xl bg-slate-200/70 sm:h-64 sm:w-56 lg:h-[17.5rem] lg:w-[15.75rem] dark:bg-slate-800/70" />
              </div>
            ) : null}
          </div>
        ) : posts.length === 0 ? (
          <p className="mt-10 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Hozircha blog postlar yo‘q. Admin panel orqali Publish qiling.
          </p>
        ) : (
          <div className={gridClassName}>
            {visiblePosts.map((post) => (
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
                  <div className="mt-5 flex items-end justify-between gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      className="gap-2 px-5 py-2.5"
                      onClick={() => setActivePost(post)}
                    >
                      {blog.readMore}
                      <ArrowUpRight className="size-4" />
                    </Button>
                    {post.author ? (
                      <p className="text-right text-xs text-slate-500 dark:text-slate-400">
                        {blog.authorLabel}:{" "}
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {post.author}
                        </span>
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}

            {showViewAllStack && viewAllHref && stackPosts.length > 0 ? (
              <div className="flex items-center justify-end pb-8 sm:col-span-2 sm:pr-2 sm:pb-0 lg:col-span-1 lg:justify-end lg:pr-0 xl:pr-2">
                <BlogViewAllStack
                  href={viewAllHref}
                  label={blog.viewAll}
                  stackPosts={stackPosts}
                />
              </div>
            ) : null}
          </div>
        )}
      </section>

      <BlogPostModal
        post={activePost}
        closeLabel={blog.closeLabel}
        authorLabel={blog.authorLabel}
        onClose={() => setActivePost(null)}
      />
    </>
  );
}
