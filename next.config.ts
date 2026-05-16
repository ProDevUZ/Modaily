import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "modaily.uk"
      },
      {
        protocol: "https",
        hostname: "www.modaily.uk"
      },
      {
        protocol: "https",
        hostname: "placehold.co"
      }
    ]
  },
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
