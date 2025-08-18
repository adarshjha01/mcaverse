// src/app/success-stories/page.tsx
import { Navbar } from "@/components/landing/Navbar";
import { StoryList } from "@/components/success-stories/StoryList";
import { ShareJourneyForm } from "@/components/success-stories/ShareJourneyForm";
import { IconTrophy } from "@/components/ui/Icons";
import { db } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

// --- Type Definition for a Story ---
type Story = {
  id: string;
  name: string;
  batch: string;
  title: string;
  content: string;
  imageUrl: string | null;
};

// --- Function to fetch approved stories ---
async function getSuccessStories(): Promise<Story[]> {
    try {
        const storiesRef = db.collection('success-stories');
        // Filter for approved stories and order by most recent
        const q = storiesRef.where('approved', '==', true).orderBy('submittedAt', 'desc');
        const snapshot = await q.get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                batch: data.batch,
                title: data.title,
                content: data.content.substring(0, 200) + '...',
                imageUrl: data.imageUrl || null,
            };
        });
    } catch (error) {
        console.error("Error fetching stories:", error);
        return [];
    }
}

export default async function SuccessStoriesPage() {
  const stories = await getSuccessStories();

  return (
    <div className="bg-white text-slate-800 min-h-screen">
      <Navbar />
      <main className="pt-16">
        <section className="py-16 text-center bg-slate-50 border-b border-slate-200">
            <IconTrophy className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
            <h1 className="text-4xl font-bold mb-2">Success Stories</h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Inspiring journeys of MCAverse students who have achieved their career goals.
            </p>
        </section>

        <div className="container mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <StoryList stories={stories} />
                </div>
                <div className="lg:col-span-1">
                    <ShareJourneyForm />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
