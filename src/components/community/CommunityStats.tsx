import { IconMessageCircle, IconUsers, IconHeart } from "@/components/ui/Icons";

type CommunityStatsProps = {
  discussionCount: number;
  totalReplies: number;
};

export const CommunityStats = ({ discussionCount, totalReplies }: CommunityStatsProps) => {
  const stats = [
    {
      label: "Discussions",
      value: discussionCount,
      icon: <IconMessageCircle className="w-5 h-5" />,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      label: "Replies",
      value: totalReplies,
      icon: <IconUsers className="w-5 h-5" />,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      label: "Helpful Votes",
      value: "∞",
      icon: <IconHeart className="w-5 h-5" />,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-900/20",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
        Community Activity
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`inline-flex p-2 rounded-lg ${stat.bg} ${stat.color} mb-2`}>
              {stat.icon}
            </div>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{stat.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
