// src/components/practice/DppDashboard.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import { DppPageData, Subject, Topic, Dpp } from '@/types/dpp';
import { IconChevronDown, IconCheckCircle } from '@/components/ui/Icons';
import { ProgressTracker } from './ProgressTracker';
import { Gamification } from './Gamification';
import  StreakHistory  from './StreakHistory';

const DppItem = ({ dpp, onToggle }: { dpp: Dpp; onToggle: () => void; }) => (
    <div className="flex items-center justify-between pl-4 py-2 border-b border-slate-200 last:border-b-0">
        <span className={`text-sm ${dpp.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
            {dpp.title}
        </span>
        <label className="flex items-center cursor-pointer">
            <input type="checkbox" checked={dpp.completed} onChange={onToggle} className="hidden" />
            <IconCheckCircle className={`w-6 h-6 transition-colors ${dpp.completed ? 'text-green-500' : 'text-slate-300 hover:text-green-400'}`} />
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
            <div className="bg-slate-50 rounded-md border border-slate-200 p-3 text-slate-500 text-sm">
                {topic.name} - <span className="italic">No DPPs yet.</span>
            </div>
        )
    }

    return (
        <div className="bg-slate-50 rounded-md border border-slate-200">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 text-left">
                <div>
                    <h3 className="font-semibold text-slate-800">{topic.name}</h3>
                    <span className="text-xs text-slate-500">{completionCount} / {totalCount} completed</span>
                </div>
                <IconChevronDown className={`transition-transform text-slate-500 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-3 pb-3">
                    <div className="w-full bg-slate-200 rounded-full h-1 mb-2">
                        <div className="bg-green-500 h-1 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    {topic.dpps.map(dpp => (
                        <DppItem key={dpp.title} dpp={dpp} onToggle={() => onDppToggle(topic.name, dpp.title)} />
                    ))}
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
            // For simplicity, let's assume each completed DPP was on a different day
            // In a real app, you'd store completion timestamps.
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
          if (newSet.has(subjectName)) {
              newSet.delete(subjectName);
          } else {
              newSet.add(subjectName);
          }
          return newSet;
      });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-4">
        {data.subjects.map(subject => {
            const isSubjectOpen = openSubjects.has(subject.name);
            const completedCount = subject.topics.reduce((acc, t) => acc + t.dpps.filter(d => d.completed).length, 0);
            const totalCount = subject.topics.reduce((acc, t) => acc + t.dpps.length, 0);
            const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

            return (
                <div key={subject.name} className="bg-white rounded-lg border border-slate-200 shadow-sm">
                    <button onClick={() => toggleSubject(subject.name)} className="w-full flex justify-between items-center p-4 text-left">
                        <div>
                            <h2 className="text-xl font-bold">{subject.name}</h2>
                             <span className="text-xs text-slate-500">{completedCount} / {totalCount} completed</span>
                        </div>
                        <IconChevronDown className={`transition-transform text-slate-500 ${isSubjectOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isSubjectOpen && (
                        <div className="px-4 pb-4 space-y-2">
                             <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
                                <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
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
