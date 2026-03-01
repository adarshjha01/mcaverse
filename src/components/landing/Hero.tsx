// src/components/landing/Hero.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RoadToNIT } from './RoadToNIT';
import { IconSparkles } from '@/components/ui/Icons';

export const Hero = () => {
    return (
        <section className="relative text-slate-800 dark:text-slate-100 pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 min-h-screen flex flex-col items-center justify-start bg-white dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 via-white to-white dark:from-indigo-950/20 dark:via-slate-950 dark:to-slate-950" />
            {/* Decorative blur orbs */}
            <div className="absolute top-0 left-1/4 w-[400px] h-[300px] opacity-20 dark:opacity-10 bg-indigo-400 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-20 right-1/4 w-[300px] h-[200px] opacity-15 dark:opacity-[0.07] bg-purple-400 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 container mx-auto px-4 text-center mt-6 sm:mt-10">
                {/* Badge */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 border border-indigo-200/60 dark:border-indigo-800/50"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 dark:bg-indigo-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600 dark:bg-indigo-400" />
                    </span>
                    Now Live: NIMCET 2026 Mock Tests
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 sm:mb-5 text-slate-900 dark:text-white"
                >
                    Step into the{' '}
                    <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                        MCAverse
                        <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 5.5C40 2 80 2 100 3.5C120 5 160 5 199 2" stroke="url(#underline-grad)" strokeWidth="2" strokeLinecap="round" />
                            <defs><linearGradient id="underline-grad" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#a855f7"/></linearGradient></defs>
                        </svg>
                    </span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed"
                >
                    Join 5,000+ students actively tracking their accuracy, attempting elite mock tests, and securing top NIT placements.
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 sm:mb-8"
                >
                    <Link href="/mock-tests" className="w-full sm:w-auto bg-indigo-600 text-white font-semibold px-7 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-200 active:scale-[0.97] text-sm sm:text-base">
                        Start Practicing Free
                    </Link>
                    <Link href="/videos" className="w-full sm:w-auto bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold px-7 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800/50 hover:shadow-md transition-all duration-200 active:scale-[0.97] text-sm sm:text-base">
                        Explore Video Lectures
                    </Link>
                </motion.div>

                {/* Trust stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-slate-500 dark:text-slate-500 mb-8 sm:mb-12"
                >
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white">5K+</span> Students
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white">500+</span> Questions
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white">100%</span> Free
                    </div>
                </motion.div>
            </div>

            {/* RoadToNIT visual */}
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative z-20 w-full px-2 sm:px-4 pb-6 sm:pb-10"
            >
                <RoadToNIT />
            </motion.div>
        </section>
    );
};