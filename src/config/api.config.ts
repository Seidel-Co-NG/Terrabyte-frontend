/**
 * API configuration. Base URL can be overridden via env.
 */
const BASE_URL =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL
    ? String(import.meta.env.VITE_API_BASE_URL).replace(/\/$/, '')
    : 'https://84d9f8ab0c7f.ngrok-free.app';

export const apiConfig = {
  baseUrl: BASE_URL,
  timeout: 60_000,
  storageKeys: {
    token: 'auth_token',
    user: 'auth_user',
  },
} as const;
