// src/components/landing/FeatureSection.tsx
import React from 'react';

// Define the type for the component's props
interface FeatureSectionProps {
    id: string;
    title: string;
    children: React.ReactNode;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ id, title, children }) => {
    return (
        <section id={id} className="py-20 bg-slate-900 text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
                <div className="max-w-3xl mx-auto text-center text-slate-400">
                    {children}
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;