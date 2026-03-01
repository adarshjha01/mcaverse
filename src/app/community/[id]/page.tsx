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
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/community"
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-6 inline-block transition-colors"
          >
            &larr; Back to all discussions
          </Link>
          
          {/* We now pass the entire post object into the ReplySection */}
          <ReplySection post={post} initialReplies={replies} />
          
        </div>
      </main>
    </div>
  );
}