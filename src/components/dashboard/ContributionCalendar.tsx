// src/components/dashboard/ContributionCalendar.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';

type ContributionCalendarProps = {
  userId: string;
};

const ContributionCalendar = ({ userId }: ContributionCalendarProps) => {
  const currentYear = new Date().getFullYear();
  const [displayYear, setDisplayYear] = useState<string | number>('last-year');
  const [data, setData] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetch(`/api/user/practice-history?userId=${userId}`)
        .then(res => res.json())
        .then(dates => {
          setData(new Set(dates));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [userId]);

  const { days, monthLabels } = useMemo(() => {
    const today = new Date();
    let startDate: Date;
    let dayCount: number;

    if (displayYear === 'last-year') {
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        dayCount = 371; // Always render 53 weeks for a consistent grid width
    } else {
        startDate = new Date(displayYear as number, 0, 1);
        dayCount = 371;
    }

    const gridStartDate = new Date(startDate);
    gridStartDate.setDate(gridStartDate.getDate() - startDate.getDay());

    const days = [];
    const labels = [];
    
    for (let i = 0; i < dayCount; i++) {
        const date = new Date(gridStartDate);
        date.setDate(date.getDate() + i);
        days.push(date);
        
        if (date.getDate() === 1) {
            const month = date.toLocaleString('default', { month: 'short' });
            labels.push({
                month: month,
                weekIndex: Math.floor(i / 7)
            });
        }
    }
    return { days, monthLabels: labels };
  }, [displayYear]);

  if (loading) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800">Practice History</h2>
            </div>
            <div className="h-28 w-full bg-slate-100 rounded animate-pulse"></div>
        </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">Practice History</h2>
            <select
                value={displayYear}
                onChange={(e) => setDisplayYear(e.target.value === 'last-year' ? 'last-year' : Number(e.target.value))}
                className="text-sm border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
                <option value="last-year">Last 12 months</option>
                {[currentYear, currentYear - 1, currentYear - 2].map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
        </div>

      <div className="flex gap-3">
        {/* Day Labels */}
        <div className="flex flex-col gap-1 pt-6 text-xs text-slate-400">
            <div className="h-3"></div> {/* Sun placeholder */}
            <div className="h-3 flex items-center">Mon</div>
            <div className="h-3"></div> {/* Tue placeholder */}
            <div className="h-3 flex items-center">Wed</div>
            <div className="h-3"></div> {/* Thu placeholder */}
            <div className="h-3 flex items-center">Fri</div>
            <div className="h-3"></div> {/* Sat placeholder */}
        </div>
        
        {/* Calendar Grid Wrapper */}
        <div className="w-full overflow-x-auto">
          <div className="relative">
            {/* Month Labels */}
            <div className="flex absolute -top-5 text-xs text-slate-500">
                {monthLabels.map(({ month, weekIndex }) => (
                    <div key={month + weekIndex} className="absolute" style={{ left: `calc(${weekIndex} * (0.75rem + 0.25rem))` }}>
                        {month}
                    </div>
                ))}
            </div>
            
            {/* Squares */}
            <div className="grid grid-flow-col grid-rows-7 gap-1 mt-6">
              {days.map((day, index) => {
                const dateString = day.toISOString().split('T')[0];
                const hasContribution = data.has(dateString);
                
                let isVisible = true;
                if (displayYear === 'last-year') {
                    if (day > new Date() || day <= new Date(new Date().setFullYear(new Date().getFullYear() - 1))) {
                        isVisible = false;
                    }
                } else {
                    if (day.getFullYear() !== displayYear) {
                        isVisible = false;
                    }
                }

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
      
      {/* Legend */}
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

export default ContributionCalendar;