// src/app/community/[id]/page.tsx

import { db } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import { notFound } from "next/navigation";
import { ReplySection } from "@/components/community/ReplySection";
import Link from 'next/link';

// --- Type Definitions ---
type Post = { id: string; title: string; content: string; authorName: string; createdAt: Date; };
type Reply = { id: string; content: string; authorId: string; authorName: string; createdAt: Date; };

// Define a specific type for the page's props
type Props = {
  params: { id: string };
};

async function getDiscussionDetails(id: string): Promise<{ post: Post; replies: Reply[] }> {
    const postRef = db.collection('discussions').doc(id);
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

    const repliesRef = postRef.collection('replies').orderBy('createdAt', 'asc');
    const repliesSnap = await repliesRef.get();
    const replies = repliesSnap.docs.map(doc => {
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

// Use the new Props type here
export default async function DiscussionDetailPage({ params }: Props) {
    const { post, replies } = await getDiscussionDetails(params.id);

    return (
        <div className="bg-slate-50 min-h-screen">
            <main className="container mx-auto px-4 py-24">
                <div className="max-w-3xl mx-auto">
                    <Link href="/community" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-6 inline-block">&larr; Back to all discussions</Link>
                    <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200 mb-8">
                        <h1 className="text-3xl font-bold mb-3 text-slate-800">{post.title}</h1>
                        <p className="text-sm text-slate-500 mb-6">
                            Posted by {post.authorName} on {post.createdAt.toLocaleDateString()}
                        </p>
                        <div className="prose max-w-none text-slate-700">
                            {post.content.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                        </div>
                    </div>
                    <ReplySection discussionId={post.id} initialReplies={replies} />
                </div>
            </main>
        </div>
    );
}