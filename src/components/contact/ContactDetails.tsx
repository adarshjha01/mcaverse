// src/components/contact/ContactDetails.tsx
import Link from "next/link";
import {
  IconMail,
  IconMapPin,
  IconClock,
  IconBrandYoutube,
  IconBrandLinkedin,
  IconBrandTwitter,
} from "@/components/ui/Icons";
import { type ReactNode } from "react";

type ContactItem = {
  icon: ReactNode;
  label: string;
  value: string;
  href: string | null;
  accent: string;
  bg: string;
};

const contactInfo: ContactItem[] = [
  {
    icon: <IconMail className="w-4 h-4" />,
    label: "Email Us",
    value: "yt.adarshjha@gmail.com",
    href: "mailto:yt.adarshjha@gmail.com",
    accent: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
  },
  {
    icon: <IconMapPin className="w-4 h-4" />,
    label: "Location",
    value: "Singasandra, Bengaluru, Karnataka 560068",
    href: null,
    accent: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  {
    icon: <IconClock className="w-4 h-4" />,
    label: "Response Time",
    value: "Usually within 24 hours",
    href: null,
    accent: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
];

const socials = [
  {
    icon: <IconBrandYoutube className="w-4.5 h-4.5" />,
    href: "https://www.youtube.com/@adarshjhamcaverse",
    label: "YouTube",
    hoverAccent: "hover:text-red-600 dark:hover:text-red-400",
    hoverBg: "hover:bg-red-50 dark:hover:bg-red-500/10",
  },
  {
    icon: <IconBrandLinkedin className="w-4.5 h-4.5" />,
    href: "https://www.linkedin.com/in/adarsh-jha-972b71243/",
    label: "LinkedIn",
    hoverAccent: "hover:text-blue-700 dark:hover:text-blue-400",
    hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-500/10",
  },
  {
    icon: <IconBrandTwitter className="w-4.5 h-4.5" />,
    href: "https://x.com/theadarshjha22",
    label: "Twitter",
    hoverAccent: "hover:text-sky-600 dark:hover:text-sky-400",
    hoverBg: "hover:bg-sky-50 dark:hover:bg-sky-500/10",
  },
];

export const ContactDetails = () => {
  return (
    <div className="w-full space-y-6">
      {/* Contact info card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm shadow-slate-200/50 dark:shadow-none">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Contact Info
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Have a question or want to collaborate?
        </p>

        <div className="space-y-3">
          {contactInfo.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60"
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg ${item.bg} ${item.accent} flex-shrink-0 mt-0.5`}
              >
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-sm font-medium text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors break-all leading-snug"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-snug">
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social links card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm shadow-slate-200/50 dark:shadow-none">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Follow Us
        </p>
        <div className="flex gap-2">
          {socials.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className={`p-2.5 rounded-lg text-slate-500 dark:text-slate-400 border border-transparent transition-all ${s.hoverAccent} ${s.hoverBg} hover:border-slate-200 dark:hover:border-slate-700`}
            >
              {s.icon}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};