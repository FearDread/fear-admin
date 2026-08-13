import { ApiFactory } from '@/lib/api-factory';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/fear/api/';

/**
 * Wraps ApiFactory with our real base URL, since the library's own
 * env-var lookup (REACT_APP_API_BASE_URL) doesn't work under Next.js.
 */
export function createFeatureApi(sliceName: string) {
  return ApiFactory(sliceName, {
    baseQuery: { baseUrl: API_BASE_URL },
  });
}
