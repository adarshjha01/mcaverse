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

type Post = { id: string; title: string; content: string; authorName: string; createdAt: string | Date };
type Reply = { id: string; content: string; authorId: string; authorName: string; createdAt: string | Date };

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
    <div className="mt-2">
      {/* 1. We pass defaultValue={[post.id]} to force the thread OPEN by default */}
      <CommentThread type="multiple" defaultValue={[post.id]} className="w-full">
        
        <Comment value={post.id} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          
          {/* Main Post Content */}
          <CommentHeader>
            <CommentAvatar name={post.authorName} color="bg-indigo-600" />
            <div className="w-full">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{post.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{post.authorName}</p>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <CommentBody className="text-slate-700 dark:text-slate-300 text-base leading-relaxed whitespace-pre-line mb-4">
                {post.content}
              </CommentBody>
            </div>
          </CommentHeader>

          {/* 2. The Toggle Button (Crucial for the animation and showing replies!) */}
          <div className="ml-12 mt-2">
            <CommentToggle className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
              {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
            </CommentToggle>
          </div>

          {/* 3. The Nested Replies */}
          <CommentReplies className="pl-6 sm:pl-12 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {replies.length > 0 ? (
              replies.map((reply) => (
                <Comment key={reply.id} value={reply.id} className="mb-6 group">
                  <CommentHeader>
                    <div className="flex justify-between items-start w-full">
                      <div className="flex gap-3 w-full">
                        <CommentAvatar name={reply.authorName} color="bg-emerald-500" />
                        <div className="w-full">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{reply.authorName}</p>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <CommentBody className="mt-2 text-slate-700 dark:text-slate-300">
                            {reply.content}
                          </CommentBody>
                        </div>
                      </div>
                      
                      {/* Delete Button */}
                      {user && user.uid === reply.authorId && (
                        <button 
                          onClick={() => handleDeleteReply(reply.id)} 
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-full flex-shrink-0"
                          title="Delete Reply"
                        >
                          <IconTrash />
                        </button>
                      )}
                    </div>
                  </CommentHeader>
                </Comment>
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400 italic text-sm mt-2">No replies yet. Be the first to help out!</p>
            )}
          </CommentReplies>
        </Comment>
      </CommentThread>

      {/* 4. The Reply Form */}
      <div className="mt-8">
        {user ? (
          <form onSubmit={handleSubmitReply} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Leave a Reply</h3>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={4}
              placeholder="Write your comment..."
              required
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
            />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-slate-400 transition-all"
              >
                {loading ? "Posting..." : "Post Reply"}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="font-medium text-slate-700 dark:text-slate-300">
              Please <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">log in</Link> to post a reply.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};