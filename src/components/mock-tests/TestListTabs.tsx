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
      <div className="bg-slate-100 p-1 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 text-sm font-semibold rounded-md transition-colors ${
              activeTab === tab 
                ? 'bg-white text-indigo-600 shadow' 
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};
