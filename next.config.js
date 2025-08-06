const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable in Next.js 15

  // Image optimization
  images: {
    domains: ['localhost', 'brenda-librave.netlify.app', 's3.amazonaws.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Internationalization handled by next-intl middleware
  // i18n config removed in favor of next-intl

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/sq/admin',
        permanent: false,
      },
      {
        source: '/blog',
        destination: '/sq/blog',
        permanent: false,
      },
    ];
  },

  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    // Add source maps for better error tracking
    if (!dev && !isServer) {
      config.devtool = 'source-map';
    }

    return config;
  },
};

// Sentry webpack plugin configuration
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  withNextIntl(nextConfig),
  {
    silent: true,
    org: process.env.SENTRY_ORG || 'brenda-librave',
    project: process.env.SENTRY_PROJECT || 'brenda-librave',
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: '/monitoring',
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: false,
  }
);
