// src/app/community/page.tsx
import { DiscussionList } from "@/components/community/DiscussionList";
import { ConnectWithUs } from "@/components/community/ConnectWithUs";
import { CommunityStats } from "@/components/community/CommunityStats";
import { StudyTools } from "@/components/community/StudyTools";
import { db } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

// --- Type Definition ---
type Discussion = {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  replyCount: number;
  voteCount: number;
  upvotes: string[];
  downvotes: string[];
};

// --- Server-side data fetching ---
async function getDiscussions(): Promise<Discussion[]> {
  try {
    const discussionsRef = db.collection("discussions");
    const q = discussionsRef.orderBy("voteCount", "desc");
    const snapshot = await q.get();
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        authorId: data.authorId,
        authorName: data.authorName || "Anonymous",
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

function StatPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 backdrop-blur-sm">
      {label}
    </span>
  );
}

export default async function CommunityPage() {
  const discussions = await getDiscussions();
  const totalReplies = discussions.reduce((sum, d) => sum + d.replyCount, 0);
  const totalVotes = discussions.reduce((sum, d) => sum + d.upvotes.length + d.downvotes.length, 0);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* ── Hero Section ── */}
      <section className="relative pt-16 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/80 border-b border-slate-200/80 dark:border-slate-800">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-300/20 dark:bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 sm:w-80 h-64 sm:h-80 bg-purple-300/20 dark:bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative container mx-auto px-4 py-12 sm:py-16 lg:py-20 text-center">
          <p className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 mb-5 border border-indigo-200/60 dark:border-indigo-500/20">
            <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-600 dark:bg-indigo-400" /></span>
            Live Community
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
            <span className="bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
              Community Hub
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed mb-8">
            Connect with fellow students, share knowledge, ask questions, and grow together.
          </p>

          {/* Stats pills */}
          {discussions.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <StatPill label={`${discussions.length} Discussions`} />
              <StatPill label={`${totalReplies} Replies`} />
              <StatPill label={`${totalVotes} Votes`} />
            </div>
          )}
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="container mx-auto px-4 py-10 sm:py-14">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <DiscussionList initialDiscussions={discussions} />
          </div>
          <aside className="lg:col-span-1 space-y-6">
            <CommunityStats
              discussionCount={discussions.length}
              totalReplies={totalReplies}
            />
            <StudyTools />
            <ConnectWithUs />
          </aside>
        </div>
      </div>
    </main>
  );
}
