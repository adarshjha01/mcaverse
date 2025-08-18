// src/app/success-stories/[id]/page.tsx
import { Navbar } from "@/components/landing/Navbar";
import { db } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import { notFound } from "next/navigation";
import Image from 'next/image';
import Link from "next/link";

// --- Type Definition for a full Story ---
type Story = {
  id: string;
  name: string;
  batch: string;
  title: string;
  content: string;
  imageUrl: string | null;
  submittedAt: Date;
};

// --- Function to fetch a single story's details ---
async function getStoryDetails(id: string): Promise<Story> {
    const storyRef = db.collection('success-stories').doc(id);
    const docSnap = await storyRef.get();

    if (!docSnap.exists) {
        notFound(); // This will render the 404 page
    }

    const data = docSnap.data()!;
    return {
        id: docSnap.id,
        name: data.name,
        batch: data.batch,
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl || null,
        submittedAt: (data.submittedAt as Timestamp).toDate(),
    };
}

export default async function StoryDetailPage({ params }: { params: { id: string } }) {
  const story = await getStoryDetails(params.id);

  return (
    <div className="bg-white text-slate-800 min-h-screen">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto">
                <Link href="/success-stories" className="text-indigo-600 font-semibold hover:text-indigo-800 mb-8 inline-block">
                    &larr; Back to All Stories
                </Link>
                
                <div className="flex items-center gap-4 mb-6">
                    <Image 
                        src={story.imageUrl || `https://placehold.co/80x80/E2E8F0/475569?text=${story.name.charAt(0)}`} 
                        alt={story.name} 
                        width={80} 
                        height={80} 
                        className="rounded-full" 
                    />
                    <div>
                        <h2 className="text-xl font-bold">{story.name}</h2>
                        <p className="text-slate-500">Batch of {story.batch}</p>
                    </div>
                </div>

                <h1 className="text-4xl font-bold mb-4">{story.title}</h1>
                <p className="text-sm text-slate-500 mb-8">
                    Published on {story.submittedAt.toLocaleDateString()}
                </p>

                <div className="prose max-w-none text-slate-700 leading-relaxed">
                    {story.content.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}