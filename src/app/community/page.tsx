// src/app/community/page.tsx
import { DiscussionList } from "@/components/community/DiscussionList";
import { ConnectWithUs } from "@/components/community/ConnectWithUs";
import { CommunityStats } from "@/components/community/CommunityStats";
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
  const totalReplies = discussions.reduce((sum, d) => sum + d.replyCount, 0);

  return (
      <main className="pt-16">
        <section className="py-12 sm:py-16 text-center px-4 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <IconUsers className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-indigo-500 mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-slate-900 dark:text-white">Community Hub</h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Connect with fellow students, ask questions, and grow together.
          </p>
        </section>

        <div className="container mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <DiscussionList initialDiscussions={discussions} />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <CommunityStats discussionCount={discussions.length} totalReplies={totalReplies} />
                    <ConnectWithUs />
                </div>
            </div>
        </div>
      </main>
  );
}
