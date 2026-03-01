"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconHeart, IconTrophy } from '@/components/ui/Icons';

type Story = {
  id: string;
  name: string;
  batch: string;
  title: string;
  content: string;
  imageUrl: string | null;
  likeCount: number;
  likes: string[];
  rating: number;
  userId: string;
};

export const StoryList = ({ stories }: { stories: Story[] }) => {
    const { user } = useAuth();
    const [optimisticStories, setOptimisticStories] = useState(stories);

    useEffect(() => {
        setOptimisticStories(stories);
    }, [stories]);

    const handleLike = async (storyId: string) => {
        if (!user) {
            alert("Please log in to like a story.");
            return;
        }

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

        try {
            const token = await user.getIdToken();
            await fetch('/api/stories/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ storyId, userId: user.uid }),
            });
        } catch (error) {
            console.error("Failed to like story:", error);
        }
    };

    const handleDelete = async (storyId: string) => {
        if (!confirm("Are you sure you want to delete your success story?")) return;

        setOptimisticStories(current => current.filter(s => s.id !== storyId));

        try {
            const token = await user!.getIdToken();
            await fetch(`/api/success-stories/${storyId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
        } catch (error) {
            console.error("Failed to delete story:", error);
            alert("Failed to delete story. Please try again.");
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 400, damping: 30 } }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    Inspiring Journeys
                </h2>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                    {optimisticStories.length} {optimisticStories.length === 1 ? 'story' : 'stories'}
                </span>
            </div>
            
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-5"
            >
                {optimisticStories.length > 0 ? (
                    optimisticStories.map(story => {
                        const isLikedByCurrentUser = user ? story.likes.includes(user.uid) : false;
                        const initials = story.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                        
                        return (
                            <motion.div 
                                variants={itemVariants}
                                key={story.id} 
                                className="group bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="flex gap-4 sm:gap-5">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0 hidden sm:block">
                                        {story.imageUrl ? (
                                            <Image 
                                                src={story.imageUrl} 
                                                alt={story.name} 
                                                width={56} 
                                                height={56} 
                                                className="rounded-xl ring-1 ring-slate-200 dark:ring-slate-800 object-cover w-14 h-14" 
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/60 dark:border-amber-800/30 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-base">
                                                {initials}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow min-w-0">
                                        {/* Header row */}
                                        <div className="flex items-start justify-between gap-3 mb-1">
                                            <div className="min-w-0">
                                                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                                                    {story.name}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-900/15 text-amber-700 dark:text-amber-400 font-semibold text-xs border border-amber-200/50 dark:border-amber-800/25">
                                                        <IconTrophy className="w-3 h-3" />
                                                        {story.title}
                                                    </span>
                                                    {story.batch && (
                                                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                                            &apos;{story.batch.slice(-2)}
                                                        </span>
                                                    )}
                                                    {/* Stars — compact */}
                                                    <div className="flex gap-px">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg key={i} className={`w-3 h-3 ${i < (story.rating || 5) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"}`} viewBox="0 0 24 24">
                                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mobile avatar */}
                                            <div className="sm:hidden flex-shrink-0">
                                                {story.imageUrl ? (
                                                    <Image src={story.imageUrl} alt={story.name} width={40} height={40} className="rounded-lg ring-1 ring-slate-200 dark:ring-slate-800 object-cover w-10 h-10" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/60 dark:border-amber-800/30 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-xs">
                                                        {initials}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Story excerpt */}
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base mt-3 line-clamp-3">
                                            &ldquo;{story.content}&rdquo;
                                        </p>

                                        {/* Footer actions */}
                                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50">
                                            <Link 
                                                href={`/success-stories/${story.id}`} 
                                                className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1 group/link"
                                            >
                                                Read more <span className="group-hover/link:translate-x-0.5 transition-transform">&rarr;</span>
                                            </Link>
                                            
                                            <div className="flex items-center gap-1">
                                                {/* Delete button */}
                                                {user && user.uid === story.userId && (
                                                    <button 
                                                        onClick={() => handleDelete(story.id)}
                                                        className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Delete Story"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}

                                                {/* Like button */}
                                                <button 
                                                    onClick={() => handleLike(story.id)}
                                                    disabled={!user}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed
                                                        ${isLikedByCurrentUser 
                                                            ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400' 
                                                            : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-500 dark:hover:text-red-400'
                                                        }`}
                                                    aria-label="Like story"
                                                >
                                                    <IconHeart 
                                                        className={`w-4 h-4 transition-transform ${isLikedByCurrentUser ? 'fill-current scale-110' : ''}`} 
                                                    />
                                                    {story.likeCount > 0 && <span>{story.likeCount}</span>}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 sm:p-16 text-center">
                        <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200/50 dark:border-amber-800/30">
                            <IconTrophy className="w-7 h-7 text-amber-500 dark:text-amber-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No stories yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
                            Be the first to inspire the MCAverse community by sharing your success story.
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};