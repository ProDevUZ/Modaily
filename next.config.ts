import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    middlewareClientMaxBodySize: 250 * 1024 * 1024
  },
  webpack: (config, { dev }) => {
    if (dev) {
      const currentWatchOptions = config.watchOptions ?? {};

      config.watchOptions = {
        ...currentWatchOptions,
        poll: 300,
        aggregateTimeout: 200
      };
    }

    return config;
  }
};

export default nextConfig;
