"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input[type="submit"], .interactive-glow';

const LERP = 0.18;

type GlowTarget = {
  element: HTMLElement;
  x: number;
  y: number;
  currentX: number;
  currentY: number;
};

export function CursorGlow() {
  const activeRef = useRef<GlowTarget | null>(null);
  const rafRef = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mediaFine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mediaMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncEnabled = () => {
      setEnabled(mediaFine.matches && !mediaMotion.matches);
    };

    syncEnabled();
    mediaFine.addEventListener("change", syncEnabled);
    mediaMotion.addEventListener("change", syncEnabled);

    return () => {
      mediaFine.removeEventListener("change", syncEnabled);
      mediaMotion.removeEventListener("change", syncEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const clearActive = () => {
      const active = activeRef.current;
      if (!active) return;
      active.element.dataset.glowHover = "false";
      activeRef.current = null;
    };

    const animate = () => {
      const active = activeRef.current;
      if (active) {
        active.currentX += (active.x - active.currentX) * LERP;
        active.currentY += (active.y - active.currentY) * LERP;
        active.element.style.setProperty("--glow-x", `${active.currentX}px`);
        active.element.style.setProperty("--glow-y", `${active.currentY}px`);
      }
      rafRef.current = window.requestAnimationFrame(animate);
    };

    const onPointerMove = (event: PointerEvent) => {
      const interactive = (event.target as Element | null)?.closest?.(
        INTERACTIVE_SELECTOR,
      );

      if (!(interactive instanceof HTMLElement)) {
        clearActive();
        return;
      }

      const rect = interactive.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (activeRef.current?.element !== interactive) {
        clearActive();
        activeRef.current = {
          element: interactive,
          x,
          y,
          currentX: x,
          currentY: y,
        };
        interactive.dataset.glowHover = "true";
        interactive.style.setProperty("--glow-x", `${x}px`);
        interactive.style.setProperty("--glow-y", `${y}px`);
        return;
      }

      activeRef.current.x = x;
      activeRef.current.y = y;
    };

    const onPointerOut = (event: PointerEvent) => {
      const from = event.target as Element | null;
      const to = event.relatedTarget as Element | null;
      const leaving = from?.closest?.(INTERACTIVE_SELECTOR);
      if (!leaving) return;
      if (to && leaving.contains(to)) return;
      if (activeRef.current?.element === leaving) {
        clearActive();
      }
    };

    rafRef.current = window.requestAnimationFrame(animate);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut, true);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      clearActive();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut, true);
    };
  }, [enabled]);

  return null;
}
