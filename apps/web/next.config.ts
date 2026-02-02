import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@monetizekit/config', '@monetizekit/db'],
};

export default nextConfig;
