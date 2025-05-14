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
        source: '/:locale/admin/:path*',
        destination: '/admin/:path*',
        locale: false
      },
      // API paths should not have locale prefixes
      {
        source: '/:locale/api/:path*',
        destination: '/api/:path*',
        locale: false
      }
    ]
  },
  // Add redirects to ensure root path goes to default locale
  async redirects() {
    return [
      {
        source: '/',
        destination: '/es',
        permanent: true,
      }
    ]
  }
};

export default withNextIntl(nextConfig);