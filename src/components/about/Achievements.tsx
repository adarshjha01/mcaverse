// src/components/about/Achievements.tsx
export const Achievements = () => {
    const roles = [
        { title: "Microsoft Learn Student Ambassador", org: "Microsoft", desc: "Lead technical communities and organized events to help students learn Microsoft technologies.", accent: "from-blue-400 to-cyan-400" },
        { title: "Coding Ninjas Campus Captain", org: "Coding Ninjas", desc: "Promoted coding culture and helping students with programming skills development.", accent: "from-amber-400 to-orange-400" },
        { title: "YouTube Content Creator", org: "Adarsh Jha [NIT Kurukshetra]", desc: "Creating educational content for MCA students with 3K+ subscribers.", accent: "from-red-400 to-rose-400" },
    ];

    return (
        <section className="bg-slate-50 dark:bg-slate-900/50 py-12 sm:py-16 lg:py-20 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Achievements & Roles</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Milestones along the journey</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    {roles.map(role => (
                        <div key={role.title} className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 hover:border-teal-300 dark:hover:border-teal-800/50 hover:shadow-md transition-all duration-200 relative overflow-hidden">
                            {/* Top gradient bar */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${role.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1 leading-snug">{role.title}</h3>
                            <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium mb-2">{role.org}</p>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{role.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};