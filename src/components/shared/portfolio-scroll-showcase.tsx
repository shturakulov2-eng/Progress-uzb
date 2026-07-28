"use client";

import { Landmark } from "lucide-react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { SectionHeading } from "@/components/shared/section-heading";
import type { SiteContent } from "@/content/types";
import { cn } from "@/lib/utils";

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

const REPLAY_VIEWPORT = { once: false, amount: 0.25 } as const;

/**
 * Desktop: sticky center stage — large header first, fades out, then L/R cards stack,
 * then results rise. Continuous spring (no quantize) so motion doesn't "stick".
 * Mobile: vertical whileInView (replays on re-enter).
 */
export function PortfolioScrollShowcase({
  portfolio,
  results,
  items,
  statistics,
}: PortfolioScrollShowcaseProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <PortfolioStaticFlow
        portfolio={portfolio}
        results={results}
        items={items}
        statistics={statistics}
        reducedMotion
      />
    );
  }

  return (
    <section id="portfolio" className="relative z-10">
      <PortfolioDesktopStack
        portfolio={portfolio}
        results={results}
        items={items}
        statistics={statistics}
      />
      <div className="section-shell py-14 sm:py-20 lg:hidden">
        <PortfolioStaticFlow
          portfolio={portfolio}
          results={results}
          items={items}
          statistics={statistics}
          reducedMotion={false}
          nested
        />
      </div>
    </section>
  );
}

function PortfolioDesktopStack({
  portfolio,
  results,
  items,
  statistics,
}: PortfolioScrollShowcaseProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  // header-in + header-out + cards + roomy results finale
  const unitCount = 2 + items.length + 2;
  const u = (n: number) => n / unitCount;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 68,
    damping: 24,
    mass: 0.75,
    restDelta: 0.0005,
  });

  const headerEnterEnd = u(1);
  const headerExitEnd = u(2);

  const headerOpacity = useTransform(
    smoothProgress,
    [0, headerEnterEnd * 0.55, headerEnterEnd, headerExitEnd],
    [0, 1, 1, 0],
  );
  const headerY = useTransform(
    smoothProgress,
    [0, headerEnterEnd, headerExitEnd],
    [28, 0, -18],
  );
  const headerScale = useTransform(
    smoothProgress,
    [0, headerEnterEnd, headerExitEnd],
    [0.94, 1.08, 0.97],
  );

  // After the last card lands, stack soft-exits and Results takes the stage.
  const resultsStart = u(2 + items.length);
  const resultsMid = resultsStart + (1 - resultsStart) * 0.55;

  const stackOpacity = useTransform(
    smoothProgress,
    [0, resultsStart, resultsMid],
    [1, 1, 0],
  );
  const stackScale = useTransform(
    smoothProgress,
    [0, resultsStart, resultsMid],
    [1, 1, 0.94],
  );

  const resultsOpacity = useTransform(
    smoothProgress,
    [0, resultsStart, resultsMid, 1],
    [0, 0, 1, 1],
  );
  const resultsY = useTransform(
    smoothProgress,
    [0, resultsStart, resultsMid, 1],
    ["46vh", "46vh", "0vh", "0vh"],
  );
  const resultsScale = useTransform(
    smoothProgress,
    [0, resultsStart, resultsMid, 1],
    [0.94, 0.94, 1, 1],
  );

  return (
    <div
      ref={sectionRef}
      className="relative hidden lg:block"
      style={{ height: `${unitCount * 78}svh` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Center stage: header then stacked cards */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="section-shell pointer-events-none absolute inset-x-0 z-20 flex justify-center"
            style={{
              opacity: headerOpacity,
              y: headerY,
              scale: headerScale,
            }}
          >
            <div className="max-w-4xl text-center [&_h2]:text-4xl [&_h2]:leading-tight md:[&_h2]:text-5xl [&_p.text-base]:text-lg">
              <SectionHeading
                eyebrow={portfolio.eyebrow}
                title={portfolio.title}
                description={portfolio.description}
                align="center"
              />
            </div>
          </motion.div>

          <motion.div
            className="relative z-10 mx-auto h-[min(58svh,540px)] w-full max-w-3xl px-6"
            style={{ opacity: stackOpacity, scale: stackScale }}
          >
            {items.map((item, index) => (
              <StackCard
                key={item.name}
                item={item}
                index={index}
                copy={portfolio}
                progress={smoothProgress}
                start={u(2 + index)}
                end={u(3 + index)}
              />
            ))}
          </motion.div>
        </div>

        {/* Finale: full Results rises from below-center into the stage */}
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{
            opacity: resultsOpacity,
            y: resultsY,
            scale: resultsScale,
          }}
        >
          <div className="section-shell w-full">
            <ResultsPanel copy={results} statistics={statistics} stage />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StackCard({
  item,
  index,
  copy,
  progress,
  start,
  end,
}: {
  item: PortfolioItem;
  index: number;
  copy: PortfolioCopy;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const fromLeft = index % 2 === 0;
  // Fully off-stage (side + slightly below), then travel into center — no mid-screen pop.
  const xFrom = fromLeft ? "-122%" : "122%";
  const fadeIn = start + (end - start) * 0.22;

  const opacity = useTransform(progress, [start, fadeIn, end], [0, 0.95, 1]);
  const x = useTransform(progress, [start, end], [xFrom, "0%"]);
  const y = useTransform(progress, [start, end], [88, 0]);
  const scale = useTransform(progress, [start, end], [0.94, 1]);
  const rotate = useTransform(
    progress,
    [start, end],
    [fromLeft ? -2.2 : 2.2, 0],
  );

  return (
    <motion.article
      style={{
        opacity,
        x,
        y,
        scale,
        rotate,
        zIndex: index + 1,
      }}
      className="absolute inset-0 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_28px_70px_rgba(15,23,42,0.14)] will-change-transform dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_28px_70px_rgba(0,0,0,0.4)]"
    >
      <PortfolioCardBody item={item} copy={copy} compact />
    </motion.article>
  );
}

function PortfolioStaticFlow({
  portfolio,
  results,
  items,
  statistics,
  reducedMotion,
  nested = false,
}: PortfolioScrollShowcaseProps & {
  reducedMotion: boolean;
  nested?: boolean;
}) {
  const content = (
    <>
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={REPLAY_VIEWPORT}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <SectionHeading
          eyebrow={portfolio.eyebrow}
          title={portfolio.title}
          description={portfolio.description}
          align="center"
        />
      </motion.div>

      <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-6 sm:mt-14 sm:gap-8">
        {items.map((item, index) => (
          <PortfolioRevealCard
            key={item.name}
            item={item}
            index={index}
            copy={portfolio}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>

      <motion.div
        className="mt-16"
        initial={reducedMotion ? false : { opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={REPLAY_VIEWPORT}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <ResultsPanel copy={results} statistics={statistics} />
      </motion.div>
    </>
  );

  if (nested) return content;

  return (
    <section
      id="portfolio"
      className="section-shell relative z-10 overflow-x-clip py-14 sm:py-20"
    >
      {content}
    </section>
  );
}

function PortfolioRevealCard({
  item,
  index,
  copy,
  reducedMotion,
}: {
  item: PortfolioItem;
  index: number;
  copy: PortfolioCopy;
  reducedMotion: boolean;
}) {
  const fromLeft = index % 2 === 0;
  const xFrom = reducedMotion ? 0 : fromLeft ? -28 : 28;

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0.7, x: xFrom, y: 24 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={REPLAY_VIEWPORT}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.03, 0.15),
        ease: "easeOut",
      }}
      className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm sm:rounded-[32px] dark:border-slate-700 dark:bg-slate-900"
    >
      <PortfolioCardBody item={item} copy={copy} />
    </motion.article>
  );
}

function PortfolioCardBody({
  item,
  copy,
  compact = false,
}: {
  item: PortfolioItem;
  copy: PortfolioCopy;
  compact?: boolean;
}) {
  return (
    <>
      <div
        className={cn(
          "relative overflow-hidden bg-[linear-gradient(135deg,#0C3272,#1a56c6)] text-white",
          compact
            ? "aspect-[16/9] p-5"
            : "aspect-[16/11] p-6 sm:aspect-[2/1]",
        )}
      >
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
            <p
              className={cn(
                "mt-2 font-semibold",
                compact ? "text-xl" : "text-xl sm:text-2xl",
              )}
            >
              {item.name}
            </p>
          </div>
        </div>
      </div>
      <div className={cn(compact ? "p-5" : "p-5 sm:p-6")}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0C3272] sm:text-sm sm:tracking-[0.2em] dark:text-blue-300">
          {item.category}
        </p>
        <h3
          className={cn(
            "mt-3 font-semibold text-slate-950 dark:text-white",
            compact ? "text-xl" : "text-xl sm:text-2xl",
          )}
        >
          {item.name}
        </h3>
        <div
          className={cn(
            "mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300",
            compact && "line-clamp-5",
          )}
        >
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
    </>
  );
}

function ResultsPanel({
  copy,
  statistics,
  compact = false,
  stage = false,
}: {
  copy: ResultsCopy;
  statistics: Statistic[];
  compact?: boolean;
  /** Desktop sticky finale: full panel, fitted to viewport, no inner scroll */
  stage?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto max-w-6xl rounded-[36px] bg-slate-950 px-5 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] sm:px-10",
        stage
          ? "px-6 py-7 sm:px-10 sm:py-9"
          : compact
            ? "py-7 sm:py-9"
            : "py-8 sm:py-12",
      )}
    >
      <div
        className={cn(
          "[&_h2]:text-white [&_p]:text-slate-300 [&_p:first-child]:text-blue-300",
          stage && "[&_h2]:text-3xl md:[&_h2]:text-4xl [&_p]:leading-7",
        )}
      >
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
          align="center"
        />
      </div>
      <div
        className={cn(
          "grid grid-cols-2 gap-3 xl:grid-cols-4",
          stage ? "mt-7 sm:gap-4" : compact ? "mt-6 sm:gap-4" : "mt-8 sm:mt-12 sm:gap-5",
        )}
      >
        {statistics.map((item) => (
          <div
            key={item.label}
            className={cn(
              "rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-sm sm:rounded-[30px]",
              stage ? "p-4 sm:p-5" : "p-4 sm:p-6",
            )}
          >
            <AnimatedCounter
              value={item.value}
              suffix={item.suffix}
              compact={stage}
            />
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
  compact = false,
}: {
  value: number;
  suffix: string;
  compact?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setDisplayValue(0);
      return;
    }

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
    <div
      ref={ref}
      className={cn(
        "font-semibold tracking-tight",
        compact ? "text-3xl sm:text-4xl" : "text-3xl sm:text-5xl",
      )}
    >
      {displayValue}
      {suffix}
    </div>
  );
}
