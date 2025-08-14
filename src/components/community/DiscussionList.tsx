// src/components/community/DiscussionList.tsx
import Link from "next/link";
import { IconMessageCircle } from "@/components/ui/Icons";
import { db } from '@/lib/firebaseAdmin'; // <-- IMPORT FROM CENTRAL FILE
import { Timestamp } from 'firebase-admin/firestore';

type Discussion = {
  id: string;
  title: string;
  author: string;
  replyCount: number;
  createdAt: Date;
};

async function getDiscussions(): Promise<Discussion[]> {
  try {
    const discussionsRef = db.collection('discussions');
    const q = discussionsRef.orderBy('createdAt', 'desc');
    const querySnapshot = await q.get();
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        author: data.author,
        replyCount: data.replyCount || 0,
        createdAt: (data.createdAt as Timestamp).toDate(),
      };
    });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return [];
  }
}

function formatTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

export const DiscussionList = async () => {
    const discussions = await getDiscussions();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Discussions</h2>
                <Link href="/community/new" className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    New Post
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow-md border border-slate-200">
                <ul className="divide-y divide-slate-200">
                    {discussions.length > 0 ? (
                        discussions.map(post => (
                            <li key={post.id} className="p-4 hover:bg-slate-50 transition-colors">
                                <Link href={`/community/${post.id}`} className="block">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800">{post.title}</h3>
                                            <p className="text-sm text-slate-500 mt-1">
                                                Posted by {post.author} • {formatTimeAgo(post.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm flex-shrink-0 ml-4">
                                            <IconMessageCircle className="w-5 h-5" />
                                            <span>{post.replyCount}</span>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li className="p-6 text-center text-slate-500">No discussions yet. Be the first to start one!</li>
                    )}
                </ul>
            </div>
        </div>
    );
};
