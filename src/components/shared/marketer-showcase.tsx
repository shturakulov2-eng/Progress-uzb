"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AtSign, Play, Send, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
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
          "h-[18rem] w-auto text-black/60 sm:h-[24rem] lg:h-[28rem] dark:text-black/75",
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative h-[18rem] w-[12rem] sm:h-[24rem] sm:w-[16rem] lg:h-[28rem] lg:w-[18.5rem]",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        priority={false}
        className="object-contain object-bottom drop-shadow-[0_24px_40px_rgba(0,0,0,0.35)]"
        sizes="(max-width: 640px) 12rem, (max-width: 1024px) 16rem, 18.5rem"
        onError={() => setUsePhoto(false)}
      />
    </div>
  );
}

export function MarketerShowcase({ copy, social }: MarketerShowcaseProps) {
  const prefersReducedMotion = useReducedMotion();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const socialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aboutOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAboutOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [aboutOpen]);

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

  const thumb = `https://i.ytimg.com/vi/${copy.youtubeId}/hqdefault.jpg`;
  const embedSrc = `https://www.youtube.com/embed/${copy.youtubeId}?autoplay=1&rel=0`;

  return (
    <>
      <section id="marketer" className="relative overflow-hidden">
        <div className="relative min-h-[34rem] bg-[#0C3272] text-white sm:min-h-[40rem] lg:min-h-[44rem] dark:bg-[#071428]">
          <motion.p
            aria-hidden="true"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none absolute inset-x-0 top-[18%] z-0 select-none text-center text-[18vw] font-black leading-none tracking-tight text-white sm:top-[12%] sm:text-[14vw] lg:text-[11rem]"
          >
            {copy.watermark}
          </motion.p>

          <div className="section-shell relative z-10 grid min-h-[34rem] items-end gap-8 py-14 sm:min-h-[40rem] sm:py-16 lg:min-h-[44rem] lg:grid-cols-[1.05fr_0.7fr_1fr] lg:items-center lg:gap-6 lg:py-20">
            <div className="order-1 space-y-5 lg:order-none lg:pb-8">
              <motion.h2
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45 }}
                className="text-4xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl"
              >
                {copy.nameLine}
              </motion.h2>
              <motion.p
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="max-w-md text-sm leading-7 text-blue-50/90 sm:text-base sm:leading-8"
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
                <Button
                  type="button"
                  variant="primary"
                  className="bg-white px-6 py-3 text-[#0C3272] shadow-[0_16px_40px_rgba(0,0,0,0.18)] hover:bg-blue-50 hover:text-[#0C3272]"
                  onClick={() => setAboutOpen(true)}
                >
                  {copy.aboutCta}
                </Button>

                <div ref={socialRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setSocialOpen((open) => !open)}
                    className="inline-flex items-center justify-center rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
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
                        className="absolute bottom-full left-0 z-20 mb-3 w-52 overflow-hidden rounded-2xl border border-white/15 bg-[#071428] shadow-xl"
                      >
                        <a
                          href={social.instagram}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-white transition hover:bg-white/10"
                        >
                          <AtSign className="size-4" />
                          {copy.instagramLabel}
                        </a>
                        <a
                          href={social.telegram}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-white transition hover:bg-white/10"
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
              className="order-2 flex justify-center self-end lg:order-none lg:self-end"
            >
              <MarketerPortrait src={copy.portraitSrc} alt={copy.nameLine} />
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="order-3 lg:order-none lg:justify-self-end"
            >
              <div className="relative w-full max-w-sm lg:max-w-[22rem]">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-100/80">
                  {copy.videoTitle}
                </span>
                <div className="overflow-hidden rounded-[22px] border border-white/20 bg-black/30 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
                  <div className="relative aspect-video">
                    {playing ? (
                      <iframe
                        title={copy.videoTitle}
                        src={embedSrc}
                        className="absolute inset-0 h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPlaying(true)}
                        className="group absolute inset-0"
                        aria-label={copy.videoTitle}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumb}
                          alt=""
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                        <span className="absolute inset-0 bg-[#0C3272]/35 transition group-hover:bg-[#0C3272]/20" />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex size-14 items-center justify-center rounded-full bg-white/95 text-[#0C3272] shadow-lg transition group-hover:scale-105">
                            <Play className="ml-0.5 size-6 fill-current" />
                          </span>
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,transparent_0%,rgba(246,248,255,0.15)_40%,#f6f8ff_100%)] dark:bg-[linear-gradient(180deg,transparent_0%,rgba(11,18,32,0.2)_40%,#0b1220_100%)] sm:h-28"
            style={{
              clipPath: "polygon(0 45%, 100% 0, 100% 100%, 0 100%)",
            }}
          />
        </div>
      </section>

      <AnimatePresence>
        {aboutOpen ? (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={copy.aboutCta}
          >
            <div
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
              onClick={() => setAboutOpen(false)}
            />
            <motion.div
              className="relative z-10 max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[28px] border border-white/10 bg-slate-950 p-5 shadow-2xl shadow-black/40 sm:rounded-[32px] sm:p-8"
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <button
                type="button"
                onClick={() => setAboutOpen(false)}
                aria-label={copy.closeLabel}
                className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/15 hover:text-white"
              >
                <X className="size-4" />
              </button>
              <div className="space-y-4 pr-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
                  {copy.nameLine}
                </p>
                <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {copy.aboutCta}
                </h3>
                <div className="space-y-4 text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                  {copy.aboutBody.split("\n\n").map((paragraph) => (
                    <p key={paragraph.slice(0, 28)}>{paragraph}</p>
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
