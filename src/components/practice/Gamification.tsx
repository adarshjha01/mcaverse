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
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 text-center">
        <IconZap className="w-12 h-12 mx-auto text-yellow-500 mb-2" />
        <p className="text-3xl font-bold">{xp} <span className="text-base font-normal text-slate-500">XP</span></p>
        <p className="text-sm text-slate-500">Experience Points</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 text-center">
        <IconAward className="w-12 h-12 mx-auto text-purple-500 mb-2" />
        <p className="text-3xl font-bold">{level}</p>
        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
          <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>
      <Leaderboard />
    </div>
  );
};
