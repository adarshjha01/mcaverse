import { IconCompass, IconBook, IconUsers, IconTrendingUp } from "@/components/ui/Icons";
import React from "react";

const features = [
    { icon: <IconCompass className="w-6 h-6" />, title: "Career Guidance", description: "Expert advice for your MCA career path", accent: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", border: "hover:border-blue-300 dark:hover:border-blue-800/50", gradient: "from-blue-400 to-cyan-400" },
    { icon: <IconBook className="w-6 h-6" />, title: "Exam Preparation", description: "Mock tests and practice materials", accent: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20", border: "hover:border-indigo-300 dark:hover:border-indigo-800/50", gradient: "from-indigo-400 to-purple-400" },
    { icon: <IconUsers className="w-6 h-6" />, title: "Alumni Insights", description: "Learn from successful graduates", accent: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20", border: "hover:border-purple-300 dark:hover:border-purple-800/50", gradient: "from-purple-400 to-pink-400" },
    { icon: <IconTrendingUp className="w-6 h-6" />, title: "Industry Trends", description: "Stay updated with latest tech trends", accent: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "hover:border-emerald-300 dark:hover:border-emerald-800/50", gradient: "from-emerald-400 to-teal-400" },
];

export const Features = () => {
    return (
        <section className="bg-slate-50 dark:bg-slate-950 py-16 sm:py-20 lg:py-24 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10 sm:mb-14">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
                        Everything You Need for MCA Success
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        From exam preparation to career guidance, we provide comprehensive resources to help you excel in your MCA journey.
                    </p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-5xl mx-auto">
                    {features.map((feature, index) => (
                        <div key={index} className={`group relative overflow-hidden bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 ${feature.border} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
                            {/* Gradient top bar */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                            <div className={`${feature.bg} rounded-xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4 ${feature.accent} group-hover:scale-110 transition-all duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};