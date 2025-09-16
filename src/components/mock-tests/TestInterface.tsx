// src/components/mock-tests/TestInterface.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

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

  // Timer effect
  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit();
    }
    const timer = setInterval(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = useCallback(async () => {
    if (!user) {
      alert("Please log in to submit your test.");
      router.push('/login');
      return;
    }

    if (isSubmitting) return;

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
      
      // Redirect to the correct results page URL
      router.push(`/mock-tests/take/${test.id}/results/${result.attemptId}`);

    } catch (error) {
      console.error("Error submitting test:", error);
      alert("There was an error submitting your test. Please try again.");
      setIsSubmitting(false);
    }
  }, [user, test.id, answers, isSubmitting, router, timeLeft]);

  useEffect(() => {
  if (timeLeft === 0) {
    handleSubmit();
  }
  const timer = setInterval(() => {
    setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
  }, 1000);
  return () => clearInterval(timer);
}, [timeLeft, handleSubmit]);

  const currentQuestion = questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">{test.title}</h1>
        <div className="text-lg font-semibold bg-red-100 text-red-700 px-4 py-2 rounded-md">
          Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
      </div>

      {currentQuestion ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Question {currentQuestionIndex + 1} of {questions.length}</h2>
          <p className="text-slate-700 mb-6 whitespace-pre-wrap">{currentQuestion.question_text}</p>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className={`block p-4 rounded-lg border cursor-pointer transition-colors ${answers[currentQuestion.id] === index ? 'bg-indigo-100 border-indigo-500' : 'border-slate-300 hover:bg-slate-50'}`}>
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={index}
                  checked={answers[currentQuestion.id] === index}
                  onChange={() => handleSelectOption(currentQuestion.id, index)}
                  className="mr-3"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ) : (
          <div className="text-center py-10">
              <p className="text-slate-500">No questions available for this test.</p>
          </div>
      )}

      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="bg-slate-200 text-slate-800 font-semibold px-6 py-2 rounded-lg hover:bg-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed"
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
          className="bg-slate-200 text-slate-800 font-semibold px-6 py-2 rounded-lg hover:bg-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};
