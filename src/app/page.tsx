// src/app/page.tsx
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { QuickAccess } from "@/components/landing/QuickAccess";
import { Testimonials } from "@/components/landing/Testimonials"; 
import { Analytics } from "@vercel/analytics/next"

export default function LandingPage() {
    return (
        <main className="w-full overflow-x-hidden flex flex-col">
            <Hero />

            {/* Wave divider: white → slate-50 */}
            <div className="relative -mt-1">
                <svg className="w-full h-8 sm:h-12" viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M0 48h1440V0C1200 40 960 20 720 24 480 28 240 48 0 24v24z" className="fill-slate-50 dark:fill-slate-950" />
                </svg>
            </div>

            <Features />

            {/* Wave divider: slate-50 → white */}
            <div className="relative -mt-1">
                <svg className="w-full h-8 sm:h-12" viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M0 48h1440V0C1200 40 960 20 720 24 480 28 240 48 0 24v24z" className="fill-white dark:fill-slate-950" />
                </svg>
            </div>

            <Testimonials />

            {/* Wave divider: white → slate-50 */}
            <div className="relative -mt-1">
                <svg className="w-full h-8 sm:h-12" viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M0 48h1440V0C1200 40 960 20 720 24 480 28 240 48 0 24v24z" className="fill-slate-50 dark:fill-slate-950" />
                </svg>
            </div>

            <QuickAccess />
        </main>
    );
}