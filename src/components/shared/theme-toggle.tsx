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
        "flex size-12 items-center justify-center rounded-full border border-white/15 bg-[#0C3272] text-white shadow-[0_20px_40px_rgba(12,50,114,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#0f3f91] dark:border-white/10 dark:bg-slate-800 dark:hover:bg-slate-700",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
