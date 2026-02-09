import Link from "next/link";
import React from "react";
import { IconTarget, IconVideo, IconBriefcase, IconZap, IconTrophy } from "@/components/ui/Icons";

const accessLinks = [
    { 
        icon: <IconTarget className="w-8 h-8 text-blue-600 dark:text-blue-400" />, 
        title: "Mock Tests", 
        description: "Practice with NIMCET, CUET PG MCA, and MAH MCA CET mock tests", 
        linkText: "Start Practice", 
        href: "/mock-tests",
        bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    { 
        icon: <IconZap className="w-8 h-8 text-amber-600 dark:text-amber-400" />, 
        title: "Video Tutorials", 
        description: "Learn with our comprehensive video courses and tutorials", 
        linkText: "Watch Now", 
        href: "/videos",
        bgColor: "bg-amber-50 dark:bg-amber-900/20"
    },
    { 
        icon: <IconTrophy className="w-8 h-8 text-purple-600 dark:text-purple-400" />, 
        title: "Success Stories", 
        description: "Read Success Stories of MCA students", 
        linkText: "Explore", 
        href: "/success-stories",
        bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
];

export const QuickAccess = () => {
    return (
        <section className="bg-white dark:bg-slate-900 py-24 transition-colors duration-300 border-t border-slate-100 dark:border-slate-800">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Quick Access</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {accessLinks.map((link, index) => (
                        <div key={index} className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                            <div className={`rounded-2xl w-16 h-16 flex items-center justify-center mb-6 ${link.bgColor} transition-colors`}>
                                {link.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                {link.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 flex-grow mb-6 leading-relaxed">
                                {link.description}
                            </p>
                            <Link href={link.href} className="inline-flex items-center font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                                {link.linkText} 
                                <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};