"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { IconUsers } from "@/components/ui/Icons";

const testimonials = [
  {
    quote: "The mock tests are exactly like the real NIMCET exam. The interface prepared me for the actual testing environment.",
    name: "Rahul S.",
    title: "NIT Trichy '26",
  },
  {
    quote: "MCAverse completely changed my prep strategy. The accuracy dashboard helped me realize I was rushing logic questions.",
    name: "Priya P.",
    title: "NIMCET AIR 142",
  },
  {
    quote: "The video tutorials are incredible. They break down complex Probability and Combinatorics topics into simple, bite-sized steps.",
    name: "Amit Kumar",
    title: "MCA Aspirant",
  },
  {
    quote: "I tried offline coaching, but the DPPs and daily practice streaks here kept me much more consistent and disciplined.",
    name: "Sneha M.",
    title: "NIT Surathkal '25",
  },
];

export const Testimonials = () => {
  // We double the array so the marquee loops seamlessly without jumping
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden relative border-t border-slate-100 dark:border-slate-900">
      <div className="container mx-auto px-4 mb-16 relative z-10 text-center">
        <IconUsers className="w-12 h-12 mx-auto text-indigo-500 mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Loved by MCA Aspirants
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
          Join thousands of students who have transformed their preparation journey with our platform.
        </p>
        
        {/* The CTA Button */}
        <Link 
            href="/success-stories" 
            className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold px-6 py-3 rounded-full shadow-md hover:scale-105 transition-transform"
        >
            Share Your Experience &rarr;
        </Link>
      </div>

      {/* Infinite Moving Cards Container */}
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        {/* Fading edges for the premium look */}
        <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white dark:from-slate-950 to-transparent"></div>
        <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white dark:from-slate-950 to-transparent"></div>

        <motion.div
          className="flex w-max gap-6 px-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
        >
          {duplicatedTestimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="w-[350px] md:w-[450px] flex-shrink-0 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm flex flex-col justify-between"
            >
              <div className="mb-6">
                 {/* 5-Star Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">
                    {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};