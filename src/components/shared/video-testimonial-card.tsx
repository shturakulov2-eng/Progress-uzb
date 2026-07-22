"use client";

import { Play } from "lucide-react";
import { useState } from "react";

export function VideoTestimonialCard({
  title,
  src,
  onPlay,
  onPause,
}: {
  title: string;
  src: string;
  onPlay?: () => void;
  onPause?: () => void;
}) {
  const [hasVideo, setHasVideo] = useState(true);

  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="relative aspect-[9/16] overflow-hidden bg-[linear-gradient(160deg,#0C3272_0%,#1a56c6_55%,#0b1220_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22),transparent_40%)]" />

        {hasVideo ? (
          <video
            src={src}
            className="absolute inset-0 h-full w-full object-cover"
            controls
            playsInline
            preload="metadata"
            muted
            onError={() => setHasVideo(false)}
            onPlay={onPlay}
            onPause={onPause}
            onEnded={onPause}
            aria-label={title}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center text-white">
            <button
              type="button"
              className="flex size-16 items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md transition group-hover:scale-105 group-hover:bg-white/25"
              aria-label={title}
            >
              <Play className="ml-1 size-6 fill-current" />
            </button>
            <p className="text-sm font-medium text-blue-50/90">{title}</p>
          </div>
        )}
      </div>
    </article>
  );
}
