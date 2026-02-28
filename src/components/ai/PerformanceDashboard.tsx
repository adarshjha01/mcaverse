// src/components/ai/PerformanceDashboard.tsx
export const PerformanceDashboard = () => (
    <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-8 text-slate-900 dark:text-slate-100">AI Performance Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 sm:p-6 rounded-lg text-center transition-colors duration-300">
                <p className="text-3xl sm:text-4xl font-bold">92%</p>
                <p className="text-xs sm:text-sm mt-1">Accuracy Trend</p>
                <p className="text-xs mt-1 opacity-75">+5% from last week</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 p-4 sm:p-6 rounded-lg text-center transition-colors duration-300">
                <p className="text-3xl sm:text-4xl font-bold">2.3min</p>
                <p className="text-xs sm:text-sm mt-1">Avg. Question Time</p>
                <p className="text-xs mt-1 opacity-75">5-15 sec improved</p>
            </div>
            <div className="bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 p-4 sm:p-6 rounded-lg text-center transition-colors duration-300">
                <p className="text-3xl sm:text-4xl font-bold">8/10</p>
                <p className="text-xs sm:text-sm mt-1">Weak Areas Fixed</p>
                <p className="text-xs mt-1 opacity-75">Great progress!</p>
            </div>
        </div>
    </div>
);