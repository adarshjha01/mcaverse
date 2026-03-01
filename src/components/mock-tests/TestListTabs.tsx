// src/components/mock-tests/TestListTabs.tsx
"use client";

import React from 'react';

interface TestListTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TestListTabs: React.FC<TestListTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = ["Previous Year Questions", "Full Length Mock Tests"];

  return (
    <div className="flex justify-center mb-10">
      <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === tab 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};
