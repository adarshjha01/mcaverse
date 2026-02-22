import { db } from "@/lib/firebaseAdmin";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { IconTrophy } from "@/components/ui/Icons";

// Forces Next.js to dynamically fetch fresh data instead of caching an error
export const dynamic = 'force-dynamic';

export default async function SuccessStoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    // Fetch the specific story from Firebase
    const docRef = db.collection("success-stories").doc(id);
    const doc = await docRef.get();
    
    // If the story was deleted or doesn't exist, throw a 404
    if (!doc.exists) {
        notFound();
    }

    const data = doc.data()!;
    
    // THE FIX: Safely parse the date! Check for createdAt, then submittedAt, then use a fallback string.
    let formattedDate = "Recently";
    if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        formattedDate = data.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } else if (data.submittedAt && typeof data.submittedAt.toDate === 'function') {
        formattedDate = data.submittedAt.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    const rating = data.rating || 5;

    return (
        <main className="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <Link href="/success-stories" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors mb-8">
                    <span className="text-xl leading-none">&larr;</span> Back to all stories
                </Link>

                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative">
                    
                    {/* Massive Quote Watermark */}
                    <div className="absolute top-8 right-12 text-9xl font-serif leading-none text-slate-100 dark:text-slate-800/50 -z-10 select-none">
                        "
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                        {/* Profile & Rating Section */}
                        <div className="flex-shrink-0 flex flex-col items-center mx-auto md:mx-0 text-center">
                            {data.imageUrl ? (
                                <Image 
                                    src={data.imageUrl} 
                                    alt={data.name || "Student"} 
                                    width={120} 
                                    height={120} 
                                    className="rounded-full ring-4 ring-indigo-50 dark:ring-indigo-900/30 object-cover w-32 h-32 mb-4" 
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-indigo-100 dark:bg-indigo-900/50 border-4 border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-4xl mb-4">
                                    {data.name?.charAt(0) || "S"}
                                </div>
                            )}
                            
                            {/* Stars Display */}
                            <div className="flex gap-1 justify-center mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-5 h-5 ${i < rating ? "fill-amber-500 text-amber-500" : "fill-slate-200 text-slate-200 dark:fill-slate-800"}`} viewBox="0 0 24 24">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                ))}
                            </div>
                            
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                Published {formattedDate}
                            </p>
                        </div>

                        {/* Story Content Section */}
                        <div className="flex-grow text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
                                {data.name}
                            </h1>
                            
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-8">
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-bold border border-indigo-100 dark:border-indigo-800/50">
                                    <IconTrophy className="w-4 h-4" />
                                    {data.title || "Achiever"}
                                </span>
                                {data.batch && (
                                    <span className="text-slate-600 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800/50 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                                        Batch of {data.batch}
                                    </span>
                                )}
                            </div>

                            <div className="prose prose-lg dark:prose-invert prose-slate max-w-none">
                                <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed italic border-l-4 border-indigo-500 pl-6 py-2 bg-slate-50/50 dark:bg-slate-900/50 rounded-r-2xl shadow-sm">
                                    "{data.content}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}