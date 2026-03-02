// src/components/videos/VideoPlayer.tsx
"use client";

import React from "react";
import { VideoDiscussion } from "./VideoDiscussion";
import { VideoNotes } from "./VideoNotes";

const IconX = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconChat = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconNotes = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);

export interface NowPlayingItem {
  id: string;
  title: string;
  videoId: string;
}

export type PanelTab = "none" | "discussion" | "notes";

interface VideoPlayerProps {
  nowPlaying: NowPlayingItem | null;
  onClose: () => void;
  playerRef: React.RefObject<HTMLDivElement | null>;
  activePanel: PanelTab;
  onPanelChange: (panel: PanelTab) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  nowPlaying,
  onClose,
  playerRef,
  activePanel,
  onPanelChange,
}) => {
  if (!nowPlaying) return null;

  const togglePanel = (panel: PanelTab) => {
    onPanelChange(activePanel === panel ? "none" : panel);
  };

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
          {/* Discussion Toggle */}
          <button
            onClick={() => togglePanel("discussion")}
            className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              activePanel === "discussion"
                ? "bg-indigo-600/80 text-white"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
            title="Video Discussion"
          >
            <IconChat className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chat</span>
          </button>

          {/* Notes Toggle */}
          <button
            onClick={() => togglePanel("notes")}
            className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              activePanel === "notes"
                ? "bg-amber-600/80 text-white"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
            title="Video Notes"
          >
            <IconNotes className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Notes</span>
          </button>

          <div className="w-px h-4 bg-slate-700 hidden sm:block" />

          <a
            href={`https://www.youtube.com/watch?v=${nowPlaying.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            YouTube
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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

      {/* Video + Side Panel Layout */}
      <div className={`flex flex-col ${activePanel !== "none" ? "lg:flex-row" : ""}`}>
        {/* 16:9 Responsive Iframe */}
        <div className={`${activePanel !== "none" ? "lg:flex-1" : "w-full"}`}>
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

        {/* Side Panel (Discussion / Notes) */}
        {activePanel !== "none" && (
          <div className="lg:w-80 xl:w-96 h-72 sm:h-80 lg:h-auto border-t lg:border-t-0 lg:border-l border-slate-700/60 bg-white dark:bg-slate-900 flex flex-col">
            {activePanel === "discussion" && (
              <VideoDiscussion videoId={nowPlaying.videoId} videoTitle={nowPlaying.title} />
            )}
            {activePanel === "notes" && (
              <VideoNotes videoId={nowPlaying.videoId} videoTitle={nowPlaying.title} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
