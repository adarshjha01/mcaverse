// src/components/community/ReplySection.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { IconTrash } from "@/components/ui/Icons";

type Reply = { id: string; content: string; authorId: string; authorName: string; createdAt: Date };

export const ReplySection = ({
  discussionId,
  initialReplies,
}: {
  discussionId: string;
  initialReplies: Reply[];
}) => {
  const { user } = useAuth();
  const [replies, setReplies] = useState(initialReplies);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);

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
        // --- SECURITY UPDATE: Send Token ---
        const token = await user.getIdToken();
        const response = await fetch("/api/discussions/reply", {
          method: "POST",
          headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` 
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
      if (!user || !window.confirm("Are you sure you want to delete this reply?")) return;

      setReplies(current => current.filter(r => r.id !== replyId));

      try {
          // --- SECURITY UPDATE: Send Token ---
          const token = await user.getIdToken();
          await fetch('/api/discussions/reply/delete', {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify({ discussionId, replyId }), 
          });
      } catch (error) {
          console.error("Error deleting reply:", error);
          alert("Failed to delete reply.");
      }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">
        {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
      </h2>

      {/* Replies List */}
      <div className="space-y-6 mb-10">
        {replies.map((reply) => (
          <div
            key={reply.id}
            className="bg-white p-5 rounded-xl shadow-md border border-slate-200 flex justify-between items-start"
          >
            <div>
                <p className="text-slate-700 leading-relaxed">{reply.content}</p>
                <p className="text-xs text-slate-500 mt-3 italic">
                  — {reply.authorName} on{" "}
                  {reply.createdAt.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
            </div>
            {user && user.uid === reply.authorId && (
                <button onClick={() => handleDeleteReply(reply.id)} className="text-slate-400 hover:text-red-600 p-1 rounded-full flex-shrink-0">
                    <IconTrash />
                </button>
            )}
          </div>
        ))}

        {replies.length === 0 && (
          <p className="text-slate-500 italic text-center">
            No replies yet. Be the first to comment!
          </p>
        )}
      </div>

      {/* Reply Box */}
      {user ? (
        <form
          onSubmit={handleSubmitReply}
          className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200"
        >
          <h3 className="text-lg font-semibold mb-4 text-slate-800">
            Leave a Reply
          </h3>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={4}
            placeholder="Write your comment..."
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none text-slate-800 placeholder-slate-400"
          />
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 transition-all"
            >
              {loading ? "Posting..." : "Post Reply"}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 shadow-md">
          <p className="font-medium text-slate-700">
            Please{" "}
            <Link
              href="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              log in
            </Link>{" "}
            to post a reply.
          </p>
        </div>
      )}
    </div>
  );
};