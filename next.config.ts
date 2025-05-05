// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.17"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aihavenlabs.com',
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
      // Add new rewrites for admin routes in app router
      // ... add similar rewrites for other admin routes
      
      {
        source: '/:locale/admin/:path*',
        destination: '/admin/:path*',
        locale: false
      },
      {
        source: '/:locale/api/:path*',
        destination: '/api/:path*',
        locale: false
      }
    ]
  }
};

export default withNextIntl(nextConfig);