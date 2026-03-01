// src/components/landing/Hero.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RoadToNIT } from './RoadToNIT'; // <-- Import the new component

export const Hero = () => {
    return (
        <section className="relative text-slate-800 dark:text-slate-100 pt-20 sm:pt-24 md:pt-32 pb-10 sm:pb-16 min-h-screen flex flex-col items-center justify-start bg-white dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
            {/* Glowing Background Beams */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-slate-950 dark:to-slate-950"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[250px] sm:h-[400px] opacity-30 dark:opacity-20 bg-indigo-500 blur-[120px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 container mx-auto px-4 text-center mt-4 sm:mt-8">
                {/* Badge */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-semibold mb-8 border border-indigo-100 dark:border-indigo-800/50"
                >
                    <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-ping"></span>
                    Now Live: NIMCET 2026 Mock Tests
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6 text-slate-900 dark:text-white"
                >
                    Step into the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">MCAverse</span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    Join 5,000+ students actively tracking their accuracy, attempting elite mock tests, and securing top NIT placements.
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-16"
                >
                    <Link href="/mock-tests" className="w-full sm:w-auto bg-indigo-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1">
                        Start Practicing Free
                    </Link>
                    <Link href="/videos" className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-green-500/30 hover:from-emerald-600 hover:to-green-600 hover:shadow-green-500/50 transition-all duration-300 transform hover:-translate-y-1">
                        Explore Video Lectures
                    </Link>
                </motion.div>
            </div>

            {/* Replaced Graph with Animated RoadToNIT Component */}
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative z-20 w-full px-2 sm:px-4 pb-8 sm:pb-16"
            >
                <RoadToNIT />
            </motion.div>
        </section>
    );
};