import { IconCompass, IconBook, IconUsers, IconTrendingUp } from "@/components/ui/Icons";
import React from "react";

const features = [
    { icon: <IconCompass className="w-8 h-8 text-blue-600 dark:text-blue-400" />, title: "Career Guidance", description: "Expert advice for your MCA career path" },
    { icon: <IconBook className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />, title: "Exam Preparation", description: "Mock tests and practice materials" },
    { icon: <IconUsers className="w-8 h-8 text-purple-600 dark:text-purple-400" />, title: "Alumni Insights", description: "Learn from successful graduates" },
    { icon: <IconTrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />, title: "Industry Trends", description: "Stay updated with latest tech trends" },
];

export const Features = () => {
    return (
        <section className="bg-slate-50 dark:bg-slate-950 py-24 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Everything You Need for MCA Success
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        From exam preparation to career guidance, we provide comprehensive resources to help you excel in your MCA journey.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-slate-800 group">
                            <div className="bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};