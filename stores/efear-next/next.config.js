
const nextConfig = {
  // Proxy all Express API calls so the frontend never needs to know the backend port.
  // In production, replace localhost:4000 with your actual API base URL via env var.
  async rewrites() {
    return [
      {
        source: '/fear/api/:path*',
        destination: `${process.env.API_BASE_URL || 'http://localhost:4000'}/fear/api/:path*`,
      },
    ];
  },

  // Security headers — mirrors what router.js was setting on every response
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'X-Frame-Options',         value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection',        value: '1; mode=block' },
          { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',      value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Long-lived cache for fingerprinted static assets (Next.js handles hashing)
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  images: {
    // Add your CDN / image domains here
    remotePatterns: [
      { protocol: 'https', hostname: '**.efear.store' },
    ],
  },
};

module.exports = nextConfig;