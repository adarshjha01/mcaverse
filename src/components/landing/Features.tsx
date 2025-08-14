// src/components/landing/Features.tsx
import { IconCompass, IconBook, IconUsers, IconTrendingUp } from "@/components/ui/Icons";
import React from "react";

const features = [
    { icon: <IconCompass className="w-8 h-8 text-blue-500" />, title: "Career Guidance", description: "Expert advice for your MCA career path" },
    { icon: <IconBook className="w-8 h-8 text-blue-500" />, title: "Exam Preparation", description: "Mock tests and practice materials" },
    { icon: <IconUsers className="w-8 h-8 text-blue-500" />, title: "Alumni Insights", description: "Learn from successful graduates" },
    { icon: <IconTrendingUp className="w-8 h-8 text-blue-500" />, title: "Industry Trends", description: "Stay updated with latest tech trends" },
];

export const Features = () => {
    return (
        <section className="bg-slate-50 py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-slate-800">Everything You Need for MCA Success</h2>
                    <p className="mt-4 text-lg text-slate-600">From exam preparation to career guidance, we provide comprehensive resources to help you excel in your MCA journey.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-200">
                            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                            <p className="text-slate-500">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};