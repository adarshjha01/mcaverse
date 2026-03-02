// src/components/videos/VideoDiscussion.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useAuth } from "@/components/auth/AuthProvider";

interface Message {
  id: string;
  videoId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPhoto: string | null;
  createdAt: string | null;
}

// Inline icons
const IconSend = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const IconTrash = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

interface VideoDiscussionProps {
  videoId: string;
  videoTitle: string;
}

export const VideoDiscussion: React.FC<VideoDiscussionProps> = ({ videoId, videoTitle }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const headers: HeadersInit = {};
      if (user) {
        const token = await user.getIdToken();
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await fetch(`/api/video-discussions?videoId=${videoId}`, { headers });
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Failed to fetch discussions:", err);
    } finally {
      setLoading(false);
    }
  }, [user, videoId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!user || !newMessage.trim() || sending) return;
    setSending(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/video-discussions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          videoId,
          content: newMessage.trim(),
          authorId: user.uid,
          authorName: user.displayName || "Anonymous",
          authorPhoto: user.photoURL || "",
        }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      await fetch(`/api/video-discussions?messageId=${messageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700/60 flex-shrink-0">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Discussion</h3>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{videoTitle}</p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">No messages yet.</p>
            <p className="text-[11px] text-slate-300 dark:text-slate-600 mt-1">Be the first to start a discussion!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.authorId === user?.uid;
            return (
              <div key={msg.id} className={`group flex gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                <div className="flex-shrink-0 w-7 h-7 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  {msg.authorPhoto ? (
                    <Image src={msg.authorPhoto} alt="" width={28} height={28} className="rounded-full" />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                      {msg.authorName?.[0] || "?"}
                    </span>
                  )}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] ${isOwn ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`text-[10px] font-semibold ${isOwn ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-300"}`}>
                      {isOwn ? "You" : msg.authorName}
                    </span>
                    <span className="text-[9px] text-slate-300 dark:text-slate-600">{timeAgo(msg.createdAt)}</span>
                  </div>
                  <div className={`px-3 py-2 rounded-xl text-[13px] leading-relaxed ${
                    isOwn
                      ? "bg-indigo-50 dark:bg-indigo-950/30 text-slate-700 dark:text-slate-200 rounded-tr-sm"
                      : "bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 rounded-tl-sm"
                  }`}>
                    {msg.content}
                  </div>
                  {isOwn && (
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="mt-0.5 opacity-0 group-hover:opacity-100 text-[10px] text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-all flex items-center gap-0.5"
                    >
                      <IconTrash className="w-3 h-3" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="px-3 py-2.5 border-t border-slate-200 dark:border-slate-700/60 flex-shrink-0">
        {user ? (
          <div className="flex items-end gap-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 resize-none rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
              style={{ maxHeight: "80px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 80) + "px";
              }}
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim() || sending}
              className="flex-shrink-0 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white disabled:text-slate-400 dark:disabled:text-slate-500 transition-colors"
            >
              <IconSend className={`w-4 h-4 ${sending ? "animate-pulse" : ""}`} />
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
            Login to chat
          </a>
        )}
      </div>
    </div>
  );
};
