// src/components/mock-tests/ReportBugModal.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { IconX } from '@/components/ui/Icons';

const REPORT_CATEGORIES = [
  { value: 'wrong_answer', label: 'Wrong Answer', emoji: '❌' },
  { value: 'wrong_explanation', label: 'Wrong Explanation', emoji: '📝' },
  { value: 'formatting_issue', label: 'Formatting / Display Issue', emoji: '🔤' },
  { value: 'unclear_question', label: 'Unclear Question', emoji: '❓' },
  { value: 'duplicate_question', label: 'Duplicate Question', emoji: '♻️' },
  { value: 'other', label: 'Other', emoji: '💬' },
] as const;

type ReportCategory = typeof REPORT_CATEGORIES[number]['value'];

type ReportBugModalProps = {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
  questionNumber: number;
  testId: string;
  getToken: () => Promise<string>;
  /** Use light-only styles (for test page). Defaults to false (dark mode aware). */
  lightOnly?: boolean;
};

export function ReportBugModal({
  isOpen,
  onClose,
  questionId,
  questionNumber,
  testId,
  getToken,
  lightOnly = false,
}: ReportBugModalProps) {
  const [category, setCategory] = useState<ReportCategory | ''>('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<'success' | 'duplicate' | 'error' | null>(null);

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setCategory('');
      setDescription('');
      setResult(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleSubmit = useCallback(async () => {
    if (!category || !description.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const token = await getToken();
      const res = await fetch('/api/question-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          questionId,
          testId,
          category,
          description: description.trim(),
          questionNumber,
        }),
      });

      if (res.status === 409) {
        setResult('duplicate');
      } else if (!res.ok) {
        setResult('error');
      } else {
        setResult('success');
      }
    } catch {
      setResult('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [category, description, isSubmitting, getToken, questionId, testId, questionNumber]);

  if (!isOpen) return null;

  // Style helpers for light-only vs dark-mode-aware
  const bg = lightOnly ? 'bg-white' : 'bg-white dark:bg-slate-800';
  const border = lightOnly ? 'border-slate-200' : 'border-slate-200 dark:border-slate-700';
  const textPrimary = lightOnly ? 'text-slate-800' : 'text-slate-800 dark:text-slate-100';
  const textSecondary = lightOnly ? 'text-slate-500' : 'text-slate-500 dark:text-slate-400';
  const cardBg = lightOnly ? 'bg-slate-50' : 'bg-slate-50 dark:bg-slate-700/50';
  const cardBorder = lightOnly ? 'border-slate-200' : 'border-slate-200 dark:border-slate-600';
  const inputBg = lightOnly ? 'bg-white border-slate-300' : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 dark:text-slate-100';
  const selectedBorder = lightOnly ? 'border-indigo-500 bg-indigo-50' : 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30';

  // Result screen
  if (result) {
    const isSuccess = result === 'success';
    const isDuplicate = result === 'duplicate';
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
        <div className={`${bg} rounded-xl shadow-2xl p-6 max-w-sm w-full border ${border}`} onClick={e => e.stopPropagation()}>
          <div className="text-center">
            <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl ${isSuccess ? 'bg-emerald-100' : isDuplicate ? 'bg-amber-100' : 'bg-red-100'}`}>
              {isSuccess ? '✅' : isDuplicate ? '⚠️' : '❌'}
            </div>
            <h3 className={`font-bold text-lg mb-2 ${textPrimary}`}>
              {isSuccess ? 'Report Submitted!' : isDuplicate ? 'Already Reported' : 'Something went wrong'}
            </h3>
            <p className={`text-sm mb-5 ${textSecondary}`}>
              {isSuccess
                ? 'Thanks for reporting! We\'ll review this question.'
                : isDuplicate
                ? 'You\'ve already submitted a report for this issue on this question.'
                : 'Failed to submit the report. Please try again later.'}
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className={`${bg} rounded-xl shadow-2xl max-w-md w-full border ${border} max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${border}`}>
          <div>
            <h3 className={`font-bold text-base ${textPrimary}`}>Report an Issue</h3>
            <p className={`text-xs ${textSecondary} mt-0.5`}>Question #{questionNumber} &middot; ID: {questionId.slice(0, 8)}...</p>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg hover:bg-slate-100 ${lightOnly ? '' : 'dark:hover:bg-slate-700'} transition-colors ${textSecondary}`}>
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Category selection */}
          <div>
            <label className={`text-sm font-semibold ${textPrimary} mb-2 block`}>What&apos;s the issue?</label>
            <div className="grid grid-cols-2 gap-2">
              {REPORT_CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`text-left px-3 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                    category === cat.value
                      ? `${selectedBorder} ring-1 ${lightOnly ? 'ring-indigo-300 text-indigo-700' : 'ring-indigo-300 dark:ring-indigo-600 text-indigo-700 dark:text-indigo-300'}`
                      : `${cardBg} ${cardBorder} ${textSecondary} hover:border-slate-300 ${lightOnly ? '' : 'dark:hover:border-slate-500'}`
                  }`}
                >
                  <span className="mr-1.5">{cat.emoji}</span> {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={`text-sm font-semibold ${textPrimary} mb-2 block`}>Describe the issue</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. The correct answer should be option B, not C..."
              maxLength={1000}
              rows={3}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400 ${inputBg}`}
            />
            <div className={`text-right text-[10px] mt-1 ${textSecondary}`}>{description.length}/1000</div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex gap-3 px-5 py-4 border-t ${border}`}>
          <button
            onClick={onClose}
            className={`flex-1 py-2.5 rounded-lg border font-semibold text-sm transition-colors ${lightOnly ? 'border-slate-300 text-slate-600 hover:bg-slate-50' : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!category || !description.trim() || isSubmitting}
            className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
}

// The tiny button to trigger the modal
export function ReportBugButton({ onClick, lightOnly = false }: { onClick: () => void; lightOnly?: boolean }) {
  return (
    <button
      onClick={onClick}
      title="Report an issue with this question"
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all group ${
        lightOnly
          ? 'text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200'
          : 'text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-transparent hover:border-red-200 dark:hover:border-red-800'
      }`}
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
      </svg>
      <span className="hidden sm:inline">Report</span>
    </button>
  );
}
