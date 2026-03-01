"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    IconUserCircle, 
    IconMail, 
    IconFileText,
    IconMic,
    IconLink
} from "@/components/ui/Icons";

export const GuestApplicationForm = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        social: "",
        topic: "",
    });

    const maxTopicChars = 500;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/guest-application", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSuccess(true);
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting application:", error);
            alert("Failed to submit application.");
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
                        Be Our Next Guest
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Have a unique journey or insight? Apply to be featured on the podcast.
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
                                <IconMic className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                Application Received!
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                                Thank you for your interest! We&apos;ll review your profile and reach out to you via email soon.
                            </p>
                            <button 
                                onClick={() => {
                                    setSuccess(false);
                                    setFormData({ name: "", email: "", social: "", topic: "" });
                                }}
                                className="mt-6 text-sm text-violet-600 dark:text-violet-400 font-semibold hover:underline"
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Name */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <IconUserCircle className="w-4 h-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 dark:focus:border-violet-500 transition-all outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            placeholder="Rahul Sharma"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <IconMail className="w-4 h-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 dark:focus:border-violet-500 transition-all outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            placeholder="rahul@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* LinkedIn / Portfolio */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">LinkedIn / Portfolio</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <IconLink className="w-4 h-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                                    </div>
                                    <input
                                        type="url"
                                        required
                                        value={formData.social}
                                        onChange={(e) => setFormData({ ...formData, social: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 dark:focus:border-violet-500 transition-all outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        placeholder="https://linkedin.com/in/rahul"
                                    />
                                </div>
                            </div>

                            {/* Topic */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">What would you like to discuss?</label>
                                    <span className={`text-[10px] font-medium tabular-nums ${formData.topic.length > maxTopicChars ? 'text-red-500' : formData.topic.length > maxTopicChars * 0.8 ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                        {formData.topic.length}/{maxTopicChars}
                                    </span>
                                </div>
                                <div className="relative group">
                                    <div className="absolute top-3 left-0 pl-3.5 pointer-events-none">
                                        <IconFileText className="w-4 h-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                                    </div>
                                    <textarea
                                        required
                                        rows={4}
                                        maxLength={maxTopicChars}
                                        value={formData.topic}
                                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 dark:focus:border-violet-500 transition-all outline-none text-sm text-slate-800 dark:text-slate-100 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        placeholder="Share a brief overview of topics or experiences you'd like to discuss..."
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
                                        Sending...
                                    </span>
                                ) : "Submit Application"}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};