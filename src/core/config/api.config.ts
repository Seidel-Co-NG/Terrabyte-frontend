/**
 * API configuration. Base URL can be overridden via env.
 */
const BASE_URL =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL
    ? String(import.meta.env.VITE_API_BASE_URL).replace(/\/$/, '')
    : 'https://765ff52402ca.ngrok-free.app';

const ADMIN_URL =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_URL
    ? String(import.meta.env.VITE_ADMIN_URL).replace(/\/$/, '')
    : (BASE_URL ? `${BASE_URL.replace(/\/$/, '')}/backdoor` : '');

const ANDROID_APP_URL =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_ANDROID_APP_URL
    ? String(import.meta.env.VITE_ANDROID_APP_URL).trim()
    : '';

const IOS_APP_URL =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_IOS_APP_URL
    ? String(import.meta.env.VITE_IOS_APP_URL).trim()
    : '';

export const apiConfig = {
  baseUrl: BASE_URL,
  adminUrl: ADMIN_URL,
  androidAppUrl: ANDROID_APP_URL,
  iosAppUrl: IOS_APP_URL,
  timeout: 60_000,
  storageKeys: {
    token: 'auth_token',
    user: 'auth_user',
  },
} as const;
