// src/components/about/ValuesMissionVision.tsx
export const ValuesMissionVision = () => {
    const values = [
        { title: "Education for All", desc: "Making quality MCA education accessible to every student regardless of background." },
        { title: "Community Building", desc: "Creating supportive communities where students can learn and grow together." },
        { title: "Practical Learning", desc: "Focusing on practical skills and real-world applications over theoretical knowledge." },
        { title: "Continuous Growth", desc: "Believing in continuous learning and adaptation to new technologies and trends." },
    ];

    return (
        <section className="bg-slate-50 py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {values.map(value => (
                        <div key={value.title} className="bg-white p-6 rounded-xl shadow-md text-center">
                            <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                            <p className="text-slate-600">{value.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                        <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
                        <p className="text-slate-700">To empower every MCA and BCA student — from aspirants to professionals — with free, high-quality education, practical guidance, and a supportive community. We simplify every “what to do” and “how to do,” bridging the gap between academic learning and real-world requirements, so every student, regardless of background, can confidently navigate their journey and achieve their goals.</p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                        <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
                        <p className="text-slate-700">To become India’s leading one-stop platform for MCA and BCA students, shaping a generation of learners who are not just exam-ready, but industry-ready. We aim to nurture confident, skilled professionals equipped with both technical expertise and life skills, guiding them from aspirant life to a successful career in technology.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};