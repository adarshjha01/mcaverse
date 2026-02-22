"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const Hero = () => {
    return (
        <section className="relative text-slate-800 dark:text-slate-100 pt-32 pb-32 min-h-screen flex flex-col items-center justify-start bg-white dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
            {/* Glowing Background Beams */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-slate-950 dark:to-slate-950"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] opacity-30 dark:opacity-20 bg-indigo-500 blur-[120px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 container mx-auto px-4 text-center mt-8">
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
                    className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white"
                >
                    Master your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">MCA Prep</span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    Join 5,000+ students actively tracking their accuracy, attempting elite mock tests, and securing top NIT placements.
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                >
                    <Link href="/mock-tests" className="w-full sm:w-auto bg-indigo-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1">
                        Start Practicing Free
                    </Link>
                    <Link href="/videos" className="w-full sm:w-auto bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-semibold px-8 py-3.5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300">
                        Explore Video Lectures
                    </Link>
                </motion.div>
            </div>

            {/* 3D Dashboard Mockup (Aceternity Parallax Style) */}
            <motion.div
                initial={{ rotateX: 20, y: 100, opacity: 0, scale: 0.9 }}
                animate={{ rotateX: 0, y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 1, type: "spring", bounce: 0.3, delay: 0.4 }}
                style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
                className="relative z-20 w-full max-w-5xl mx-auto px-4"
            >
                <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 md:p-4 overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/10">
                    {/* Mock Browser Header */}
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        <div className="ml-4 h-6 w-48 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
                    </div>
                    {/* Mock Dashboard Body */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[300px] md:h-[400px]">
                        <div className="col-span-1 md:col-span-2 bg-slate-50 dark:bg-slate-950 rounded-xl p-6 border border-slate-100 dark:border-slate-800 flex flex-col">
                            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-6"></div>
                            <div className="flex-1 border-b border-dashed border-slate-200 dark:border-slate-800 flex items-end gap-4 pb-4">
                                {[40, 70, 45, 90, 65, 85].map((height, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                                        className="flex-1 bg-indigo-500 dark:bg-indigo-600 rounded-t-md opacity-80"
                                    ></motion.div>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-1 bg-slate-50 dark:bg-slate-950 rounded-xl p-6 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center">
                             <div className="h-32 w-32 rounded-full border-8 border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center relative">
                                 <motion.div 
                                    initial={{ rotate: -90, pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    className="absolute inset-0 rounded-full border-8 border-indigo-500 border-l-transparent border-b-transparent"
                                 ></motion.div>
                                 <span className="text-3xl font-bold text-slate-800 dark:text-white">85%</span>
                             </div>
                             <p className="mt-4 text-sm text-slate-500 font-medium">Global Accuracy</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};