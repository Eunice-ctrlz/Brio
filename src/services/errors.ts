export type ApiErrorKind = 'network' | 'timeout' | 'aborted' | 'http' | 'parse';

export class ApiError extends Error {
  readonly status: number;
  readonly kind: ApiErrorKind;
  readonly errors?: Record<string, string[]>;

  constructor(
    message: string,
    options: { status?: number; kind?: ApiErrorKind; errors?: Record<string, string[]> } = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status ?? 0;
    this.kind = options.kind ?? 'http';
    this.errors = options.errors;
  }

  get isUnauthorized() {
    return this.status === 401;
  }
  get isNotFound() {
    return this.status === 404;
  }
  get isValidation() {
    return this.status === 422;
  }
}

export const isAbortError = (e: unknown): boolean =>
  e instanceof ApiError ? e.kind === 'aborted' : e instanceof DOMException && e.name === 'AbortError';

export function defaultMessage(status: number): string {
  switch (status) {
    case 400: return 'The request was invalid.';
    case 401: return 'Please sign in to continue.';
    case 403: return 'You don’t have permission to do that.';
    case 404: return 'We couldn’t find what you were looking for.';
    case 405: return 'That action isn’t supported.';
    case 409: return 'That conflicts with the current state. Please refresh and try again.';
    case 422: return 'Some of the information provided is invalid.';
    case 429: return 'Too many requests. Please wait a moment and try again.';
    default:
      return status >= 500
        ? 'Our servers hit a snag. Please try again shortly.'
        : `Request failed (${status}).`;
  }
}

