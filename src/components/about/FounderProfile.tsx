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
    { name: "YouTube", href: "https://www.youtube.com/@adarshjhamcaverse", icon: <IconYouTube className="w-4 h-4" />, color: "hover:text-red-500" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/adarsh-jha-972b71243/", icon: <IconLinkedIn className="w-4 h-4" />, color: "hover:text-blue-600" },
    { name: "Twitter", href: "https://x.com/theadarshjha22", icon: <IconTwitter className="w-4 h-4" />, color: "hover:text-sky-500" },
    { name: "Spotify", href: "https://open.spotify.com/show/4xlytFQ9Rcspndg01619rM", icon: <IconSpotify className="w-4 h-4" />, color: "hover:text-green-500" },
  ];

  const stats = [
      { value: "10,000+", label: "Students Helped" },
      { value: "3K+", label: "YouTube Subscribers" },
      { value: "5+", label: "Communities Led" },
      { value: "25+", label: "Events Organized" },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Founder Card */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
            {/* Photo */}
            <div className="flex-shrink-0 relative">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden ring-4 ring-teal-100 dark:ring-teal-900/30 shadow-lg">
                <Image src="/IMG_3107.jpg" alt="Adarsh Jha" width={150} height={150} className="w-full h-full object-cover" />
              </div>
              {/* Online dot */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-[3px] border-white dark:border-slate-950" />
            </div>

            {/* Info */}
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">Adarsh Jha</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Founder & CEO, MCAverse &middot; Assistant Professor</p>

              {/* Badges */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-5">
                <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M23.334 11.96c-.713-.726-.872-1.829-.393-2.727.342-.64.366-1.401.064-2.062-.301-.66-.893-1.142-1.601-1.302-.991-.225-1.722-1.067-1.803-2.081-.059-.723-.451-1.378-1.062-1.77-.609-.393-1.367-.478-2.05-.229-.956.346-2.023.076-2.64-.669-.44-.53-1.1-.838-1.784-.838-.684 0-1.344.309-1.784.838-.617.745-1.684 1.015-2.64.669-.682-.248-1.44-.163-2.05.229-.61.392-1.003 1.047-1.062 1.77-.08 1.014-.811 1.856-1.802 2.081-.708.16-1.3.642-1.601 1.302-.302.661-.278 1.422.064 2.062.479.898.32 2.001-.393 2.727-.508.517-.747 1.242-.644 1.96.104.718.549 1.343 1.203 1.69.918.487 1.388 1.548 1.16 2.621-.163.766.029 1.573.52 2.183.49.61 1.233.932 2.006.87 1.082-.087 2.063.511 2.424 1.477.258.69.839 1.225 1.569 1.446.73.222 1.517.073 2.128-.402.855-.667 2.037-.667 2.893 0 .611.475 1.398.623 2.128.402.73-.221 1.311-.756 1.57-1.446.36-.966 1.34-1.564 2.423-1.477.773.062 1.516-.26 2.006-.87.491-.61.683-1.417.52-2.183-.228-1.073.242-2.134 1.16-2.621.654-.347 1.099-.972 1.203-1.69.103-.718-.136-1.443-.644-1.96zm-8.18 2.018l-4.667 4.667a.8.8 0 01-1.133 0l-2.333-2.334a.8.8 0 111.132-1.132l1.767 1.767 4.1-4.1a.8.8 0 011.134 1.132z"/></svg>
                  Microsoft Ambassador
                </span>
                <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
                  Coding Ninjas Captain
                </span>
                <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-purple-200/50 dark:border-purple-800/30">
                  LinkedIn Marketing Insider
                </span>
              </div>

              {/* Bio */}
              <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3 mb-5">
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

              {/* Social Links */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {socialLinks.map(link => (
                  <a 
                     key={link.name} 
                     href={link.href} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className={`inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 ${link.color} font-semibold px-3 py-2 rounded-xl transition-all duration-200 border border-slate-200 dark:border-slate-700/50 text-xs hover:border-slate-300 dark:hover:border-slate-600 active:scale-[0.97]`}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {stats.map(stat => (
                <div key={stat.label} className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 text-center hover:border-teal-300 dark:hover:border-teal-800/50 transition-all duration-200">
                    <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-0.5">{stat.value}</p>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};
