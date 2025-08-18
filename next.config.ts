import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ... (your serverActions block if you have one)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // <-- ADD THIS
      },
    ],
  },
}

export default nextConfig