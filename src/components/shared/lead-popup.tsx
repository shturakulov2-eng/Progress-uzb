"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

import { ContactForm } from "@/components/shared/contact-form";
import type { SiteContent } from "@/content/types";

const THREE_MINUTES = 3 * 60 * 1000;

export function LeadPopup({ content }: { content: SiteContent }) {
  const { popup } = content;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) return;
    const timer = window.setTimeout(() => setOpen(true), THREE_MINUTES);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function handleClose() {
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={popup.title}
        >
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            className="relative z-10 max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[32px] border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-black/40 sm:p-8"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label={popup.close}
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/15 hover:text-white"
            >
              <X className="size-4" />
            </button>

            <div className="mb-6 space-y-3 pr-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                <Sparkles className="size-3.5" />
                {popup.eyebrow}
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {popup.title}
              </h2>
              <p className="text-sm leading-6 text-slate-300">
                {popup.description}
              </p>
            </div>

            <ContactForm content={content} onSuccess={handleClose} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
