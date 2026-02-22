import type { NextConfig } from 'next'

/** @type {import('next').NextConfig} */



const nextConfig: NextConfig = {
  

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // <-- ADD THIS
      },
    ],
  },
}

module.exports = nextConfig;
export default nextConfig