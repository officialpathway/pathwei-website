// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.17"],
  // Remove empty devIndicators if not needed
  // Add other Next.js config options here
};

export default withNextIntl(nextConfig);