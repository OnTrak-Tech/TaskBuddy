/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  images: {
    unoptimized: true,
    // Use hardcoded values instead of environment variables
    domains: ['taskbuddy-dev-attachments.s3.amazonaws.com'],
  },
  // Add this to ensure proper static export
  trailingSlash: true,
}

module.exports = nextConfig
