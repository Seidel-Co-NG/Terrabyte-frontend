/**
 * HTTP client for API requests. Attaches token, handles 401.
 */
import { apiConfig } from './api.config';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig {
  requireToken?: boolean;
  signal?: AbortSignal;
}

function getToken(): string | null {
  try {
    return localStorage.getItem(apiConfig.storageKeys.token);
  } catch {
    return null;
  }
}

function getHeaders(requireToken = true, _body?: unknown): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (requireToken) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function request<T = unknown>(
  path: string,
  method: RequestMethod = 'GET',
  body?: unknown,
  config: RequestConfig = {}
): Promise<T> {
  const { requireToken = true, signal } = config;
  const url = path.startsWith('http') ? path : `${apiConfig.baseUrl}${path}`;
  const options: RequestInit = {
    method,
    headers: getHeaders(requireToken, body),
    signal,
  };
  if (body != null && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (response.status === 401 && requireToken) {
    clearAuthStorage();
    window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'unauthorized' } }));
    throw new Error(data?.message ?? 'Session expired. Please login again.');
  }

  if (!response.ok) {
    const message = data?.message ?? `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data as T;
}

export function clearAuthStorage(): void {
  try {
    localStorage.removeItem(apiConfig.storageKeys.token);
    localStorage.removeItem(apiConfig.storageKeys.user);
  } catch {
    // ignore
  }
}

export const client = {
  get: <T>(path: string, config?: RequestConfig) =>
    request<T>(path, 'GET', undefined, config),
  post: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>(path, 'POST', body, config),
  put: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>(path, 'PUT', body, config),
  patch: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>(path, 'PATCH', body, config),
  delete: <T>(path: string, config?: RequestConfig) =>
    request<T>(path, 'DELETE', undefined, config),
};
