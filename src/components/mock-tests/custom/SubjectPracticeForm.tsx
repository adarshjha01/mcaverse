// src/components/mock-tests/custom/SubjectPracticeForm.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

type SubjectPracticeFormProps = {
  subjects: string[];
};

export const SubjectPracticeForm = ({ subjects }: SubjectPracticeFormProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
        alert("Please log in to create a test.");
        router.push('/login');
        return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const subject = formData.get('subject') as string;
    const numQuestions = Number(formData.get('numQuestions'));
    const duration = Number(formData.get('duration'));

    try {
        const response = await fetch('/api/mock-tests/create-custom', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                subject,
                numQuestions,
                duration,
                userId: user.uid
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to create the test.');
        }

        if (result.success && result.testId) {
            router.push(`/mock-tests/take/${result.testId}`);
        } else {
            setError(result.error || 'An unknown error occurred.');
        }
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg border border-slate-200 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 text-center">Create Your Custom Test</h2>
      
      {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md">{error}</p>}
      
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
          Select Subject
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {subjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="numQuestions" className="block text-sm font-medium text-slate-700 mb-2">
          Number of Questions
        </label>
        <input
          type="number"
          id="numQuestions"
          name="numQuestions"
          defaultValue="10"
          min="5"
          max="50"
          required
          className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-2">
          Duration (in minutes)
        </label>
        <input
          type="number"
          id="duration"
          name="duration"
          defaultValue="15"
          min="10"
          max="120"
          required
          className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 transition-colors"
        >
          {loading ? 'Generating...' : 'Generate Test'}
        </button>
      </div>
    </form>
  );
};

