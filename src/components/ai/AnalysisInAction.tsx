// src/components/ai/AnalysisInAction.tsx
export const AnalysisInAction = () => (
    <div className="mb-12">
        <h2 className="text-3xl font-bold mb-8">AI Analysis in Action</h2>
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-yellow-300 bg-yellow-50">
                <p className="font-semibold text-yellow-800">Weakness Identified: Probability Questions</p>
                <p className="text-yellow-700 mt-2">You have missed 70% of probability questions in the last 5 tests.</p>
                <div className="mt-4 pt-4 border-t border-yellow-200">
                    <p className="font-semibold text-sm text-slate-700">AI Recommendation:</p>
                    <p className="text-sm text-slate-600">Focus on basic probability concepts and practice 10-15 questions daily.</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-green-300 bg-green-50">
                <p className="font-semibold text-green-800">Strength Found: Data Structures</p>
                <p className="text-green-700 mt-2">Consistently scoring 90%+ in data structure questions.</p>
                 <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="font-semibold text-sm text-slate-700">AI Recommendation:</p>
                    <p className="text-sm text-slate-600">Maintain this strength and help others in the community forum.</p>
                </div>
            </div>
        </div>
    </div>
);
