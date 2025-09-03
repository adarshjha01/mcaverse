// src/components/mock-tests/TestResults.tsx
"use client";

import Link from 'next/link';

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
      <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200 mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">Test Results</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-4xl font-bold text-indigo-600">{attempt.score}</p>
            <p className="text-sm text-slate-500">Total Score</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-green-600">{attempt.correctCount}</p>
            <p className="text-sm text-slate-500">Correct</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-red-500">{attempt.incorrectCount}</p>
            <p className="text-sm text-slate-500">Incorrect</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-slate-700">{questions.length - attempt.totalAttempted}</p>
            <p className="text-sm text-slate-500">Unattempted</p>
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

          return (
            <div key={q.id} className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
              <p className="font-semibold mb-4">Question {index + 1}: {q.question_text}</p>
              <div className="space-y-2 mb-4">
                {q.options.map((option, i) => {
                  let borderColor = 'border-slate-300';
                  if (i === correctAnswerIndex) borderColor = 'border-green-500';
                  if (isAttempted && !isCorrect && i === userAnswerIndex) borderColor = 'border-red-500';

                  return (
                    <div key={i} className={`p-3 rounded-md border-2 ${borderColor}`}>
                      {option}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 text-sm">
                <p><strong>Your Answer:</strong> <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{isAttempted ? q.options[userAnswerIndex] : 'Not Attempted'}</span></p>
                <p><strong>Correct Answer:</strong> <span className="text-green-600">{q.options[correctAnswerIndex]}</span></p>
                <p className="mt-2"><strong>Explanation:</strong> {q.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Link href="/mock-tests" className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700">
          Back to All Tests
        </Link>
      </div>
    </div>
  );
};