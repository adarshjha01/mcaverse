"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { 
    IconUserCircle, 
    IconTrophy, 
    IconFileText 
} from "@/components/ui/Icons";

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

export const ShareJourneyForm = ({ onStoryAdded }: { onStoryAdded?: (story: Story) => void }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        name: user?.displayName || "",
        title: "", // e.g., "NIT Trichy '26" or "AIR 142"
        quote: "",
        rating: 5,
        batch: "",
    });

    const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];
    const maxChars = 500;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = await user?.getIdToken();
            // Assuming you have this standard API route set up
            const res = await fetch("/api/success-stories", {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
                body: JSON.stringify({
                    ...formData,
                    userId: user?.uid || "anonymous",
                    photoURL: user?.photoURL || null,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setSuccess(true);
                // Optimistically add the story to the list if it was auto-approved (rating >= 4)
                if (data.isApproved && onStoryAdded) {
                    onStoryAdded({
                        id: data.id,
                        name: formData.name,
                        batch: formData.batch,
                        title: formData.title,
                        content: formData.quote,
                        imageUrl: user?.photoURL || null,
                        likeCount: 0,
                        likes: [],
                        rating: formData.rating,
                        userId: user?.uid || "anonymous",
                    });
                }
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting story:", error);
            alert("Failed to submit story.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto relative">
            
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 blur-3xl rounded-[3rem] -z-10"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl"
            >
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                        Share Your Success
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Inspire the next generation of MCA aspirants by sharing your journey.
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div 
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-12 text-center"
                        >
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                                <IconTrophy className="w-10 h-10 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            You&apos;re a Legend!
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                                {formData.rating >= 4 
                                    ? "Thank you for sharing your journey! Your story has been published and will be featured on our Success Stories page and testimonials."
                                    : "Thank you for your feedback! Your response has been recorded and is under review."
                                }
                            </p>
                            <button 
                                onClick={() => setSuccess(false)}
                                className="mt-8 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                            >
                                Submit another response
                            </button>
                        </motion.div>
                    ) : (
                        <motion.form 
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onSubmit={handleSubmit} 
                            className="space-y-6"
                        >
                            {/* Interactive 5-Star Rating */}
                            <div className="flex flex-col items-center mb-8">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">
                                    Rate your experience
                                </label>

                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            className={`transition-all hover:scale-110 ${formData.rating >= star ? "text-amber-500" : "text-slate-300 dark:text-slate-700"}`}
                                        >
                                            <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-sm font-semibold mt-1 text-slate-500 dark:text-slate-400">
                                    {ratingLabels[formData.rating]}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <IconUserCircle className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-800 dark:text-slate-100"
                                            placeholder="Rahul Sharma"
                                        />
                                    </div>
                                </div>

                                {/* Title/College Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Placement / Rank</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <IconTrophy className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-800 dark:text-slate-100"
                                            placeholder="NIT Trichy '26 or AIR 142"
                                        />
                                    </div>
                                </div>

                                {/* Graduation Year */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Graduation Year</label>
                                    <input
                                        type="number"
                                        min="2000"
                                        max="2040"
                                        value={formData.batch}
                                        onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-800 dark:text-slate-100"
                                        placeholder="e.g. 2026"
                                    />
                                </div>
                            </div>

                            {/* Story Textarea */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Your Journey</label>
                                    <span className={`text-xs font-medium ${formData.quote.length > maxChars ? 'text-red-500' : formData.quote.length > maxChars * 0.8 ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'}`}>
                                        {formData.quote.length}/{maxChars}
                                    </span>
                                </div>
                                <div className="relative group">
                                    <div className="absolute top-3 left-0 pl-4 pointer-events-none">
                                        <IconFileText className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <textarea
                                        required
                                        rows={4}
                                        maxLength={maxChars}
                                        value={formData.quote}
                                        onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-800 dark:text-slate-100 resize-none"
                                        placeholder="How did MCAverse help you achieve your goals?"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full relative overflow-hidden group bg-indigo-600 text-white font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.7)] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                {loading ? "Submitting..." : "Publish My Story"}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};