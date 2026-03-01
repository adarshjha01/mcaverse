"use client";

import React, { forwardRef, useRef } from "react";
import Image from "next/image";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { IconUserCircle, IconTrophy } from "@/components/ui/Icons";

// 1. The Circle Component (Acts as a node for the beams to connect to)
const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={`z-10 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 border-slate-200 bg-white shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:border-slate-800 dark:bg-slate-900 transition-transform hover:scale-110 ${className}`}
      >
        {children}
      </div>
    );
  },
);
Circle.displayName = "Circle";

export const RoadToNIT = () => {
  // 2. Create References for the Aspirant, Engine, and 3 Exams
  const containerRef = useRef<HTMLDivElement>(null);
  
  const aspirantRef = useRef<HTMLDivElement>(null);
  const mcaverseRef = useRef<HTMLDivElement>(null);
  
  const nimcetRef = useRef<HTMLDivElement>(null);
  const cuetRef = useRef<HTMLDivElement>(null);
  const mahRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <h3 className="text-center text-xs sm:text-sm font-bold tracking-widest text-slate-400 uppercase mb-4 sm:mb-8">
            The Bridge to Your Dream Placement
        </h3>

        {/* 3. The Main Container — responsive height */}
        <div
          className="relative flex h-[280px] sm:h-[350px] md:h-[400px] w-full items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-4 sm:p-6 md:p-8 shadow-sm backdrop-blur-sm"
          ref={containerRef}
        >
          <div className="flex h-full w-full flex-row items-stretch justify-between gap-2 sm:gap-6 md:gap-10">
            
            {/* LEFT COLUMN: The Input (Aspirant) */}
            <div className="flex flex-col justify-center py-2 sm:py-4">
              <div className="flex flex-col items-center gap-1 sm:gap-2 z-20">
                  <Circle ref={aspirantRef} className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20">
                    <IconUserCircle className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-slate-600 dark:text-slate-300" />
                  </Circle>
                  <span className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-600 dark:text-slate-400 mt-1 sm:mt-2">Aspirant</span>
              </div>
            </div>

            {/* CENTER COLUMN: The Engine (MCAverse) */}
            <div className="flex flex-col justify-center items-center gap-2 sm:gap-4 z-20">
              <Circle 
                ref={mcaverseRef} 
                className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 border-4 border-indigo-100 dark:border-indigo-900/50 shadow-[0_0_40px_-10px_rgba(99,102,241,0.4)] bg-white dark:bg-slate-950"
              >
                <Image 
                    src="/mcaverse-logo.png" 
                    alt="MCAverse Engine" 
                    width={90} 
                    height={90} 
                    className="rounded-full animate-pulse w-12 h-12 sm:w-16 sm:h-16 md:w-[90px] md:h-[90px]" 
                />
              </Circle>
              <span className="text-[10px] sm:text-xs md:text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  MCAverse
              </span>
            </div>

            {/* RIGHT COLUMN: The Outputs (3 Major Exams) */}
            <div className="flex flex-col justify-between py-3 sm:py-6">
              {/* CUET PG MCA (Top) */}
              <div className="flex items-center gap-2 sm:gap-4 z-20">
                  <Circle ref={nimcetRef} className="border-amber-200 dark:border-amber-900/50">
                    <IconTrophy className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                  </Circle>
                  <span className="text-[10px] sm:text-xs font-bold text-amber-600 dark:text-amber-500 w-16 sm:w-24">CUET PG MCA</span>
              </div>
              
              {/* NIMCET (Middle - Highlighted) */}
              <div className="flex items-center gap-2 sm:gap-4 z-20">
                  <Circle ref={cuetRef} className="border-amber-400 dark:border-amber-600 shadow-[0_0_15px_-3px_rgba(245,158,11,0.4)] h-14 w-14 sm:h-16 sm:w-16">
                    <IconTrophy className="h-6 w-6 sm:h-8 sm:w-8 text-amber-500" />
                  </Circle>
                  <span className="text-xs sm:text-sm font-extrabold text-amber-600 dark:text-amber-500 w-16 sm:w-24">NIMCET</span>
              </div>

              {/* MAH MCA CET (Bottom) */}
              <div className="flex items-center gap-2 sm:gap-4 z-20">
                  <Circle ref={mahRef} className="border-amber-200 dark:border-amber-900/50">
                    <IconTrophy className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                  </Circle>
                  <span className="text-[10px] sm:text-xs font-bold text-amber-600 dark:text-amber-500 w-16 sm:w-24">MAH MCA CET</span>
              </div>
            </div>
          </div>

          {/* 4. The Animated Beams */}
          
          {/* Incoming Beam (Aspirant -> MCAverse) */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={aspirantRef}
            toRef={mcaverseRef}
            curvature={0}
            duration={3}
          />
          
          {/* Outgoing Beams (Fanning out to the 3 Exams) */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={mcaverseRef}
            toRef={nimcetRef}
            curvature={-50}
            startYOffset={-20}
            duration={3}
            delay={0.2}
            gradientStartColor="#6366f1" 
            gradientStopColor="#f59e0b"  
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={mcaverseRef}
            toRef={cuetRef}
            curvature={0}
            duration={3}
            delay={0.8}
            gradientStartColor="#6366f1" 
            gradientStopColor="#f59e0b"  
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={mcaverseRef}
            toRef={mahRef}
            curvature={50}
            startYOffset={20}
            duration={3}
            delay={1.5}
            gradientStartColor="#6366f1" 
            gradientStopColor="#f59e0b"  
          />
        </div>
    </div>
  );
};