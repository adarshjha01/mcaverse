// src/components/community/DiscussionList.tsx
"use client";

import Link from "next/link";
import { IconMessageCircle, IconArrowUp, IconArrowDown, IconTrash } from "@/components/ui/Icons";
import { useAuth } from "@/components/auth/AuthProvider";
import { useState, useTransition } from "react";

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

// --- VoteButtons Component ---
const VoteButtons = ({ discussion, onVote }: { discussion: Discussion; onVote: (voteType: 'up' | 'down') => void }) => {
    const { user } = useAuth();
    const [isPending, startTransition] = useTransition();

    const hasUpvoted = user ? discussion.upvotes.includes(user.uid) : false;
    const hasDownvoted = user ? discussion.downvotes.includes(user.uid) : false;

    const handleVote = (voteType: 'up' | 'down') => {
        if (!user) {
            alert("Please log in to vote.");
            return;
        }
        startTransition(() => onVote(voteType));
    };

    return (
        <div className="flex items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
            <button onClick={() => handleVote('up')} disabled={!user || isPending} className={`p-1 rounded ${hasUpvoted ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}>
                <IconArrowUp />
            </button>
            <span className="font-bold text-sm mx-2 w-4 text-center text-slate-800 dark:text-slate-200">{discussion.voteCount}</span>
            <button onClick={() => handleVote('down')} disabled={!user || isPending} className={`p-1 rounded ${hasDownvoted ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400'}`}>
                <IconArrowDown />
            </button>
        </div>
    );
};

export const DiscussionList = ({ initialDiscussions }: { initialDiscussions: Discussion[] }) => {
    const { user } = useAuth();
    const [discussions, setDiscussions] = useState(initialDiscussions);

    const handleVoteOptimistic = async (discussionId: string, voteType: 'up' | 'down') => {
        if (!user) return;
        
        // Save previous state for rollback
        const previousDiscussions = discussions;

        // Optimistic UI Update
        setDiscussions(currentDiscussions => 
            currentDiscussions.map(d => {
                if (d.id === discussionId) {
                    const hasUpvoted = d.upvotes.includes(user.uid);
                    const hasDownvoted = d.downvotes.includes(user.uid);
                    let newVoteCount = d.voteCount;
                    let newUpvotes = [...d.upvotes];
                    let newDownvotes = [...d.downvotes];

                    if (voteType === 'up') {
                        if (hasUpvoted) {
                            newVoteCount--;
                            newUpvotes = newUpvotes.filter(id => id !== user.uid);
                        } else {
                            newVoteCount += hasDownvoted ? 2 : 1;
                            newUpvotes.push(user.uid);
                            newDownvotes = newDownvotes.filter(id => id !== user.uid);
                        }
                    } else { // downvote
                        if (hasDownvoted) {
                            newVoteCount++;
                            newDownvotes = newDownvotes.filter(id => id !== user.uid);
                        } else {
                            newVoteCount -= hasUpvoted ? 2 : 1;
                            newDownvotes.push(user.uid);
                            newUpvotes = newUpvotes.filter(id => id !== user.uid);
                        }
                    }
                    return { ...d, voteCount: newVoteCount, upvotes: newUpvotes, downvotes: newDownvotes };
                }
                return d;
            }).sort((a, b) => b.voteCount - a.voteCount)
        );

        try {
            // --- SECURITY UPDATE: Send Token ---
            const token = await user.getIdToken();
            await fetch('/api/discussions/vote', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ discussionId, userId: user.uid, voteType }),
            });
        } catch (error) {
            console.error("Failed to submit vote", error);
            // Revert optimistic update on failure
            setDiscussions(previousDiscussions);
        }
    };

    const handleDeletePost = async (discussionId: string) => {
        if (!user || !window.confirm("Are you sure you want to delete this post?")) return;

        // Save previous state for rollback
        const previousDiscussions = discussions;

        // Optimistic UI Update
        setDiscussions(current => current.filter(d => d.id !== discussionId));

        try {
            // --- SECURITY UPDATE: Send Token ---
            const token = await user.getIdToken();
            await fetch('/api/discussions/delete', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ discussionId }), 
            });
        } catch (error) {
            console.error("Failed to delete post", error);
            // Revert optimistic update on failure
            setDiscussions(previousDiscussions);
            alert("Failed to delete post.");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Discussions</h2>
                <Link href="/community/new" className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    New Post
                </Link>
            </div>
            {discussions.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                    <IconMessageCircle className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">No discussions yet</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Be the first to start a conversation!</p>
                    <Link href="/community/new" className="inline-block bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                        Start a Discussion
                    </Link>
                </div>
            ) : (
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md border border-slate-200 dark:border-slate-800">
                <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                    {discussions.map(post => (
                        <li key={post.id} className="p-4 flex gap-3 sm:gap-4 items-start sm:items-center">
                            <div className="flex-shrink-0">
                                <VoteButtons discussion={post} onVote={(voteType) => handleVoteOptimistic(post.id, voteType)} />
                            </div>
                            <div className="flex-grow min-w-0">
                                <Link href={`/community/${post.id}`} className="block">
                                    <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate">{post.title}</h3>
                                </Link>
                                <div className="flex flex-wrap justify-between items-center mt-1 gap-1">
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                        Posted by {post.authorName} • {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                                        <IconMessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span>{post.replyCount}</span>
                                    </div>
                                </div>
                            </div>
                            {user && user.uid === post.authorId && (
                                <button onClick={() => handleDeletePost(post.id)} className="text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-full flex-shrink-0 transition-colors">
                                    <IconTrash />
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            )}
        </div>
    );
};