/**
 * Laravel-style JSON bodies often return HTTP 200 with
 * `{ status: "failed" | "successful", message: "..." }`.
 * The fetch client only throws on non-2xx, so callers must check `status`.
 */

export function isApiSuccessResponse(res: unknown): boolean {
  if (res == null || typeof res !== 'object') return false;
  const r = res as Record<string, unknown>;
  const status = r.status;
  if (status == null) return false;
  const s = String(status).toLowerCase();
  return s === 'success' || s === 'successful';
}

export function getApiMessage(res: unknown, fallback: string): string {
  if (res && typeof res === 'object' && 'message' in res) {
    const m = (res as { message?: unknown }).message;
    if (typeof m === 'string' && m.trim()) return m;
  }
  return fallback;
}
