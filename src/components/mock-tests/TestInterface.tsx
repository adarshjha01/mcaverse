"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { LatexText } from '@/components/ui/LatexText'; // Ensure you have this component

type Question = {
  id: string;
  question_text: string;
  options: string[];
};

type MockTest = {
  id: string;
  title: string;
  durationInMinutes: number;
  question_ids: string[];
};

type TestInterfaceProps = {
  test: MockTest;
  questions: Question[];
};

export const TestInterface = ({ test, questions }: TestInterfaceProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(test.durationInMinutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to submit the test
  const handleSubmit = useCallback(async () => {
    if (!user) {
      alert("Please log in to submit your test.");
      router.push('/login');
      return;
    }

    if (isSubmitting) return;

    // Only confirm if triggered manually (time left > 0)
    if (timeLeft > 0 && !window.confirm("Are you sure you want to submit the test?")) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/mock-tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          testId: test.id,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      const result = await response.json();
      router.push(`/mock-tests/take/${test.id}/results/${result.attemptId}`);

    } catch (error) {
      console.error("Error submitting test:", error);
      alert("There was an error submitting your test. Please try again.");
      setIsSubmitting(false);
    }
  }, [user, test.id, answers, isSubmitting, router, timeLeft]);

  // Timer Effect (Fixed: Removed Duplicate)
  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit();
    }
    const timer = setInterval(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleSubmit]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const currentQuestion = questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-md border border-slate-200 dark:border-slate-800">
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{test.title}</h1>
        <div className="text-lg font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-4 py-2 rounded-md">
          Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
      </div>

      {currentQuestion ? (
        <div>
          <div className="flex items-baseline gap-2 mb-4">
             <span className="text-xl font-semibold text-slate-900 dark:text-white">Q{currentQuestionIndex + 1}.</span>
             <div className="text-lg text-slate-800 dark:text-slate-200">
                <LatexText text={currentQuestion.question_text} />
             </div>
          </div>
          
          <div className="space-y-3 mt-6">
            {currentQuestion.options.map((option, index) => (
              <label 
                key={index} 
                className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${
                    answers[currentQuestion.id] === index 
                    ? 'bg-indigo-50 border-indigo-500 dark:bg-indigo-900/20 dark:border-indigo-400' 
                    : 'border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={index}
                  checked={answers[currentQuestion.id] === index}
                  onChange={() => handleSelectOption(currentQuestion.id, index)}
                  className="mt-1 mr-3"
                />
                <span className="text-slate-700 dark:text-slate-300">
                   <LatexText text={option} />
                </span>
              </label>
            ))}
          </div>
        </div>
      ) : (
          <div className="text-center py-10">
              <p className="text-slate-500 dark:text-slate-400">No questions available for this test.</p>
          </div>
      )}

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-white font-semibold px-6 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-green-400"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Test'}
        </button>
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
          disabled={currentQuestionIndex >= questions.length - 1}
          className="bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-white font-semibold px-6 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};