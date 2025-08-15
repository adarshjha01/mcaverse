// src/components/ai/PerformanceDashboard.tsx
export const PerformanceDashboard = () => (
    <div>
        <h2 className="text-3xl font-bold mb-8">AI Performance Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-100 text-green-800 p-6 rounded-lg text-center">
                <p className="text-4xl font-bold">92%</p>
                <p className="text-sm">Accuracy Trend</p>
                <p className="text-xs mt-1">+5% from last week</p>
            </div>
            <div className="bg-blue-100 text-blue-800 p-6 rounded-lg text-center">
                <p className="text-4xl font-bold">2.3min</p>
                <p className="text-sm">Avg. Question Time</p>
                <p className="text-xs mt-1">5-15 sec improved</p>
            </div>
            <div className="bg-pink-100 text-pink-800 p-6 rounded-lg text-center">
                <p className="text-4xl font-bold">8/10</p>
                <p className="text-sm">Weak Areas Fixed</p>
                <p className="text-xs mt-1">Great progress!</p>
            </div>
        </div>
    </div>
);