// src/components/ai/AnalysisInAction.tsx
export const AnalysisInAction = () => (
    <div className="mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-8 text-slate-900 dark:text-slate-100">AI Analysis in Action</h2>
        <div className="space-y-4 sm:space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 sm:p-6 rounded-lg shadow-md border border-yellow-300 dark:border-yellow-700 transition-colors duration-300">
                <p className="font-semibold text-yellow-800 dark:text-yellow-300 text-sm sm:text-base">Weakness Identified: Probability Questions</p>
                <p className="text-yellow-700 dark:text-yellow-400 mt-1.5 sm:mt-2 text-sm sm:text-base">You have missed 70% of probability questions in the last 5 tests.</p>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-yellow-200 dark:border-yellow-700">
                    <p className="font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-300">AI Recommendation:</p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">Focus on basic probability concepts and practice 10-15 questions daily.</p>
                </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 sm:p-6 rounded-lg shadow-md border border-green-300 dark:border-green-700 transition-colors duration-300">
                <p className="font-semibold text-green-800 dark:text-green-300 text-sm sm:text-base">Strength Found: Data Structures</p>
                <p className="text-green-700 dark:text-green-400 mt-1.5 sm:mt-2 text-sm sm:text-base">Consistently scoring 90%+ in data structure questions.</p>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-green-200 dark:border-green-700">
                    <p className="font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-300">AI Recommendation:</p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">Maintain this strength and help others in the community forum.</p>
                </div>
            </div>
        </div>
    </div>
);
