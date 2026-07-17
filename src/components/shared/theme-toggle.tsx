"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Kunduzgi rejim" : "Tungi rejim"}
      title={isDark ? "Kunduzgi rejim" : "Tungi rejim"}
      className={cn(
        "group relative flex size-11 items-center justify-center overflow-hidden rounded-full",
        "border border-white/30 bg-white/10 text-white backdrop-blur-md",
        "transition-all duration-300 hover:border-white/60 hover:bg-white/20",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.28),transparent_55%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100"
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ opacity: 0, rotate: -90, scale: 0.55, y: 8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.55, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative z-10 flex items-center justify-center"
        >
          {isDark ? (
            <Sun className="size-5 text-amber-300" strokeWidth={2.2} />
          ) : (
            <Moon className="size-5 text-blue-100" strokeWidth={2.2} />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
