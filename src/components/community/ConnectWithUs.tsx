// src/components/community/ConnectWithUs.tsx
import { IconSend, IconMessageCircle, IconYouTube, IconLinkedIn } from "@/components/ui/Icons";

// Array of all social links for easy management
const socialLinks = [
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
        href: "https://www.youtube.com/@adarshjhanitkurukshetra",
        icon: <IconYouTube />,
        className: "bg-red-600 hover:bg-red-700",
    },
    {
        name: "Follow on LinkedIn",
        href: "https://www.linkedin.com/in/adarsh-jha-972b71243/",
        icon: <IconLinkedIn />,
        className: "bg-blue-700 hover:bg-blue-800",
    }
    
];

export const ConnectWithUs = () => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200 sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Connect With Us</h2>
            <p className="text-slate-600 mb-6">
                Get instant updates, join live discussions, and be part of our active community across all platforms.
            </p>
            <div className="space-y-4">
                {socialLinks.map(link => (
                    <a 
                        key={link.name}
                        href={link.href}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-center gap-3 text-white font-semibold py-3 rounded-lg shadow-md transition-colors ${link.className}`}
                    >
                        {link.icon}
                        <span>{link.name}</span>
                    </a>
                ))}
            </div>
        </div>
    );
};
