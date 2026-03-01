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
        title: "",
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
        <div className="w-full max-w-2xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm"
            >
                <div className="mb-6">
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">
                        Share Your Story
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Inspire the next generation of MCA aspirants.
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div 
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-10 text-center"
                        >
                            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mb-5 border border-emerald-200/50 dark:border-emerald-800/30">
                                <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                Story Submitted!
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                                {formData.rating >= 4 
                                    ? "Your story has been published! It will appear on the page shortly."
                                    : "Thank you for your feedback. Your response is under review."
                                }
                            </p>
                            <button 
                                onClick={() => { setSuccess(false); setFormData({ name: user?.displayName || "", title: "", quote: "", rating: 5, batch: "" }); }}
                                className="mt-6 text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                            >
                                Submit another
                            </button>
                        </motion.div>
                    ) : (
                        <motion.form 
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onSubmit={handleSubmit} 
                            className="space-y-5"
                        >
                            {/* Star Rating */}
                            <div className="flex flex-col items-center py-2">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                                    Rate your experience
                                </label>
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            className={`transition-all hover:scale-110 active:scale-95 ${formData.rating >= star ? "text-amber-400" : "text-slate-200 dark:text-slate-700"}`}
                                        >
                                            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs font-medium mt-1 text-slate-400 dark:text-slate-500">
                                    {ratingLabels[formData.rating]}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Name */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <IconUserCircle className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            placeholder="Rahul Sharma"
                                        />
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Placement / Rank</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <IconTrophy className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            placeholder="NIT Trichy '26 or AIR 142"
                                        />
                                    </div>
                                </div>

                                {/* Graduation Year */}
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Graduation Year</label>
                                    <input
                                        type="number"
                                        min="2000"
                                        max="2040"
                                        value={formData.batch}
                                        onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        placeholder="e.g. 2026"
                                    />
                                </div>
                            </div>

                            {/* Story */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Your Journey</label>
                                    <span className={`text-[10px] font-medium tabular-nums ${formData.quote.length > maxChars ? 'text-red-500' : formData.quote.length > maxChars * 0.8 ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                        {formData.quote.length}/{maxChars}
                                    </span>
                                </div>
                                <div className="relative group">
                                    <div className="absolute top-3 left-0 pl-3.5 pointer-events-none">
                                        <IconFileText className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <textarea
                                        required
                                        rows={4}
                                        maxLength={maxChars}
                                        value={formData.quote}
                                        onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all outline-none text-sm text-slate-800 dark:text-slate-100 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        placeholder="How did MCAverse help you achieve your goals?"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm py-3.5 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                        Submitting...
                                    </span>
                                ) : "Publish My Story"}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};