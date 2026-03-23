import { useLocalSearchParams } from 'expo-router';

/**
 * Typed param hooks – replaces React Router's `useParams()`.
 *
 * Before:
 *   import { useParams } from 'react-router-dom';
 *   const { id } = useParams<{ id: string }>();
 *
 * After:
 *   import { useProductParams, useBlogParams, useResetPasswordParams } from '../hooks/useLocalParams';
 *   const { id } = useProductParams();
 */

/** /product/:id */
export function useProductParams() {
  return useLocalSearchParams<{ id: string }>();
}

/** /blog/:id */
export function useBlogParams() {
  return useLocalSearchParams<{ id: string }>();
}

/** /reset-password/:token */
export function useResetPasswordParams() {
  return useLocalSearchParams<{ token: string }>();
}