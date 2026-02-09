import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const Hero = () => {
    const stats = [
        { value: "5000+", label: "Students" },
        { value: "100+", label: "Mock Tests" },
        { value: "50+", label: "Video Tutorials" },
        { value: "98%", label: "Success Rate" },
    ];

    return (
        // Added dark:bg-slate-950 and dark:text-white
        <section id="home" className="relative text-slate-800 dark:text-slate-100 pt-32 pb-20 min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-300">
            {/* Adjusted gradient for dark mode */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5 dark:opacity-[0.02]"></div>
            
            <div className="relative z-10 container mx-auto px-4 text-center">
                <div className="mb-8">
                    <Image src="/mcaverse-logo.png" alt="MCAverse Logo" width={80} height={80} className="mx-auto rounded-full" />
                </div>
                {/* Fixed text colors with dark: modifiers */}
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
                    MCAverse
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-6 max-w-3xl mx-auto">
                    Guiding MCA Aspirants & Graduates to Success
                </p>
                <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-3xl mx-auto">
                    Your comprehensive platform for MCA exam preparation, career guidance, and professional growth in the tech industry.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <Link href="/videos" className="w-full sm:w-auto bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105">
                        Explore Content
                    </Link>
                    {/* Fixed secondary button for dark mode */}
                    <Link href="/community" className="w-full sm:w-auto bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-all duration-300 transform hover:scale-105">
                        Join Community
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-4xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                            <p className="text-slate-500 dark:text-slate-400">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};