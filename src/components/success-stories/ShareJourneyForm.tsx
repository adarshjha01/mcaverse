// src/components/success-stories/ShareJourneyForm.tsx
"use client";

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { submitSuccessStory } from '@/app/actions';

// A helper component for the submit button to show a "pending" state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="mt-6 w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400"
    >
      {pending ? "Submitting..." : "Share My Story"}
    </button>
  );
}

export const ShareJourneyForm = () => {
  const [state, formAction] = useActionState(submitSuccessStory, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    // Updated container to match GuestApplicationForm
    <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200 sticky top-24">
      <h2 className="text-2xl font-bold mb-4">Share Your Journey</h2>
      <p className="text-slate-600 mb-6">
        Inspire the next generation of MCA students by sharing your success story with the community.
      </p>
      <form ref={formRef} action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">Your Name</label>
          {/* Updated input styles */}
          <input type="text" id="name" name="name" required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          {state?.errors?.name && <p className="text-sm text-red-500 mt-1">{state.errors.name[0]}</p>}
        </div>
        <div>
          <label htmlFor="batch" className="block text-sm font-medium text-slate-700">Batch Year (e.g., 2022)</label>
          <input type="text" id="batch" name="batch" required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          {state?.errors?.batch && <p className="text-sm text-red-500 mt-1">{state.errors.batch[0]}</p>}
        </div>
        <div>
          <label htmlFor="storyTitle" className="block text-sm font-medium text-slate-700">Story Title</label>
          <input type="text" id="storyTitle" name="storyTitle" required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          {state?.errors?.storyTitle && <p className="text-sm text-red-500 mt-1">{state.errors.storyTitle[0]}</p>}
        </div>
        <div>
          <label htmlFor="storyContent" className="block text-sm font-medium text-slate-700">Your Story</label>
          <textarea id="storyContent" name="storyContent" rows={5} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
          {state?.errors?.storyContent && <p className="text-sm text-red-500 mt-1">{state.errors.storyContent[0]}</p>}
        </div>
        <SubmitButton />
        {state?.message && <p className={`text-sm mt-4 text-center ${state.success ? 'text-green-600' : 'text-red-500'}`}>{state.message}</p>}
      </form>
    </div>
  );
};
