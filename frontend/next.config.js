/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    // Use hardcoded values instead of environment variables
  },
}

module.exports = nextConfig
