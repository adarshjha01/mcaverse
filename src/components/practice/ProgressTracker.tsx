// src/components/practice/ProgressTracker.tsx
import React from 'react';
import { IconCheckCircle, IconAward } from '@/components/ui/Icons';

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
  const max = Math.max(...data);
  return (
    <div className="flex justify-between items-end h-24 mt-4">
      {data.map((value, index) => (
        <div key={index} className="w-1/7 text-center">
          <div 
            className="bg-blue-500 rounded-t-sm mx-auto" 
            style={{ height: `${(value / max) * 100}%`, width: '80%' }}
            title={`${value} DPPs`}
          ></div>
          <p className="text-xs text-slate-500 mt-1">{['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]}</p>
        </div>
      ))}
    </div>
  );
};

export const ProgressTracker = ({ completionPercentage, completedDpps, totalDpps }: ProgressTrackerProps) => {
  const weeklyData = [2, 3, 1, 4, 2, 5, 1]; // Mock data for the graph

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
      <h3 className="text-xl font-bold mb-4">Progress Tracking</h3>
      
      {/* Overall Completion */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-slate-700">Overall Completion</span>
            <span className="text-sm font-bold text-indigo-600">{completedDpps} / {totalDpps} DPPs</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
        </div>
      </div>

      {/* Weekly Graph */}
      <div className="mb-6">
        <h4 className="font-semibold text-slate-700">Weekly Progress</h4>
        <WeeklyProgressChart data={weeklyData} />
      </div>

      {/* Badges */}
      <div>
        <h4 className="font-semibold text-slate-700 mb-2">Badges</h4>
        <ul className="space-y-2">
            {badges.map((badge, index) => (
                <li key={index} className={`flex items-center gap-3 p-2 rounded-md ${badge.achieved ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    <IconAward className={`w-5 h-5 ${badge.achieved ? 'text-yellow-500' : 'text-slate-400'}`} />
                    <span className="text-sm">{badge.milestone}</span>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
