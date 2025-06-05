/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AWS_REGION: string
  readonly VITE_USER_POOL_ID: string
  readonly VITE_USER_POOL_CLIENT_ID: string
  readonly VITE_API_ENDPOINT: string
  readonly VITE_SES_SENDER_EMAIL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  env: {
    VITE_AWS_REGION: string
    VITE_USER_POOL_ID: string
    VITE_USER_POOL_CLIENT_ID: string
    VITE_API_ENDPOINT: string
    VITE_SES_SENDER_EMAIL: string
  }
}