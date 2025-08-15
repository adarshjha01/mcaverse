// src/components/ai/CtaSection.tsx
import Link from "next/link";

export const CtaSection = () => (
    <section className="bg-purple-600">
        <div className="container mx-auto px-4 py-16 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience AI-Powered Learning?</h2>
            <p className="mb-8 max-w-2xl mx-auto">Join thousands of MCA students who are already using our AI assistant to improve their performance and achieve their goals.</p>
            <Link href="#" className="bg-white text-purple-600 font-bold px-8 py-3 rounded-full hover:bg-slate-200 transition-colors">
                Start AI Analysis &rarr;
            </Link>
        </div>
    </section>
);
