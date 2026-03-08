// src/components/ui/QuestionImages.tsx
// Reusable component to render question/option/explanation images
"use client";

import Image from 'next/image';
import { useState } from 'react';

interface QuestionImagesProps {
    images: string[];
    alt?: string;
    className?: string;
}

/**
 * Renders an array of image URLs inline (below question text, inside option, or in explanation).
 * Handles loading states, errors, and click-to-zoom.
 */
export const QuestionImages = ({ images, alt = "Question image", className = "" }: QuestionImagesProps) => {
    const [zoomedSrc, setZoomedSrc] = useState<string | null>(null);

    if (!images || images.length === 0) return null;

    return (
        <>
            <div className={`flex flex-wrap gap-3 my-3 ${className}`}>
                {images.map((src, idx) => (
                    <ImageWithFallback
                        key={idx}
                        src={src}
                        alt={`${alt} ${idx + 1}`}
                        onClick={() => setZoomedSrc(src)}
                    />
                ))}
            </div>

            {/* Zoom overlay */}
            {zoomedSrc && (
                <div
                    className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
                    onClick={() => setZoomedSrc(null)}
                >
                    <div className="relative max-w-[90vw] max-h-[90vh]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={zoomedSrc}
                            alt={alt}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        />
                        <button
                            onClick={() => setZoomedSrc(null)}
                            className="absolute -top-3 -right-3 w-8 h-8 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

/**
 * Single image with loading skeleton plus error fallback.
 */
function ImageWithFallback({ src, alt, onClick }: { src: string; alt: string; onClick: () => void }) {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

    // Skip non-URL filenames (unresolved images)
    if (!src.startsWith('http://') && !src.startsWith('https://')) {
        return (
            <div className="px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg text-xs text-amber-600 dark:text-amber-400">
                📷 Image: {src}
            </div>
        );
    }

    return (
        <div className="relative cursor-zoom-in" onClick={onClick}>
            {status === 'loading' && (
                <div className="w-48 h-32 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            )}
            {status === 'error' && (
                <div className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-xs text-red-500">
                    Failed to load image
                </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={alt}
                className={`max-w-full max-h-64 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow ${status === 'loading' ? 'absolute opacity-0' : ''}`}
                onLoad={() => setStatus('loaded')}
                onError={() => setStatus('error')}
            />
        </div>
    );
}
