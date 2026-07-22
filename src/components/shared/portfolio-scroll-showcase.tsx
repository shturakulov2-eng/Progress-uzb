"use client";

import { Landmark } from "lucide-react";
import {
  easeInOut,
  easeOut,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";

import { SectionHeading } from "@/components/shared/section-heading";
import type { SiteContent } from "@/content/types";

type PortfolioCopy = SiteContent["sections"]["portfolio"];
type ResultsCopy = SiteContent["sections"]["results"];
type PortfolioItem = SiteContent["portfolioItems"][number];
type Statistic = SiteContent["statistics"][number];

type PortfolioScrollShowcaseProps = {
  portfolio: PortfolioCopy;
  results: ResultsCopy;
  items: PortfolioItem[];
  statistics: Statistic[];
};

export function PortfolioScrollShowcase({
  portfolio,
  results,
  items,
  statistics,
}: PortfolioScrollShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // One snap stage per: header + each project + results.
  const stageCount = items.length + 2;
  // Progress value that each snap point lands on (0, u, 2u, ... 1).
  const u = 1 / (stageCount - 1);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // #region agent log
  useEffect(() => {
    let lastLog = 0;
    let sampleCount = 0;
    const unsub = scrollYProgress.on("change", (v) => {
      sampleCount += 1;
      const now = Date.now();
      if (now - lastLog < 400) return;
      lastLog = now;
      fetch("http://127.0.0.1:7536/ingest/f1d1b59d-dd24-43d5-8599-1dfaa67eee90", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "091a6d",
        },
        body: JSON.stringify({
          sessionId: "091a6d",
          runId: "run1",
          hypothesisId: "D",
          location: "portfolio-scroll-showcase.tsx:progress",
          message: "portfolio-progress-sample",
          data: {
            progress: Number(v.toFixed(4)),
            samplesSinceLastLog: sampleCount,
            stageCount,
            itemCount: items.length,
          },
          timestamp: now,
        }),
      }).catch(() => {});
      sampleCount = 0;
    });
    return () => unsub();
  }, [scrollYProgress, stageCount, items.length]);
  // #endregion

  // Snap to the nearest fully-arrived stage once the user stops scrolling,
  // instead of relying on CSS `scroll-snap` (which fights native momentum
  // scrolling and made the whole page feel stuck).
  useEffect(() => {
    if (prefersReducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    let idleTimer: number | undefined;
    let pointerDown = false;
    let scrollEventCount = 0;

    const settle = () => {
      if (pointerDown) return;
      const vh = window.innerHeight;
      const sectionTop = section.offsetTop;
      const scrollY = window.scrollY;
      const tolerance = vh * 0.08;

      if (scrollY < sectionTop - tolerance) return;
      if (scrollY > sectionTop + (stageCount - 1) * vh + tolerance) return;

      const rawStage = (scrollY - sectionTop) / vh;
      const stage = Math.min(Math.max(Math.round(rawStage), 0), stageCount - 1);
      const target = sectionTop + stage * vh;
      const delta = Math.abs(scrollY - target);

      // #region agent log
      fetch("http://127.0.0.1:7536/ingest/f1d1b59d-dd24-43d5-8599-1dfaa67eee90", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "091a6d",
        },
        body: JSON.stringify({
          sessionId: "091a6d",
          runId: "run1",
          hypothesisId: "A",
          location: "portfolio-scroll-showcase.tsx:settle",
          message: "settle-eval",
          data: {
            scrollY: Math.round(scrollY),
            sectionTop: Math.round(sectionTop),
            vh,
            rawStage: Number(rawStage.toFixed(3)),
            stage,
            target: Math.round(target),
            delta: Math.round(delta),
            willScroll: delta > 2,
            scrollEventsSinceLastSettle: scrollEventCount,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      scrollEventCount = 0;

      if (delta > 2) {
        // #region agent log
        fetch("http://127.0.0.1:7536/ingest/f1d1b59d-dd24-43d5-8599-1dfaa67eee90", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "091a6d",
          },
          body: JSON.stringify({
            sessionId: "091a6d",
            runId: "run1",
            hypothesisId: "B",
            location: "portfolio-scroll-showcase.tsx:scrollTo",
            message: "programmatic-smooth-scroll",
            data: {
              from: Math.round(scrollY),
              to: Math.round(target),
              htmlSmooth:
                typeof document !== "undefined"
                  ? getComputedStyle(document.documentElement).scrollBehavior
                  : "n/a",
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        window.scrollTo({ top: target, behavior: "smooth" });
      }
    };

    const onScroll = () => {
      scrollEventCount += 1;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(settle, 140);
    };
    const onPointerDown = () => {
      pointerDown = true;
    };
    const onPointerUp = () => {
      pointerDown = false;
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchend", onPointerUp, { passive: true });
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mouseup", onPointerUp);

    return () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchend", onPointerUp);
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mouseup", onPointerUp);
    };
  }, [stageCount, prefersReducedMotion]);

  const headingOpacity = useTransform(
    scrollYProgress,
    [0, u * 0.55, u * 0.95],
    [1, 1, 0],
    { ease: easeInOut },
  );
  const headingY = useTransform(
    scrollYProgress,
    [0, u * 0.55, u * 0.95],
    [0, 0, prefersReducedMotion ? -12 : -70],
    { ease: easeInOut },
  );
  const headingScale = useTransform(
    scrollYProgress,
    [0, u * 0.55, u * 0.95],
    [1, 1, 0.94],
    { ease: easeInOut },
  );

  // Cards group fades out as the results panel arrives (last stage).
  const cardsStart = items.length * u;
  const cardsOpacity = useTransform(
    scrollYProgress,
    [cardsStart + u * 0.35, cardsStart + u * 0.9],
    [1, 0],
    { ease: easeInOut },
  );

  const resultsOpacity = useTransform(
    scrollYProgress,
    [cardsStart + u * 0.15, cardsStart + u * 0.9],
    [0, 1],
    { ease: easeOut },
  );
  const resultsY = useTransform(
    scrollYProgress,
    [cardsStart + u * 0.15, cardsStart + u * 0.95],
    [prefersReducedMotion ? 16 : 80, 0],
    { ease: easeOut },
  );
  const resultsScale = useTransform(
    scrollYProgress,
    [cardsStart + u * 0.15, cardsStart + u * 0.95],
    [0.95, 1],
    { ease: easeOut },
  );

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative"
      style={{ height: `${stageCount * 100}svh` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="section-shell relative h-full">
          <div className="pointer-events-none absolute inset-0 flex items-center px-4 sm:px-6 lg:px-8">
            <motion.div
              className="w-full"
              style={{
                opacity: headingOpacity,
                y: headingY,
                scale: headingScale,
              }}
            >
              <SectionHeading
                eyebrow={portfolio.eyebrow}
                title={portfolio.title}
                description={portfolio.description}
                align="center"
              />
            </motion.div>
          </div>

          <motion.div className="absolute inset-0" style={{ opacity: cardsOpacity }}>
            {items.map((item, index) => (
              <PortfolioMotionCard
                key={item.name}
                item={item}
                index={index}
                itemCount={items.length}
                unit={u}
                progress={scrollYProgress}
                copy={portfolio}
                reducedMotion={Boolean(prefersReducedMotion)}
              />
            ))}
          </motion.div>

          <div className="pointer-events-none absolute inset-0 flex items-center px-4 sm:px-6 lg:px-8">
            <motion.div
              className="w-full"
              style={{
                opacity: resultsOpacity,
                y: resultsY,
                scale: resultsScale,
              }}
            >
              <ResultsPanel copy={results} statistics={statistics} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PortfolioMotionCard({
  item,
  index,
  itemCount,
  unit,
  progress,
  copy,
  reducedMotion,
}: {
  item: PortfolioItem;
  index: number;
  itemCount: number;
  unit: number;
  progress: MotionValue<number>;
  copy: PortfolioCopy;
  reducedMotion: boolean;
}) {
  // Card i is fully centered at the snap point progress = (index + 1) * unit.
  const center = (index + 1) * unit;
  const enterStart = center - unit * 0.88;
  const nextCenter = (index + 2) * unit;
  const direction = index % 2 === 0 ? -1 : 1;
  const isLast = index === itemCount - 1;

  const x = useTransform(
    progress,
    [enterStart, center],
    [reducedMotion ? `${direction * 8}%` : `${direction * 118}%`, "0%"],
    { ease: easeOut },
  );
  const opacity = useTransform(
    progress,
    [enterStart, enterStart + unit * 0.35],
    [0, 1],
    { ease: easeOut },
  );
  const stackScale = useTransform(
    progress,
    isLast ? [0, 1] : [center, nextCenter],
    isLast ? [1, 1] : [1, 0.955],
    { ease: easeInOut },
  );
  const stackY = useTransform(
    progress,
    isLast ? [0, 1] : [center, nextCenter],
    isLast ? [0, 0] : [0, -18],
    { ease: easeInOut },
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{ zIndex: index + 1 }}
    >
      <motion.div style={{ x, y: stackY, opacity, scale: stackScale }}>
        <article className="pointer-events-auto mx-auto flex max-h-[86svh] w-[min(88vw,22rem)] flex-col overflow-y-auto overscroll-contain rounded-[32px] border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.18)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_28px_80px_rgba(0,0,0,0.4)]">
          <div className="relative aspect-[16/11] shrink-0 overflow-hidden bg-[linear-gradient(135deg,#0C3272,#1a56c6)] p-6 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.18),_transparent_25%)]" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em]">
                  {copy.projectPreview}
                </span>
                <Landmark className="size-5 text-blue-100" />
              </div>
              <div className="rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-sm text-blue-100">{item.category}</p>
                <p className="mt-2 text-2xl font-semibold">{item.name}</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0C3272] dark:text-blue-300">
              {item.category}
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
              {item.name}
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {copy.durationLabel}:
                </span>{" "}
                {item.duration}
              </p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {copy.resultLabel}:
                </span>{" "}
                {item.result}
              </p>
              {item.process ? (
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {copy.processLabel}:
                  </span>{" "}
                  {item.process}
                </p>
              ) : null}
            </div>
          </div>
        </article>
      </motion.div>
    </div>
  );
}

function ResultsPanel({
  copy,
  statistics,
}: {
  copy: ResultsCopy;
  statistics: Statistic[];
}) {
  return (
    <div className="mx-auto max-w-6xl rounded-[36px] bg-slate-950 px-5 py-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] sm:px-10 sm:py-12">
      <div className="[&_h2]:text-white [&_p]:text-slate-300 [&_p:first-child]:text-blue-300">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
          align="center"
        />
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 xl:grid-cols-4">
        {statistics.map((item) => (
          <div
            key={item.label}
            className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:rounded-[30px] sm:p-6"
          >
            <AnimatedCounter value={item.value} suffix={item.suffix} />
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-blue-100 sm:text-sm sm:tracking-[0.2em]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnimatedCounter({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const start = performance.now();
    const duration = 1200;
    let frameId = 0;

    const frame = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setDisplayValue(Math.round(value * progress));
      if (progress < 1) frameId = window.requestAnimationFrame(frame);
    };

    frameId = window.requestAnimationFrame(frame);
    return () => window.cancelAnimationFrame(frameId);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-3xl font-semibold tracking-tight sm:text-5xl">
      {displayValue}
      {suffix}
    </div>
  );
}
