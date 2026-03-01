// src/components/contact/ContactDetails.tsx
import Link from "next/link";
import { IconMail, IconMapPin, IconClock, IconBrandYoutube, IconBrandLinkedin, IconBrandTwitter } from "@/components/ui/Icons";

const contactInfo = [
    {
        icon: <IconMail className="w-5 h-5" />,
        label: "Email Us",
        value: "yt.adarshjha@gmail.com",
        href: "mailto:yt.adarshjha@gmail.com",
        color: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
        icon: <IconMapPin className="w-5 h-5" />,
        label: "Location",
        value: "Singasandra, Bengaluru, Karnataka 560068",
        href: null,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
        icon: <IconClock className="w-5 h-5" />,
        label: "Response Time",
        value: "Usually within 24 hours",
        href: null,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-900/20",
    },
];

const socials = [
    { icon: <IconBrandYoutube className="w-5 h-5" />, href: "https://www.youtube.com/@adarshjhamcaverse", label: "YouTube", hoverColor: "hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" },
    { icon: <IconBrandLinkedin className="w-5 h-5" />, href: "https://www.linkedin.com/in/adarsh-jha-972b71243/", label: "LinkedIn", hoverColor: "hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20" },
    { icon: <IconBrandTwitter className="w-5 h-5" />, href: "https://x.com/theadarshjha22", label: "Twitter", hoverColor: "hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20" },
];

export const ContactDetails = () => {
    return (
        <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Get in Touch</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
                Have a question or want to collaborate? We&apos;d love to hear from you.
            </p>

            {/* Contact Info Cards */}
            <div className="space-y-3 mb-8">
                {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <div className={`p-2.5 rounded-lg ${item.bg} ${item.color} flex-shrink-0`}>
                            {item.icon}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{item.label}</p>
                            {item.href ? (
                                <a href={item.href} className="text-sm font-medium text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors break-all">
                                    {item.value}
                                </a>
                            ) : (
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{item.value}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Social Media */}
            <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Follow Us</p>
                <div className="flex gap-2">
                    {socials.map((s) => (
                        <Link
                            key={s.label}
                            href={s.href}
                            target="_blank"
                            aria-label={s.label}
                            className={`p-3 rounded-lg text-slate-500 dark:text-slate-400 transition-all ${s.hoverColor}`}
                        >
                            {s.icon}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};