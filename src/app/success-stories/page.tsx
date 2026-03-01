import { SuccessStoriesClient } from "@/components/success-stories/SuccessStoriesClient";
import { IconSparkles } from "@/components/ui/Icons";
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
  rating: number;
  userId: string;
};

async function getSuccessStories(): Promise<Story[]> {
    try {
        const storiesRef = db.collection('success-stories');
        const q = storiesRef.where('isApproved', '==', true);
        const snapshot = await q.get();
        
        const sortedDocs = snapshot.docs.sort((a, b) => {
            const timeA = a.data().createdAt?.toMillis() || 0;
            const timeB = b.data().createdAt?.toMillis() || 0;
            return timeB - timeA;
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
                userId: data.userId || '',
            };
        });
    } catch (error) {
        console.error("Error fetching stories:", error);
        return [];
    }
}

export default async function SuccessStoriesPage() {
  const stories = await getSuccessStories();

  // Dynamic avg rating from real story data
  const avgRating = stories.length > 0
    ? (stories.reduce((sum, s) => sum + s.rating, 0) / stories.length).toFixed(1)
    : null;

  return (
      <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
        {/* Hero */}
        <section className="relative overflow-hidden pt-28 sm:pt-32 pb-20 sm:pb-28 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/30 dark:bg-amber-900/10 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-200/20 dark:bg-rose-900/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-100/20 dark:bg-orange-900/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 text-center relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/80 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/30 mb-6 backdrop-blur-sm">
                    <IconSparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Real Stories, Real Results</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight leading-[1.1]">
                    Success{' '}
                    <span className="relative inline-block">
                        <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">Stories</span>
                        <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                            <path d="M2 8C50 2 150 2 198 8" stroke="url(#underline-grad)" strokeWidth="3" strokeLinecap="round" />
                            <defs><linearGradient id="underline-grad" x1="0" y1="0" x2="200" y2="0"><stop stopColor="#f59e0b" /><stop offset="1" stopColor="#f43f5e" /></linearGradient></defs>
                        </svg>
                    </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
                    Hear from students who turned their MCA dreams into reality. Their journeys of hard work, consistency, and smart preparation will inspire yours.
                </p>

                {/* Stats row */}
                <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
                    <div className="text-center">
                        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{stories.length}+</p>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Stories Shared</p>
                    </div>
                    {avgRating && (
                    <>
                    <div className="w-px h-10 bg-slate-300 dark:bg-slate-700" />
                    <div className="text-center">
                        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{avgRating}★</p>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Avg Rating</p>
                    </div>
                    </>
                    )}
                </div>
            </div>

            {/* Wave divider */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 48" fill="none" className="w-full h-8 sm:h-12">
                    <path d="M0 48L60 42C120 36 240 24 360 20C480 16 600 20 720 26C840 32 960 40 1080 42C1200 44 1320 40 1380 38L1440 36V48H0Z" className="fill-white dark:fill-slate-950" />
                </svg>
            </div>
        </section>

        {/* Content */}
        <div className="container mx-auto px-4 py-12 sm:py-16">
            <SuccessStoriesClient initialStories={stories} />
        </div>
      </main>
  );
}