// src/components/videos/VideoNotes.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import type { User } from "firebase/auth";

interface VideoNotesProps {
  videoId: string;
  videoTitle: string;
}

const IconSave = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
  </svg>
);

export const VideoNotes: React.FC<VideoNotesProps> = ({ videoId, videoTitle }) => {
  const { user } = useAuth();

  // Show login prompt for logged-out users
  if (!user) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700/60 flex-shrink-0">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Notes</h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{videoTitle}</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-amber-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Personal Notes</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 max-w-[200px]">Login to take notes for this lecture. Your notes are private and saved to your account.</p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 text-sm font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
            Login to take notes
          </a>
        </div>
      </div>
    );
  }

  return <VideoNotesEditor videoId={videoId} videoTitle={videoTitle} user={user} />;
};

// Separate component to keep hooks unconditional
const VideoNotesEditor: React.FC<VideoNotesProps & { user: User }> = ({ videoId, videoTitle, user }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef(content);
  const hasUnsavedRef = useRef(hasUnsaved);

  // Fetch existing note
  const fetchNote = useCallback(async () => {
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/video-notes?videoId=${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setContent(data.content || "");
      setLastSaved(data.updatedAt || null);
      setHasUnsaved(false);
    } catch (err) {
      console.error("Failed to fetch note:", err);
    } finally {
      setLoading(false);
    }
  }, [user, videoId]);

  useEffect(() => {
    fetchNote();
  }, [fetchNote]);

  // Save note
  const saveNote = useCallback(async (noteContent: string) => {
    setSaving(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/video-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ videoId, content: noteContent }),
      });
      if (res.ok) {
        setLastSaved(new Date().toISOString());
        setHasUnsaved(false);
      }
    } catch (err) {
      console.error("Failed to save note:", err);
    } finally {
      setSaving(false);
    }
  }, [user, videoId]);

  // Keep refs in sync with state
  useEffect(() => { contentRef.current = content; }, [content]);
  useEffect(() => { hasUnsavedRef.current = hasUnsaved; }, [hasUnsaved]);

  // Auto-save with debounce (3 seconds after last edit)
  const handleChange = (value: string) => {
    setContent(value);
    setHasUnsaved(true);

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      saveNote(value);
    }, 3000);
  };

  // Manual save
  const handleManualSave = () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveNote(content);
  };

  // Save on unmount if unsaved
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      if (hasUnsavedRef.current) {
        // Fire-and-forget save on unmount
        user.getIdToken().then((token) => {
          fetch("/api/video-notes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ videoId, content: contentRef.current }),
            keepalive: true,
          }).catch(() => {});
        }).catch(() => {});
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (iso: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700/60 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Notes</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{videoTitle}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {hasUnsaved && (
              <span className="text-[10px] text-amber-500 font-medium">Unsaved</span>
            )}
            {saving && (
              <span className="text-[10px] text-indigo-500 font-medium animate-pulse">Saving...</span>
            )}
            {!saving && !hasUnsaved && lastSaved && (
              <span className="text-[10px] text-green-500 font-medium">Saved</span>
            )}
            <button
              onClick={handleManualSave}
              disabled={saving || !hasUnsaved}
              className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all"
              title="Save notes"
            >
              <IconSave className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0 p-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500" />
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Take notes for this lecture...&#10;&#10;• Key concepts&#10;• Important formulas&#10;• Questions to revisit"
            className="w-full h-full resize-none rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors leading-relaxed"
          />
        )}
      </div>

      {/* Footer */}
      {lastSaved && (
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
          <p className="text-[10px] text-slate-300 dark:text-slate-600">
            Last saved: {formatTime(lastSaved)}
          </p>
        </div>
      )}
    </div>
  );
};
