// src/components/about/JoinMission.tsx
import Link from 'next/link';

export const JoinMission = () => {
    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 text-white rounded-2xl p-8 sm:p-10 lg:p-14 text-center max-w-4xl mx-auto">
                    {/* Decorative gradient orbs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Join Our Mission</h2>
                        <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-lg mx-auto leading-relaxed">Be part of our growing community and help us make MCA education better for everyone.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <Link href="/community" className="bg-white text-slate-900 font-bold text-sm px-6 py-3 rounded-xl hover:bg-slate-100 active:scale-[0.97] transition-all shadow-sm">Join Community</Link>
                            <Link href="/contact" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-white/20 active:scale-[0.97] transition-all">Contact Us</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};