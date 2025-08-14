// src/components/landing/QuickAccess.tsx
import Link from "next/link";
import React from "react";
import { IconTarget, IconVideo, IconBriefcase, IconZap } from "@/components/ui/Icons";

const accessLinks = [
    { icon: <IconTarget className="w-8 h-8 text-blue-600" />, title: "Mock Tests", description: "Practice with NIMCET, CUET PG MCA, and MAH MCA CET mock tests", linkText: "Start Practice", href: "/mock-tests" },
    { icon: <IconZap className="w-8 h-8 text-green-600" />, title: "Video Tutorials", description: "Learn with our comprehensive video courses and tutorials", linkText: "Watch Now", href: "/videos" },
    { icon: <IconBriefcase className="w-8 h-8 text-purple-600" />, title: "Career Hub", description: "Get career guidance, internships, and industry insights", linkText: "Explore", href: "/career-hub" },
];

export const QuickAccess = () => {
    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-slate-800">Quick Access</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {accessLinks.map((link, index) => (
                        <div key={index} className="bg-slate-50 p-8 rounded-xl shadow-lg border border-slate-200 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className={`rounded-full w-16 h-16 flex items-center justify-center mb-6 ${
                                index === 0 ? 'bg-blue-100' : index === 1 ? 'bg-green-100' : 'bg-purple-100'
                            }`}>
                                {link.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">{link.title}</h3>
                            <p className="text-slate-600 flex-grow mb-6">{link.description}</p>
                            <Link href={link.href} className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                                {link.linkText} &rarr;
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
