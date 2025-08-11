import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s0bnmcnt2almodrw.public.blob.vercel-storage.com",
        pathname: "/**", // allow all paths
      },
    ],
  },
};

export default nextConfig;
