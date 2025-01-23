/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
    // ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
    serverActions: true,
};

module.exports = nextConfig;
