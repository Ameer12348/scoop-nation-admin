import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
 images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      // Optionally add this for HTTP support (less common and less secure)
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
