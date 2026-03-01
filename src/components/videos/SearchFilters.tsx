// src/components/videos/SearchFilters.tsx
"use client";

import React from "react";

export type FilterMode = "all" | "completed" | "revision" | "not-started";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterMode: FilterMode;
  onFilterChange: (mode: FilterMode) => void;
  allExpanded: boolean;
  onToggleExpand: () => void;
  resultCount?: number;
  isLoggedIn: boolean;
}

const FILTER_OPTIONS: { value: FilterMode; label: string; requiresAuth: boolean }[] = [
  { value: "all", label: "All", requiresAuth: false },
  { value: "completed", label: "Completed", requiresAuth: true },
  { value: "revision", label: "Revision", requiresAuth: true },
  { value: "not-started", label: "Not Started", requiresAuth: true },
];

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchQuery,
  onSearchChange,
  filterMode,
  onFilterChange,
  allExpanded,
  onToggleExpand,
  resultCount,
  isLoggedIn,
}) => {
  return (
    <div className="mb-6 space-y-3">
      {/* Search Bar + Expand/Collapse */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-grow">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search lectures by title..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 dark:focus:ring-indigo-400/30 dark:focus:border-indigo-500 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Clear search"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button
          onClick={onToggleExpand}
          className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all shadow-sm active:scale-[0.98]"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              allExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
          </svg>
          {allExpanded ? "Collapse All" : "Expand All"}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {FILTER_OPTIONS.map((opt) => {
          // Only show auth-required filters when logged in
          if (opt.requiresAuth && !isLoggedIn) return null;
          return (
            <button
              key={opt.value}
              onClick={() => onFilterChange(opt.value)}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all active:scale-[0.97] ${
                filterMode === opt.value
                  ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-300 dark:ring-indigo-500/40 shadow-sm"
                  : "bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-700/40"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      {(searchQuery.trim() || filterMode !== "all") &&
        resultCount !== undefined && (
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            {resultCount} lecture{resultCount !== 1 ? "s" : ""} found
            {searchQuery.trim() && (
              <>
                {" "}
                matching &ldquo;
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {searchQuery}
                </span>
                &rdquo;
              </>
            )}
            {filterMode !== "all" && (
              <span className="ml-1 text-slate-400 dark:text-slate-500">
                ({FILTER_OPTIONS.find((o) => o.value === filterMode)?.label})
              </span>
            )}
          </p>
        )}
    </div>
  );
};
