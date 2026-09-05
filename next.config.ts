import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_COMMERCE_URL: process.env.NEXT_COMMERCE_URL,
  },
};

export default nextConfig;
