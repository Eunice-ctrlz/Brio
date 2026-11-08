import type {
  ApiResponse,
  AuthResponse,
  CheckoutPayload,
  Customer,
  LoginPayload,
  Order,
  Product,
  ProductQuery,
  RegisterPayload,
} from '@/types';
import { ApiError, defaultMessage } from './errors';
import { mockApi } from './mockApi.ts';

// Re-export so the rest of the app can import errors from one place.
export { ApiError, isAbortError } from './errors';
export type { ApiErrorKind } from './errors';

/* -------------------------------------------------------------------------- */
/*  Configuration                                                             */
/* -------------------------------------------------------------------------- */

const BASE_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/+$/, '');
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const REQUEST_TIMEOUT_MS = 15_000;

/** Cross-origin API → send cookies (session auth). The PHP side must then echo a specific origin. */
const IS_CROSS_ORIGIN = /^https?:\/\//i.test(BASE_URL);

/* -------------------------------------------------------------------------- */
/*  Core request helper                                                       */
/* -------------------------------------------------------------------------- */

type Primitive = string | number | boolean | undefined | null;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  params?: Record<string, Primitive>;
  body?: unknown;
  signal?: AbortSignal;
}

function buildUrl(path: string, params?: Record<string, Primitive>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value));
  }
  const qs = query.toString();
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}${qs ? `?${qs}` : ''}`;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { method = 'GET', params, body, signal } = options;

  // Combine the caller's signal with our own timeout.
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);
  const onCallerAbort = () => controller.abort();
  signal?.addEventListener('abort', onCallerAbort, { once: true });
  if (signal?.aborted) controller.abort();

  const headers: Record<string, string> = { Accept: 'application/json' };
  // A JSON Content-Type makes cross-origin requests "non-simple", which triggers a
  // CORS preflight (OPTIONS). The PHP API must answer it — see php-api/index.php.
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let response: Response;
  try {
    response = await fetch(buildUrl(path, params), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      mode: 'cors',
      credentials: IS_CROSS_ORIGIN ? 'include' : 'same-origin',
      signal: controller.signal,
    });
  } catch (err) {
    if (timedOut) throw new ApiError('The request timed out. Please try again.', { kind: 'timeout' });
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Request cancelled.', { kind: 'aborted' });
    }
    // fetch rejects (TypeError) on DNS/offline/CORS-blocked failures.
    throw new ApiError('Can’t reach the server. Check your connection and try again.', {
      kind: 'network',
    });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onCallerAbort);
  }

  // 204 No Content (e.g. DELETE) → empty envelope.
  if (response.status === 204) {
    return { success: true, data: undefined as T };
  }

  const text = await response.text();
  let payload: Partial<ApiResponse<T>> | null = null;
  if (text) {
    try {
      payload = JSON.parse(text) as Partial<ApiResponse<T>>;
    } catch {
      // PHP fatals / HTML error pages end up here.
      if (response.ok) {
        throw new ApiError('The server returned an unreadable response.', {
          status: response.status,
          kind: 'parse',
        });
      }
    }
  }

  if (!response.ok || payload?.success === false) {
    throw new ApiError(payload?.message || defaultMessage(response.status), {
      status: response.status,
      errors: payload?.errors,
    });
  }

  if (!payload || !('data' in payload)) {
    throw new ApiError('The server response was missing data.', {
      status: response.status,
      kind: 'parse',
    });
  }

  return payload as ApiResponse<T>;
}

/* -------------------------------------------------------------------------- */
/*  Public API surface                                                        */
/* -------------------------------------------------------------------------- */

export interface ApiClient {
  getProducts(query?: ProductQuery, signal?: AbortSignal): Promise<ApiResponse<Product[]>>;
  getProduct(id: number, signal?: AbortSignal): Promise<ApiResponse<Product>>;
  getProfile(signal?: AbortSignal): Promise<ApiResponse<Customer>>;
  getOrders(signal?: AbortSignal): Promise<ApiResponse<Order[]>>;
  checkout(payload: CheckoutPayload, signal?: AbortSignal): Promise<ApiResponse<Order>>;
  login(payload: LoginPayload, signal?: AbortSignal): Promise<ApiResponse<AuthResponse>>;
  register(payload: RegisterPayload, signal?: AbortSignal): Promise<ApiResponse<AuthResponse>>;
  logout(signal?: AbortSignal): Promise<ApiResponse<void>>;
}

const httpApi: ApiClient = {
  getProducts: (query = {}, signal) =>
    request<Product[]>('/products', {
      signal,
      params: {
        category: query.category === 'all' ? undefined : query.category,
        search: query.search?.trim(),
        featured: query.featured ? 1 : undefined,
        deal: query.deal ? 1 : undefined,
        limit: query.limit,
      },
    }),
  getProduct: (id, signal) => request<Product>(`/products/${id}`, { signal }),
  getProfile: (signal) => request<Customer>('/account/profile', { signal }),
  getOrders: (signal) => request<Order[]>('/account/orders', { signal }),
  checkout: (payload, signal) => request<Order>('/orders', { method: 'POST', body: payload, signal }),
  login: (payload, signal) => request<AuthResponse>('/auth/login', { method: 'POST', body: payload, signal }),
  register: (payload, signal) => request<AuthResponse>('/auth/register', { method: 'POST', body: payload, signal }),
  logout: (signal) => request<void>('/auth/logout', { method: 'POST', signal }),
};

export const api: ApiClient = USE_MOCK ? mockApi : httpApi;
