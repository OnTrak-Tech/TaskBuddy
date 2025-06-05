// Helper to get environment variables from either Vite or window.env
export const getEnv = (key: string): string => {
  // Try to get from window.env first (for production)
  if (typeof window !== 'undefined' && window.env) {
    return (window.env as any)[key] || '';
  }
  
  // Fall back to import.meta.env (for development)
  return (import.meta.env as any)[key] || '';
};