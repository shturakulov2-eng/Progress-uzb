"use client";

import { Play } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type YTPlayer = {
  destroy: () => void;
  playVideo: () => void;
};

type YTNamespace = {
  Player: new (
    elementId: string,
    config?: {
      events?: {
        onStateChange?: (event: { data: number }) => void;
      };
    },
  ) => YTPlayer;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
  };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeApi() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise<void>((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };

    if (
      !document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
    ) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }

    const poll = window.setInterval(() => {
      if (window.YT?.Player) {
        window.clearInterval(poll);
        resolve();
      }
    }, 40);
  });

  return youtubeApiPromise;
}

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
  const [captureClicks, setCaptureClicks] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const onPlayRef = useRef(onPlay);
  const onPauseRef = useRef(onPause);
  const iframeId = useId().replace(/:/g, "");

  useEffect(() => {
    onPlayRef.current = onPlay;
    onPauseRef.current = onPause;
  }, [onPlay, onPause]);

  const youtubeId = src.match(
    /(?:youtube\.com\/(?:shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/,
  )?.[1];

  const youtubeEmbedSrc = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?rel=0&playsinline=1&modestbranding=1&controls=1&enablejsapi=1&origin=${typeof window !== "undefined" ? encodeURIComponent(window.location.origin) : ""}`
    : null;

  useEffect(() => {
    if (!youtubeId) return;

    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled || !window.YT || !document.getElementById(iframeId)) return;

      playerRef.current = new window.YT.Player(iframeId, {
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT!.PlayerState.PLAYING) {
              setCaptureClicks(false);
              onPlayRef.current?.();
            }
            if (event.data === window.YT!.PlayerState.ENDED) {
              setCaptureClicks(true);
              onPauseRef.current?.();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        // ignore
      }
      playerRef.current = null;
    };
  }, [youtubeId, iframeId]);

  function handleYoutubeTap() {
    setCaptureClicks(false);
    onPlayRef.current?.();
    try {
      playerRef.current?.playVideo();
    } catch {
      // Player may still be initializing; user can press YouTube play next.
    }
  }

  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="relative aspect-[9/16] overflow-hidden bg-black">
        {youtubeEmbedSrc ? (
          <>
            <iframe
              ref={iframeRef}
              id={iframeId}
              title={title}
              src={youtubeEmbedSrc}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            {captureClicks ? (
              <button
                type="button"
                aria-label={title}
                className="absolute inset-0 z-10 cursor-pointer bg-transparent"
                onClick={handleYoutubeTap}
              />
            ) : null}
          </>
        ) : hasVideo ? (
          <video
            src={src}
            className="absolute inset-0 h-full w-full object-cover"
            controls
            playsInline
            preload="metadata"
            onError={() => setHasVideo(false)}
            onPlay={() => onPlayRef.current?.()}
            onEnded={() => onPauseRef.current?.()}
            aria-label={title}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[linear-gradient(160deg,#0C3272_0%,#1a56c6_55%,#0b1220_100%)] px-6 text-center text-white">
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
