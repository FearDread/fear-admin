import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.10.1.140'],
  async rewrites() {
    return [
      {
        source: '/fear/api/:path*',
        destination: `${process.env.FEAR_API_ORIGIN || 'https://fear.dedyn.io:4000'}/fear/api/:path*`,
      },
    ];
  },

};

export default nextConfig;
