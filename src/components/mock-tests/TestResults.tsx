// src/components/mock-tests/TestResults.tsx
"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
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
import { ReportBugModal, ReportBugButton } from '@/components/mock-tests/ReportBugModal';

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
  submittedAt: string;
};

type TestResultsProps = {
  attempt: UserAttempt;
  questions: Question[];
  testId: string;
};

type QuestionStatus = 'correct' | 'incorrect' | 'unattempted';

export const TestResults = ({ attempt, questions, testId }: TestResultsProps) => {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [showSummary, setShowSummary] = useState(true);
  const [reportBugOpen, setReportBugOpen] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = attempt.answers[currentQuestion?.id];
  const correctAnswer = currentQuestion?.correct_answers[0];
  
  const getQuestionStatus = (qId: string, correctIdx: number): QuestionStatus => {
    const userAns = attempt.answers[qId];
    if (userAns === undefined) return 'unattempted';
    if (userAns === correctIdx) return 'correct';
    return 'incorrect';
  };

  const totalQuestions = questions.length;
  const totalAttempted = attempt.totalAttempted ?? (attempt.correctCount + attempt.incorrectCount);
  const unattemptedCount = totalQuestions - totalAttempted;
  const accuracy = totalAttempted > 0 
    ? Math.round((attempt.correctCount / totalAttempted) * 100) 
    : 0;

  // Per-subject breakdown
  const subjectStats = useMemo(() => {
    const stats: Record<string, { correct: number; incorrect: number; unattempted: number; total: number }> = {};
    questions.forEach(q => {
      const subject = q.subject || 'General';
      if (!stats[subject]) stats[subject] = { correct: 0, incorrect: 0, unattempted: 0, total: 0 };
      stats[subject].total++;
      const status = getQuestionStatus(q.id, q.correct_answers[0]);
      if (status === 'correct') stats[subject].correct++;
      else if (status === 'incorrect') stats[subject].incorrect++;
      else stats[subject].unattempted++;
    });
    return stats;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, attempt.answers]);

  const getPaletteClass = (status: QuestionStatus) => {
    switch (status) {
      case 'correct': return 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-200 dark:shadow-emerald-900/30';
      case 'incorrect': return 'bg-red-500 text-white border-red-600 shadow-red-200 dark:shadow-red-900/30';
      default: return 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-500';
    }
  };

  // Summary overlay
  if (showSummary) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Score Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Top gradient banner */}
            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-6 md:p-8 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgMHYyaC0ydi0yaDJ6bTIgMGgydjJoLTJ2LTJ6bS0yLTR2Mmgtdi0yaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <IconTrophy className="w-8 h-8 text-yellow-300 drop-shadow-md" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">Test Completed!</h1>
                <p className="text-blue-100 text-sm">Here&apos;s your performance summary</p>
              </div>
            </div>

            {/* Score Display */}
            <div className="p-6 md:p-8">
              {/* Big score + accuracy */}
              <div className="flex items-center justify-center gap-8 md:gap-12 mb-8">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{attempt.score}</div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Score</div>
                </div>
                <div className="w-px h-16 bg-slate-200 dark:bg-slate-700"></div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{accuracy}<span className="text-2xl">%</span></div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Accuracy</div>
                </div>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-center">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <IconCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{attempt.correctCount}</div>
                  <div className="text-xs font-medium text-emerald-600 dark:text-emerald-500">Correct</div>
                </div>
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                    <IconX className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="text-2xl font-bold text-red-700 dark:text-red-400">{attempt.incorrectCount}</div>
                  <div className="text-xs font-medium text-red-600 dark:text-red-500">Wrong</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <span className="text-slate-500 dark:text-slate-400 text-xs font-bold">—</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{unattemptedCount}</div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Skipped</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  <span>Performance Breakdown</span>
                  <span>{totalQuestions} Questions</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden flex">
                  {attempt.correctCount > 0 && (
                    <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(attempt.correctCount / totalQuestions) * 100}%` }} />
                  )}
                  {attempt.incorrectCount > 0 && (
                    <div className="bg-red-500 h-full transition-all" style={{ width: `${(attempt.incorrectCount / totalQuestions) * 100}%` }} />
                  )}
                  {unattemptedCount > 0 && (
                    <div className="bg-slate-300 dark:bg-slate-500 h-full transition-all" style={{ width: `${(unattemptedCount / totalQuestions) * 100}%` }} />
                  )}
                </div>
                <div className="flex gap-4 mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Correct</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>Wrong</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-500"></span>Skipped</span>
                </div>
              </div>

              {/* Subject breakdown */}
              {Object.keys(subjectStats).length > 1 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Subject-wise Analysis</h3>
                  <div className="space-y-2">
                    {Object.entries(subjectStats).map(([subject, stats]) => {
                      const subjectAcc = (stats.correct + stats.incorrect) > 0 
                        ? Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100) 
                        : 0;
                      return (
                        <div key={subject} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 rounded-lg px-4 py-2.5 border border-slate-100 dark:border-slate-700">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate mr-4">{subject}</span>
                          <div className="flex items-center gap-3 text-xs font-semibold shrink-0">
                            <span className="text-emerald-600 dark:text-emerald-400">{stats.correct}✓</span>
                            <span className="text-red-500 dark:text-red-400">{stats.incorrect}✗</span>
                            <span className="text-slate-400">{stats.unattempted} skip</span>
                            <span className="text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-md">{subjectAcc}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSummary(false)}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-colors text-sm"
                >
                  Review All Questions
                </button>
                <Link
                  href="/mock-tests"
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-center transition-colors text-sm border border-slate-200 dark:border-slate-600"
                >
                  Back to Tests
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- QUESTION REVIEW MODE ---
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-[calc(100vh-48px)] bg-slate-50 dark:bg-slate-950 font-sans transition-colors">
      
      {/* REPORT BUG MODAL */}
      {currentQuestion && user && (
        <ReportBugModal
          isOpen={reportBugOpen}
          onClose={() => setReportBugOpen(false)}
          questionId={currentQuestion.id}
          questionNumber={currentQuestionIndex + 1}
          testId={testId}
          getToken={() => user.getIdToken()}
        />
      )}

      {/* SCORE HEADER BAR */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSummary(true)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500 dark:text-slate-400">
            <IconChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base">Review Answers</h1>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>Score: <span className="text-slate-800 dark:text-slate-100 font-bold">{attempt.score}</span></span>
              <span className="w-px h-3 bg-slate-300 dark:bg-slate-600"></span>
              <span className="text-emerald-600 dark:text-emerald-400">{attempt.correctCount}✓</span>
              <span className="text-red-500 dark:text-red-400">{attempt.incorrectCount}✗</span>
              <span className="text-slate-400">{unattemptedCount} skip</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/mock-tests" className="hidden sm:block px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
            Exit Review
          </Link>
          <button 
            onClick={() => setIsPaletteOpen(!isPaletteOpen)}
            className="md:hidden p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <IconMenu2 className="w-5 h-5 text-slate-600 dark:text-slate-300"/>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT: QUESTION REVIEW AREA */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
                    
                    {/* Question Number + Status Badge */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">Question {currentQuestionIndex + 1}</span>
                            {(() => {
                              const status = getQuestionStatus(currentQuestion.id, correctAnswer);
                              if (status === 'correct') return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">Correct</span>;
                              if (status === 'incorrect') return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">Wrong</span>;
                              return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">Skipped</span>;
                            })()}
                        </div>
                        <div className="flex items-center gap-2">
                            <ReportBugButton onClick={() => setReportBugOpen(true)} />
                            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wide border border-slate-200 dark:border-slate-700">
                                {currentQuestion.subject || 'General'}
                            </span>
                        </div>
                    </div>

                    {/* Question Text */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 md:p-6 shadow-sm">
                        <div className="text-base md:text-lg text-slate-900 dark:text-slate-100 leading-relaxed font-medium select-none">
                            <LatexText text={currentQuestion.question_text} />
                        </div>
                    </div>

                    {/* Options */}
                    <div className="grid gap-3">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = userAnswer === index;
                            const isCorrect = correctAnswer === index;
                            const label = String.fromCharCode(65 + index);

                            let containerClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700";
                            let labelBgClass = "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600";
                            let icon = null;

                            if (isCorrect) {
                                containerClass = "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 ring-1 ring-emerald-200 dark:ring-emerald-800";
                                labelBgClass = "bg-emerald-500 text-white border-emerald-600";
                                icon = <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0"><IconCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /></div>;
                            } else if (isSelected && !isCorrect) {
                                containerClass = "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700 ring-1 ring-red-200 dark:ring-red-800";
                                labelBgClass = "bg-red-500 text-white border-red-600";
                                icon = <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0"><IconX className="w-3.5 h-3.5 text-red-600 dark:text-red-400" /></div>;
                            }

                            return (
                                <div 
                                    key={index}
                                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all shadow-sm ${containerClass}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 text-sm font-bold ${labelBgClass}`}>
                                            {label}
                                        </div>
                                        <div className="text-slate-800 dark:text-slate-200 text-sm md:text-base">
                                            <LatexText text={option} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 ml-2">
                                        {isSelected && !isCorrect && <span className="text-[10px] font-bold text-red-500 dark:text-red-400 uppercase">Your answer</span>}
                                        {isCorrect && isSelected && <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Your answer</span>}
                                        {isCorrect && !isSelected && <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Correct</span>}
                                        {icon}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Explanation */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-5 md:p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-40 -mr-10 -mt-10"></div>
                        
                        <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-3 flex items-center gap-2 relative z-10">
                            <IconInfoCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            Explanation
                        </h3>
                        <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base relative z-10">
                            <LatexText text={currentQuestion.explanation || "No explanation provided for this question."} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Nav */}
            <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-4 flex items-center justify-between h-14 shrink-0 shadow-[0_-2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_-2px_8px_rgba(0,0,0,0.2)]">
                <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 flex items-center gap-2 transition-colors text-sm border border-slate-200 dark:border-slate-700"
                >
                    <IconChevronLeft className="w-4 h-4" /> Previous
                </button>
                
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                    {currentQuestionIndex + 1} of {totalQuestions}
                </span>

                <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition-colors text-sm shadow-sm"
                >
                    Next <IconChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* RIGHT: QUESTION PALETTE */}
        <div className={`
            fixed inset-y-0 right-0 w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 z-30 transform transition-transform duration-200 shadow-xl md:shadow-none
            md:relative md:transform-none md:w-72 md:flex md:flex-col md:shrink-0
            ${isPaletteOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
            {/* Mobile close */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center md:hidden bg-slate-50 dark:bg-slate-800">
                <span className="font-bold text-slate-700 dark:text-slate-200">Question Palette</span>
                <button onClick={() => setIsPaletteOpen(false)} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"><IconX className="w-5 h-5"/></button>
            </div>

            {/* Legend */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 shrink-0">
                <div className="grid grid-cols-3 gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500 shadow-sm"></span> Correct</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-500 shadow-sm"></span> Wrong</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-600 border border-slate-300 dark:border-slate-500"></span> Skipped</div>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-3 bg-blue-50/30 dark:bg-slate-800/30">
                <h3 className="font-bold text-xs mb-3 text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">All Questions</h3>
                <div className="grid grid-cols-5 gap-2 content-start">
                    {questions.map((q, idx) => {
                        const status = getQuestionStatus(q.id, q.correct_answers[0]);
                        return (
                            <button
                                key={q.id}
                                onClick={() => { setCurrentQuestionIndex(idx); setIsPaletteOpen(false); }}
                                className={`
                                    aspect-square rounded-lg text-xs font-bold border flex items-center justify-center transition-all relative shadow-sm
                                    ${getPaletteClass(status)}
                                    ${currentQuestionIndex === idx ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 ring-offset-1 dark:ring-offset-slate-900 z-10 scale-110' : ''}
                                `}
                            >
                                {idx + 1}
                            </button>
                        );
                    })}
                </div>
            </div>
            
            {/* Bottom actions */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shrink-0 space-y-2">
                <button onClick={() => setShowSummary(true)} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm text-sm transition-colors">
                    View Summary
                </button>
                <Link href="/mock-tests" className="block w-full py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-center rounded-lg text-sm transition-colors">
                    Exit Review
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};