// src/components/mock-tests/AvailableExams.tsx
import Link from "next/link";
import React from "react";
import { IconBook, IconArrowRight, IconTrophy, IconTarget } from "@/components/ui/Icons";

const exams = [
    {
        id: 'nimcet',
        name: "NIMCET",
        fullName: "NIT MCA Common Entrance Test",
        description: "Gateway to NITs — Math, Analytical, Computer Awareness & English",
        gradient: "from-blue-500 to-indigo-600",
        lightBg: "bg-blue-50 dark:bg-blue-900/20",
        textColor: "text-blue-600 dark:text-blue-400",
        borderColor: "border-blue-100 dark:border-blue-800",
        stats: { questions: "120", time: "120 min", marks: "1000" },
        icon: <IconTrophy className="w-7 h-7" />,
    },
    {
        id: 'cuet',
        name: "CUET PG MCA",
        fullName: "Common University Entrance Test",
        description: "Ticket to JNU, BHU, DU — Math, Thinking Ability & Computer Basics",
        gradient: "from-emerald-500 to-teal-600",
        lightBg: "bg-emerald-50 dark:bg-emerald-900/20",
        textColor: "text-emerald-600 dark:text-emerald-400",
        borderColor: "border-emerald-100 dark:border-emerald-800",
        stats: { questions: "75", time: "105 min", marks: "300" },
        icon: <IconBook className="w-7 h-7" />,
    },
    {
        id: 'mahmca',
        name: "MAH MCA CET",
        fullName: "Maharashtra MCA Common Entrance Test",
        description: "Top Maharashtra colleges — Reasoning, English & Computer concepts",
        gradient: "from-pink-500 to-rose-600",
        lightBg: "bg-pink-50 dark:bg-pink-900/20",
        textColor: "text-pink-600 dark:text-pink-400",
        borderColor: "border-pink-100 dark:border-pink-800",
        stats: { questions: "100", time: "90 min", marks: "200" },
        icon: <IconTarget className="w-7 h-7" />,
    },
];

export const AvailableExams = () => {
    return (
        <section className="bg-slate-50 dark:bg-slate-900/50 py-16 sm:py-20 transition-colors duration-300 border-t border-slate-100 dark:border-slate-800/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 mb-3">Exam Catalog</span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Available Exams</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-lg mx-auto">Choose your target exam and start practicing with curated mock tests</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                    {exams.map(exam => (
                        <Link key={exam.name} href={`/mock-tests/${exam.id}`} className="group block">
                            <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col">
                                {/* Top gradient bar */}
                                <div className={`h-1.5 bg-gradient-to-r ${exam.gradient}`} />
                                
                                <div className="p-6 sm:p-8 flex flex-col flex-grow">
                                    {/* Icon + Name */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`w-14 h-14 rounded-xl ${exam.lightBg} ${exam.textColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                            {exam.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{exam.name}</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{exam.fullName}</p>
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-grow">{exam.description}</p>
                                    
                                    {/* Stats row */}
                                    <div className="grid grid-cols-3 gap-2 mb-6">
                                        <div className={`text-center p-2.5 rounded-lg ${exam.lightBg} border ${exam.borderColor}`}>
                                            <div className={`text-sm font-bold ${exam.textColor}`}>{exam.stats.questions}</div>
                                            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Questions</div>
                                        </div>
                                        <div className={`text-center p-2.5 rounded-lg ${exam.lightBg} border ${exam.borderColor}`}>
                                            <div className={`text-sm font-bold ${exam.textColor}`}>{exam.stats.time}</div>
                                            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Duration</div>
                                        </div>
                                        <div className={`text-center p-2.5 rounded-lg ${exam.lightBg} border ${exam.borderColor}`}>
                                            <div className={`text-sm font-bold ${exam.textColor}`}>{exam.stats.marks}</div>
                                            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Marks</div>
                                        </div>
                                    </div>
                                    
                                    {/* CTA */}
                                    <div className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r ${exam.gradient} text-white shadow-lg shadow-indigo-200/30 dark:shadow-none group-hover:shadow-xl transition-all`}>
                                        View Tests <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};