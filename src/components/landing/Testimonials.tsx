"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// The shape of our live database stories
type Story = {
  id: string;
  name: string;
  title: string;
  content: string;
  rating: number;
  imageUrl?: string | null;
};

// Fallback data just in case the database is empty
const fallbackTestimonials: Story[] = [
  { id: "1", content: "The mock tests are exactly like the real NIMCET exam.", name: "Rahul S.", title: "NIT Trichy '26", rating: 5 },
  { id: "2", content: "The accuracy dashboard helped me realize I was rushing logic.", name: "Priya P.", title: "AIR 142", rating: 5 },
  { id: "3", content: "DPPs kept me disciplined during my final year.", name: "Sneha M.", title: "NIT Surathkal '25", rating: 5 },
];

export const Testimonials = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the live, auto-approved stories from our newly updated API
    const fetchStories = async () => {
      const res = await fetch("/api/success-stories", { cache: "no-store" });
      try {
        const res = await fetch("/api/success-stories");
        if (res.ok) {
          const data = await res.json();
          setStories(data.length > 0 ? data : fallbackTestimonials);
        } else {
          setStories(fallbackTestimonials);
        }
      } catch (error) {
        console.error("Failed to fetch live stories", error);
        setStories(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Duplicate the array to make the infinite CSS marquee loop seamlessly
  const marqueeItems = [...stories, ...stories];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 border-y border-slate-100 dark:border-slate-900 overflow-hidden">
      <div className="container mx-auto px-4 text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Student Success Stories</h2>
        
        {/* The "Share Experience" CTA */}
        <Link 
          href="/success-stories" 
          className="group relative inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-full text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm"
        >
          Share your journey & get featured
          <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="flex gap-6 w-max px-6"
        >
          {marqueeItems.map((story, i) => (
            <div key={`${story.id}-${i}`} className="w-[400px] bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full">
              
              <div>
                  {/* Dynamic 5-Star Rating based on DB data */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, starIdx) => (
                        <svg key={starIdx} className={`w-5 h-5 ${starIdx < (story.rating || 5) ? "fill-amber-500 text-amber-500" : "fill-slate-200 text-slate-200 dark:fill-slate-800"}`} viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic text-lg mb-6 line-clamp-4">
                    "{story.content}"
                  </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                {story.imageUrl ? (
                    <Image src={story.imageUrl} alt={story.name} width={48} height={48} className="rounded-full w-12 h-12 object-cover border-2 border-indigo-100 dark:border-indigo-900" />
                ) : (
                    <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold border-2 border-indigo-200 dark:border-indigo-800">
                        {story.name.charAt(0)}
                    </div>
                )}
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{story.name}</h4>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{story.title}</p>
                </div>
              </div>

            </div>
          ))}
        </motion.div>
      )}
    </section>
  );
};