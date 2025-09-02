import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone build for Docker deployments
  output: 'standalone',
  
  // Configure trailing slash behavior
  trailingSlash: false,
  
  // Configure image optimization
  images: {
    domains: ['images.tori.fi'], // Allow images from tori.fi
  },
  
  // Configure headers for security
  async headers() {
    return [
      {
        source: '/:path*',
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
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;