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
    NEXT_PUBLIC_API_URL: 'https://uzoqf3buyb.execute-api.eu-west-1.amazonaws.com/Prod',
    NEXT_PUBLIC_COGNITO_USER_POOL_ID: 'eu-west-1_J7EKiwTfA',
    NEXT_PUBLIC_COGNITO_CLIENT_ID: 'n7u78450uvmbtgjdf6iai58cm',
    NEXT_PUBLIC_REGION: 'eu-west-1',
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_URL: 'https://uzoqf3buyb.execute-api.eu-west-1.amazonaws.com/Prod',
    NEXT_PUBLIC_COGNITO_USER_POOL_ID: 'eu-west-1_J7EKiwTfA',
    NEXT_PUBLIC_COGNITO_CLIENT_ID: 'n7u78450uvmbtgjdf6iai58cm',
    NEXT_PUBLIC_REGION: 'eu-west-1',
  },
  assetPrefix: '.',
}

module.exports = nextConfig
