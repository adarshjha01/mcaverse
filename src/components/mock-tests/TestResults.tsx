// src/components/mock-tests/TestResults.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { LatexText } from '@/components/ui/LatexText';
import { 
  IconCheck, 
  IconX, 
  IconMenu2, 
  IconChevronRight, 
  IconChevronLeft,
  IconTrophy,
  IconInfoCircle
} from "@/components/ui/Icons"; 

// --- TYPES ---
type Question = {
  id: string;
  question_text: string;
  options: string[];
  correct_answers: number[];
  explanation: string;
  subject?: string;
};

type UserAttempt = {
  id: string;
  score: number;
  correctCount: number;
  incorrectCount: number;
  totalAttempted: number;
  answers: { [key: string]: number };
  submittedAt: string; // <--- Ensure this is string
};

type TestResultsProps = {
  attempt: UserAttempt;
  questions: Question[];
};

export const TestResults = ({ attempt, questions }: TestResultsProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = attempt.answers[currentQuestion.id];
  const correctAnswer = currentQuestion.correct_answers[0];
  
  // Helper to determine status for Palette coloring
  const getQuestionStatus = (qId: string, correctIdx: number) => {
    const userAns = attempt.answers[qId];
    if (userAns === undefined) return 'unattempted';
    if (userAns === correctIdx) return 'correct';
    return 'incorrect';
  };

  const getPaletteColor = (status: string) => {
    switch (status) {
      case 'correct': return 'bg-green-500 text-white border-green-600';
      case 'incorrect': return 'bg-red-500 text-white border-red-600';
      default: return 'bg-slate-100 text-slate-500 border-slate-200'; // Unattempted
    }
  };

  const totalQuestions = questions.length;
  // Calculate accuracy safely
  const accuracy = attempt.totalAttempted > 0 
    ? Math.round((attempt.correctCount / attempt.totalAttempted) * 100) 
    : 0;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 font-sans">
      
      {/* --- SCORE HEADER --- */}
      <div className="bg-[#003D69] text-white p-4 shadow-md shrink-0 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                <IconTrophy className="w-8 h-8 text-yellow-400 drop-shadow-md" />
            </div>
            <div>
                <h1 className="font-bold text-xl leading-tight">Test Summary</h1>
                <div className="flex gap-4 text-sm mt-1 text-blue-200">
                    <span className="flex items-center gap-1">
                        Score: <span className="text-white font-bold text-lg">{attempt.score}</span>
                    </span>
                    <span className="w-px bg-white/20 h-4 self-center"></span>
                    <span className="flex items-center gap-1">
                        Accuracy: <span className="text-white font-bold text-lg">{accuracy}%</span>
                    </span>
                </div>
            </div>
        </div>
        
        <div className="flex items-center gap-3 text-sm font-medium">
            <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30 text-green-300">
                <IconCheck className="w-5 h-5" /> 
                <span className="hidden sm:inline">Correct:</span> {attempt.correctCount}
            </div>
            <div className="flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/30 text-red-300">
                <IconX className="w-5 h-5" /> 
                <span className="hidden sm:inline">Wrong:</span> {attempt.incorrectCount}
            </div>
            <button 
                onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                className="md:hidden p-2 bg-white/10 rounded-lg ml-2 hover:bg-white/20 transition-colors"
            >
                <IconMenu2 className="w-6 h-6 text-white"/>
            </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT: QUESTION REVIEW AREA */}
        <div className="flex-1 flex flex-col h-full overflow-hidden p-2 md:p-4 bg-slate-100">
            <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col">
                
                {/* Question Header */}
                <div className="px-6 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                     <span className="font-bold text-slate-700 text-sm">Question {currentQuestionIndex + 1}</span>
                     <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-200 text-slate-600 uppercase tracking-wide">
                        {currentQuestion.subject || 'General'}
                     </span>
                </div>

                <div className="p-6 md:p-8 flex-1">
                    {/* Question Text */}
                    <div className="text-lg text-slate-900 leading-relaxed font-medium mb-8">
                        <LatexText text={currentQuestion.question_text} />
                    </div>

                    {/* Options */}
                    <div className="grid gap-3 mb-8">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = userAnswer === index;
                            const isCorrect = correctAnswer === index;
                            
                            let styles = "border-slate-200 hover:bg-slate-50"; // Default
                            let icon = null;
                            const label = String.fromCharCode(65 + index); // A, B, C, D

                            if (isCorrect) {
                                styles = "border-green-500 bg-green-50 ring-1 ring-green-500 shadow-sm";
                                icon = <IconCheck className="w-5 h-5 text-green-600" />;
                            } else if (isSelected && !isCorrect) {
                                styles = "border-red-500 bg-red-50 ring-1 ring-red-500 shadow-sm";
                                icon = <IconX className="w-5 h-5 text-red-600" />;
                            }

                            return (
                                <div 
                                    key={index}
                                    className={`flex items-start justify-between p-4 rounded-lg border transition-all ${styles}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5 shadow-sm
                                            ${isCorrect ? 'border-green-500 text-green-600 bg-white' : isSelected ? 'border-red-500 text-red-600 bg-white' : 'border-slate-300 text-slate-400 bg-white'}
                                        `}>
                                            {label}
                                        </div>
                                        <div className="text-slate-800 pt-0.5">
                                            <LatexText text={option} />
                                        </div>
                                    </div>
                                    {icon}
                                </div>
                            );
                        })}
                    </div>

                    {/* Explanation Section (New UI) */}
                    <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-6 relative overflow-hidden">
                        {/* Decorative background accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
                        
                        <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-4 flex items-center gap-2 relative z-10">
                            <IconInfoCircle className="w-5 h-5 text-blue-600" />
                            Detailed Explanation
                        </h3>
                        <div className="text-slate-700 leading-relaxed text-sm md:text-base relative z-10">
                            <LatexText text={currentQuestion.explanation || "No explanation provided."} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Nav */}
            <div className="mt-3 flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm h-14 shrink-0">
                <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded hover:bg-slate-200 disabled:opacity-50 flex items-center gap-2 transition-colors text-sm"
                >
                    <IconChevronLeft className="w-4 h-4" /> Previous
                </button>
                
                <Link 
                    href="/mock-tests"
                    className="text-sm font-semibold text-slate-500 hover:text-indigo-600 underline decoration-2 decoration-indigo-200 hover:decoration-indigo-600 transition-all hidden sm:block"
                >
                    Back to Dashboard
                </Link>

                <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="px-6 py-2 bg-[#0072BC] text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors text-sm shadow-sm"
                >
                    Next <IconChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* RIGHT: PALETTE (Sidebar) */}
        <div className={`
            fixed inset-y-0 right-0 w-80 bg-white border-l border-slate-200 z-30 transform transition-transform duration-300 shadow-xl md:shadow-none
            md:relative md:transform-none md:w-72 md:flex md:flex-col md:m-2 md:ml-0 md:rounded-lg md:border
            ${isPaletteOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
            {/* Mobile Close Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center md:hidden bg-slate-50">
                <span className="font-bold text-slate-700">Question Palette</span>
                <button onClick={() => setIsPaletteOpen(false)}><IconX className="w-6 h-6 text-slate-400"/></button>
            </div>

            {/* Legend */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 grid grid-cols-2 gap-3 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-green-500 shadow-sm"></div> Correct</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-red-500 shadow-sm"></div> Incorrect</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-slate-200 border border-slate-300"></div> Unattempted</div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4 bg-white">
                <div className="grid grid-cols-5 gap-2 content-start">
                    {questions.map((q, idx) => {
                        const status = getQuestionStatus(q.id, q.correct_answers[0]);
                        return (
                            <button
                                key={q.id}
                                onClick={() => { setCurrentQuestionIndex(idx); setIsPaletteOpen(false); }}
                                className={`
                                    aspect-square rounded text-xs font-bold border flex items-center justify-center transition-all relative
                                    ${getPaletteColor(status)}
                                    ${currentQuestionIndex === idx ? 'ring-2 ring-indigo-600 ring-offset-1 z-10 scale-110 shadow-md' : ''}
                                `}
                            >
                                {idx + 1}
                            </button>
                        );
                    })}
                </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50">
                 <Link href="/mock-tests" className="block w-full py-3 bg-slate-800 text-white font-bold text-center rounded hover:bg-slate-900 transition-colors shadow-sm text-sm">
                    Exit Review
                 </Link>
            </div>
        </div>
      </div>
    </div>
  );
};