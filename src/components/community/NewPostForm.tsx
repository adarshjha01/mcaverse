// src/components/community/NewPostForm.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export const NewPostForm = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      alert("You must be logged in to post.");
      return;
    }
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    formData.append('authorId', user.uid);
    formData.append('authorName', user.displayName || 'Anonymous');
    
    try {
      // --- SECURITY UPDATE START ---
      const token = await user.getIdToken(); // Get the token
      // --- SECURITY UPDATE END ---

      const response = await fetch('/api/discussions', { 
        method: 'POST', 
        body: formData,
        // Add the Authorization header
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        router.push('/community');
        router.refresh();
      } else {
        const errorData = await response.json();
        alert(`Failed to create post: ${errorData.message || 'Please check your input.'}`);
      }
    } catch (error) {
      alert("An error occurred while creating the post.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center p-10 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
        <h2 className="text-3xl font-bold mb-3 text-slate-800 dark:text-white">Create a New Discussion</h2>
        <p className="font-medium mb-6 text-slate-600 dark:text-slate-400">You must be logged in to start a discussion.</p>
        <Link
          href="/login"
          className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          Login to Post
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-8 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Start a New Discussion</h2>
      
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          placeholder="Enter a clear and catchy title"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={8}
          required
          placeholder="Write your thoughts, questions, or ideas here..."
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
        ></textarea>
      </div>

      <div className="flex justify-end items-center gap-4">
        <Link
          href="/community"
          className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 transition-all"
        >
          {loading ? "Posting..." : "Post Discussion"}
        </button>
      </div>
    </form>
  );
};