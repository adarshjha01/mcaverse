// src/app/dpp/page.tsx
import { db } from "@/lib/firebaseAdmin";
import { DailyPractice } from "@/components/practice/DailyPractice";
import { StreakTracker } from "@/components/practice/StreakTracker";
import { Leaderboard } from "@/components/practice/Leaderboard";
import { IconFlame } from "@/components/ui/Icons"; // Assuming you'll add this icon

// Helper to get today's date at midnight UTC
const getTodayAtMidnight = () => {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

async function getDailyPractice() {
    try {
        const today = getTodayAtMidnight();
        const dppRef = db.collection('dpps').where('date', '==', today);
        const snapshot = await dppRef.get();

        if (snapshot.empty) {
            return null;
        }

        const dppDoc = snapshot.docs[0];
        const dppData = dppDoc.data();
        const questionsRef = db.collection('questions');
        const questionsSnap = await questionsRef.where('__name__', 'in', dppData.question_ids).get();
        
        const questions = questionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Ensure questions are in the order specified by question_ids
        const orderedQuestions = dppData.question_ids.map((id: any) => questions.find(q => q.id === id)).filter(Boolean);

        return { id: dppDoc.id, questions: orderedQuestions, points: dppData.points || 10 };
    } catch (error) {
        console.error("Error fetching daily practice:", error);
        return null;
    }
}


export default async function DppPage() {
    const dpp = await getDailyPractice();

    return (
        <main className="pt-16">
            <section className="py-16 text-center bg-slate-50 border-b border-slate-200">
                <IconFlame className="w-16 h-16 mx-auto text-orange-500 mb-4" />
                <h1 className="text-4xl font-bold mb-2">Daily Practice Problems (DPP)</h1>
                <p className="text-lg text-slate-600">Sharpen your skills with a fresh set of problems every day.</p>
            </section>
            <div className="container mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        {dpp ? <DailyPractice dpp={dpp} /> : <p>No DPP available today. Check back tomorrow!</p>}
                    </div>
                    <div className="lg:col-span-1 space-y-8">
                        <StreakTracker />
                        <Leaderboard />
                    </div>
                </div>
            </div>
        </main>
    );
}