// src/components/practice/Gamification.tsx
import { Leaderboard } from './Leaderboard';
import { IconAward, IconZap } from '@/components/ui/Icons';

type GamificationProps = {
  xp: number;
  level: string;
};

export const Gamification = ({ xp, level }: GamificationProps) => {
  const levels = ["Beginner", "Intermediate", "Pro", "Legend"];
  const levelIndex = levels.indexOf(level);
  const progressPercentage = (levelIndex / (levels.length - 1)) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-center transition-colors">
            <IconZap className="w-10 h-10 mx-auto text-yellow-500 mb-2" />
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{xp} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">XP</span></p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Experience Points</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-center transition-colors">
            <IconAward className="w-10 h-10 mx-auto text-purple-500 mb-2" />
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{level}</p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-3">
              <div className="bg-purple-600 dark:bg-purple-500 h-1.5 rounded-full transition-all" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
      </div>

      <Leaderboard />
    </div>
  );
};