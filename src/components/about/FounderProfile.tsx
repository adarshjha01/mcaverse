// src/components/about/FounderProfile.tsx
import Image from 'next/image';

// --- ICONS for Social Links ---
const IconYouTube = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10C2.5 6 7.5 4 12 4s9.5 2 9.5 3-2.5 4.5-5 6-5 2-5 2z"></path>
        <path d="M12 18.5c-4.11 0-6.41-1.03-7.5-3C3.5 14.5 2 12.5 2 11c0-1.5 1.5-3 2.5-3.5C5.5 7 8.5 6 12 6s6.5 1 7.5 1.5c1 .5 2.5 2 2.5 3.5 0 1.5-1.5 3.5-2.5 4.5-1.09 1.97-3.39 3-7.5 3z"></path>
        <path d="M9.5 15.5l5-3-5-3z"></path>
    </svg>
);
const IconLinkedIn = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle>
    </svg>
);
const IconTwitter = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9-3.3 1.4-6.6 2.8-10 2.8-3.3 0-6.6-1.4-10-2.8 0 0 1.7-3.5 3.3-4.9-1.3-1.3-2-3.4-2-3.4s2.8 1.4 5.5 2.8c2.8 1.4 5.5 2.8 8.2 0z"></path>
    </svg>
);
const IconMail = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
);


export const FounderProfile = () => {
  const socialLinks = [
    { name: "YouTube", href: "https://www.youtube.com/@adarshjhanitkurukshetra", icon: <IconYouTube /> },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/adarsh-jha-972b71243/", icon: <IconLinkedIn /> },
    { name: "Twitter", href: "https://x.com/theadarshjha22", icon: <IconTwitter /> },
    { name: "Contact", href: "mailto:yt.adarshjha22@gmail.com", icon: <IconMail /> },
  ];

  const stats = [
      {value: "10,000+", label: "Students Helped"},
      {value: "50K+", label: "YouTube Subscribers"},
      {value: "5+", label: "Communities Led"},
      {value: "25+", label: "Events Organized"},
  ];

  return (
    <section className="pb-16">
      <div className="container mx-auto px-4">
        {/* Founder Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="flex-shrink-0">
            {/* --- THIS IS THE UPDATED LINE --- */}
            <Image src="/adarsh-jha.jpg" alt="Adarsh Jha" width={150} height={150} className="rounded-full" />
          </div>
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-3xl font-bold">Adarsh Jha</h2>
            <p className="text-slate-600 mb-4">Founder & CEO, MCAverse</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">Microsoft Learn Student Ambassador</span>
                <span className="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">GDSC Lead</span>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">Coding Ninjas Captain</span>
                <span className="bg-purple-100 text-purple-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">ISB Ambassador</span>
            </div>
            <p className="text-slate-700 mb-6">
              A passionate educator and technology enthusiast, Adarsh started his journey with a simple mission: to make MCA education more accessible and practical for students across India. With experience leading multiple tech communities and creating educational content for thousands of students, he founded MCAverse to bridge the gap between academic learning and industry requirements.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {socialLinks.map(link => (
                <a 
                   key={link.name} 
                   href={link.href} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm border border-slate-200"
                >
                  {link.icon}
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(stat => (
                <div key={stat.label} className="bg-white rounded-xl shadow-md p-6 text-center">
                    <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                    <p className="text-slate-500">{stat.label}</p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};