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
        hostname: 'mypathwayapp.com'
      },
      {
        protocol: 'https',
        hostname: 'zfourrtiscdrogzcwxde.supabase.co',
      }
    ],
  },
  webpack: (config, { dev }) => {
    // Improve source maps in development mode
    if (dev) {
      config.devtool = 'eval-source-map';
    }
    
    return config;
  },
  reactStrictMode: true,
  
  async rewrites() {
    return [
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