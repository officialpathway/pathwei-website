// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Turbopack configuration (replaces experimental.turbo)
  
  // Allowed development origins
  allowedDevOrigins: ["192.168.0.17"],
  
  // Rewrite configuration for cleaner URLs
  async rewrites() {
    return [
      // Main rewrite rule - hides locale from visible URL
      {
        source: '/:path*',
        destination: '/:locale/:path*',
        has: [
          {
            type: 'cookie',
            key: 'NEXT_LOCALE',
            value: '(?<locale>en-US|es-ES)' // Match your supported locales
          }
        ]
      },
      
      // Fallback for direct requests to locale-prefixed paths
      {
        source: '/:locale(en-US|es-ES)/:path*',
        destination: '/:locale/:path*'
      }
    ];
  },
  
  // Optional: Redirect configuration
  async redirects() {
    return [
      // Redirect root to default locale
      {
        source: '/',
        destination: '/en-US', // Or your default locale
        permanent: false
      }
    ];
  },
  
  // Other Next.js configuration options
  images: {
    domains: [], // Add your image domains here
  },
  
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Production-only configurations
  ...(process.env.NODE_ENV === 'production' ? {
    // Production-specific configs
  } : {})
};

export default withNextIntl(nextConfig);