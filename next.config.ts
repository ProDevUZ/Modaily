import type { NextConfig } from "next";

function getOptionalRemoteImagePattern() {
  const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL?.trim();

  if (!publicBaseUrl) {
    return null;
  }

  try {
    const url = new URL(publicBaseUrl);

    if (url.protocol !== "https:") {
      return null;
    }

    return {
      protocol: "https" as const,
      hostname: url.hostname
    };
  } catch {
    return null;
  }
}

const r2RemoteImagePattern = getOptionalRemoteImagePattern();
const remotePatterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [
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
];

if (r2RemoteImagePattern) {
  remotePatterns.push(r2RemoteImagePattern);
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    unoptimized: false,
    remotePatterns
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
