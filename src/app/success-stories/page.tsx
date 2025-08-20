// src/app/success-stories/page.tsx

import { StoryList } from "@/components/success-stories/StoryList";
import { ShareJourneyForm } from "@/components/success-stories/ShareJourneyForm";
import { IconTrophy } from "@/components/ui/Icons";
import { db } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

// --- Updated Type Definition ---
type Story = {
  id: string;
  name: string;
  batch: string;
  title: string;
  content: string;
  imageUrl: string | null;
  likeCount: number;
  likes: string[]; // Array of user IDs who liked the story
};

// --- Updated Function to fetch stories ---
async function getSuccessStories(): Promise<Story[]> {
    try {
        const storiesRef = db.collection('success-stories');
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
                likeCount: data.likeCount || 0,
                likes: data.likes || [],
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
  );
}