// src/components/about/JoinMission.tsx
import Link from 'next/link';

export const JoinMission = () => {
    return (
        <section className="py-12 sm:py-16 lg:py-20 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="bg-slate-800 dark:bg-slate-800 text-white rounded-2xl p-6 sm:p-8 lg:p-12 text-center max-w-4xl mx-auto hover:shadow-2xl transition-all duration-300">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Join Our Mission</h2>
                    <p className="text-sm sm:text-base text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto">Be part of our growing community and help us make MCA education better for everyone. Together, we can achieve more.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                        <Link href="/community" className="bg-white text-slate-900 font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-slate-200 transition-colors text-sm sm:text-base">Join Community</Link>
                        <Link href="/contact" className="bg-transparent border border-slate-500 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-slate-700 transition-colors text-sm sm:text-base">Contact Us</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};