import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '100MB',
    },
  },
  images: {
    domains: ['img.freepik.com', 'cloud.appwrite.io'],
  },
};

export default nextConfig;
