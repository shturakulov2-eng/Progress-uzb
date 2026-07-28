"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { SectionHeading } from "@/components/shared/section-heading";
import type { SiteContent } from "@/content/types";
import { cn } from "@/lib/utils";

type ProcessCopy = SiteContent["sections"]["process"];

type ProcessScrollCarouselProps = {
  copy: ProcessCopy;
  steps: string[];
};

/**
 * Desktop: sticky horizontal carousel — vertical scroll drives steps in from the right.
 * Mobile: tall vertical step cards (same content, no horizontal pin).
 */
export function ProcessScrollCarousel({ copy, steps }: ProcessScrollCarouselProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [travel, setTravel] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Soft inertia: keep moving briefly after scroll stops, then ease to rest.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: prefersReducedMotion ? 500 : 70,
    damping: prefersReducedMotion ? 50 : 22,
    mass: prefersReducedMotion ? 0.2 : 0.85,
    restDelta: 0.0005,
  });

  const x = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -travel],
  );
  const progressWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;
      setTravel(Math.max(track.scrollWidth - viewport.clientWidth, 0));
    };

    measure();
    const frame = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    if (viewportRef.current) observer.observe(viewportRef.current);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [steps.length]);

  const stageCount = Math.max(steps.length, 2);

  return (
    <section id="process" className="relative">
      {/* Desktop / large screens: pinned horizontal journey */}
      <div
        ref={sectionRef}
        className="relative hidden lg:block"
        style={{ height: `${stageCount * 100}svh` }}
      >
        <div className="sticky top-0 flex h-svh flex-col justify-start overflow-hidden pt-8 pb-10">
          <div className="section-shell shrink-0">
            <SectionHeading
              eyebrow={copy.eyebrow}
              title={copy.title}
              description={copy.description}
              align="center"
            />
            <div className="mx-auto mt-6 h-1.5 max-w-3xl overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <motion.div
                className="h-full rounded-full bg-[#0C3272] dark:bg-blue-400"
                style={{ width: progressWidth }}
              />
            </div>
          </div>

          <div
            ref={viewportRef}
            className="section-shell relative mt-6 min-h-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,#000_0%,#000_88%,transparent_100%)]"
          >
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="flex h-full w-max items-stretch gap-8 pr-[28vw] will-change-transform"
            >
              {steps.map((step, index) => (
                <ProcessCard
                  key={step}
                  step={step}
                  index={index}
                  total={steps.length}
                  size="desktop"
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet: vertical large steps */}
      <div className="section-shell py-14 sm:py-20 lg:hidden">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
          align="center"
        />
        <div className="relative mt-10 space-y-5 pl-2">
          <div className="absolute top-3 bottom-3 left-7 w-0.5 bg-slate-200 dark:bg-slate-700" />
          {steps.map((step, index) => (
            <motion.div
              key={step}
              initial={prefersReducedMotion ? false : { opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <ProcessCard step={step} index={index} total={steps.length} size="mobile" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessCard({
  step,
  index,
  total,
  size,
}: {
  step: string;
  index: number;
  total: number;
  size: "desktop" | "mobile";
}) {
  const desktop = size === "desktop";

  return (
    <article
      className={cn(
        "relative overflow-hidden border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_24px_60px_rgba(0,0,0,0.35)]",
        desktop
          ? "flex h-full max-h-[min(42svh,360px)] w-[min(72vw,560px)] shrink-0 flex-col justify-between rounded-[36px] p-8"
          : "ml-10 rounded-[28px] p-6",
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 text-[7.5rem] font-semibold leading-none text-[#0C3272]/[0.06] dark:text-blue-300/10"
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="relative">
        <div
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-[#0C3272] font-semibold text-white dark:bg-blue-600",
            desktop ? "size-16 text-xl" : "size-12 text-base",
          )}
        >
          {index + 1}
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#0C3272]/70 dark:text-blue-300/80">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
      </div>

      <h3
        className={cn(
          "relative font-semibold tracking-tight text-slate-950 dark:text-white",
          desktop ? "mt-6 max-w-[14ch] text-3xl leading-tight xl:text-4xl" : "mt-4 text-2xl leading-snug",
        )}
      >
        {step}
      </h3>
    </article>
  );
}
