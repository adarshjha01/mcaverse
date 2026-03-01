import { IconMessageCircle, IconUsers, IconHeart } from "@/components/ui/Icons";
import { type ReactNode } from "react";

type CommunityStatsProps = {
  discussionCount: number;
  totalReplies: number;
};

type StatItem = {
  label: string;
  value: number | string;
  icon: ReactNode;
  accent: string;
  bg: string;
};

export const CommunityStats = ({
  discussionCount,
  totalReplies,
}: CommunityStatsProps) => {
  const stats: StatItem[] = [
    {
      label: "Discussions",
      value: discussionCount,
      icon: <IconMessageCircle className="w-4 h-4" />,
      accent: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
    },
    {
      label: "Replies",
      value: totalReplies,
      icon: <IconUsers className="w-4 h-4" />,
      accent: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      label: "Helpful",
      value: "∞",
      icon: <IconHeart className="w-4 h-4" />,
      accent: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-500/10",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
        Community Activity
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center text-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${stat.bg} ${stat.accent} mb-2`}>
              {stat.icon}
            </div>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {stat.value}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
