// src/components/practice/StreakHistory.tsx
"use client";

import { useMemo } from 'react';

type StreakHistoryProps = {
  completionDates: Set<string>; // Expecting dates in 'YYYY-MM-DD' format
};

const StreakHistory = ({ completionDates }: StreakHistoryProps) => {
  const currentYear = new Date().getFullYear();

  const { days, monthLabels } = useMemo(() => {
    const today = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    const dayCount = 371; // Always render 53 weeks for a consistent grid width

    const gridStartDate = new Date(startDate);
    gridStartDate.setDate(gridStartDate.getDate() - startDate.getDay());

    const days = [];
    const labels = [];
    
    for (let i = 0; i < dayCount; i++) {
        const date = new Date(gridStartDate);
        date.setDate(date.getDate() + i);
        days.push(date);
        
        if (date.getDate() === 1 && date > startDate) {
            const month = date.toLocaleString('default', { month: 'short' });
            labels.push({
                month: month,
                weekIndex: Math.floor(i / 7)
            });
        }
    }
    return { days, monthLabels: labels };
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Practice History</h2>

      <div className="flex gap-3">
        <div className="flex flex-col gap-1 pt-6 text-xs text-slate-400">
            <div className="h-3"></div>
            <div className="h-3 flex items-center">Mon</div>
            <div className="h-3"></div>
            <div className="h-3 flex items-center">Wed</div>
            <div className="h-3"></div>
            <div className="h-3 flex items-center">Fri</div>
            <div className="h-3"></div>
        </div>
        
        <div className="w-full overflow-x-auto">
          <div className="relative">
            <div className="flex absolute -top-5 text-xs text-slate-500">
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
                const colorClass = isVisible ? (hasContribution ? 'bg-green-500' : 'bg-slate-200') : 'bg-transparent';

                return (
                  <div key={index} className="relative group">
                    <div className={`w-3 h-3 rounded-[2px] ${colorClass}`} />
                    {isVisible && (
                      <span className="absolute bottom-full mb-2 w-max px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
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
      
      <div className="flex justify-end items-center gap-2 mt-4 text-xs text-slate-500 pr-2">
            <span>Less</span>
            <div className="w-3 h-3 rounded-[2px] bg-slate-200"></div>
            <div className="w-3 h-3 rounded-[2px] bg-green-300"></div>
            <div className="w-3 h-3 rounded-[2px] bg-green-500"></div>
            <div className="w-3 h-3 rounded-[2px] bg-green-700"></div>
            <span>More</span>
        </div>
    </div>
  );
};

export default StreakHistory;
