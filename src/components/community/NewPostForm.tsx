// src/components/community/NewPostForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

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
    formData.append("authorId", user.uid);
    formData.append("authorName", user.displayName || "Anonymous");

    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/discussions", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        router.push("/community");
        router.refresh();
      } else {
        const errorData = await response.json();
        alert(
          `Failed to create post: ${errorData.message || "Please check your input."}`
        );
      }
    } catch {
      alert("An error occurred while creating the post.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12 px-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">
          Start a New Discussion
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          You must be logged in to start a discussion.
        </p>
        <Link
          href="/login"
          className="inline-block bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Login to Post
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none space-y-6"
    >
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        Start a New Discussion
      </h2>

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          placeholder="Enter a clear and descriptive title"
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
        >
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={8}
          required
          placeholder="Write your thoughts, questions, or ideas here..."
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all resize-y"
        />
      </div>

      <div className="flex justify-end items-center gap-4 pt-2">
        <Link
          href="/community"
          className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white text-sm font-semibold py-2.5 px-6 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Posting..." : "Post Discussion"}
        </button>
      </div>
    </form>
  );
};