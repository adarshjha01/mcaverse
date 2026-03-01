// src/components/videos/VideoPlayer.tsx
"use client";

import React from "react";

const IconX = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export interface NowPlayingItem {
  id: string;
  title: string;
  videoId: string;
}

interface VideoPlayerProps {
  nowPlaying: NowPlayingItem | null;
  onClose: () => void;
  playerRef: React.RefObject<HTMLDivElement | null>;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  nowPlaying,
  onClose,
  playerRef,
}) => {
  if (!nowPlaying) return null;

  return (
    <div
      ref={playerRef}
      className="mb-8 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 bg-black shadow-2xl shadow-black/10 dark:shadow-black/30 ring-1 ring-black/5 dark:ring-white/5 animate-in fade-in slide-in-from-top-2 duration-300"
    >
      {/* Player Header Bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-750">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="hidden sm:inline text-[10px] font-medium text-red-400 uppercase tracking-wider">
              Playing
            </span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-slate-700" />
          <p className="text-xs sm:text-sm font-medium text-white truncate">
            {nowPlaying.title}
          </p>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2 sm:ml-3">
          <a
            href={`https://www.youtube.com/watch?v=${nowPlaying.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            YouTube
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close player"
          >
            <IconX className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* 16:9 Responsive Iframe */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          key={nowPlaying.videoId}
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${nowPlaying.videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={nowPlaying.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};
