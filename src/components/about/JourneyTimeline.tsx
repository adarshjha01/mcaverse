// src/components/about/JourneyTimeline.tsx
export const JourneyTimeline = () => {
    const timelineEvents = [
        { year: "2019", title: "Started MCA Journey", desc: "Began MCA program with a passion for technology and education" },
        { year: "2020", title: "First YouTube Video", desc: "Published first educational video, starting the MCAverse channel" },
        { year: "2021", title: "Microsoft Learn Student Ambassador", desc: "Selected as Microsoft Learn Student Ambassador" },
        { year: "2022", title: "GDSC Lead Selection", desc: "Appointed as Google Developer Student Club Lead" },
        { year: "2023", title: "Multiple Ambassador Roles", desc: "Became Campus Ambassador for Coding Ninjas, ISB, and Unstop" },
        { year: "2024", title: "MCAverse Platform Launch", desc: "Launched comprehensive MCAverse educational platform" },
    ];

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-16">Journey Timeline</h2>
                <div className="relative max-w-2xl mx-auto">
                    {/* The vertical line */}
                    <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-slate-200"></div>
                    
                    {timelineEvents.map((event, index) => (
                        <div key={index} className="relative mb-8 flex justify-between items-center w-full">
                            {/* Content Left */}
                            <div className={`w-5/12 ${index % 2 !== 0 ? 'order-3' : ''}`}>
                                <div className="text-right pr-8">
                                    <h3 className="font-bold text-lg">{event.title}</h3>
                                    <p className="text-slate-600">{event.desc}</p>
                                </div>
                            </div>
                            
                            {/* Dot and Year */}
                            <div className="z-10 flex items-center order-2">
                                <div className="bg-slate-800 text-white rounded-full h-24 w-24 flex flex-col items-center justify-center shadow-xl">
                                    <span className="font-bold text-xl">{event.year}</span>
                                </div>
                            </div>
                            
                            {/* Spacer for the other side */}
                            <div className="w-5/12"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};