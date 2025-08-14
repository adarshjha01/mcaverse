// src/components/community/NewPostForm.tsx
"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createDiscussionPost } from '@/app/actions';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400">
      {pending ? "Posting..." : "Post Discussion"}
    </button>
  );
}

export const NewPostForm = () => {
  const [state, formAction] = useActionState(createDiscussionPost, null);

  return (
    <form action={formAction} className="bg-white p-8 rounded-lg shadow-md border border-slate-200 space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title</label>
        {/* The forms plugin will style this input */}
        <input type="text" id="title" name="title" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"/>
        {state?.errors?.title && <p className="text-sm text-red-500 mt-1">{state.errors.title[0]}</p>}
      </div>
      <div>
        <label htmlFor="author" className="block text-sm font-medium text-slate-700">Your Name</label>
        <input type="text" id="author" name="author" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"/>
        {state?.errors?.author && <p className="text-sm text-red-500 mt-1">{state.errors.author[0]}</p>}
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-slate-700">Content</label>
        {/* The forms plugin will style this textarea */}
        <textarea id="content" name="content" rows={8} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
        {state?.errors?.content && <p className="text-sm text-red-500 mt-1">{state.errors.content[0]}</p>}
      </div>
      <div className="flex justify-end items-center gap-4">
        <Link href="/community" className="text-sm font-medium text-slate-600 hover:text-slate-900">Cancel</Link>
        <SubmitButton />
      </div>
      {state?.message && <p className="text-sm text-red-500 text-center">{state.message}</p>}
    </form>
  );
};
