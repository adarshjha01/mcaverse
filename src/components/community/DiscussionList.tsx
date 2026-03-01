// src/components/community/DiscussionList.tsx
"use client";

import Link from "next/link";
import {
  IconMessageCircle,
  IconArrowUp,
  IconArrowDown,
  IconTrash,
} from "@/components/ui/Icons";
import { useAuth } from "@/components/auth/AuthProvider";
import { useState, useMemo, useTransition } from "react";

// --- Type Definitions ---
type Discussion = {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  createdAt: string | Date;
  replyCount: number;
  voteCount: number;
  upvotes: string[];
  downvotes: string[];
};

type SortMode = "votes" | "newest" | "most-replies";

// --- Helper: relative time ---
function timeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

// --- Vote Column ---
const VoteColumn = ({
  discussion,
  onVote,
}: {
  discussion: Discussion;
  onVote: (voteType: "up" | "down") => void;
}) => {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  const hasUpvoted = user ? discussion.upvotes.includes(user.uid) : false;
  const hasDownvoted = user
    ? discussion.downvotes.includes(user.uid)
    : false;

  const handleVote = (voteType: "up" | "down") => {
    if (!user) {
      alert("Please log in to vote.");
      return;
    }
    startTransition(() => onVote(voteType));
  };

  return (
    <div className="flex flex-col items-center gap-0.5 select-none">
      <button
        onClick={() => handleVote("up")}
        disabled={!user || isPending}
        aria-label="Upvote"
        className={`p-1.5 rounded-md transition-colors ${
          hasUpvoted
            ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
            : "text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <IconArrowUp />
      </button>
      <span
        className={`text-sm font-semibold tabular-nums ${
          discussion.voteCount > 0
            ? "text-indigo-600 dark:text-indigo-400"
            : discussion.voteCount < 0
            ? "text-red-500 dark:text-red-400"
            : "text-slate-500 dark:text-slate-400"
        }`}
      >
        {discussion.voteCount}
      </span>
      <button
        onClick={() => handleVote("down")}
        disabled={!user || isPending}
        aria-label="Downvote"
        className={`p-1.5 rounded-md transition-colors ${
          hasDownvoted
            ? "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10"
            : "text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <IconArrowDown />
      </button>
    </div>
  );
};

// --- Initials Avatar ---
const InitialsAvatar = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex-shrink-0">
      {initials}
    </span>
  );
};

// --- Main Component ---
export const DiscussionList = ({
  initialDiscussions,
}: {
  initialDiscussions: Discussion[];
}) => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState(initialDiscussions);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortMode>("votes");

  // --- Filtered & sorted discussions ---
  const displayed = useMemo(() => {
    let list = discussions;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.authorName.toLowerCase().includes(q)
      );
    }

    // Sort
    const sorted = [...list];
    if (sort === "newest") {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sort === "most-replies") {
      sorted.sort((a, b) => b.replyCount - a.replyCount);
    } else {
      sorted.sort((a, b) => b.voteCount - a.voteCount);
    }

    return sorted;
  }, [discussions, search, sort]);

  // --- Optimistic vote handler ---
  const handleVoteOptimistic = async (
    discussionId: string,
    voteType: "up" | "down"
  ) => {
    if (!user) return;
    const previousDiscussions = discussions;

    setDiscussions((current) =>
      current
        .map((d) => {
          if (d.id === discussionId) {
            const hasUpvoted = d.upvotes.includes(user.uid);
            const hasDownvoted = d.downvotes.includes(user.uid);
            let newVoteCount = d.voteCount;
            let newUpvotes = [...d.upvotes];
            let newDownvotes = [...d.downvotes];

            if (voteType === "up") {
              if (hasUpvoted) {
                newVoteCount--;
                newUpvotes = newUpvotes.filter((id) => id !== user.uid);
              } else {
                newVoteCount += hasDownvoted ? 2 : 1;
                newUpvotes.push(user.uid);
                newDownvotes = newDownvotes.filter((id) => id !== user.uid);
              }
            } else {
              if (hasDownvoted) {
                newVoteCount++;
                newDownvotes = newDownvotes.filter((id) => id !== user.uid);
              } else {
                newVoteCount -= hasUpvoted ? 2 : 1;
                newDownvotes.push(user.uid);
                newUpvotes = newUpvotes.filter((id) => id !== user.uid);
              }
            }
            return {
              ...d,
              voteCount: newVoteCount,
              upvotes: newUpvotes,
              downvotes: newDownvotes,
            };
          }
          return d;
        })
        .sort((a, b) => b.voteCount - a.voteCount)
    );

    try {
      const token = await user.getIdToken();
      await fetch("/api/discussions/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          discussionId,
          userId: user.uid,
          voteType,
        }),
      });
    } catch (error) {
      console.error("Failed to submit vote", error);
      setDiscussions(previousDiscussions);
    }
  };

  // --- Optimistic delete handler ---
  const handleDeletePost = async (discussionId: string) => {
    if (!user || !window.confirm("Are you sure you want to delete this post?"))
      return;
    const previousDiscussions = discussions;
    setDiscussions((current) => current.filter((d) => d.id !== discussionId));

    try {
      const token = await user.getIdToken();
      await fetch("/api/discussions/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ discussionId }),
      });
    } catch (error) {
      console.error("Failed to delete post", error);
      setDiscussions(previousDiscussions);
      alert("Failed to delete post.");
    }
  };

  const SORT_OPTIONS: { value: SortMode; label: string }[] = [
    { value: "votes", label: "Top" },
    { value: "newest", label: "New" },
    { value: "most-replies", label: "Active" },
  ];

  return (
    <div>
      {/* ── Header bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Discussions
        </h2>
        <Link
          href="/community/new"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm shadow-indigo-500/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Post
        </Link>
      </div>

      {/* ── Search + Sort ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search discussions..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all shadow-sm shadow-slate-100/50 dark:shadow-none"
          />
        </div>
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 overflow-hidden flex-shrink-0">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={`px-3.5 py-2 text-xs font-semibold transition-colors ${
                sort === opt.value
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Discussion List ── */}
      {displayed.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed p-12 text-center">
          {discussions.length === 0 ? (
            <>
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <IconMessageCircle className="w-6 h-6 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">
                No discussions yet
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Be the first to start a conversation!
              </p>
              <Link
                href="/community/new"
                className="inline-block bg-indigo-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Start a Discussion
              </Link>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">
                No results found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Try a different search term.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((post) => (
            <article
              key={post.id}
              className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all hover:shadow-md hover:shadow-indigo-500/5"
            >
              <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5">
                {/* Vote column */}
                <div className="flex-shrink-0 pt-0.5">
                  <VoteColumn
                    discussion={post}
                    onVote={(voteType) =>
                      handleVoteOptimistic(post.id, voteType)
                    }
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Link href={`/community/${post.id}`} className="block group/link">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100 group-hover/link:text-indigo-600 dark:group-hover/link:text-indigo-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                    <div className="flex items-center gap-1.5">
                      <InitialsAvatar name={post.authorName} />
                      <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {post.authorName}
                      </span>
                    </div>
                    <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">
                      &middot;
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-500">
                      {timeAgo(new Date(post.createdAt))}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">
                      &middot;
                    </span>
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-500">
                      <IconMessageCircle className="w-3.5 h-3.5" />
                      <span className="text-xs">
                        {post.replyCount}{" "}
                        {post.replyCount === 1 ? "reply" : "replies"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete button (owner only) */}
                {user && user.uid === post.authorId && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex-shrink-0"
                    title="Delete post"
                    aria-label="Delete post"
                  >
                    <IconTrash />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};