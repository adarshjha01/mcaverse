// src/components/about/ValuesMissionVision.tsx
export const ValuesMissionVision = () => {
    const values = [
        { title: "Education for All", desc: "Making quality MCA education accessible to every student regardless of background." },
        { title: "Community Building", desc: "Creating supportive communities where students can learn and grow together." },
        { title: "Practical Learning", desc: "Focusing on practical skills and real-world applications over theoretical knowledge." },
        { title: "Continuous Growth", desc: "Believing in continuous learning and adaptation to new technologies and trends." },
    ];

    return (
        <section className="bg-slate-50 dark:bg-slate-900/50 py-12 sm:py-16 lg:py-20 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Our Values</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">The principles that drive everything we do</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-14 max-w-4xl mx-auto">
                    {values.map(value => (
                        <div key={value.title} className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl text-center border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-800/50 hover:shadow-md transition-all duration-200">
                            <h3 className="font-bold text-xs sm:text-sm mb-1 text-slate-900 dark:text-white">{value.title}</h3>
                            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{value.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                    <div className="relative bg-white dark:bg-slate-900 p-5 sm:p-6 lg:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-800/50 hover:shadow-md transition-all duration-200 overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-cyan-400" />
                        <h3 className="text-lg sm:text-xl font-extrabold mb-2 sm:mb-3 text-slate-900 dark:text-white">Our Mission</h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">To empower every MCA and BCA student &mdash; from aspirants to professionals &mdash; with free, high-quality education, practical guidance, and a supportive community. We simplify every &ldquo;what to do&rdquo; and &ldquo;how to do,&rdquo; bridging the gap between academic learning and real-world requirements, so every student, regardless of background, can confidently navigate their journey and achieve their goals.</p>
                    </div>
                    <div className="relative bg-white dark:bg-slate-900 p-5 sm:p-6 lg:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-800/50 hover:shadow-md transition-all duration-200 overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />
                        <h3 className="text-lg sm:text-xl font-extrabold mb-2 sm:mb-3 text-slate-900 dark:text-white">Our Vision</h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">To become India&apos;s leading one-stop platform for MCA and BCA students, shaping a generation of learners who are not just exam-ready, but industry-ready. We aim to nurture confident, skilled professionals equipped with both technical expertise and life skills, guiding them from aspirant life to a successful career in technology.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
