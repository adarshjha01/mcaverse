// src/app/dpp/page.tsx
"use client";

import { useState, useCallback } from 'react';
import { DailyPractice } from "@/components/practice/DailyPractice";
import { Leaderboard } from "@/components/practice/Leaderboard";
import { IconFlame } from "@/components/ui/Icons";

export default function DailyPracticePage() {
    const [leaderboardKey, setLeaderboardKey] = useState(0);
    const handleStreakUpdate = useCallback(() => {
        // Small delay so Firestore write is committed before re-fetching
        setTimeout(() => setLeaderboardKey(k => k + 1), 800);
    }, []);

    return (
        <main className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Header Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-14 sm:py-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(99,102,241,0.3),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_50%)]" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center justify-center p-3.5 bg-white/10 backdrop-blur-sm rounded-2xl mb-5 ring-1 ring-white/20">
                        <IconFlame className="w-7 h-7 sm:w-9 sm:h-9 text-orange-400" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Daily Quest</h1>
                    <p className="text-indigo-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Consistency is the key to cracking MCA entrances. Solve one problem every day, keep your streak alive, and climb the leaderboard.
                    </p>
                </div>
            </section>

            {/* Practice Section */}
            <div className="container mx-auto px-4 py-8 sm:py-12 -mt-6 sm:-mt-12">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Main question area */}
                        <div className="lg:col-span-3">
                            <DailyPractice onStreakUpdate={handleStreakUpdate} />
                            <p className="mt-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                                New question drops every day at midnight.
                            </p>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* How it works card */}
                            <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">How It Works</h3>
                                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                    <li className="flex items-start gap-3">
                                        <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold inline-flex items-center justify-center">1</span>
                                        <span>A new question appears every day at midnight</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold inline-flex items-center justify-center">2</span>
                                        <span>Wrong answer? No worries — retry until you get it right!</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-xs font-bold inline-flex items-center justify-center">3</span>
                                        <span>Correct answer adds to your streak — climb the board!</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold inline-flex items-center justify-center">4</span>
                                        <span>Miss a day entirely? Streak resets to 0 — stay consistent!</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Streak Leaderboard */}
                            <Leaderboard refreshKey={leaderboardKey} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}