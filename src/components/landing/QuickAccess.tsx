import Link from "next/link";
import React from "react";
import { IconTarget, IconVideo, IconTrophy, IconFlame } from "@/components/ui/Icons";

const accessLinks = [
    { 
        icon: <IconTarget className="w-5 h-5" />, 
        title: "Mock Tests", 
        description: "Practice with NIMCET, CUET PG MCA, and MAH MCA CET mock tests.", 
        linkText: "Start Practice", 
        href: "/mock-tests",
        accent: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "hover:border-blue-300 dark:hover:border-blue-800/50",
        gradient: "from-blue-400 to-cyan-400",
    },
    { 
        icon: <IconFlame className="w-5 h-5" />, 
        title: "Daily Practice", 
        description: "Solve one problem every day to build consistent preparation habits.", 
        linkText: "Today\u2019s Problem", 
        href: "/dpp",
        accent: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-900/20",
        border: "hover:border-amber-300 dark:hover:border-amber-800/50",
        gradient: "from-amber-400 to-orange-400",
    },
    { 
        icon: <IconVideo className="w-5 h-5" />, 
        title: "Video Tutorials", 
        description: "Learn with comprehensive video courses covering the full MCA syllabus.", 
        linkText: "Watch Now", 
        href: "/videos",
        accent: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        border: "hover:border-emerald-300 dark:hover:border-emerald-800/50",
        gradient: "from-emerald-400 to-teal-400",
    },
    { 
        icon: <IconTrophy className="w-5 h-5" />, 
        title: "Success Stories", 
        description: "Read inspiring stories from students who cracked top MCA entrances.", 
        linkText: "Explore", 
        href: "/success-stories",
        accent: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-50 dark:bg-purple-900/20",
        border: "hover:border-purple-300 dark:hover:border-purple-800/50",
        gradient: "from-purple-400 to-pink-400",
    },
];

export const QuickAccess = () => {
    return (
        <section className="bg-slate-50 dark:bg-slate-950 py-16 sm:py-20 lg:py-24 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10 sm:mb-14">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Quick Access</h2>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Jump right into what matters most</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-5xl mx-auto">
                    {accessLinks.map((link, index) => (
                        <div key={index} className={`group relative bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 ${link.border} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden`}>
                            {/* Top gradient accent bar */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${link.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                            
                            <div className={`${link.bg} rounded-xl w-10 h-10 flex items-center justify-center mb-3 sm:mb-4 ${link.accent} group-hover:scale-110 transition-all duration-300`}>
                                {link.icon}
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">
                                {link.title}
                            </h3>
                            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 flex-grow mb-3 sm:mb-4 leading-relaxed">
                                {link.description}
                            </p>
                            <Link href={link.href} className={`inline-flex items-center text-xs sm:text-sm font-semibold ${link.accent} transition-colors`}>
                                {link.linkText}
                                <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};