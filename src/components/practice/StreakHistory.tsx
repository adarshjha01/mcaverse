// src/components/practice/StreakHistory.tsx
"use client";

import { useMemo } from 'react';

type StreakHistoryProps = {
  completionDates: Set<string>;
};

const StreakHistory = ({ completionDates }: StreakHistoryProps) => {
  const { days, monthLabels } = useMemo(() => {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    const dayCount = 371; 

    const gridStartDate = new Date(startDate);
    gridStartDate.setDate(gridStartDate.getDate() - startDate.getDay());

    const days = [];
    const labels = [];
    
    for (let i = 0; i < dayCount; i++) {
        const date = new Date(gridStartDate);
        date.setDate(date.getDate() + i);
        days.push(date);
        
        if (date.getDate() === 1 && date > startDate) {
            labels.push({
                month: date.toLocaleString('default', { month: 'short' }),
                weekIndex: Math.floor(i / 7)
            });
        }
    }
    return { days, monthLabels: labels };
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Practice History</h2>

      <div className="flex gap-3">
        <div className="flex flex-col gap-1 pt-6 text-xs text-slate-400 dark:text-slate-500 font-medium">
            <div className="h-3"></div>
            <div className="h-3 flex items-center">Mon</div>
            <div className="h-3"></div>
            <div className="h-3 flex items-center">Wed</div>
            <div className="h-3"></div>
            <div className="h-3 flex items-center">Fri</div>
            <div className="h-3"></div>
        </div>
        
        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="relative">
            <div className="flex absolute -top-5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                {monthLabels.map(({ month, weekIndex }) => (
                    <div key={month + weekIndex} className="absolute" style={{ left: `calc(${weekIndex} * (0.75rem + 0.25rem))` }}>
                        {month}
                    </div>
                ))}
            </div>
            
            <div className="grid grid-flow-col grid-rows-7 gap-1 mt-6">
              {days.map((day, index) => {
                const dateString = day.toISOString().split('T')[0];
                const hasContribution = completionDates.has(dateString);
                
                const isVisible = day <= new Date() && day > new Date(new Date().setFullYear(new Date().getFullYear() - 1));
                
                // Color Logic: 
                // Contribution -> Green (Light/Dark)
                // Empty -> Slate-200 (Light) / Slate-700 (Dark)
                const colorClass = isVisible 
                    ? (hasContribution ? 'bg-green-500 dark:bg-green-600' : 'bg-slate-100 dark:bg-slate-800') 
                    : 'bg-transparent';

                return (
                  <div key={index} className="relative group">
                    <div className={`w-3 h-3 rounded-[2px] ${colorClass}`} />
                    {isVisible && (
                      <span className="absolute bottom-full mb-2 w-max px-2 py-1 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        {hasContribution ? 'Practice' : 'No practice'} on {day.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end items-center gap-2 mt-4 text-xs text-slate-500 dark:text-slate-400 pr-2">
            <span>Less</span>
            <div className="w-3 h-3 rounded-[2px] bg-slate-100 dark:bg-slate-800"></div>
            <div className="w-3 h-3 rounded-[2px] bg-green-300 dark:bg-green-800"></div>
            <div className="w-3 h-3 rounded-[2px] bg-green-500 dark:bg-green-600"></div>
            <div className="w-3 h-3 rounded-[2px] bg-green-700 dark:bg-green-400"></div>
            <span>More</span>
        </div>
    </div>
  );
};

export default StreakHistory;