import { SuccessStoriesClient } from "@/components/success-stories/SuccessStoriesClient";
import { IconTrophy } from "@/components/ui/Icons";
import { db } from "@/lib/firebaseAdmin";

// THE FIX: Forces Next.js to fetch fresh data every time the page loads
export const dynamic = 'force-dynamic';

type Story = {
  id: string;
  name: string;
  batch: string;
  title: string;
  content: string;
  imageUrl: string | null;
  likeCount: number;
  likes: string[]; 
  rating: number; // Added rating to the type
  userId: string;
};

async function getSuccessStories(): Promise<Story[]> {
    try {
        const storiesRef = db.collection('success-stories');
        
        // THE FIX: Remove the .orderBy() from the Firebase query to bypass the Index error
        const q = storiesRef.where('isApproved', '==', true);
        const snapshot = await q.get();
        
        // THE FIX: Sort the documents in JavaScript memory instead!
        const sortedDocs = snapshot.docs.sort((a, b) => {
            const timeA = a.data().createdAt?.toMillis() || 0;
            const timeB = b.data().createdAt?.toMillis() || 0;
            return timeB - timeA; // Descending order (newest first)
        });

        return sortedDocs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                batch: data.batch || '',
                title: data.title,
                content: data.content,
                imageUrl: data.imageUrl || null,
                likeCount: data.likeCount || 0,
                likes: data.likes || [],
                rating: data.rating || 5,
                userId: data.userId || '', // <-- Add this mapping!
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
      <main className="pt-24 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <section className="py-16 text-center border-b border-slate-200 dark:border-slate-800 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-200 dark:border-indigo-800">
                    <IconTrophy className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Success Stories</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
                    Inspiring journeys of MCAverse students who have achieved their career goals.
                </p>
            </div>
        </section>

        <div className="container mx-auto px-4 py-16">
            <SuccessStoriesClient initialStories={stories} />
        </div>
      </main>
  );
}