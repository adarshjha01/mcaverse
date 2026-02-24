"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconHeart } from '@/components/ui/Icons';

type Story = {
  id: string;
  name: string;
  batch: string;
  title: string; // Used as Placement/Rank
  content: string;
  imageUrl: string | null;
  likeCount: number;
  likes: string[];
  userId: string; // <-- NEW: Added to track ownership for the delete button
};

export const StoryList = ({ stories }: { stories: Story[] }) => {
    const { user } = useAuth();
    const [optimisticStories, setOptimisticStories] = useState(stories);

    const handleLike = async (storyId: string) => {
        if (!user) {
            alert("Please log in to like a story.");
            return;
        }

        // Optimistic UI update
        setOptimisticStories(currentStories =>
            currentStories.map(story => {
                if (story.id === storyId) {
                    const alreadyLiked = story.likes.includes(user.uid);
                    return {
                        ...story,
                        likes: alreadyLiked ? story.likes.filter(id => id !== user.uid) : [...story.likes, user.uid],
                        likeCount: alreadyLiked ? story.likeCount - 1 : story.likeCount + 1,
                    };
                }
                return story;
            })
        );

        // Call the API route
        try {
            await fetch('/api/stories/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storyId, userId: user.uid }),
            });
        } catch (error) {
            console.error("Failed to like story:", error);
        }
    };

    // NEW: Handle Delete Function
    const handleDelete = async (storyId: string) => {
        if (!confirm("Are you sure you want to delete your success story?")) return;

        // Optimistic UI removal
        setOptimisticStories(current => current.filter(s => s.id !== storyId));

        try {
            await fetch(`/api/success-stories/${storyId}`, { method: 'DELETE' });
        } catch (error) {
            console.error("Failed to delete story:", error);
            alert("Failed to delete story. Please try again.");
        }
    };

    // Framer Motion staggered animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    };

    return (
        <div className="w-full">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">
                Inspiring Journeys
            </h2>
            
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-6"
            >
                {optimisticStories.length > 0 ? (
                    optimisticStories.map(story => {
                        const isLikedByCurrentUser = user ? story.likes.includes(user.uid) : false;
                        
                        return (
                            <motion.div 
                                variants={itemVariants}
                                key={story.id} 
                                className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-800 transition-all duration-300"
                            >
                                {/* Subtle Quote Mark Watermark */}
                                <div className="absolute top-6 right-8 text-8xl font-serif leading-none text-slate-100 dark:text-slate-800/50 -z-10 select-none">
                                    &quot;
                                </div>

                                <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                                        {story.imageUrl ? (
                                            <Image 
                                                src={story.imageUrl} 
                                                alt={story.name} 
                                                width={80} 
                                                height={80} 
                                                className="rounded-full ring-4 ring-indigo-50 dark:ring-indigo-900/30 object-cover w-20 h-20" 
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/50 border-2 border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-2xl">
                                                {story.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow text-center sm:text-left">
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                                {story.name}
                                            </h3>
                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm">
                                                <span className="font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                                                    {story.title}
                                                </span>
                                                {story.batch && (
                                                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                                                        • Batch of {story.batch}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic text-lg mb-6">
                                            &quot;{story.content}&quot;
                                        </p>
                                    </div>
                                </div>

                                {/* Footer: Read More, Delete & Like Button */}
                                <div className="flex justify-between items-center mt-2 pt-6 border-t border-slate-100 dark:border-slate-800/50 relative z-10">
                                    <Link 
                                        href={`/success-stories/${story.id}`} 
                                        className="text-sm font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
                                    >
                                        Read Full Story <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                                    </Link>
                                    
                                    <div className="flex items-center gap-2">
                                        
                                        {/* NEW: Delete Button (Only shows if it's YOUR story) */}
                                        {user && user.uid === story.userId && (
                                            <button 
                                                onClick={() => handleDelete(story.id)}
                                                className="p-2 mr-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                                title="Delete Story"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}

                                        <button 
                                            onClick={() => handleLike(story.id)}
                                            disabled={!user}
                                            className="group/btn relative flex items-center justify-center p-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 dark:hover:bg-red-900/20"
                                            aria-label="Like story"
                                        >
                                            <IconHeart 
                                                className={`w-6 h-6 transition-all duration-300 transform group-hover/btn:scale-110 ${
                                                    isLikedByCurrentUser 
                                                    ? 'fill-red-500 text-red-500' 
                                                    : 'text-slate-400 dark:text-slate-500 group-hover/btn:text-red-500'
                                                }`} 
                                            />
                                        </button>
                                        <span className={`text-sm font-bold ${isLikedByCurrentUser ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                            {story.likeCount}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-12 text-center">
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                            No success stories have been shared yet. Be the first to inspire others!
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};