/**
 * types/user.ts
 *
 */
export interface User {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string | null;
  role: string;
  country?: string;
  lastLoginAt?: string | null;
}