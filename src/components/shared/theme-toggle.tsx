"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "onDark";
}) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const onDark = variant === "onDark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Kunduzgi rejim" : "Tungi rejim"}
      title={isDark ? "Kunduzgi rejim" : "Tungi rejim"}
      className={cn(
        "group relative flex size-11 items-center justify-center overflow-hidden rounded-full backdrop-blur-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2",
        onDark
          ? "border border-white/30 bg-white/10 text-white hover:border-white/60 hover:bg-white/20 focus-visible:ring-blue-300"
          : cn(
              "border border-slate-200/80 bg-white/90 text-slate-700 shadow-sm hover:border-[#0C3272]/40 hover:bg-white hover:text-[#0C3272] focus-visible:ring-[#0C3272]/30",
              "dark:border-white/30 dark:bg-white/10 dark:text-white dark:shadow-none dark:hover:border-white/60 dark:hover:bg-white/20 dark:hover:text-white dark:focus-visible:ring-blue-300",
            ),
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 opacity-80 transition-opacity duration-300 group-hover:opacity-100",
          onDark
            ? "bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.28),transparent_55%)]"
            : "bg-[radial-gradient(circle_at_30%_20%,rgba(12,50,114,0.08),transparent_55%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.28),transparent_55%)]",
        )}
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
            <Sun
              className={cn(
                "size-5",
                onDark ? "text-amber-300" : "text-amber-500 dark:text-amber-300",
              )}
              strokeWidth={2.2}
            />
          ) : (
            <Moon
              className={cn(
                "size-5",
                onDark ? "text-blue-100" : "text-[#0C3272] dark:text-blue-100",
              )}
              strokeWidth={2.2}
            />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
