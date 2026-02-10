"use client";

import Link from 'next/link';
import { 
    IconBrandYoutube, 
    IconBrandLinkedin, 
    IconBrandTwitter, 
    IconBrandWhatsapp,
    IconMessageCircle 
} from '@/components/ui/Icons';

// Helper for Telegram icon
const IconTelegram = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
    </svg>
);

// Helper for External Link icon
const IconExternalLink = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
);

const socialLinks = [
    { 
        name: "YouTube Channel", 
        icon: <IconBrandYoutube className="w-6 h-6" />, 
        href: "https://www.youtube.com/@adarshjhanitkurukshetra",
        color: "text-red-600 dark:text-red-500",
        bgColor: "bg-red-50 dark:bg-red-900/10",
        borderColor: "hover:border-red-200 dark:hover:border-red-900/50",
        description: "Watch free video tutorials & guides"
    },
    {
        name: "Telegram Channel",
        icon: <IconTelegram className="w-6 h-6" />,
        href: "https://t.me/adarshjhanitkurukshetra",
        color: "text-sky-500 dark:text-sky-400",
        bgColor: "bg-sky-50 dark:bg-sky-900/10",
        borderColor: "hover:border-sky-200 dark:hover:border-sky-900/50",
        description: "Join official channel for updates"
    },
    {
        name: "Discussion Group",
        icon: <IconMessageCircle className="w-6 h-6" />,
        href: "https://t.me/NIT_MCA",
        color: "text-indigo-500 dark:text-indigo-400",
        bgColor: "bg-indigo-50 dark:bg-indigo-900/10",
        borderColor: "hover:border-indigo-200 dark:hover:border-indigo-900/50",
        description: "Chat with other MCA aspirants"
    },
    { 
        name: "LinkedIn", 
        icon: <IconBrandLinkedin className="w-6 h-6" />, 
        href: "https://www.linkedin.com/in/adarsh-jha-972b71243/",
        color: "text-blue-700 dark:text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-900/10",
        borderColor: "hover:border-blue-200 dark:hover:border-blue-900/50",
        description: "Connect professionally"
    },
    { 
        name: "Twitter (X)", 
        icon: <IconBrandTwitter className="w-6 h-6" />, 
        href: "https://x.com/theadarshjha22",
        color: "text-slate-700 dark:text-slate-300",
        bgColor: "bg-slate-100 dark:bg-slate-800",
        borderColor: "hover:border-slate-300 dark:hover:border-slate-600",
        description: "Follow for latest updates"
    },
];

export const ConnectWithUs = () => {
    return (
        <div className="space-y-3 mb-10">
            {socialLinks.map((social) => (
                <Link 
                    key={social.name} 
                    href={social.href} 
                    target="_blank"
                    className={`flex items-center p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md hover:-translate-y-0.5 group ${social.borderColor}`}
                >
                    {/* Icon Box */}
                    <div className={`p-3 rounded-lg mr-4 ${social.bgColor} ${social.color} transition-colors`}>
                        {social.icon}
                    </div>

                    {/* Text Content */}
                    <div className="flex-grow">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {social.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {social.description}
                        </p>
                    </div>

                    {/* Arrow Icon */}
                    <div className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                        <IconExternalLink />
                    </div>
                </Link>
            ))}
        </div>
    );
};