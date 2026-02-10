// src/components/mock-tests/TestResults.tsx
"use client";

import Link from 'next/link';
import { LatexText } from '@/components/ui/LatexText'; // <--- Import the component

// --- Type Definitions ---
type Question = {
  id: string;
  question_text: string;
  options: string[];
  correct_answers: number[];
  explanation: string;
};

type UserAttempt = {
  id: string;
  score: number;
  correctCount: number;
  incorrectCount: number;
  totalAttempted: number;
  answers: { [key: string]: number };
};

type TestResultsProps = {
  attempt: UserAttempt;
  questions: Question[];
};

export const TestResults = ({ attempt, questions }: TestResultsProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Score Summary */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-md border border-slate-200 dark:border-slate-800 mb-8">
        <h1 className="text-3xl font-bold text-center mb-4 text-slate-900 dark:text-white">Test Results</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{attempt.score}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Score</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">{attempt.correctCount}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Correct</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-red-500 dark:text-red-400">{attempt.incorrectCount}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Incorrect</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-slate-700 dark:text-slate-300">{questions.length - attempt.totalAttempted}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Unattempted</p>
          </div>
        </div>
      </div>

      {/* Detailed Question Review */}
      <div className="space-y-6">
        {questions.map((q, index) => {
          const userAnswerIndex = attempt.answers[q.id];
          const correctAnswerIndex = q.correct_answers[0];
          const isCorrect = userAnswerIndex === correctAnswerIndex;
          const isAttempted = userAnswerIndex !== undefined;

          // Determine class based on correctness
          let borderClass = 'border-slate-200 dark:border-slate-800';
          if (isAttempted) {
             borderClass = isCorrect ? 'border-green-200 dark:border-green-900' : 'border-red-200 dark:border-red-900';
          }

          return (
            <div key={q.id} className={`bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md border ${borderClass}`}>
              <div className="font-semibold mb-4 text-slate-900 dark:text-white flex gap-2">
                 <span>Q{index + 1}:</span>
                 <div className="flex-1">
                    <LatexText text={q.question_text} />
                 </div>
              </div>

              <div className="space-y-2 mb-4">
                {q.options.map((option, i) => {
                  let optionClass = 'bg-white border-slate-300 dark:bg-slate-900 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                  
                  // Highlight Logic
                  if (i === correctAnswerIndex) {
                    optionClass = 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-500 dark:text-green-200';
                  } else if (isAttempted && !isCorrect && i === userAnswerIndex) {
                    optionClass = 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-500 dark:text-red-200';
                  }

                  return (
                    <div key={i} className={`p-3 rounded-md border-2 ${optionClass}`}>
                       <LatexText text={option} />
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-sm bg-slate-50 dark:bg-slate-800/50 p-4 rounded-md text-slate-800 dark:text-slate-200">
                <p className="mb-2">
                    <strong>Your Answer: </strong> 
                    <span className={isCorrect ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-red-600 dark:text-red-400 font-semibold'}>
                        {isAttempted ? <LatexText text={q.options[userAnswerIndex]} /> : 'Not Attempted'}
                    </span>
                </p>
                <p className="mb-2">
                    <strong>Correct Answer: </strong> 
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                        <LatexText text={q.options[correctAnswerIndex]} />
                    </span>
                </p>
                <div className="mt-3">
                    <strong>Explanation:</strong>
                    <div className="mt-1 text-slate-600 dark:text-slate-300">
                        <LatexText text={q.explanation} />
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-8 pb-10">
        <Link href="/mock-tests" className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
          Back to All Tests
        </Link>
      </div>
    </div>
  );
};