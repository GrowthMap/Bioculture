import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.typeform.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;