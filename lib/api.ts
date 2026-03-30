import 'server-only';

import { cache } from 'react';

import type { HTTPValidationError, MessageResponse, UserProfileResponse } from '@/lib/types/api.types';

/**
 * StudentNest backend base URL.
 * Override via the `NEST_API_BASE_URL` environment variable in `.env.local`
 * for local development or staging environments.
 */
export const NEST_API_BASE_URL =
  process.env.NEST_API_BASE_URL ?? 'https://student-nest-backend-205p.onrender.com';

/**
 * Structured error returned by every `nestRequest` call on failure.
 *
 * - `message` — human-readable summary suitable for UI display.
 * - `status`  — HTTP status code when the request reached the server.
 * - `detail`  — per-field validation errors forwarded from the backend
 *   (FastAPI `HTTPValidationError.detail`), present only on 422 responses.
 */
export type ApiError = {
  message: string;
  status?: number;
  detail?: HTTPValidationError['detail'];
};

/**
 * Discriminated-union result type used across all API calls.
 *
 * On success: `{ data: T; error: null }`.
 * On failure: `{ data: null; error: ApiError }`.
 *
 * UI code can branch on `result.error` to decide what to render.
 */
export type ApiResult<T> =
  | { data: T; error: null }
  | { data: null; error: ApiError };

/**
 * Extended `RequestInit` that accepts Next.js-specific `next` options
 * for caching (`revalidate`) and tag-based invalidation (`tags`).
 */
export type NestFetchInit = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] };
};

function buildUrl(path: string): string {
  const base = NEST_API_BASE_URL.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

async function parseJson<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function messageFromPayload(payload: unknown, fallback: string): string {
  if (
    payload &&
    typeof payload === 'object' &&
    'detail' in payload &&
    Array.isArray((payload as HTTPValidationError).detail)
  ) {
    const msgs = (payload as HTTPValidationError).detail.map((d) => d.msg).filter(Boolean);
    if (msgs.length) return msgs.join('; ');
  }
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const m = (payload as MessageResponse).message;
    if (typeof m === 'string' && m.length) return m;
  }
  return fallback;
}

/**
 * Generic fetch wrapper for the StudentNest REST API.
 *
 * Returns a consistent `ApiResult<TResponse>` so callers never need
 * try/catch — errors are always in `result.error`.
 *
 * **Server Components (reads):** pass `next: { revalidate, tags }` to
 * leverage Next.js ISR caching and tag-based invalidation.
 *
 * **Server Actions (mutations):** omit `next` and set `cache: 'no-store'`.
 *
 * @template TResponse  The expected JSON shape on a successful response.
 * @param path  API path relative to {@link NEST_API_BASE_URL}, e.g. `"/api/v1/auth/login"`.
 * @param init  Fetch options (method, headers, body, caching).
 * @returns `{ data, error }` — exactly one side is non-null.
 */
export async function nestRequest<TResponse>(
  path: string,
  init: NestFetchInit = {}
): Promise<ApiResult<TResponse>> {
  const url = buildUrl(path);
  const headers = new Headers(init.headers);

  if (init.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const res = await fetch(url, { ...init, headers });
    const payload = await parseJson<unknown>(res);

    if (!res.ok) {
      return {
        data: null,
        error: {
          message: messageFromPayload(payload, res.statusText || 'Request failed'),
          status: res.status,
          detail:
            payload && typeof payload === 'object' && 'detail' in payload
              ? (payload as HTTPValidationError).detail
              : undefined,
        },
      };
    }

    return { data: payload as TResponse, error: null };
  } catch (e) {
    return {
      data: null,
      error: { message: e instanceof Error ? e.message : 'Network error' },
    };
  }
}

/**
 * Fetch the authenticated user's profile.
 *
 * **Endpoint:** `GET /api/v1/auth/me`
 *
 * Wrapped in React `cache()` to deduplicate within the same Server Component
 * render pass. Revalidates every 60 s (ISR) and is tagged `auth` + `profile`
 * so Server Actions can purge it on login/logout/profile updates.
 *
 * @param accessToken  JWT access token for the `Authorization: Bearer` header.
 */
export const getAuthProfile = cache(async (accessToken: string) =>
  nestRequest<UserProfileResponse>('/api/v1/auth/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 60, tags: ['auth', 'profile'] },
  })
);

const moduleHealthPaths = [
  '/api/v1/listings/health',
  '/api/v1/conversations/health',
  '/api/v1/payments/health',
  '/api/v1/marketplace/health',
  '/api/v1/opportunities/health',
  '/api/v1/notifications/health',
  '/api/v1/admin/health',
] as const;

export type ModuleHealthPath = (typeof moduleHealthPaths)[number];

/**
 * Factory that creates a `cache()`-wrapped health-check fetcher for a given
 * backend module. Each returned function deduplicates within a render pass and
 * revalidates every 300 s. Tagged `health` + the path for targeted invalidation.
 *
 * @param path  One of the module health endpoint paths (e.g. `"/api/v1/listings/health"`).
 * @returns A `cache()`-wrapped async function returning `ApiResult<Record<string, unknown>>`.
 */
export function getModuleHealth(path: ModuleHealthPath) {
  return cache(async () =>
    nestRequest<Record<string, unknown>>(path, {
      method: 'GET',
      next: { revalidate: 300, tags: ['health', path] },
    })
  );
}

/** Health check — `GET /api/v1/listings/health` (cache-wrapped). */
export const getListingsHealth = getModuleHealth('/api/v1/listings/health');

/** Health check — `GET /api/v1/conversations/health` (cache-wrapped). */
export const getConversationsHealth = getModuleHealth('/api/v1/conversations/health');

/** Health check — `GET /api/v1/payments/health` (cache-wrapped). */
export const getPaymentsHealth = getModuleHealth('/api/v1/payments/health');

/** Health check — `GET /api/v1/marketplace/health` (cache-wrapped). */
export const getMarketplaceHealth = getModuleHealth('/api/v1/marketplace/health');

/** Health check — `GET /api/v1/opportunities/health` (cache-wrapped). */
export const getOpportunitiesHealth = getModuleHealth('/api/v1/opportunities/health');

/** Health check — `GET /api/v1/notifications/health` (cache-wrapped). */
export const getNotificationsHealth = getModuleHealth('/api/v1/notifications/health');

/** Health check — `GET /api/v1/admin/health` (cache-wrapped). */
export const getAdminHealth = getModuleHealth('/api/v1/admin/health');
