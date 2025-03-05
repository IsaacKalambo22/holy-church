import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true, // Skip type-checking during builds
  },

  // ESLint settings
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint checks during builds
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'd2qzsd8jf2durk.cloudfront.net',
      },
    ],
  },
};

export default nextConfig;
