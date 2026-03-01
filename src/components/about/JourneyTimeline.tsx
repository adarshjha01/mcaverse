// src/components/about/JourneyTimeline.tsx
export const JourneyTimeline = () => {
    const timelineEvents = [
        { year: "2021", title: "Started NIMCET Preparation", desc: "Discovered the monopoly of coaching institutes during NIMCET prep." },
        { year: "2022", title: "First YouTube Video", desc: "Published first YouTube video after earning a seat at NIT Kurukshetra through self-study." },
        { year: "2023", title: "Microsoft Learn Student Ambassador", desc: "Selected as a representative for Microsoft at NIT Kurukshetra." },
        { year: "2024", title: "Multiple Ambassador Roles", desc: "Became Campus Ambassador for Coding Ninjas, ISB, and Unstop." },
        { year: "2025", title: "MCAverse Platform Launch", desc: "Launched comprehensive MCAverse educational platform." },
    ];

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10 sm:mb-14">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">The Journey</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">From self-study to building MCAverse</p>
                </div>

                {/* Unified timeline — works on all screens */}
                <div className="relative max-w-2xl mx-auto">
                    {/* Vertical line */}
                    <div className="absolute left-[22px] sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-300 via-cyan-300 to-emerald-300 dark:from-teal-800 dark:via-cyan-800 dark:to-emerald-800" />

                    <div className="space-y-8 sm:space-y-10">
                        {timelineEvents.map((event, index) => (
                            <div key={index} className="relative flex items-start sm:items-center">
                                {/* Desktop: alternating layout */}
                                <div className={`hidden sm:flex w-full items-center ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                                    {/* Content side */}
                                    <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-teal-300 dark:hover:border-teal-800/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                            <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">{event.year}</p>
                                            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{event.title}</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{event.desc}</p>
                                        </div>
                                    </div>

                                    {/* Center dot with year */}
                                    <div className="flex-shrink-0 z-10 w-12 h-12 rounded-full bg-teal-500 dark:bg-teal-600 text-white font-bold text-[11px] flex items-center justify-center shadow-md border-4 border-white dark:border-slate-950">
                                        {event.year}
                                    </div>

                                    {/* Spacer side */}
                                    <div className="w-5/12" />
                                </div>

                                {/* Mobile layout */}
                                <div className="flex sm:hidden items-start gap-4 pl-14 w-full">
                                    {/* Dot with year */}
                                    <div className="absolute left-0 top-0 z-10 w-12 h-12 rounded-full bg-teal-500 dark:bg-teal-600 text-white font-bold text-[11px] flex items-center justify-center shadow-md border-4 border-white dark:border-slate-950">
                                        {event.year}
                                    </div>
                                    {/* Card */}
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex-1 hover:border-teal-300 dark:hover:border-teal-800/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">{event.year}</p>
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{event.title}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{event.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};