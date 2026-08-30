/**
 * types/user.ts
 *
 * NOTE: This is a best-guess reconstruction based on fields referenced across
 * Login.jsx / Register.jsx / GoogleAuth.jsx (displayName, firstName, lastName,
 * email, avatar, role, lastLoginAt). Merge with the project's real `User`
 * type if one already exists elsewhere in the codebase instead of adding
 * a duplicate.
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