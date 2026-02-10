// src/components/mock-tests/custom/TopicPracticeForm.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

type SubjectsWithTopics = {
  [subject: string]: string[];
};

type TopicPracticeFormProps = {
  data: SubjectsWithTopics;
};

export const TopicPracticeForm = ({ data }: TopicPracticeFormProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subjects = Object.keys(data).sort();
  const [selectedSubject, setSelectedSubject] = useState(subjects[0] || '');

  // ✅ FIX 1: topics is always derived from the current selectedSubject live
  const topics = selectedSubject ? (data[selectedSubject] ?? []) : [];

  // ✅ FIX 2: selectedTopic is tracked in state so it resets when subject changes
  const [selectedTopic, setSelectedTopic] = useState(topics[0] || '');

  const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubject = event.target.value;
    setSelectedSubject(newSubject);
    // ✅ FIX 3: immediately reset topic to the first valid topic of the new subject
    const newTopics = data[newSubject] ?? [];
    setSelectedTopic(newTopics[0] || '');
  };

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
    const topic = formData.get('topic') as string;
    const numQuestions = Number(formData.get('numQuestions'));
    const duration = Number(formData.get('duration'));

    try {
      const response = await fetch('/api/mock-tests/create-custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic,
          numQuestions,
          duration,
          userId: user.uid
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create test.');
      }

      if (result.success && result.testId) {
        router.push(`/mock-tests/take/${result.testId}`);
      } else {
        setError(result.error || 'An unknown error occurred.');
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center">
        Create Your Custom Test
      </h2>

      {error && (
        <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-950/50 p-3 rounded-md">
          {error}
        </p>
      )}

      {/* Subject Dropdown */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Select Subject
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={selectedSubject}
          onChange={handleSubjectChange}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
        >
          {subjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>

      {/* Topic Dropdown */}
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Select Topic
        </label>
        <select
          id="topic"
          name="topic"
          required
          // ✅ FIX 4: key forces React to fully remount this select when subject changes,
          //    so the browser's internal selected-option state is wiped clean
          key={selectedSubject}
          value={selectedTopic}
          onChange={e => setSelectedTopic(e.target.value)}
          disabled={!selectedSubject || topics.length === 0}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2"
        >
          {topics.length === 0 ? (
            <option value="">No topics available</option>
          ) : (
            topics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))
          )}
        </select>
        {/* ✅ FIX 5: Show topic count so user knows what's available */}
        {selectedSubject && topics.length > 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {topics.length} topic{topics.length !== 1 ? 's' : ''} available
          </p>
        )}
      </div>

      {/* Number of Questions */}
      <div>
        <label htmlFor="numQuestions" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
        />
      </div>

      {/* Duration */}
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading || topics.length === 0}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors"
        >
          {loading ? 'Generating...' : 'Generate Test'}
        </button>
      </div>
    </form>
  );
};