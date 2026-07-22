"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Decorative scroll-scrubbed mountain path + walker.
 * Lives in the main content column only (never under the fixed sidebar).
 * Behind section UI (z-0); sections should sit at z-10+.
 */
export function MountainJourney() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const characterRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const path = pathRef.current;
    const character = characterRef.current;
    if (!root || !path || !character) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const placeAt = (progress: number) => {
      const length = path.getTotalLength();
      const clamped = Math.min(Math.max(progress, 0), 1);
      // Path is drawn summit → base visually from top to bottom in SVG coords,
      // but journey progress 0 = bottom (start), 1 = summit.
      const distance = (1 - clamped) * length;
      const point = path.getPointAtLength(distance);
      const ahead = path.getPointAtLength(Math.max(distance - 1.5, 0));
      const angle =
        (Math.atan2(ahead.y - point.y, ahead.x - point.x) * 180) / Math.PI;

      gsap.set(character, {
        x: point.x,
        y: point.y,
        rotation: angle + 90,
        transformOrigin: "50% 50%",
      });
    };

    if (reduced) {
      placeAt(0.35);
      return;
    }

    const home = document.querySelector("#home");
    const contact = document.querySelector("#contact");
    if (!home || !contact) {
      placeAt(0);
      return;
    }

    const ctx = gsap.context(() => {
      const state = { progress: 0 };
      placeAt(0);
      let lastMountainLog = 0;
      let updateCount = 0;

      gsap.to(state, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: home,
          endTrigger: contact,
          start: "top top",
          end: "top center",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          placeAt(state.progress);
          updateCount += 1;
          // #region agent log
          const now = Date.now();
          if (now - lastMountainLog >= 500) {
            fetch("http://127.0.0.1:7536/ingest/f1d1b59d-dd24-43d5-8599-1dfaa67eee90", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Debug-Session-Id": "091a6d",
              },
              body: JSON.stringify({
                sessionId: "091a6d",
                runId: "run1",
                hypothesisId: "C",
                location: "mountain-journey.tsx:onUpdate",
                message: "mountain-scrub-sample",
                data: {
                  progress: Number(state.progress.toFixed(4)),
                  updatesSinceLastLog: updateCount,
                  scrollY: Math.round(window.scrollY),
                },
                timestamp: now,
              }),
            }).catch(() => {});
            updateCount = 0;
            lastMountainLog = now;
          }
          // #endregion
        },
      });
    }, root);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    // Fonts / sticky portfolio height can shift layout after first paint.
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 bottom-0 z-0 left-2 w-[5.5rem] opacity-[0.38] sm:left-3 sm:w-28 sm:opacity-[0.45] lg:left-[15rem] lg:w-36 lg:opacity-50 dark:opacity-[0.55]"
    >
      <svg
        viewBox="0 0 120 640"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft mountain silhouette */}
        <path
          d="M8 620 L28 480 L48 540 L72 320 L92 400 L112 180 L120 640 L8 640 Z"
          className="fill-[#0C3272]/12 dark:fill-blue-400/10"
        />
        <path
          d="M0 640 L22 500 L44 560 L70 360 L95 440 L118 220 L120 640 Z"
          className="fill-[#0C3272]/08 dark:fill-blue-300/8"
        />

        {/* Trail path: top (summit) → bottom (start) */}
        <path
          ref={pathRef}
          id="mountain-trail"
          d="M62 36 C58 90, 78 130, 54 180 C30 230, 86 270, 48 330 C18 380, 92 420, 56 480 C28 530, 74 560, 60 610"
          className="stroke-[#0C3272]/55 dark:stroke-blue-300/50"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2 7"
        />

        {/* Summit flag */}
        <g className="text-[#0C3272] dark:text-blue-300">
          <line
            x1="62"
            y1="36"
            x2="62"
            y2="18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M62 18 L78 24 L62 30 Z" fill="currentColor" opacity="0.85" />
        </g>

        {/* Checkpoint dots along the trail (approx milestones) */}
        {[
          [60, 610],
          [52, 470],
          [56, 330],
          [54, 180],
          [62, 36],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={i === 4 ? 4.5 : 3.2}
            className="fill-[#0C3272]/70 dark:fill-blue-300/70"
          />
        ))}

        {/* Walker — positioned via GSAP transform (origin at feet-ish center) */}
        <g ref={characterRef} style={{ willChange: "transform" }}>
          <circle cx="0" cy="-14" r="5.5" className="fill-[#0C3272] dark:fill-blue-200" />
          <path
            d="M0 -8 L0 4 M0 0 L-5 8 M0 0 L5 8 M0 4 L-4 16 M0 4 L4 16"
            className="stroke-[#0C3272] dark:stroke-blue-200"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}
