// src/components/practice/DailyPractice.tsx
"use client";

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

// Add these type definitions
type DppQuestion = {
    id: string;
    question_text: string;
    options: string[];
};

type Dpp = {
    id: string;
    questions: DppQuestion[];
};

// Update the component's props from 'any' to the new 'Dpp' type
export const DailyPractice = ({ dpp }: { dpp: Dpp }) => {
    const { user } = useAuth();
    const router = useRouter();
    const [answers, setAnswers] = useState<{ [key: string]: number }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSelectOption = (questionId: string, optionIndex: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleSubmit = async () => {
        if (!user) {
            alert("Please log in to submit your practice.");
            return;
        }
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/dpp/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.uid,
                    dppId: dpp.id,
                    answers,
                }),
            });

            if (!response.ok) throw new Error("Submission failed");
            
            const result = await response.json();
            alert(`You scored ${result.score} out of ${result.totalQuestions}!`);
            router.refresh();

        } catch (error) {
            alert("Error submitting your practice.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
            <h2 className="text-2xl font-bold mb-6">Today&apos;s DPP</h2>
            {dpp.questions.map((q: DppQuestion, index: number) => (
                <div key={q.id} className="mb-8">
                    <p className="font-semibold mb-4">Question {index + 1}: {q.question_text}</p>
                    <div className="space-y-3">
                        {q.options.map((option: string, i: number) => (
                            <label key={i} className={`block p-4 rounded-lg border-2 cursor-pointer ${answers[q.id] === i ? 'bg-indigo-100 border-indigo-500' : 'border-slate-300'}`}>
                                <input
                                    type="radio"
                                    name={q.id}
                                    checked={answers[q.id] === i}
                                    onChange={() => handleSelectOption(q.id, i)}
                                    className="mr-3"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </div>
            ))}
            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700"
            >
                {isSubmitting ? 'Submitting...' : 'Submit Practice'}
            </button>
        </div>
    );
};