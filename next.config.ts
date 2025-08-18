import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Add this serverActions block
  serverActions: {
    allowedOrigins: ["*.app.github.dev"],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
}

export default nextConfig