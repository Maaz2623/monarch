import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        hostname: "www.boat-lifestyle.com",
      },
    ],
  },
};

export default nextConfig;
