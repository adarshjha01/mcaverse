"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [editingStory, setEditingStory] = useState<Story | null>(null);
    const [editForm, setEditForm] = useState({ name: '', title: '', content: '', batch: '', rating: 5 });
    const [editLoading, setEditLoading] = useState(false);

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

    const openEditModal = (story: Story) => {
        setEditingStory(story);
        setEditForm({
            name: story.name,
            title: story.title,
            content: story.content,
            batch: story.batch,
            rating: story.rating,
        });
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStory || !user) return;
        setEditLoading(true);

        try {
            const token = await user.getIdToken();
            const res = await fetch(`/api/success-stories/${editingStory.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(editForm),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to update');
            }

            const data = await res.json();

            // Update the story in optimistic state
            setOptimisticStories(current =>
                current.map(s => {
                    if (s.id === editingStory.id) {
                        return {
                            ...s,
                            name: editForm.name,
                            title: editForm.title,
                            content: editForm.content,
                            batch: editForm.batch,
                            rating: editForm.rating,
                        };
                    }
                    return s;
                }).filter(s => {
                    // If rating dropped below 4, it may no longer be approved — remove from list
                    if (s.id === editingStory.id && !data.isApproved) return false;
                    return true;
                })
            );

            setEditingStory(null);
        } catch (error: any) {
            console.error("Failed to edit story:", error);
            alert(error.message || "Failed to update story. Please try again.");
        } finally {
            setEditLoading(false);
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
                                                {/* Edit button */}
                                                {user && user.uid === story.userId && (
                                                    <button 
                                                        onClick={() => openEditModal(story)}
                                                        className="p-2 text-slate-300 dark:text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                                                        title="Edit Story"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                )}

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

            {/* --- EDIT MODAL --- */}
            <AnimatePresence>
                {editingStory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setEditingStory(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-800 p-6 relative max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setEditingStory(null)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Edit Your Story</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Update your experience and inspire others.</p>

                            <form onSubmit={handleEditSubmit} className="space-y-5">
                                {/* Star Rating */}
                                <div className="flex flex-col items-center py-1">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                                        Rating
                                    </label>
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setEditForm({ ...editForm, rating: star })}
                                                className={`transition-all hover:scale-110 active:scale-95 ${editForm.rating >= star ? "text-amber-400" : "text-slate-200 dark:text-slate-700"}`}
                                            >
                                                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Name */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all outline-none text-sm text-slate-800 dark:text-slate-100"
                                        />
                                    </div>

                                    {/* Title / Rank */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Placement / Rank</label>
                                        <input
                                            type="text"
                                            required
                                            value={editForm.title}
                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all outline-none text-sm text-slate-800 dark:text-slate-100"
                                        />
                                    </div>

                                    {/* Batch */}
                                    <div className="space-y-1.5 sm:col-span-2">
                                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Graduation Year</label>
                                        <input
                                            type="number"
                                            min="2000"
                                            max="2040"
                                            value={editForm.batch}
                                            onChange={(e) => setEditForm({ ...editForm, batch: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all outline-none text-sm text-slate-800 dark:text-slate-100"
                                            placeholder="e.g. 2026"
                                        />
                                    </div>
                                </div>

                                {/* Story content */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Your Story</label>
                                        <span className={`text-[10px] font-medium tabular-nums ${editForm.content.length > 500 ? 'text-red-500' : editForm.content.length > 400 ? 'text-amber-500' : 'text-slate-400'}`}>
                                            {editForm.content.length}/500
                                        </span>
                                    </div>
                                    <textarea
                                        required
                                        rows={5}
                                        maxLength={500}
                                        value={editForm.content}
                                        onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all outline-none text-sm text-slate-800 dark:text-slate-100 resize-none"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setEditingStory(null)}
                                        className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editLoading}
                                        className="flex-1 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {editLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                                Saving...
                                            </span>
                                        ) : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};