// src/components/common/ComingSoonPage.tsx
import Link from 'next/link';
import { HorizontalNavbar } from '@/components/landing/HorizontalNavbar'; // Corrected: Using named import
// NOTE: We don't need to import the Footer here because it's already in the main layout.tsx

// Icon for the page
const IconWrench = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
);

interface ComingSoonPageProps {
  featureName: string;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ featureName }) => {
  return (
    // The main layout now handles the background color and footer
    <>
      <HorizontalNavbar />
      {/* Updated section with white background to match the homepage theme */}
      <main className="flex-grow flex items-center justify-center text-center py-20 bg-white">
        <div className="container mx-auto px-4">
          <IconWrench className="w-20 h-20 mx-auto text-slate-400 mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Coming Soon!
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            The <span className="font-semibold text-indigo-600">{featureName}</span> feature is currently under construction. 
            <br />
            We're working hard to bring you an amazing experience. Stay tuned!
          </p>
          <Link href="/" className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors duration-300">
            Go Back Home
          </Link>
        </div>
      </main>
    </>
  );
};
