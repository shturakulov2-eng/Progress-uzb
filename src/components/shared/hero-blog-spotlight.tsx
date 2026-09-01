"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { BlogPostModal } from "@/components/shared/blog-post-modal";
import type { SiteContent } from "@/content/types";
import type { PublicBlogPost } from "@/lib/blog";
import { cn } from "@/lib/utils";

type BlogCopy = SiteContent["sections"]["blog"];

type HeroBlogSpotlightProps = {
  blog: BlogCopy;
  limit?: number;
  className?: string;
};

const ROTATE_MS = 5500;

function SpotlightCard({
  post,
  readMore,
  authorLabel,
  onSelect,
}: {
  post: PublicBlogPost;
  readMore: string;
  authorLabel: string;
  onSelect: (post: PublicBlogPost) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(post)}
      className="group/card glass-card flex h-full w-full flex-col overflow-hidden rounded-[24px] border border-white/60 text-left transition duration-300 hover:border-[#0C3272]/20 hover:shadow-[0_20px_60px_rgba(12,50,114,0.14)] dark:border-white/10 dark:hover:border-blue-300/25 2xl:rounded-[28px]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-slate-800">
        <Image
          src={post.image}
          alt={post.title}
          fill
          unoptimized
          className="object-cover transition duration-500 group-hover/card:scale-[1.03]"
          sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 340px, 380px"
        />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5 2xl:p-6">
        <h3 className="line-clamp-2 text-base font-semibold tracking-tight text-slate-950 dark:text-white 2xl:text-lg">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300 2xl:text-[15px] 2xl:leading-7">
          {post.excerpt}
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#0C3272] dark:text-blue-300">
          {readMore}
          <ArrowUpRight className="size-4 transition group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
        </span>
        {post.author ? (
          <p className="mt-2 text-right text-xs text-slate-500 dark:text-slate-400">
            {authorLabel}:{" "}
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {post.author}
            </span>
          </p>
        ) : null}
      </div>
    </button>
  );
}

export function HeroBlogSpotlight({
  blog,
  limit = 6,
  className,
}: HeroBlogSpotlightProps) {
  const reduceMotion = useReducedMotion();
  const [posts, setPosts] = useState<PublicBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [modalPost, setModalPost] = useState<PublicBlogPost | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      setLoading(true);
      try {
        const response = await fetch(`/api/blog?limit=${limit}`);
        const json = (await response.json()) as { posts?: PublicBlogPost[] };
        if (!cancelled) {
          const fetched = json.posts ?? [];
          const withImages = fetched.filter((post) => post.image);
          setPosts(withImages.length > 0 ? withImages : fetched);
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
  }, [limit]);

  const advance = useCallback(() => {
    if (posts.length <= 1) return;
    setIndex((current) => (current + 1) % posts.length);
  }, [posts.length]);

  useEffect(() => {
    if (posts.length <= 1 || paused || reduceMotion) return;
    const timer = window.setInterval(advance, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [posts.length, paused, reduceMotion, advance]);

  if (!loading && posts.length === 0) {
    return null;
  }

  const currentPost = posts[index];

  const flipVariants = reduceMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: { opacity: 0, rotateY: -78, scale: 0.94 },
        center: { opacity: 1, rotateY: 0, scale: 1 },
        exit: { opacity: 0, rotateY: 78, scale: 0.94 },
      };

  return (
    <>
      <div
        className={cn("w-full", className)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {loading ? (
          <div className="h-[17rem] w-full animate-pulse rounded-[24px] bg-slate-200/70 dark:bg-slate-800/70 sm:h-[18.5rem] xl:h-[20rem] 2xl:h-[21.5rem] 2xl:rounded-[28px]" />
        ) : currentPost ? (
          <div
            className="relative h-[17rem] sm:h-[18.5rem] xl:h-[20rem] 2xl:h-[21.5rem]"
            style={{ perspective: reduceMotion ? undefined : "1200px" }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentPost.id}
                className="absolute inset-0 [transform-style:preserve-3d]"
                variants={flipVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <SpotlightCard
                  post={currentPost}
                  readMore={blog.readMore}
                  authorLabel={blog.authorLabel}
                  onSelect={setModalPost}
                />
              </motion.div>
            </AnimatePresence>

            {posts.length > 1 ? (
              <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5">
                {posts.map((post, dotIndex) => (
                  <button
                    key={post.id}
                    type="button"
                    aria-label={post.title}
                    onClick={() => setIndex(dotIndex)}
                    className={cn(
                      "size-1.5 rounded-full transition duration-300",
                      dotIndex === index
                        ? "scale-125 bg-[#0C3272] dark:bg-blue-400"
                        : "bg-[#0C3272]/25 hover:bg-[#0C3272]/45 dark:bg-white/20 dark:hover:bg-white/35",
                    )}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <BlogPostModal
        post={modalPost}
        closeLabel={blog.closeLabel}
        authorLabel={blog.authorLabel}
        onClose={() => setModalPost(null)}
      />
    </>
  );
}
