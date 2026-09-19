import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
     remotePatterns: [new URL('https://res.cloudinary.com/dgzxxbqa0/**')],
  },
  allowedDevOrigins: ['10.10.1.140', 'efear.shop'],
  async rewrites() {
    return [
      {
        source: '/fear/api/:path*',
        destination: `${process.env.FEAR_API_ORIGIN || 'http://localhost:4000'}/fear/api/:path*`,
      },
    ];
  },

};

export default nextConfig;
