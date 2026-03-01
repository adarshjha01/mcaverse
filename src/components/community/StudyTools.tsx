import Link from "next/link";
import {
  IconBook,
  IconVideo,
  IconBrainCircuit,
  IconClipboardList,
} from "@/components/ui/Icons";

const tools = [
  {
    name: "Daily Practice (DPP)",
    description: "Solve topic-wise problems daily",
    href: "/dpp",
    icon: <IconBook className="w-5 h-5" />,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    name: "Mock Tests",
    description: "Full-length NIMCET & MCA mocks",
    href: "/mock-tests",
    icon: <IconClipboardList className="w-5 h-5" />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    name: "Video Lectures",
    description: "Watch concept explanations",
    href: "/videos",
    icon: <IconVideo className="w-5 h-5" />,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
  },
  {
    name: "AI Assistant",
    description: "Get instant doubt resolution",
    href: "/ai-assistant",
    icon: <IconBrainCircuit className="w-5 h-5" />,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-900/20",
  },
];

export const StudyTools = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
        Study Tools
      </h3>
      <div className="space-y-2">
        {tools.map((tool) => (
          <Link
            key={tool.name}
            href={tool.href}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
          >
            <div className={`p-2 rounded-lg ${tool.bg} ${tool.color} flex-shrink-0`}>
              {tool.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {tool.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {tool.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
