// src/app/community/page.tsx
import { DiscussionList } from "@/components/community/DiscussionList";
import { ConnectWithUs } from "@/components/community/ConnectWithUs";
import { IconUsers } from "@/components/ui/Icons";
import { db } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

// --- Updated Type Definition ---
type Discussion = {
  id: string;
  title: string;
  authorId: string; // <-- ADDED
  authorName: string;
  createdAt: Date;
  replyCount: number;
  voteCount: number;
  upvotes: string[];
  downvotes: string[];
};

// --- Updated Server-side function ---
async function getDiscussions(): Promise<Discussion[]> {
    try {
        const discussionsRef = db.collection('discussions');
        const q = discussionsRef.orderBy('voteCount', 'desc');
        const snapshot = await q.get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                authorId: data.authorId, // <-- ADDED
                authorName: data.authorName || 'Anonymous',
                createdAt: (data.createdAt as Timestamp).toDate(),
                replyCount: data.replyCount || 0,
                voteCount: data.voteCount || 0,
                upvotes: data.upvotes || [],
                downvotes: data.downvotes || [],
            };
        });
    } catch (error) {
        console.error("Error fetching discussions:", error);
        return [];
    }
}

export default async function CommunityPage() {
  const discussions = await getDiscussions();

  return (
      <main className="pt-16">
        <section className="py-16 text-center bg-white border-b border-slate-200">
          <IconUsers className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
          <h1 className="text-4xl font-bold mb-2">Community Hub</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Connect with fellow students, ask questions, and grow together.
          </p>
        </section>

        <div className="container mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <DiscussionList initialDiscussions={discussions} />
                </div>
                <div className="lg:col-span-1">
                    <ConnectWithUs />
                </div>
            </div>
        </div>
      </main>
  );
}
