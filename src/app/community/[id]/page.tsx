// src/app/community/[id]/page.tsx
import { Navbar } from "@/components/landing/Navbar";
import { db } from '@/lib/firebaseAdmin'; // <-- IMPORT FROM CENTRAL FILE
import { Timestamp } from 'firebase-admin/firestore';
import { notFound } from 'next/navigation';
import { ReplyForm } from "@/components/community/ReplyForm";

type DiscussionPost = { id: string; title: string; content: string; author: string; createdAt: Date; };
type Reply = { id: string; content: string; author: string; createdAt: Date; };

async function getDiscussionDetails(id: string): Promise<{ post: DiscussionPost; replies: Reply[] }> {
    const postRef = db.collection('discussions').doc(id);
    const postSnap = await postRef.get();

    if (!postSnap.exists) {
        notFound();
    }

    const postData = postSnap.data()!;
    const post = {
        id: postSnap.id,
        title: postData.title,
        content: postData.content,
        author: postData.author,
        createdAt: (postData.createdAt as Timestamp).toDate(),
    };

    const repliesRef = postRef.collection('replies').orderBy('createdAt', 'asc');
    const repliesSnap = await repliesRef.get();

    const replies = repliesSnap.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            content: data.content,
            author: data.author,
            createdAt: (data.createdAt as Timestamp).toDate(),
        };
    });

    return { post, replies };
}

export default async function DiscussionDetailPage({ params }: { params: { id: string } }) {
    const { post, replies } = await getDiscussionDetails(params.id);

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <main className="container mx-auto px-4 py-24">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200 mb-8">
                        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                        <p className="text-sm text-slate-500 mb-6">
                            Posted by {post.author} on {post.createdAt.toLocaleDateString()}
                        </p>
                        <div className="prose max-w-none">
                            <p>{post.content}</p>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-6">{replies.length} Replies</h2>
                    <div className="space-y-6 mb-8">
                        {replies.map(reply => (
                            <div key={reply.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                                <p className="text-slate-700">{reply.content}</p>
                                <p className="text-xs text-slate-500 mt-4">
                                    - {reply.author} on {reply.createdAt.toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                         {replies.length === 0 && <p className="text-slate-500">No replies yet. Be the first to comment!</p>}
                    </div>
                    <ReplyForm discussionId={post.id} />
                </div>
            </main>
        </div>
    );
}