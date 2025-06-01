// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.17"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mypathwayapp.com'
      },
      {
        protocol: 'https',
        hostname: 'zfourrtiscdrogzcwxde.supabase.co',
      }
    ],
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      // Admin paths should not have locale prefixes
      {
        source: '/admin/:path*',
        destination: '/admin/:path*',
      },
      // API paths should not have locale prefixes
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      }
    ]
  },
  // Remove all locale-related redirects for now
  async redirects() {
    return []
  }
};

export default nextConfig;