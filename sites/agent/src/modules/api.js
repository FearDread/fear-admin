// api: every call to the FEAR server goes through here, and the session lives here.
//
// Handlers always RESOLVE with { ok, status, data, message }: broker.fire() swallows a rejected
// handler and replaces its error with a generic "All tasks failed", which would lose the HTTP status.
import { EMAIL_PATTERN } from '../lib/format.js';

export default function register(FEAR) {
  FEAR.create('api', (sb) => {
    let cfg = { apiRoot: '' };
    let user = null;
    let online = false;

    const root = () => String(cfg.apiRoot).replace(/\/+$/, '').replace(/\/agent$/, '');
    const notify = (ch, data) => sb.emit(ch, data).catch((e) => sb.warn(e));

    // The agent API is admin-only; the httpOnly cookie set by /auth/login is what authorises it.
    async function http(url, req) {
      const method = (req && req.method) || 'GET';
      try {
        // Content-Type only when there is a body: a JSON content type makes even a GET "non-simple",
        // which forces a cross-origin preflight (OPTIONS) before every request.
        const hasBody = !!(req && req.body) && method !== 'GET';
        const res = await fetch(url, {
          method,
          credentials: 'include',
          headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
          body: hasBody ? JSON.stringify(req.body) : undefined,
          signal: req && req.signal,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const message = data.message || (data.error && data.error.message) || `API error: ${res.status}`;
          return { ok: false, status: res.status, message, data };
        }
        return { ok: true, status: res.status, data };
      } catch (err) {
        return { ok: false, status: 0, message: err.message || 'Network error', network: true };
      }
    }

    const status = () => ({ user, online });
    const publish = () => notify('session:changed', status());

    async function init() {
      const res = await http(`${root()}/agent/initialize`, { method: 'POST' });
      online = res.ok;
      await notify('agent:status', { online, status: res.status, message: res.message });
      return res;
    }

    async function login(req) {
      const email = String((req && req.email) || '').trim().toLowerCase();
      if (!EMAIL_PATTERN.test(email)) return { ok: false, status: 400, message: 'Invalid email address' };
      const res = await http(`${root()}/auth/login`, { method: 'POST', body: { email, password: req.password } });
      if (!res.ok) return res;
      const u = (res.data.data && res.data.data.user) || (res.data.result && res.data.result.user) || {};
      user = { email: u.email || email, role: u.role };
      await publish();
      await init(); // reconnect now that there is a session (also tells a non-admin they can't use it)
      return { ok: true, status: 200, user };
    }

    async function logout() {
      const res = await http(`${root()}/auth/logout`, { method: 'POST' });
      user = null;
      online = false;
      await publish();
      await notify('agent:status', { online: false });
      return res;
    }

    async function restore() {
      const res = await http(`${root()}/auth/me`);
      const u = res.ok && res.data.data && res.data.data.user;
      if (u) { user = { email: u.email, role: u.role }; await publish(); }
      return init();
    }

    return {
      load() {
        return sb.fire('settings:get').then((s) => {
          cfg = s;
          sb.add('settings:changed', (s2) => { cfg = s2; });
          sb.add('session:get', () => status());
          sb.add('api:agent', (req) => http(`${root()}/agent${req.path}`, req));
          sb.add('api:auth', (req) => http(`${root()}/auth${req.path}`, req));
          sb.add('api:nginx', (req) => http(`${root()}/nginx${req.path}`, req));
          sb.add('api:init', () => init());
          sb.add('api:restore', () => restore());
          sb.add('api:login', (req) => login(req));
          sb.add('api:logout', () => logout());
        });
      },
    };
  });
}
