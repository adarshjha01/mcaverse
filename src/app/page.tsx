// src/app/page.tsx
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import FeatureSection from "@/components/landing/FeatureSection";

export default function LandingPage() {
    return (
        <div className="bg-slate-900">
            <Navbar />
            <main>
                <Hero />
                <FeatureSection id="about" title="About MCAverse">
                    <p>This is where you'll describe your mission, vision, and the team behind MCAverse. Explain why you started this platform and what makes it unique for MCA students.</p>
                </FeatureSection>
                <FeatureSection id="lectures" title="Lectures & Mock Tests">
                     <p>Here you can showcase your core offerings. Maybe include a few sample video thumbnails or a list of subjects covered in your mock tests. This section is crucial for converting visitors into users.</p>
                </FeatureSection>
                <FeatureSection id="community" title="Join Our Thriving Community">
                     <p>Describe the benefits of joining the MCAverse community. Mention things like peer-to-peer support, doubt-clearing sessions, and networking opportunities with fellow aspirants and graduates.</p>
                </FeatureSection>
                <FeatureSection id="career-hub" title="Your Career Hub">
                     <p>Detail the resources available in the Career Hub. This could include resume building workshops, interview preparation guides, job boards, and mentorship programs with industry professionals.</p>
                </FeatureSection>
                <FeatureSection id="podcast" title="The MCAverse Podcast">
                     <p>Introduce your podcast. You can embed a player for the latest episode here. Talk about the topics you cover, such as interviews with successful alumni, career tips, and discussions on new technologies.</p>
                </FeatureSection>
                <FeatureSection id="contact" title="Get In Touch">
                     <p>Provide contact information here. A simple contact form, email address, and links to your social media profiles would be perfect for this section.</p>
                </FeatureSection>
            </main>
            <footer className="bg-slate-900 border-t border-slate-800 py-8 text-center text-slate-400">
                <div className="container mx-auto px-4">
                    <p>&copy; {new Date().getFullYear()} MCAverse. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}