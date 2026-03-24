import axios from 'axios';

export const BASE_URL = 'http://localhost:4000/fear/api';  // ← set your URL

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Lazy store reference (injected from store.js after creation) ───────────
let _store = null;
export const injectStore = (store) => { _store = store; };

// ── Attach Bearer token to every outgoing request ─────────────────────────
api.interceptors.request.use((config) => {
  const token = _store?.getState().users.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auto-logout on 401 ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && _store) {
      // Lazy import avoids circular dep: api ← store ← user/slice ← api
      import('./user/slice').then(({ logout }) => _store.dispatch(logout()));
    }
    return Promise.reject(err);
  }
);

export default api;