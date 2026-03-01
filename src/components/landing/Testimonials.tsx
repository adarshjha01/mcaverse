"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

type Story = {
  id: string;
  name: string;
  title: string;
  content: string;
  rating: number;
  imageUrl?: string | null;
};

const fallbackTestimonials: Story[] = [
  { id: "1", content: "The mock tests are exactly like the real NIMCET exam.", name: "Rahul S.", title: "NIT Trichy '26", rating: 5 },
  { id: "2", content: "The accuracy dashboard helped me realize I was rushing logic.", name: "Priya P.", title: "AIR 142", rating: 5 },
  { id: "3", content: "DPPs kept me disciplined during my final year.", name: "Sneha M.", title: "NIT Surathkal '25", rating: 5 },
];

export const Testimonials = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch("/api/success-stories", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const featured = data.filter((s: Story) => (s.rating || 0) >= 4);
          setStories(featured.length > 0 ? featured : fallbackTestimonials);
        } else {
          setStories(fallbackTestimonials);
        }
      } catch {
        setStories(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const marqueeItems = [...stories, ...stories];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-4 text-center mb-10 sm:mb-14">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Student Success Stories</h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-6">
          Real stories from students who cracked top MCA entrances with MCAverse.
        </p>
        <Link 
          href="/success-stories" 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:border-indigo-300 dark:hover:border-indigo-800/50 hover:shadow-md transition-all duration-200 active:scale-[0.97]"
        >
          Share your journey &amp; get featured
          <span>&rarr;</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex gap-4 px-6 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-[80vw] sm:w-[340px] flex-shrink-0 bg-slate-100 dark:bg-slate-900 rounded-2xl h-48 animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="flex gap-4 w-max px-4"
        >
          {marqueeItems.map((story, i) => (
            <div key={`${story.id}-${i}`} className="w-[80vw] sm:w-[340px] bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-indigo-200 dark:hover:border-indigo-800/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              
              <div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, starIdx) => (
                    <svg key={starIdx} className={`w-4 h-4 ${starIdx < (story.rating || 5) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200 dark:fill-slate-800"}`} viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic mb-4 line-clamp-3">
                  &quot;{story.content}&quot;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                {story.imageUrl ? (
                  <Image src={story.imageUrl} alt={story.name} width={40} height={40} className="rounded-full w-10 h-10 object-cover border-2 border-indigo-100 dark:border-indigo-900" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold border border-indigo-200/50 dark:border-indigo-800/30">
                    {story.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{story.name}</h4>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">{story.title}</p>
                </div>
              </div>

            </div>
          ))}
        </motion.div>
      )}
    </section>
  );
};