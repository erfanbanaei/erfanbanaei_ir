import type { NextConfig } from 'next';

const immutable = 'public, max-age=31536000, immutable';

const nextConfig: NextConfig = {
  // The bot's local deploy builds into a separate folder, then swaps it in (see ../run-local.sh).
  distDir: process.env.NEXT_DIST_DIR || '.next',
  poweredByHeader: false,
  // Tailwind's CSS is small; inlining it removes a render-blocking request (better FCP/LCP).
  experimental: { inlineCss: true },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: 'blog.erfanbanaei.ir', pathname: '/wp-content/uploads/**' }],
  },
  // Pages re-rendered by ISR (home, blog) read content/ at runtime, so ship it with the functions.
  outputFileTracingIncludes: { '/**': ['./content/**/*'] },

  // Persian lives at the root, English under /en. Internally every page is app/[lang]/…,
  // so unprefixed paths are rewritten to /fa/… and /fa/… is redirected to the clean URL.
  async redirects() {
    return [
      { source: '/fa', destination: '/', permanent: true },
      { source: '/fa/:path*', destination: '/:path*', permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        { source: '/', destination: '/fa' },
        { source: '/:path((?!en(?:/|$)).*)', destination: '/fa/:path' },
      ],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Bot-uploaded images get a unique hashed name, so they never change in place.
      { source: '/images/:path*', headers: [{ key: 'Cache-Control', value: immutable }] },
      { source: '/files/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' }] },
    ];
  },
};

export default nextConfig;
