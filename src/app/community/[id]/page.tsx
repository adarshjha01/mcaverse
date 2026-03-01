// src/app/community/[id]/page.tsx
import { db } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import { notFound } from "next/navigation";
import { ReplySection } from "@/components/community/ReplySection";
import Link from "next/link";

// --- Type Definitions ---
type Post = {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: Date;
};

type Reply = {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
};

async function getDiscussionDetails(
  id: string
): Promise<{ post: Post; replies: Reply[] }> {
  const postRef = db.collection("discussions").doc(id);
  const postSnap = await postRef.get();
  if (!postSnap.exists) notFound();

  const postData = postSnap.data()!;
  const post = {
    id: postSnap.id,
    title: postData.title,
    content: postData.content,
    authorName: postData.authorName,
    createdAt: (postData.createdAt as Timestamp).toDate(),
  };

  const repliesRef = postRef.collection("replies").orderBy("createdAt", "asc");
  const repliesSnap = await repliesRef.get();
  const replies = repliesSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      content: data.content,
      authorId: data.authorId,
      authorName: data.authorName,
      createdAt: (data.createdAt as Timestamp).toDate(),
    };
  });

  return { post, replies };
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DiscussionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { post, replies } = await getDiscussionDetails(id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Back navigation */}
          <Link
            href="/community"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to discussions
          </Link>

          <ReplySection post={post} initialReplies={replies} />
        </div>
      </main>
    </div>
  );
}