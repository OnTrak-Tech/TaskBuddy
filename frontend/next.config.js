/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  output: 'export',
  images: {
    unoptimized: true,
    domains: [
      'taskbuddy-files.s3.eu-west-1.amazonaws.com',
      'taskbuddy-user-files.s3.amazonaws.com'
    ],
  },
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    COGNITO_USER_POOL_ID: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    COGNITO_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    REGION: process.env.NEXT_PUBLIC_REGION,
  },
}

module.exports = nextConfig
