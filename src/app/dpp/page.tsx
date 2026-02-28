// src/app/dpp/page.tsx
import { DailyPractice } from "@/components/practice/DailyPractice";
import { Leaderboard } from "@/components/practice/Leaderboard";
import { IconFlame } from "@/components/ui/Icons";

export default function DailyPracticePage() {
    return (
        <main className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Header Section */}
            <section className="bg-indigo-900 text-white py-12 sm:py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-800 rounded-full mb-4">
                        <IconFlame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Daily Quest</h1>
                    <p className="text-indigo-200 text-base sm:text-lg max-w-2xl mx-auto">
                        Consistency is the key to cracking MCA entrances. Solve one problem every day, keep your streak alive, and climb the leaderboard.
                    </p>
                </div>
            </section>

            {/* Practice Section */}
            <div className="container mx-auto px-4 py-8 sm:py-12 -mt-4 sm:-mt-10">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Main question area */}
                        <div className="lg:col-span-3">
                            <DailyPractice />
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
                                        <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold inline-flex items-center justify-center">2</span>
                                        <span>Answer correctly to keep your streak alive</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold inline-flex items-center justify-center">3</span>
                                        <span>Earn points and climb the leaderboard</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold inline-flex items-center justify-center">4</span>
                                        <span>Miss a day? Streak resets — stay consistent!</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Leaderboard */}
                            <Leaderboard />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}