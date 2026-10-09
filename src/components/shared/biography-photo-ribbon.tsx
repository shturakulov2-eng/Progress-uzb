"use client";

import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type GalleryPhoto = {
  src: string;
  alt: string;
};

const SLIDE_MS = 620;
const PAUSE_MS = 1800;

export function BiographyPhotoRibbon({
  photos,
  label,
}: {
  photos: GalleryPhoto[];
  label: string;
}) {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(0);
  const indexRef = useRef(0);
  const pauseTimerRef = useRef(0);
  const playbackRef = useRef<ReturnType<typeof animate> | null>(null);
  const pausedByUserRef = useRef(false);
  const x = useMotionValue(0);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const first = track?.children[0] as HTMLElement | undefined;
      const second = track?.children[1] as HTMLElement | undefined;
      if (!first || !second) return;
      stepRef.current = second.getBoundingClientRect().left - first.getBoundingClientRect().left;
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [photos.length]);

  useEffect(() => {
    if (reduceMotion || photos.length < 2 || userPaused) return;

    let cancelled = false;

    const slideNext = () => {
      if (cancelled || pausedByUserRef.current) return;
      const step = stepRef.current;
      if (step <= 0) {
        pauseTimerRef.current = window.setTimeout(slideNext, 200);
        return;
      }

      indexRef.current += 1;
      playbackRef.current = animate(x, -indexRef.current * step, {
        duration: SLIDE_MS / 1000,
        ease: [0.22, 1, 0.36, 1],
      });

      void playbackRef.current.finished.then(
        () => {
          if (cancelled || pausedByUserRef.current) return;
          if (indexRef.current >= photos.length) {
            indexRef.current = 0;
            x.set(0);
          }
          pauseTimerRef.current = window.setTimeout(slideNext, PAUSE_MS);
        },
        () => undefined,
      );
    };

    pauseTimerRef.current = window.setTimeout(slideNext, PAUSE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(pauseTimerRef.current);
      playbackRef.current?.stop();
    };
  }, [photos.length, reduceMotion, userPaused, x]);

  function pauseAutoplay() {
    pausedByUserRef.current = true;
    setUserPaused(true);
    window.clearTimeout(pauseTimerRef.current);
    playbackRef.current?.stop();
  }

  function resumeAutoplay() {
    pausedByUserRef.current = false;
    setUserPaused(false);
  }

  if (photos.length === 0) return null;

  const looped = reduceMotion ? photos : [...photos, ...photos];

  return (
    <div
      aria-label={label}
      className={cn(
        "relative w-full overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]",
      )}
      onPointerDown={pauseAutoplay}
      onPointerUp={resumeAutoplay}
      onPointerCancel={resumeAutoplay}
      onPointerLeave={resumeAutoplay}
    >
      <motion.div
        ref={trackRef}
        className="flex w-max gap-3 px-1 sm:gap-4 sm:px-2"
        style={{ x }}
        drag={reduceMotion ? false : "x"}
        dragConstraints={{ left: -(photos.length * 280), right: 0 }}
        dragElastic={0.08}
        onDragStart={pauseAutoplay}
        onDragEnd={resumeAutoplay}
      >
        {looped.map((photo, index) => {
          const isClone = index >= photos.length;

          return (
            <div
              key={`${photo.src}-${index}`}
              className="relative h-40 w-[12.5rem] shrink-0 overflow-hidden rounded-[22px] border border-slate-200/80 bg-slate-100 shadow-[0_12px_28px_rgba(15,23,42,0.08)] sm:h-52 sm:w-[18.5rem] lg:h-56 lg:w-[20.5rem] dark:border-white/10 dark:bg-slate-900"
            >
              <Image
                src={photo.src}
                alt={isClone ? "" : photo.alt}
                fill
                unoptimized
                sizes="(max-width: 640px) 200px, (max-width: 1024px) 296px, 328px"
                className="object-cover object-center"
                draggable={false}
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
