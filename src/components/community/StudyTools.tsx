import Link from "next/link";
import {
  IconBook,
  IconClipboardList,
  IconVideo,
  IconBrainCircuit,
} from "@/components/ui/Icons";
import { type ReactNode } from "react";

type Tool = {
  name: string;
  description: string;
  href: string;
  icon: ReactNode;
  accent: string;
  bg: string;
};

const tools: Tool[] = [
  {
    name: "Daily Practice (DPP)",
    description: "Solve topic-wise problems daily",
    href: "/dpp",
    icon: <IconBook className="w-4 h-4" />,
    accent: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  {
    name: "Mock Tests",
    description: "Full-length NIMCET & MCA mocks",
    href: "/mock-tests",
    icon: <IconClipboardList className="w-4 h-4" />,
    accent: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
  {
    name: "Video Lectures",
    description: "Watch concept explanations",
    href: "/videos",
    icon: <IconVideo className="w-4 h-4" />,
    accent: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-500/10",
  },
  {
    name: "AI Assistant",
    description: "Get instant doubt resolution",
    href: "/ai-assistant",
    icon: <IconBrainCircuit className="w-4 h-4" />,
    accent: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-500/10",
  },
];

export const StudyTools = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
        Study Tools
      </h3>
      <div className="space-y-1">
        {tools.map((tool) => (
          <Link
            key={tool.name}
            href={tool.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${tool.bg} ${tool.accent} flex-shrink-0 transition-colors`}>
              {tool.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {tool.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {tool.description}
              </p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
};
