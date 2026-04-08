import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "fncshatzshafygbjvhuw.supabase.co",
      },
      // AWS S3 patterns for multiple regions
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
      // Specific AWS regions
      {
        protocol: "https",
        hostname: "*.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.us-west-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.eu-west-1.amazonaws.com",
      },
    ],
    // Increase timeout for remote image optimization
    minimumCacheTTL: 3600,
    // Disable optimization for external URLs to improve performance
    unoptimized: process.env.NODE_ENV === 'production' ? false : true,
  },
};

export default nextConfig;