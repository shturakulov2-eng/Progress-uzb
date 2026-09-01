"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AtSign, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import type { SiteContent } from "@/content/types";
import { cn } from "@/lib/utils";

type MarketerCopy = SiteContent["sections"]["marketer"];

type MarketerShowcaseProps = {
  copy: MarketerCopy;
  social: {
    instagram: string;
    telegram: string;
  };
};

/** Human bust silhouette — auto-replaced when portrait PNG loads */
function PersonSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 560"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Head */}
      <ellipse cx="200" cy="118" rx="78" ry="92" />
      {/* Neck */}
      <path d="M168 198c6 28 14 42 32 48 18-6 26-20 32-48-10 8-22 12-32 12s-22-4-32-12Z" />
      {/* Shoulders + torso */}
      <path d="M200 250c-34 0-58 10-86 28-36 24-66 62-82 118-8 28-12 62-14 104h364c-2-42-6-76-14-104-16-56-46-94-82-118-28-18-52-28-86-28Z" />
    </svg>
  );
}

function MarketerPortrait({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [usePhoto, setUsePhoto] = useState(Boolean(src));

  useEffect(() => {
    setUsePhoto(Boolean(src));
  }, [src]);

  if (!usePhoto || !src) {
    return (
      <PersonSilhouette
        className={cn(
          "h-[18rem] w-auto text-[#0C3272]/55 sm:h-[24rem] lg:h-[28rem] dark:text-blue-300/50",
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative z-20 [mask-image:linear-gradient(180deg,#000_0%,#000_48%,transparent_92%)] [-webkit-mask-image:linear-gradient(180deg,#000_0%,#000_48%,transparent_92%)]",
        className,
      )}
    >
      <Image
        src={src.includes("?") ? src : `${src}?v=12`}
        alt={alt}
        width={547}
        height={1024}
        unoptimized
        priority
        className="h-auto w-[min(100%,14rem)] sm:w-[18rem] lg:w-[22rem] xl:w-[26rem]"
        sizes="(max-width: 640px) 14rem, (max-width: 1024px) 18rem, 26rem"
        onError={() => setUsePhoto(false)}
      />
    </div>
  );
}

export function MarketerShowcase({ copy, social }: MarketerShowcaseProps) {
  const prefersReducedMotion = useReducedMotion();
  const [socialOpen, setSocialOpen] = useState(false);
  const socialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socialOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        socialRef.current &&
        !socialRef.current.contains(event.target as Node)
      ) {
        setSocialOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [socialOpen]);

  const embedSrc = `https://www.youtube.com/embed/${copy.youtubeId}?rel=0&modestbranding=0&controls=1&playsinline=1`;

  return (
    <section id="marketer" className="relative overflow-hidden">
      <div className="relative min-h-[34rem] sm:min-h-[40rem] lg:min-h-[44rem]">
        <motion.p
          aria-hidden="true"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none absolute inset-x-0 top-[28%] z-0 select-none text-center text-[18vw] font-black leading-none tracking-tight text-[#0C3272]/[0.07] sm:top-[22%] sm:text-[14vw] lg:top-[26%] lg:text-[11rem] dark:text-blue-300/10"
        >
          {copy.watermark}
        </motion.p>

        <div className="section-shell relative z-10 grid min-h-[34rem] items-end gap-8 py-14 sm:min-h-[40rem] sm:py-16 lg:min-h-[46rem] lg:grid-cols-[1.15fr_0.7fr_1.15fr] lg:items-center lg:gap-4 lg:py-20 2xl:min-h-[52rem] 2xl:gap-8">
          <div className="order-1 relative z-30 space-y-5 lg:order-none lg:pb-8">
            <motion.h2
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45 }}
              className="whitespace-pre-line text-4xl font-black uppercase tracking-tight text-[#0C3272] sm:text-5xl lg:text-6xl dark:text-blue-200"
            >
              {copy.nameLine}
            </motion.h2>
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="max-w-lg text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-300"
            >
              {copy.bio}
            </motion.p>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: 0.14 }}
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              <Link
                href="/shaxzod-turakulov"
                className={cn(buttonVariants({ variant: "primary" }), "px-6 py-3")}
              >
                {copy.aboutCta}
              </Link>

              <div ref={socialRef} className="relative">
                <button
                  type="button"
                  onClick={() => setSocialOpen((open) => !open)}
                  className="inline-flex items-center justify-center rounded-full border border-[#0C3272]/25 bg-white/80 px-6 py-3 text-sm font-semibold text-[#0C3272] shadow-sm transition hover:border-[#0C3272] hover:bg-[#0C3272]/5 dark:border-white/20 dark:bg-slate-900/60 dark:text-blue-200 dark:hover:border-blue-300 dark:hover:bg-white/10"
                >
                  {copy.socialCta}
                </button>
                <AnimatePresence>
                  {socialOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18 }}
                      className="absolute bottom-full left-0 z-20 mb-3 w-52 overflow-hidden rounded-2xl border border-[#0C3272]/12 bg-white shadow-xl dark:border-white/10 dark:bg-slate-900"
                    >
                      <a
                        href={social.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-[#0C3272]/6 hover:text-[#0C3272] dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-blue-200"
                      >
                        <AtSign className="size-4" />
                        {copy.instagramLabel}
                      </a>
                      <a
                        href={social.telegram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-[#0C3272]/6 hover:text-[#0C3272] dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-blue-200"
                      >
                        <Send className="size-4" />
                        {copy.telegramLabel}
                      </a>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="order-2 z-20 flex translate-y-2 justify-center self-end sm:translate-y-3 lg:order-none lg:self-end lg:translate-y-4 xl:translate-y-6"
          >
            <MarketerPortrait src={copy.portraitSrc} alt={copy.nameLine} />
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-3 relative z-30 min-w-0 lg:order-none lg:justify-self-stretch"
          >
            <div className="relative w-full min-w-[16rem] sm:min-w-[20rem] lg:max-w-none">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0C3272]/70 dark:text-blue-300/80">
                {copy.videoTitle}
              </span>
              <div className="overflow-hidden rounded-xl border border-[#0C3272]/12 bg-black shadow-[0_24px_70px_rgba(12,50,114,0.14)] dark:border-white/10 dark:shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
                <div className="relative aspect-video w-full">
                  <iframe
                    title={copy.videoTitle}
                    src={embedSrc}
                    className="absolute inset-0 h-full w-full"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Soft page-edge fade — below side content */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-24 sm:h-28 lg:h-32"
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(246,248,255,0.5)_55%,#eef4ff_100%)] dark:bg-[linear-gradient(180deg,transparent_0%,rgba(11,18,32,0.5)_55%,#0b1220_100%)]" />
        </div>
      </div>
    </section>
  );
}
