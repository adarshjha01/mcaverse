// src/components/about/Achievements.tsx
export const Achievements = () => {
    const roles = [
        { title: "Microsoft Learn Student Ambassador", org: "Microsoft", desc: "Lead technical communities and organized events to help students learn Microsoft technologies." },
        { title: "Coding Ninjas Campus Captain", org: "Coding Ninjas", desc: "Promoted coding culture and helping students with programming skills development." },
        { title: "YouTube Content Creator", org: "Adarsh Jha [NIT Kurukshetra]", desc: "Creating educational content for MCA students with 3K+ subscribers." },
    ];

    return (
        <section className="bg-slate-50 py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Achievements & Roles</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {roles.map(role => (
                        <div key={role.title} className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                            <h3 className="text-xl font-bold mb-1">{role.title}</h3>
                            <p className="text-sm text-slate-500 mb-3">{role.org}</p>
                            <p className="text-slate-600">{role.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};