"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

import type { PublicBlogPost } from "@/lib/blog";

type BlogPostModalProps = {
  post: PublicBlogPost | null;
  closeLabel: string;
  authorLabel?: string;
  onClose: () => void;
};

export function BlogPostModal({
  post,
  closeLabel,
  authorLabel,
  onClose,
}: BlogPostModalProps) {
  useEffect(() => {
    if (!post) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [post, onClose]);

  return (
    <AnimatePresence>
      {post ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={post.title}
        >
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={onClose}
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
              onClick={onClose}
              aria-label={closeLabel}
              className="absolute right-4 top-4 z-20 flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 transition hover:bg-white dark:border-white/15 dark:bg-slate-900/90 dark:text-white/80 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X className="size-4" />
            </button>

            <div className="relative aspect-[16/9] overflow-hidden bg-slate-200 dark:bg-slate-800">
              <Image
                src={post.image}
                alt={post.title}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>

            <div className="space-y-4 p-5 sm:p-8">
              <h3 className="pr-10 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                {post.title}
              </h3>
              {post.author && authorLabel ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {authorLabel}:{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {post.author}
                  </span>
                </p>
              ) : null}
              <div className="space-y-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-300">
                {post.body.split("\n\n").map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
