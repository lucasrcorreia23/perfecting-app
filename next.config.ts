import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack é usado automaticamente com 'next dev --turbo' no Next.js 16+
  // Não é necessário configurar explicitamente
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
