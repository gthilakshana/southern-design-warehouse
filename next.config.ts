import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    unoptimized: true,
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
    // Optimized loading settings
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;