import { useCallback, useEffect, useState } from 'react';
import { ApiError, isAbortError } from '@/services/errors';
import type { ApiResponse } from '@/types';

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  fetcher: (signal: AbortSignal) => Promise<ApiResponse<T>>,
  deps: readonly unknown[],
) {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0); // bumping this re-runs the effect (retry)

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));

    fetcher(controller.signal)
      .then((res) => setState({ data: res.data, loading: false, error: null }))
      .catch((err: unknown) => {
        if (isAbortError(err)) return; // superseded or unmounted, ignore
        setState({
          data: null,
          loading: false,
          error: err instanceof ApiError ? err.message : 'Something went wrong.',
        });
      });

    return () => controller.abort(); // cleanup cancels the in-flight request
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}