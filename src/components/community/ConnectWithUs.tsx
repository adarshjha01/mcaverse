import Link from 'next/link';
import { IconYouTube, IconLinkedIn, IconTwitter, IconWhatsapp } from '@/components/ui/Icons';

const socialLinks = [
    { 
        name: "YouTube", 
        icon: <IconYouTube className="w-8 h-8" />, 
        href: "https://www.youtube.com/@adarshjhanitkurukshetra",
        color: "text-red-600 dark:text-red-500",
        bgColor: "bg-red-50 dark:bg-red-900/10",
        description: "Watch video tutorials"
    {
        name: "Join Telegram Channel",
        href: "https://t.me/adarshjhanitkurukshetra",
        icon: <IconSend />,
        className: "bg-sky-500 hover:bg-sky-600",
    },
    {
        name: "Join Discussion Group",
        href: "https://t.me/NIT_MCA",
        icon: <IconMessageCircle className="w-6 h-6" />,
        className: "bg-slate-700 hover:bg-slate-800",
    },
    {
        name: "Subscribe on YouTube",
        href: "https://www.youtube.com/@adarshjhamcaverse",
        icon: <IconYouTube />,
        className: "bg-red-600 hover:bg-red-700",
    },
    { 
        name: "LinkedIn", 
        icon: <IconLinkedIn className="w-8 h-8" />, 
        href: "https://www.linkedin.com/in/adarsh-jha-972b71243/",
        color: "text-blue-700 dark:text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-900/10",
        description: "Connect professionally"
    },
    { 
        name: "Twitter", 
        icon: <IconTwitter className="w-8 h-8" />, 
        href: "https://x.com/theadarshjha22",
        color: "text-sky-500 dark:text-sky-400",
        bgColor: "bg-sky-50 dark:bg-sky-900/10",
        description: "Follow for updates"
    },
];

export const ConnectWithUs = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {socialLinks.map((social) => (
                <Link 
                    key={social.name} 
                    href={social.href} 
                    target="_blank"
                    className="flex flex-col items-center p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all hover:-translate-y-1 group"
                >
                    <div className={`p-3 rounded-full mb-3 ${social.bgColor} ${social.color} transition-colors`}>
                        {social.icon}
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{social.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">{social.description}</span>
                </Link>
            ))}
        </div>
    );
};