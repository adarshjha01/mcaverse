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
  }, [completionDates]);

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-5 sm:mb-6">Practice History</h2>

      <div className="flex gap-2 sm:gap-3">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] pt-6 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium select-none">
            <div className="h-3" />
            <div className="h-3 flex items-center leading-none">Mon</div>
            <div className="h-3" />
            <div className="h-3 flex items-center leading-none">Wed</div>
            <div className="h-3" />
            <div className="h-3 flex items-center leading-none">Fri</div>
            <div className="h-3" />
        </div>

        <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar">
          <div className="relative min-w-max">
            {/* Month labels */}
            <div className="flex text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium h-5 relative">
                {monthLabels.map(({ month, weekIndex }, i) => (
                    <div key={month + weekIndex + i} className="absolute whitespace-nowrap" style={{ left: `calc(${weekIndex} * (0.75rem + 3px))` }}>
                        {month}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-flow-col grid-rows-7 gap-[3px] mt-1">
              {days.map((day, index) => {
                const dateString = day.toISOString().split('T')[0];
                const hasContribution = completionDates.has(dateString);
                const today = new Date();
                const yearAgo = new Date();
                yearAgo.setFullYear(yearAgo.getFullYear() - 1);

                const isVisible = day <= today && day > yearAgo;

                const colorClass = isVisible
                    ? (hasContribution ? 'bg-green-500 dark:bg-green-500' : 'bg-slate-200 dark:bg-slate-800')
                    : 'bg-transparent';

                return (
                  <div key={index} className="relative group">
                    <div className={`w-3 h-3 rounded-[2px] ${colorClass} transition-colors`} />
                    {isVisible && (
                      <span className="absolute bottom-full mb-2 w-max px-2 py-1 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 left-1/2 -translate-x-1/2 whitespace-nowrap shadow-lg">
                        {hasContribution ? 'Practiced' : 'No practice'} on {day.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-end items-center gap-1.5 mt-4 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 select-none">
            <span>Less</span>
            <div className="w-3 h-3 rounded-[2px] bg-slate-200 dark:bg-slate-800" />
            <div className="w-3 h-3 rounded-[2px] bg-green-500 dark:bg-green-500" />
            <span>More</span>
      </div>
    </div>
  );
};

export default StreakHistory;