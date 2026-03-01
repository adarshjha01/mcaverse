import Link from "next/link";
import {
  IconBrandYoutube,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconMessageCircle,
} from "@/components/ui/Icons";
import { type ReactNode } from "react";

// Telegram icon (not in shared Icons)
const IconTelegram = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
  </svg>
);

const IconExternal = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

type SocialLink = {
  name: string;
  href: string;
  description: string;
  icon: ReactNode;
  accent: string; // text color for icon
  bg: string;     // bg for icon pill
};

const socialLinks: SocialLink[] = [
  {
    name: "YouTube",
    href: "https://www.youtube.com/@adarshjhamcaverse",
    description: "Free video tutorials & guides",
    icon: <IconBrandYoutube className="w-4 h-4" />,
    accent: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-500/10",
  },
  {
    name: "Telegram Channel",
    href: "https://t.me/adarshjhanitkurukshetra",
    description: "Official updates & announcements",
    icon: <IconTelegram className="w-4 h-4" />,
    accent: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-500/10",
  },
  {
    name: "Discussion Group",
    href: "https://t.me/NIT_MCA",
    description: "Chat with other MCA aspirants",
    icon: <IconMessageCircle className="w-4 h-4" />,
    accent: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/adarsh-jha-972b71243/",
    description: "Connect professionally",
    icon: <IconBrandLinkedin className="w-4 h-4" />,
    accent: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
  },
  {
    name: "Twitter (X)",
    href: "https://x.com/theadarshjha22",
    description: "Latest updates & news",
    icon: <IconBrandTwitter className="w-4 h-4" />,
    accent: "text-slate-800 dark:text-slate-300",
    bg: "bg-slate-100 dark:bg-slate-700/40",
  },
];

export const ConnectWithUs = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
        Connect With Us
      </h3>
      <div className="space-y-1">
        {socialLinks.map((social) => (
          <Link
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${social.bg} ${social.accent} flex-shrink-0 transition-colors`}>
              {social.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {social.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {social.description}
              </p>
            </div>
            <div className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors flex-shrink-0">
              <IconExternal />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};