/**
 * Application configuration
 * Reads from environment variables (Vite requires VITE_ prefix)
 */

export const getApiBaseUrl = (): string => {
  // Vite exposes env variables via import.meta.env
  // Only variables prefixed with VITE_ are exposed to client-side code
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5193';
};

export const config = {
  apiBaseUrl: getApiBaseUrl(),
} as const;

