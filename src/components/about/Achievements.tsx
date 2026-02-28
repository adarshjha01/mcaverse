// src/components/about/Achievements.tsx
export const Achievements = () => {
    const roles = [
        { title: "Microsoft Learn Student Ambassador", org: "Microsoft", desc: "Lead technical communities and organized events to help students learn Microsoft technologies." },
        { title: "Coding Ninjas Campus Captain", org: "Coding Ninjas", desc: "Promoted coding culture and helping students with programming skills development." },
        { title: "YouTube Content Creator", org: "Adarsh Jha [NIT Kurukshetra]", desc: "Creating educational content for MCA students with 3K+ subscribers." },
    ];

    return (
        <section className="bg-slate-50 dark:bg-slate-900/50 py-12 sm:py-16 lg:py-20 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-slate-900 dark:text-slate-100">Achievements & Roles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {roles.map(role => (
                        <div key={role.title} className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-slate-200 dark:border-slate-700 transition-all duration-300 group">
                            <h3 className="text-lg sm:text-xl font-bold mb-1 text-slate-900 dark:text-slate-100">{role.title}</h3>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-2 sm:mb-3">{role.org}</p>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">{role.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};