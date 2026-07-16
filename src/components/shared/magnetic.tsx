"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

import { cn } from "@/lib/utils";

const STRENGTH = 0.35;
const MAX_OFFSET = 10;

export function Magnetic({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");

    const sync = () => setEnabled(media.matches && !prefersReducedMotion);
    sync();

    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [prefersReducedMotion]);

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);

    x.set(Math.max(Math.min(offsetX * STRENGTH, MAX_OFFSET), -MAX_OFFSET));
    y.set(Math.max(Math.min(offsetY * STRENGTH, MAX_OFFSET), -MAX_OFFSET));
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={enabled ? { x: springX, y: springY } : undefined}
    >
      {children}
    </motion.div>
  );
}
