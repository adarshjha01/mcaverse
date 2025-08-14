// src/components/common/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
    const quickLinks = [
        { href: "/mock-tests", label: "Mock Tests" },
        { href: "/videos", label: "Video Tutorials" },
        { href: "/career-hub", label: "Career Guidance" },
        { href: "/community", label: "Community" }, // Assuming community is a section on the homepage
    ];

    const resources = [
        { href: "/ai-assistant", label: "AI Assistant" },
        { href: "/podcast", label: "Podcast" }, // Assuming podcast is a section on the homepage
        { href: "/about", label: "About Us" },
        { href: "/#contact", label: "Contact" }, // Assuming contact is a section on the homepage
    ];

    const socialLinks = [
        { href: "https://www.youtube.com/@adarshjhanitkurukshetra", label: "YouTube" },
        { href: "https://www.linkedin.com/in/adarsh-jha-972b71243/", label: "LinkedIn" },
        { href: "https://x.com/theadarshjha22", label: "Twitter" },
    ];

    return (
        <footer className="bg-slate-900 text-slate-400">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Column 1: MCAverse Info */}
                    <div className="md:col-span-1">
                         <Link href="/" className="flex items-center space-x-2 mb-4">
                            <Image 
                                src="/mcaverse-logo.png"
                                alt="MCAverse Logo"
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                            <span className="font-bold text-xl text-white">MCAverse</span>
                        </Link>
                        <p className="text-sm">
                            Guiding MCA Aspirants & Graduates to Success. Your comprehensive platform for MCA exam preparation and career guidance.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="font-bold text-white text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            {quickLinks.map(link => (
                                <li key={link.label}>
                                    <Link href={link.href} className="hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div>
                        <h3 className="font-bold text-white text-lg mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            {resources.map(link => (
                                <li key={link.label}>
                                    <Link href={link.href} className="hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                     {/* Column 4: Connect With Us */}
                     <div>
                        <h3 className="font-bold text-white text-lg mb-4">Connect With Us</h3>
                        <p className="text-sm mb-4">Follow us on social media for updates</p>
                        <div className="flex space-x-4">
                           {socialLinks.map(link => (
                               <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                   {link.label}
                               </a>
                           ))}
                        </div>
                    </div>
                </div>
                
                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-8 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} MCAverse. All rights reserved. | Made with <span className="text-red-500">❤️</span> by Adarsh for MCA students</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
