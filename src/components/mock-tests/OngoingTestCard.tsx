// src/components/mock-tests/OngoingTestCard.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconClock, IconArrowRight, IconX } from "@/components/ui/Icons";
import type { OngoingTestState } from "@/components/mock-tests/TestInterface";

const ONGOING_TEST_KEY = 'mcaverse_ongoing_test';

export const OngoingTestCard = () => {
  const router = useRouter();
  const [ongoingTest, setOngoingTest] = useState<OngoingTestState | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ONGOING_TEST_KEY);
      if (!raw) return;
      const saved: OngoingTestState = JSON.parse(raw);
      const elapsed = Math.floor((Date.now() - saved.savedAt) / 1000);
      const remaining = saved.timeLeft - elapsed;
      if (remaining <= 0) {
        localStorage.removeItem(ONGOING_TEST_KEY);
        return;
      }
      setOngoingTest(saved);
      setTimeRemaining(remaining);
    } catch {
      localStorage.removeItem(ONGOING_TEST_KEY);
    }
  }, []);

  // Live countdown
  useEffect(() => {
    if (!ongoingTest) return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          localStorage.removeItem(ONGOING_TEST_KEY);
          setOngoingTest(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [ongoingTest]);

  const handleContinue = () => {
    if (ongoingTest) {
      router.push(`/mock-tests/take/${ongoingTest.testId}`);
    }
  };

  const handleDiscard = () => {
    localStorage.removeItem(ONGOING_TEST_KEY);
    setOngoingTest(null);
  };

  if (!ongoingTest || timeRemaining <= 0) return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const answeredCount = Object.values(ongoingTest.statusMap).filter(s => s === 'answered').length;
  const totalQuestions = Object.keys(ongoingTest.statusMap).length;
  const progress = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 shadow-sm animate-in fade-in slide-in-from-top-2">
      {/* Discard button */}
      <button
        onClick={handleDiscard}
        className="absolute top-3 right-3 p-1.5 rounded-lg text-amber-400 hover:text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
        title="Discard this test"
      >
        <IconX className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-0.5">
            Ongoing Test
          </p>
          <h3 className="text-base font-bold text-slate-800 dark:text-white truncate">
            {ongoingTest.testTitle}
          </h3>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <IconClock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className={`text-sm font-bold font-mono ${timeRemaining < 300 ? 'text-red-600' : 'text-amber-700 dark:text-amber-300'}`}>
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </span>
          <span className="text-xs text-amber-600/70 dark:text-amber-400/70">remaining</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{answeredCount}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">/ {totalQuestions} answered</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-amber-200/50 dark:bg-amber-900/30 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Continue button */}
      <button
        onClick={handleContinue}
        className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-200/50 dark:shadow-none transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
      >
        Continue Test
        <IconArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
