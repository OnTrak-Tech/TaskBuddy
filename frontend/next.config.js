/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      `${process.env.NEXT_PUBLIC_APP_NAME}-${process.env.NEXT_PUBLIC_ENV}-attachments.s3.amazonaws.com`,
    ],
  },
}

module.exports = nextConfig