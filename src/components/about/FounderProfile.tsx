// src/components/about/FounderProfile.tsx
import Image from 'next/image';

// --- ICONS for Social Links ---
export const IconYouTube = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M23.498 6.186a2.97 2.97 0 0 0-2.09-2.103C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.408.583A2.97 2.97 0 0 0 .502 6.186 31.398 31.398 0 0 0 0 12a31.4 31.4 0 0 0 .502 5.814 2.97 2.97 0 0 0 2.09 2.103C4.495 20.5 12 20.5 12 20.5s7.505 0 9.408-.583a2.97 2.97 0 0 0 2.09-2.103A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.502-5.814zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
  </svg>
);
const IconLinkedIn = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle>
    </svg>
);
export const IconTwitter = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
  >
    <path d="M23.954 4.569c-.885.392-1.83.656-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.564-2.005.974-3.127 1.195-.897-.959-2.178-1.558-3.594-1.558-2.722 0-4.928 2.206-4.928 4.928 0 .386.045.762.127 1.124-4.094-.205-7.725-2.165-10.152-5.144-.424.729-.666 1.577-.666 2.475 0 1.708.87 3.215 2.188 4.099-.807-.026-1.566-.248-2.229-.616v.062c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.317 0-.626-.031-.928-.088.627 1.956 2.444 3.377 4.6 3.418-1.685 1.321-3.808 2.108-6.115 2.108-.397 0-.788-.023-1.175-.069 2.179 1.397 4.768 2.212 7.557 2.212 9.054 0 14.001-7.496 14.001-13.986 0-.213-.005-.425-.014-.636.961-.694 1.8-1.562 2.46-2.549z" />
  </svg>
);
const IconMail = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
);


export const FounderProfile = () => {
  const socialLinks = [
    { name: "YouTube", href: "https://www.youtube.com/@adarshjhamcaverse", icon: <IconYouTube /> },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/adarsh-jha-972b71243/", icon: <IconLinkedIn /> },
    { name: "Twitter", href: "https://x.com/theadarshjha22", icon: <IconTwitter /> },
    { name: "Contact", href: "mailto:yt.adarshjha22@gmail.com", icon: <IconMail /> },
  ];

  const stats = [
      {value: "10,000+", label: "Students Helped"},
      {value: "3K+", label: "YouTube Subscribers"},
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
                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">Coding Ninjas Campus Captain</span>
                <span className="bg-purple-100 text-purple-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">LinkedIn Certified Marketing Insider </span>
            </div>
            <p className="text-slate-700 mb-6">
            I began my MCA journey through self-study because I couldn’t afford expensive coaching, but I refused to let that stop me. I promised myself that if I ever reached a point where I could guide others, I would share everything I learned to help MCA aspirants succeed. After completing my MCA from NIT Kurukshetra, I led communities and created educational content for thousands of students. Today, through MCAverse, I strive to be your one-stop solution for all MCA and BCA questions, guiding you from your first step as an aspirant to building a successful career. As an Assistant Professor, I work closely with students to understand their challenges and create better resources so together we can make every step of this journey easier and more rewarding.
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