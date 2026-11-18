import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // exercises.json is read with fs at runtime; make sure serverless bundles include it
  outputFileTracingIncludes: {
    '/**': ['./public/data/exercises.json'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/hasaneyldrm/exercises-dataset/**',
      },
    ],
  },
};

export default nextConfig;
