"use client";

import { useState, useMemo, useEffect } from 'react';
import { DppPageData, Dpp, Topic } from '@/types/dpp';
import { IconChevronDown, IconCheckCircle } from '@/components/ui/Icons';
import { ProgressTracker } from './ProgressTracker';
import { Gamification } from './Gamification';
import StreakHistory from './StreakHistory';

const DppItem = ({ dpp, onToggle }: { dpp: Dpp; onToggle: () => void; }) => (
    <div className="flex items-center justify-between pl-4 py-3 border-b border-slate-100 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors rounded-md">
        <span className={`text-sm font-medium ${dpp.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
            {dpp.title}
        </span>
        <label className="flex items-center cursor-pointer p-1">
            <input type="checkbox" checked={dpp.completed} onChange={onToggle} className="hidden" />
            <IconCheckCircle className={`w-6 h-6 transition-colors ${dpp.completed ? 'text-green-500 dark:text-green-400' : 'text-slate-300 dark:text-slate-600 hover:text-green-400 dark:hover:text-green-500'}`} />
        </label>
    </div>
);

const TopicAccordion = ({ topic, onDppToggle }: { topic: Topic; onDppToggle: (topicName: string, dppTitle: string) => void; }) => {
    const [isOpen, setIsOpen] = useState(topic.dpps.length > 0);
    const completionCount = topic.dpps.filter(d => d.completed).length;
    const totalCount = topic.dpps.length;
    const progress = totalCount > 0 ? (completionCount / totalCount) * 100 : 0;

    if (totalCount === 0) {
        return (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400 text-sm italic">
                {topic.name} - No DPPs yet.
            </div>
        )
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">{topic.name}</h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{completionCount} / {totalCount} completed</span>
                </div>
                <IconChevronDown className={`transition-transform text-slate-500 dark:text-slate-400 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-4 pb-4">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-4">
                        <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="space-y-1">
                        {topic.dpps.map(dpp => (
                            <DppItem key={dpp.title} dpp={dpp} onToggle={() => onDppToggle(topic.name, dpp.title)} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const DppDashboard = ({ initialData }: { initialData: DppPageData }) => {
  const [data, setData] = useState(initialData);
  const [openSubjects, setOpenSubjects] = useState<Set<string>>(new Set([initialData.subjects[0].name]));

  const { completedDpps, totalDpps, completionPercentage, xp, level, completionDates } = useMemo(() => {
    let completed = 0;
    let total = 0;
    const dates = new Set<string>();

    data.subjects.forEach(subject => {
      subject.topics.forEach(topic => {
        total += topic.dpps.length;
        topic.dpps.forEach(dpp => {
          if (dpp.completed) {
            completed++;
            const fakeDate = new Date();
            fakeDate.setDate(fakeDate.getDate() - (total - completed));
            dates.add(fakeDate.toISOString().split('T')[0]);
          }
        });
      });
    });

    const xpPoints = completed * 10;
    let currentLevel = "Beginner";
    if (xpPoints > 50) currentLevel = "Intermediate";
    if (xpPoints > 100) currentLevel = "Pro";
    if (xpPoints > 150) currentLevel = "Legend";

    return {
      completedDpps: completed,
      totalDpps: total,
      completionPercentage: total > 0 ? (completed / total) * 100 : 0,
      xp: xpPoints,
      level: currentLevel,
      completionDates: dates,
    };
  }, [data]);

  const handleDppToggle = (subjectName: string, topicName: string, dppTitle: string) => {
      setData(prevData => {
          const newData = { ...prevData };
          const subject = newData.subjects.find(s => s.name === subjectName);
          const topic = subject?.topics.find(t => t.name === topicName);
          const dpp = topic?.dpps.find(d => d.title === dppTitle);
          if (dpp) {
              dpp.completed = !dpp.completed;
          }
          return newData;
      });
  };

  const toggleSubject = (subjectName: string) => {
      setOpenSubjects(prev => {
          const newSet = new Set(prev);
          if (newSet.has(subjectName)) newSet.delete(subjectName); else newSet.add(subjectName);
          return newSet;
      });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {data.subjects.map(subject => {
            const isSubjectOpen = openSubjects.has(subject.name);
            const completedCount = subject.topics.reduce((acc, t) => acc + t.dpps.filter(d => d.completed).length, 0);
            const totalCount = subject.topics.reduce((acc, t) => acc + t.dpps.length, 0);
            const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

            return (
                <div key={subject.name} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
                    <button onClick={() => toggleSubject(subject.name)} className="w-full flex justify-between items-center p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{subject.name}</h2>
                             <span className="text-xs text-slate-500 dark:text-slate-400">{completedCount} / {totalCount} completed</span>
                        </div>
                        <IconChevronDown className={`transition-transform text-slate-500 dark:text-slate-400 ${isSubjectOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isSubjectOpen && (
                        <div className="px-5 pb-5 space-y-4">
                             <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                                <div className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            {subject.topics.map(topic => (
                                <TopicAccordion 
                                    key={topic.name} 
                                    topic={topic} 
                                    onDppToggle={(topicName, dppTitle) => handleDppToggle(subject.name, topicName, dppTitle)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )
        })}
      </div>
      <div className="lg:col-span-1 space-y-8">
        {/* Ensure these sub-components (ProgressTracker, Gamification, StreakHistory) use dark: classes internally */}
        <ProgressTracker 
            completionPercentage={completionPercentage}
            completedDpps={completedDpps}
            totalDpps={totalDpps}
        />
        <Gamification xp={xp} level={level}/>
        <StreakHistory completionDates={completionDates} />
      </div>
    </div>
  );
};