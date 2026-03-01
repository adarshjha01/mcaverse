import { db } from "@/lib/firebaseAdmin";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { IconTrophy } from "@/components/ui/Icons";

// Forces Next.js to dynamically fetch fresh data instead of caching an error
export const dynamic = 'force-dynamic';

export default async function SuccessStoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const docRef = db.collection("success-stories").doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
        notFound();
    }

    const data = doc.data()!;
    
    // Safely parse the date
    let formattedDate = "Recently";
    if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        formattedDate = data.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } else if (data.submittedAt && typeof data.submittedAt.toDate === 'function') {
        formattedDate = data.submittedAt.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    const rating = data.rating || 5;
    const initials = (data.name || 'S').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
            {/* Hero accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />

            <div className="pt-20 sm:pt-24 pb-20 sm:pb-28">
                <div className="container mx-auto px-4 max-w-3xl">
                    
                    {/* Back link */}
                    <Link 
                        href="/success-stories" 
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-10 group"
                    >
                        <span className="group-hover:-translate-x-0.5 transition-transform">&larr;</span> All Stories
                    </Link>

                    {/* Profile card */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 mb-10">
                        {data.imageUrl ? (
                            <Image 
                                src={data.imageUrl} 
                                alt={data.name || "Student"} 
                                width={96} 
                                height={96} 
                                className="rounded-2xl ring-2 ring-slate-200 dark:ring-slate-800 object-cover w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0" 
                            />
                        ) : (
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800/40 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-2xl sm:text-3xl flex-shrink-0">
                                {initials}
                            </div>
                        )}
                        
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                                {data.name}
                            </h1>
                            
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-bold text-sm border border-amber-200/60 dark:border-amber-800/30">
                                    <IconTrophy className="w-3.5 h-3.5" />
                                    {data.title || "Achiever"}
                                </span>
                                {data.batch && (
                                    <span className="text-slate-500 dark:text-slate-400 font-medium text-sm bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                        Batch of {data.batch}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 justify-center sm:justify-start">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"}`} viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-xs text-slate-400 dark:text-slate-500">&middot;</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{formattedDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-200 dark:bg-slate-800 mb-10" />

                    {/* Story content */}
                    <article className="relative">
                        {/* Opening quote mark */}
                        <span className="absolute -top-6 -left-2 sm:-left-4 text-6xl sm:text-8xl font-serif text-slate-200 dark:text-slate-800 select-none pointer-events-none leading-none">&ldquo;</span>
                        
                        <blockquote className="relative z-10 pl-4 sm:pl-6">
                            <p className="text-lg sm:text-xl lg:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed sm:leading-relaxed font-medium whitespace-pre-line">
                                {data.content}
                            </p>
                        </blockquote>

                        {/* Closing quote mark */}
                        <span className="block text-right text-6xl sm:text-8xl font-serif text-slate-200 dark:text-slate-800 select-none pointer-events-none leading-none -mt-6">&rdquo;</span>
                    </article>

                    {/* Footer CTA */}
                    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Inspired by this story?</p>
                        <Link 
                            href="/success-stories" 
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
                        >
                            Read More Stories &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}