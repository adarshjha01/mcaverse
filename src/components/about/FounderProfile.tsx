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
const IconSpotify = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
);


export const FounderProfile = () => {
  const socialLinks = [
    { name: "YouTube", href: "https://www.youtube.com/@adarshjhamcaverse", icon: <IconYouTube /> },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/adarsh-jha-972b71243/", icon: <IconLinkedIn /> },
    { name: "Twitter", href: "https://x.com/theadarshjha22", icon: <IconTwitter /> },
    { name: "Spotify", href: "https://open.spotify.com/show/4xlytFQ9Rcspndg01619rM", icon: <IconSpotify /> },
  ];

  const stats = [
      {value: "10,000+", label: "Students Helped"},
      {value: "3K+", label: "YouTube Subscribers"},
      {value: "5+", label: "Communities Led"},
      {value: "25+", label: "Events Organized"},
  ];

  return (
    <section className="py-10 sm:py-16">
      <div className="container mx-auto px-4">
        {/* Founder Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8 mb-8 sm:mb-12 transition-all duration-300">
          <div className="flex-shrink-0">
            <Image src="/IMG_3107.jpg" alt="Adarsh Jha" width={150} height={150} className="rounded-full w-28 h-28 sm:w-[150px] sm:h-[150px] object-cover" />
          </div>
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Adarsh Jha</h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-3 sm:mb-4">Founder & CEO, MCAverse</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3 sm:mb-4">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">Microsoft Learn Student Ambassador</span>
                <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">Coding Ninjas Campus Captain</span>
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">LinkedIn Certified Marketing Insider</span>
            </div>
            <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-4 sm:mb-6 space-y-3 leading-relaxed">
              <p>
                I began my MCA journey through self-study because I couldn&apos;t afford expensive coaching, but I refused to let that stop me. I promised myself that if I ever reached a point where I could guide others, I would share everything I learned to help MCA aspirants succeed.
              </p>
              <p>
                After completing my MCA from NIT Kurukshetra, I led communities and created educational content for thousands of students. Today, through MCAverse, I strive to be your one-stop solution for all MCA and BCA questions &mdash; guiding you from your first step as an aspirant to building a successful career.
              </p>
              <p>
                As an Assistant Professor, I work closely with students to understand their challenges and create better resources, so together we can make every step of this journey easier and more rewarding.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">
              {socialLinks.map(link => (
                <a 
                   key={link.name} 
                   href={link.href} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 sm:gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors duration-200 shadow-sm border border-slate-200 dark:border-slate-700 text-sm"
                >
                  {link.icon}
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {stats.map(stat => (
                <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-slate-200 dark:border-slate-700 p-4 sm:p-6 text-center transition-all duration-300">
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};
