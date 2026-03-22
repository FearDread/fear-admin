import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = '@efear:auth';
const CART_KEY = '@efear:cart';

// ── In-memory cache (populated once by preload) ───────────────────────────────
let _cache = null;

// ── Async helpers ──────────────────────────────────────────────────────────────
const _write = (key, value) =>
  AsyncStorage.setItem(key, JSON.stringify(value)).catch(console.warn);

const _read = async (key) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const _delete = (key) => AsyncStorage.removeItem(key).catch(console.warn);

// ── Storage object (default export) ───────────────────────────────────────────
const Storage = {

  /**
   * MUST be awaited before initializeStore() is called.
   * Reads the persisted auth payload into _cache so Storage.load() is sync-safe.
   */
  async preload() {
    _cache = await _read(AUTH_KEY);
  },

  /**
   * Synchronous read — safe only after preload() has resolved.
   * Returns the full stored auth object or null.
   * Shape: { currentUser, token, isAuthenticated, rememberMe, expiresAt }
   */
  load() {
    return _cache;
  },

  /**
   * Persist an authenticated session.
   * Matches original: Storage.save(user, token, rememberMe, expiresAt)
   *
   * @param {object}  user        - User object (becomes currentUser in Redux)
   * @param {string}  token       - JWT bearer token
   * @param {boolean} rememberMe  - Whether to use an extended expiry
   * @param {string}  expiresAt   - ISO string expiry timestamp
   */
  save(user, token, rememberMe = false, expiresAt = null) {
    const payload = {
      currentUser:     user,
      token,
      isAuthenticated: true,
      rememberMe,
      expiresAt,
    };
    _cache = payload;
    _write(AUTH_KEY, payload);
  },

  /**
   * Wipe auth on logout.
   */
  clear() {
    _cache = null;
    _delete(AUTH_KEY);
  },

  // ── Cart persistence (async — called from cartSlice or middleware) ──────────

  async loadCart() {
    return (await _read(CART_KEY)) ?? [];
  },

  saveCart(items) {
    _write(CART_KEY, items);
  },

  clearCart() {
    _delete(CART_KEY);
  },
};

export default Storage;

// ── Named exports (used directly in user/slice.js) ────────────────────────────

/**
 * saveUserToStorage(user, token, rememberMe, expiresAt)
 * Alias for Storage.save() — used after profile updates where we have all
 * four args available individually.
 */
export const saveUserToStorage = (user, token, rememberMe, expiresAt) =>
  Storage.save(user, token, rememberMe, expiresAt);

/**
 * clearUserStorage()
 * Alias for Storage.clear() — used inside logoutUser thunk.
 */
export const clearUserStorage = () => Storage.clear();