import Link from "next/link";
import React from "react";
import { IconLibrary, IconFocus, IconFlame, IconArrowRight } from "@/components/ui/Icons";

const practiceTypes = [
  {
    id: "dpp",
    title: "Daily Practice",
    description: "Build a habit with daily problems and track your streak. Stay consistent and watch your scores improve.",
    icon: <IconFlame className="w-6 h-6" />,
    buttonText: "Start Daily Practice",
    href: "/dpp",
    color: "text-red-500 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-100 dark:border-red-800",
    badge: "Hot",
    badgeColor: "bg-red-500",
  },
  {
    id: "topic-wise",
    title: "Topic Wise Tests",
    description: "Master individual topics and pinpoint specific weak areas. Targeted practice for maximum improvement.",
    icon: <IconFocus className="w-6 h-6" />,
    buttonText: "View Topics",
    href: "/mock-tests/topic-wise",
    color: "text-orange-500 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-100 dark:border-orange-800",
    badge: "Focused",
    badgeColor: "bg-orange-500",
  },
  {
    id: "subject-wise",
    title: "Subject Wise Tests",
    description: "Strengthen your core subjects with dedicated practice tests. Comprehensive coverage of every subject.",
    icon: <IconLibrary className="w-6 h-6" />,
    buttonText: "View Subjects",
    href: "/mock-tests/subject-wise",
    color: "text-purple-500 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-100 dark:border-purple-800",
    badge: "Complete",
    badgeColor: "bg-purple-500",
  }
];

export const PracticeSections = () => {
  return (
    <section className="bg-white dark:bg-slate-950 py-14 sm:py-16 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 mb-3">Practice Modes</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Customised Practice
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-lg mx-auto">Choose your preferred practice mode and start improving today</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {practiceTypes.map(test => (
            <Link key={test.id} href={test.href} className="group block">
              <div className="relative bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                {/* Badge */}
                <span className={`absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${test.badgeColor}`}>
                  {test.badge}
                </span>
                
                <div className={`w-14 h-14 rounded-xl ${test.bg} ${test.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 border ${test.border}`}>
                  {test.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{test.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-grow leading-relaxed">{test.description}</p>
                <div className="flex items-center gap-2 font-semibold text-sm text-indigo-600 dark:text-indigo-400 group-hover:gap-3 transition-all">
                  {test.buttonText} <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};