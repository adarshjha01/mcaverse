// src/components/dashboard/ContributionCalendar.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';

type ContributionCalendarProps = {
  userId: string;
};

type MonthLabel = {
  month: string;
  weekIndex: number;
};

// Updated color scheme to match GitHub's contribution chart
const getColorClass = (count: number): string => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count >= 1 && count <= 2) return 'bg-green-200 dark:bg-green-900';
    if (count >= 3 && count <= 5) return 'bg-green-400 dark:bg-green-700';
    if (count >= 6 && count <= 8) return 'bg-green-600 dark:bg-green-500';
    return 'bg-green-700 dark:bg-green-400';
};

const ContributionCalendar = ({ userId }: ContributionCalendarProps) => {
  const currentYear = new Date().getFullYear();
  const [displayYear, setDisplayYear] = useState<string | number>('last-year');
  const [data, setData] = useState<{ [date: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetch(`/api/user/practice-history?userId=${userId}`)
        .then(res => res.json())
        .then(contributionData => {
          setData(contributionData);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [userId]);

  const { days, monthLabels } = useMemo(() => {
    let startDate: Date;
    const endDate = new Date();

    if (displayYear === 'last-year') {
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        startDate.setDate(startDate.getDate() + 1);
    } else {
        startDate = new Date(displayYear as number, 0, 1);
    }

    const gridStartDate = new Date(startDate);
    gridStartDate.setDate(gridStartDate.getDate() - startDate.getDay());

    const days: Date[] = [];
    for (let i = 0; i < 371; i++) { // Fill 53 weeks
        const date = new Date(gridStartDate);
        date.setDate(date.getDate() + i);
        days.push(date);
    }

    const labels: MonthLabel[] = [];
    let lastMonth = -1;
    
    // Corrected logic for month label placement
    days.forEach((day, index) => {
      const dayMonth = day.getMonth();
      if (dayMonth !== lastMonth && day >= startDate && (displayYear === 'last-year' ? day <= endDate : day.getFullYear() === displayYear)) {
          const weekIndex = Math.floor(index / 7);
          // Only add a new month label if it's not immediately next to the previous one
          if (labels.length === 0 || (weekIndex - labels[labels.length - 1].weekIndex) > 2) {
            labels.push({
              month: day.toLocaleString('default', { month: 'short' }),
              weekIndex: weekIndex,
            });
            lastMonth = dayMonth;
          }
      }
    });

    return { days, monthLabels: labels };
  }, [displayYear]);

  if (loading) {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Practice History</h2>
            </div>
            <div className="h-32 w-full bg-slate-100 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Practice History</h2>
            <select
                value={displayYear}
                onChange={(e) => setDisplayYear(e.target.value === 'last-year' ? 'last-year' : Number(e.target.value))}
                className="text-sm border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
                <option value="last-year">Last 12 months</option>
                {[currentYear, currentYear - 1, currentYear - 2].map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
        </div>

      <div className="flex gap-2">
        {/* Day labels */}
        <div className="flex flex-col gap-[2px] pt-5 text-xs text-slate-500 dark:text-slate-400">
            <div className="h-[11px]"></div>
            <div className="h-[11px] flex items-center">Mon</div>
            <div className="h-[11px]"></div>
            <div className="h-[11px] flex items-center">Wed</div>
            <div className="h-[11px]"></div>
            <div className="h-[11px] flex items-center">Fri</div>
            <div className="h-[11px]"></div>
        </div>
        
        <div className="flex-1 overflow-x-auto">
          <div className="relative min-w-fit">
            {/* Month labels */}
            <div className="flex absolute -top-4 text-xs text-slate-600 dark:text-slate-400 font-medium">
              {monthLabels.map(({ month, weekIndex }) => (
                <div
                  key={month + weekIndex}
                  className="absolute"
                  style={{
                    left: `${weekIndex * 13}px` // 11px square + 2px gap = 13px per week
                  }}
                >
                  {month}
                </div>
              ))}
            </div>
            
            {/* Contribution grid */}
            <div className="grid grid-flow-col grid-rows-7 gap-[2px] mt-4">
              {days.map((day, index) => {
                const dateString = day.toISOString().split('T')[0];
                const contributionCount = data[dateString] || 0;
                
                let isVisible = true;
                const today = new Date();
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

                if (displayYear === 'last-year') {
                    if (day > today || day <= oneYearAgo) {
                        isVisible = false;
                    }
                } else {
                    if (day.getFullYear() !== (displayYear as number)) {
                        isVisible = false;
                    }
                }

                const colorClass = isVisible ? getColorClass(contributionCount) : 'bg-transparent';
                const tooltipText = contributionCount > 0 ? `${contributionCount} contributions` : 'No contributions';

                return (
                  <div key={index} className="relative group">
                    <div className={`w-[11px] h-[11px] rounded-sm ${colorClass} border border-gray-200/50 dark:border-gray-700/50`} />
                    {isVisible && (
                      <span className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        {tooltipText} on {day.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
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
      <div className="flex justify-between items-center mt-4">
        <a href="#" className="text-xs text-blue-500 hover:underline">
          Learn how we count contributions
        </a>
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <span>Less</span>
            <div className="w-[11px] h-[11px] rounded-sm bg-gray-100 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50"></div>
            <div className="w-[11px] h-[11px] rounded-sm bg-green-200 dark:bg-green-900 border border-gray-200/50 dark:border-gray-700/50"></div>
            <div className="w-[11px] h-[11px] rounded-sm bg-green-400 dark:bg-green-700 border border-gray-200/50 dark:border-gray-700/50"></div>
            <div className="w-[11px] h-[11px] rounded-sm bg-green-600 dark:bg-green-500 border border-gray-200/50 dark:border-gray-700/50"></div>
            <div className="w-[11px] h-[11px] rounded-sm bg-green-700 dark:bg-green-400 border border-gray-200/50 dark:border-gray-700/50"></div>
            <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default ContributionCalendar;