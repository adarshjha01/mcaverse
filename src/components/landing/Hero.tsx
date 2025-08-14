// src/components/landing/Hero.tsx
import React from 'react';
import Image from 'next/image'; // Import the Image component

const Hero = () => {
    const stats = [
        { value: "5000+", label: "Students" },
        { value: "100+", label: "Mock Tests" },
        { value: "50+", label: "Video Tutorials" },
        { value: "98%", label: "Success Rate" },
    ];

    return (
        <section id="home" className="relative text-white pt-32 pb-20 min-h-screen flex items-center justify-center">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-900 to-slate-900 opacity-90"></div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div>

            <div className="relative z-10 container mx-auto px-4 text-center">
                {/* --- THIS IS THE UPDATED LOGO SECTION --- */}
                <div className="mb-8">
                    <Image 
                        src="/mcaverse-logo.png" 
                        alt="MCAverse Logo"
                        width={80} // w-20 in Tailwind is 80px
                        height={80} // h-20 in Tailwind is 80px
                        className="mx-auto rounded-full" // Added rounded-full
                    />
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
                    MCAverse
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 mb-6 max-w-3xl mx-auto">
                    Guiding MCA Aspirants & Graduates to Success
                </p>
                <p className="text-lg text-slate-400 mb-12 max-w-3xl mx-auto">
                    Your comprehensive platform for MCA exam preparation, career guidance, and professional growth in the tech industry.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <a href="#" className="w-full sm:w-auto bg-white text-slate-900 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-slate-200 transition-all duration-300 transform hover:scale-105">
                        Explore Content
                    </a>
                    <a href="#" className="w-full sm:w-auto bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105">
                        Join Community
                    </a>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-4xl font-bold text-white">{stat.value}</p>
                            <p className="text-slate-400">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
