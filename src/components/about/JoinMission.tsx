// src/components/about/JoinMission.tsx
import Link from 'next/link';

export const JoinMission = () => {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="bg-slate-800 text-white rounded-xl p-12 text-center max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
                    <p className="text-slate-300 mb-8">Be part of our growing community and help us make MCA education better for everyone. Together, we can achieve more.</p>
                    <div className="flex justify-center gap-4">
                        <Link href="/community" className="bg-white text-slate-900 font-semibold px-6 py-3 rounded-lg hover:bg-slate-200">Join Community</Link>
                        <Link href="#" className="bg-transparent border border-slate-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-slate-700">Learn More</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};