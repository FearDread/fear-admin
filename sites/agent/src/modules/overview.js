// overview: agent health, modules, background services and one-click commands.
import { esc } from '../lib/format.js';
import { icon } from '../lib/icons.js';

const $ = window.jQuery;
const QUICK = ['status', 'version', 'service-list', 'ai-status', 'proxy-status', 'help'];

export default function register(FEAR) {
  FEAR.create('overview', (sb) => {
    let view = null;
    let mounted = false;
    let poll = null;
    let data = null; // last /status payload
    let session = { user: null, online: false };
    let error = '';
    let loading = false;

    const toast = (type, text) => sb.emit('toast', { type, text }).catch(() => {});

    const stat = (ic, label, value, sub) => `
      <div class="stat"><div class="stat-ic">${icon(ic)}</div>
        <div><div class="stat-v">${esc(value)}</div><div class="stat-l">${esc(label)}</div>${sub ? `<div class="stat-s">${esc(sub)}</div>` : ''}</div></div>`;

    const template = () => {
      const s = (data && data.stats) || {};
      const v = data && data.version && (data.version.version || data.version.agentVersion);
      const mods = Object.entries((data && data.modules) || {});
      const svcs = Object.entries((data && data.services) || {});
      const offline = !session.online;

      return `
      <div class="page">
        <header class="page-head row-between">
          <div><h1>Overview</h1><p class="muted">${session.online ? 'Agent connected' : 'Agent offline'}${v ? ` · v${esc(v)}` : ''}${session.user ? ` · ${esc(session.user.email)}` : ''}</p></div>
          <div class="row">
            <button type="button" class="btn btn-ghost btn-refresh">${icon('refresh-cw', loading ? 'spin' : '')} Refresh</button>
            <button type="button" class="btn btn-primary" data-action="goto:terminal">${icon('terminal')} Open terminal</button>
            <button type="button" class="btn" data-action="goto:chat">${icon('message-square')} AI chat</button>
          </div>
        </header>

        ${offline ? `
        <div class="callout">
          ${icon('wifi-off')}
          <div><strong>Agent not connected.</strong> ${esc(error || 'Sign in with an admin account to use the agent.')}</div>
          <button type="button" class="btn btn-primary btn-sm" data-action="${session.user ? 'retry' : 'login'}">${session.user ? 'Retry' : icon('log-in') + ' Sign in'}</button>
        </div>` : ''}

        <div class="stat-grid">
          ${stat('cpu', 'Modules loaded', s.modulesLoaded != null ? s.modulesLoaded : '–')}
          ${stat('terminal', 'Commands available', s.commandsAvailable != null ? s.commandsAvailable : '–')}
          ${stat('zap', 'Services running', s.servicesRunning != null ? s.servicesRunning : '–', svcs.length ? `of ${svcs.length}` : '')}
          ${stat('activity', 'Commands run', s.commandHistory != null ? s.commandHistory : '–')}
        </div>

        <div class="cols">
          <section class="panel">
            <h2>${icon('cpu')} Modules</h2>
            ${mods.length ? `<ul class="rows">${mods.map(([n, m]) => `
              <li><span class="grow">${esc(m.displayName || n)}${m.provider ? ` <span class="muted">· ${esc(m.provider)}</span>` : ''}</span>
              <span class="pill ${m.status === 'ready' && m.configured !== false ? 'pill-ok' : m.status === 'ready' ? 'pill-warn' : 'pill-bad'}"><i class="dot"></i>${m.status === 'ready' && m.configured === false ? 'not configured' : esc(m.status)}</span></li>`).join('')}</ul>`
              : `<p class="muted pad">${offline ? 'Connect the agent to see its modules.' : 'No module data.'}</p>`}
          </section>

          <div class="stack">
            <section class="panel">
              <h2>${icon('server')} Background services</h2>
              ${svcs.length ? `<ul class="rows">${svcs.map(([n, st]) => `
                <li><span class="grow mono">${esc(n)}</span>
                <span class="pill ${st === 'running' ? 'pill-ok' : ''}"><i class="dot"></i>${esc(st)}</span>
                <button type="button" class="btn btn-sm btn-svc" data-svc="${esc(n)}" data-to="${st === 'running' ? 'stop' : 'start'}">${icon(st === 'running' ? 'square' : 'play')} ${st === 'running' ? 'Stop' : 'Start'}</button></li>`).join('')}</ul>`
                : `<p class="muted pad">No services registered.</p>`}
            </section>
            <section class="panel">
              <h2>${icon('zap')} Quick commands</h2>
              <div class="chips pad">${QUICK.map((c) => `<button type="button" class="chip btn-cmd" data-cmd="${c}">${c}</button>`).join('')}</div>
            </section>
          </div>
        </div>
      </div>`;
    };

    const draw = () => mounted && view.render({});

    const refresh = async () => {
      if (loading) return;
      loading = true;
      draw();
      const [res, ses] = await Promise.all([sb.fire('api:agent', { path: '/status' }), sb.fire('session:get')]);
      session = ses;
      if (res.ok && res.data.initialized !== false) { data = res.data; error = ''; }
      else { data = res.ok ? null : data; error = res.ok ? 'The agent has not been initialised.' : res.message; }
      loading = false;
      draw();
    };

    const events = {
      'click .btn-refresh': () => refresh(),
      'click .btn-cmd': (e) => { location.hash = 'terminal'; sb.emit('terminal:run', { cmd: String($(e.currentTarget).data('cmd')) }); },
      'click .btn-svc': async (e) => {
        const $b = $(e.currentTarget).prop('disabled', true);
        const res = await sb.fire('api:agent', { path: `/service/${$b.data('to')}`, method: 'POST', body: { service: $b.data('svc') } });
        toast(res.ok ? 'ok' : 'bad', res.ok ? `Service ${$b.data('svc')}: ${$b.data('to')} requested` : res.message);
        refresh();
      },
    };

    const mount = () => {
      view = sb.View({ el: '#view-overview', template, events });
      mounted = true;
      draw();
      refresh();
      poll = sb.interval(() => (document.hidden ? null : refresh()), 15000);
      poll.promise.catch(() => {});
    };
    const unmount = () => { if (mounted) { mounted = false; poll && poll.stop(); view.destroy(); } };

    return {
      load() {
        sb.add('view:mount', (m) => { if (m.name === 'overview') mount(); });
        sb.add('route:start', (m) => { if (mounted && m.path !== 'overview') unmount(); });
        sb.add('agent:status', (s) => { session.online = !!s.online; if (mounted) refresh(); });
        sb.add('session:changed', (s) => { session = s; });
        sb.add('overview:retry', () => sb.fire('api:init'));
      },
      unload() { unmount(); },
    };
  });
}
