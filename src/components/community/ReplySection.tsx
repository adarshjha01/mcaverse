"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { IconTrash } from "@/components/ui/Icons";
import {
  CommentThread,
  Comment,
  CommentHeader,
  CommentAvatar,
  CommentBody,
  CommentToggle,
  CommentReplies,
} from "@/components/ruixen/comment-thread";

type Post = {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string | Date;
};
type Reply = {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string | Date;
};

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
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const ReplySection = ({
  post,
  initialReplies,
}: {
  post: Post;
  initialReplies: Reply[];
}) => {
  const { user } = useAuth();
  const [replies, setReplies] = useState(initialReplies);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);
  const discussionId = post.id;

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !replyContent.trim()) return;
    setLoading(true);

    const newReplyData = {
      discussionId,
      replyContent,
      authorId: user.uid,
      authorName: user.displayName || "Anonymous",
    };

    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/discussions/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newReplyData),
      });

      if (response.ok) {
        const optimisticReply: Reply = {
          id: Date.now().toString(),
          content: newReplyData.replyContent,
          authorId: newReplyData.authorId,
          authorName: newReplyData.authorName,
          createdAt: new Date(),
        };
        setReplies([...replies, optimisticReply]);
        setReplyContent("");
      } else {
        alert("Failed to post reply.");
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (
      !user ||
      !window.confirm("Are you sure you want to delete this reply?")
    )
      return;

    const previousReplies = replies;
    setReplies((current) => current.filter((r) => r.id !== replyId));

    try {
      const token = await user.getIdToken();
      await fetch("/api/discussions/reply/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ discussionId, replyId }),
      });
    } catch (error) {
      console.error("Error deleting reply:", error);
      setReplies(previousReplies);
      alert("Failed to delete reply.");
    }
  };

  const postDate = new Date(post.createdAt);

  return (
    <div>
      {/* ── Main Post Card ── */}
      <CommentThread
        type="multiple"
        defaultValue={[post.id]}
        className="w-full"
      >
        <Comment
          value={post.id}
          className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none"
        >
          <CommentHeader>
            <CommentAvatar
              name={post.authorName}
              color="bg-indigo-600 text-white"
            />
            <div className="w-full min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1.5 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {post.authorName}
                </span>
                <span className="text-slate-300 dark:text-slate-700">
                  &middot;
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {timeAgo(postDate)}
                </span>
              </div>
              <CommentBody className="text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed whitespace-pre-line">
                {post.content}
              </CommentBody>
            </div>
          </CommentHeader>

          {/* Toggle to show/hide replies */}
          <div className="ml-11 mt-4">
            <CommentToggle className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
              {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
            </CommentToggle>
          </div>

          {/* Nested Replies */}
          <CommentReplies className="pl-4 sm:pl-11 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
            {replies.length > 0 ? (
              replies.map((reply) => (
                <Comment
                  key={reply.id}
                  value={reply.id}
                  className="mb-4 last:mb-0 group"
                >
                  <CommentHeader>
                    <div className="flex justify-between items-start w-full gap-2">
                      <div className="flex gap-3 min-w-0">
                        <CommentAvatar
                          name={reply.authorName}
                          color="bg-emerald-600 text-white"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {reply.authorName}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {timeAgo(new Date(reply.createdAt))}
                            </span>
                          </div>
                          <CommentBody className="mt-1.5 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                            {reply.content}
                          </CommentBody>
                        </div>
                      </div>

                      {user && user.uid === reply.authorId && (
                        <button
                          onClick={() => handleDeleteReply(reply.id)}
                          className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex-shrink-0"
                          title="Delete Reply"
                          aria-label="Delete reply"
                        >
                          <IconTrash />
                        </button>
                      )}
                    </div>
                  </CommentHeader>
                </Comment>
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-sm py-2">
                No replies yet. Be the first to help out!
              </p>
            )}
          </CommentReplies>
        </Comment>
      </CommentThread>

      {/* ── Reply Form ── */}
      <div className="mt-6">
        {user ? (
          <form
            onSubmit={handleSubmitReply}
            className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none"
          >
            <label
              htmlFor="reply-content"
              className="block text-sm font-semibold text-slate-800 dark:text-white mb-3"
            >
              Leave a Reply
            </label>
            <textarea
              id="reply-content"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={4}
              placeholder="Write your thoughts..."
              required
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all resize-y"
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={loading || !replyContent.trim()}
                className="bg-indigo-600 text-white text-sm font-semibold py-2.5 px-5 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Posting..." : "Post Reply"}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 px-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <Link
                href="/login"
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Log in
              </Link>{" "}
              to post a reply.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};