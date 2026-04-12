import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Expose to client components so relative signed URLs can be made absolute
    NEXT_PUBLIC_NEST_API_BASE_URL:
      process.env.NEST_API_BASE_URL ?? 'https://student-nest-backend-205p.onrender.com',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
