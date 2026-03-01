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
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-slate-900 dark:text-slate-100">Our Values</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-14 lg:mb-16">
                    {values.map(value => (
                        <div key={value.title} className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 text-center border border-slate-200 dark:border-slate-700 transition-all duration-300 group">
                            <h3 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2 text-slate-900 dark:text-slate-100">{value.title}</h3>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">{value.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 lg:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-slate-200 dark:border-slate-700 transition-all duration-300">
                        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-slate-900 dark:text-slate-100">Our Mission</h3>
                        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">To empower every MCA and BCA student — from aspirants to professionals — with free, high-quality education, practical guidance, and a supportive community. We simplify every “what to do” and “how to do,” bridging the gap between academic learning and real-world requirements, so every student, regardless of background, can confidently navigate their journey and achieve their goals.</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 lg:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-slate-200 dark:border-slate-700 transition-all duration-300">
                        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-slate-900 dark:text-slate-100">Our Vision</h3>
                        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">To become India’s leading one-stop platform for MCA and BCA students, shaping a generation of learners who are not just exam-ready, but industry-ready. We aim to nurture confident, skilled professionals equipped with both technical expertise and life skills, guiding them from aspirant life to a successful career in technology.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};