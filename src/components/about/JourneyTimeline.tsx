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
        <section className="py-12 sm:py-16 lg:py-20 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-16 text-slate-900 dark:text-slate-100">Journey Timeline</h2>

                {/* Mobile: simple vertical timeline */}
                <div className="md:hidden relative max-w-md mx-auto">
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                    <div className="space-y-6">
                        {timelineEvents.map((event, index) => (
                            <div key={index} className="relative flex items-start gap-4 pl-12">
                                <div className="absolute left-0 top-0 z-10 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-full h-10 w-10 flex items-center justify-center shadow-lg text-sm font-bold">
                                    {event.year.slice(-2)}
                                </div>
                                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex-1">
                                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">{event.year}</p>
                                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-1">{event.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{event.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desktop: alternating zigzag timeline */}
                <div className="hidden md:block relative max-w-2xl mx-auto">
                    <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                    
                    {timelineEvents.map((event, index) => (
                        <div key={index} className="relative mb-10 flex justify-between items-center w-full">
                            {/* Content — alternates side */}
                            <div className={`w-5/12 ${index % 2 !== 0 ? 'order-3 text-left pl-8' : 'text-right pr-8'}`}>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{event.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{event.desc}</p>
                            </div>
                            
                            {/* Dot and Year */}
                            <div className="z-10 flex items-center order-2">
                                <div className="bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-full h-20 w-20 lg:h-24 lg:w-24 flex flex-col items-center justify-center shadow-xl">
                                    <span className="font-bold text-lg lg:text-xl">{event.year}</span>
                                </div>
                            </div>
                            
                            {/* Spacer for the other side */}
                            <div className={`w-5/12 ${index % 2 !== 0 ? '' : 'order-3'}`}></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};