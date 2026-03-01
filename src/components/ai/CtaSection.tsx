// src/components/ai/CtaSection.tsx

export const CtaSection = () => (
    <section className="bg-purple-600 dark:bg-purple-800 transition-colors duration-300">
        <div className="container mx-auto px-4 py-10 sm:py-16 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Experience AI-Powered Learning?</h2>
            <p className="text-sm sm:text-base mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90 px-2">Join thousands of MCA students who are already using our AI assistant to improve their performance and achieve their goals.</p>
            <span className="inline-block bg-white/70 text-purple-600 font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base cursor-not-allowed select-none">
                Coming Soon &rarr;
            </span>
        </div>
    </section>
);
