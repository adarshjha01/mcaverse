// src/components/practice/ProgressTracker.tsx
import React from 'react';
import { IconAward } from '@/components/ui/Icons';

type ProgressTrackerProps = {
  completionPercentage: number;
  completedDpps: number;
  totalDpps: number;
};

const badges = [
    { milestone: "10 DPPs in Probability", reward: "Badge", achieved: true },
    { milestone: "5 DPPs in a week", reward: "Badge", achieved: false },
];

const WeeklyProgressChart = ({ data }: { data: number[] }) => {
  const max = Math.max(...data, 1);
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return (
    <div className="flex items-end justify-between gap-2 h-28 mt-4 px-1">
      {data.map((value, index) => (
        <div key={index} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
          <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 tabular-nums">
            {value > 0 ? value : ''}
          </span>
          <div
            className={`w-full max-w-[24px] rounded-t transition-all duration-500 ${
              value > 0
                ? 'bg-indigo-500 dark:bg-indigo-400'
                : 'bg-slate-200 dark:bg-slate-700'
            }`}
            style={{ height: `${Math.max((value / max) * 100, value > 0 ? 12 : 4)}%` }}
            title={`${value} DPPs`}
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{dayLabels[index]}</p>
        </div>
      ))}
    </div>
  );
};

export const ProgressTracker = ({ completionPercentage, completedDpps, totalDpps }: ProgressTrackerProps) => {
  const weeklyData = [2, 3, 1, 4, 2, 5, 1]; 

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">Progress Tracking</h3>
      
      {/* Overall Completion */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Overall Completion</span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{completedDpps} / {totalDpps} DPPs</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
            <div className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
        </div>
      </div>

      {/* Weekly Graph */}
      <div className="mb-8">
        <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Weekly Progress</h4>
        <WeeklyProgressChart data={weeklyData} />
      </div>

      {/* Badges */}
      <div>
        <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">Badges</h4>
        <ul className="space-y-2">
            {badges.map((badge, index) => (
                <li key={index} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    badge.achieved 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30 text-green-800 dark:text-green-300' 
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                    <IconAward className={`w-5 h-5 ${badge.achieved ? 'text-yellow-500' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="text-sm font-medium">{badge.milestone}</span>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
};