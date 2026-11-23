// nginx: dashboard for the nginx vhost / DNS monitor (/fear/api/nginx/*). Admin session cookie, like the rest.
// Rewrite of nginx.js as a framework module: mounts on the #nginx route through the Router, talks to the
// server only through the api module (api:nginx), and tears down its charts and poller on route change.
//
// Endpoints used (the shapes nginx.js already expected):
//   GET  /status          -> { result: { monitoring, lastRun, snapshot: { hosts }, events } }
//   GET  /trend?limit=60  -> { result: [{ time, avgMs, hosts: { name: { ms } } }] }
//   POST /check-all, /monitor/start, /monitor/stop, /test
import { esc } from '../lib/format.js';
import { icon } from '../lib/icons.js';
import { LineChart, Ring, countTo, fillGaps, clamp, hhmm, GREEN, AMBER, RED } from '../lib/charts.js';

const $ = window.jQuery;
const POLL_MS = 10000;

const healthy = (h) => {
  const ok = (p) => p && p.ok && p.status < 500;
  return !!(ok(h.http) && (!h.https || ok(h.https)));
};
const probeMs = (h) => {
  const p = h.https && h.https.ok ? h.https : (h.http && h.http.ok ? h.http : null);
  return p ? p.ms : null;
};
const isAuthErr = (e) => e.status === 401 || e.status === 403 || /auth|denied|forbidden/i.test(e.message || '');

export default function register(FEAR) {
  FEAR.create('nginx', (sb) => {
    let view = null;
    let mounted = false;
    let poll = null;
    let line = null;
    let ring = null;
    let busy = false;
    let monitoring = false;
    let lastEvent = null;
    let cache = null;        // last { status, trend }: repainted instantly when the view is reopened
    let pendingCheck = false; // set by the palette before the view exists

    const toast = (type, text) => sb.emit('toast', { type, text }).catch(() => {});
    const r = (name) => view.el.find(`[data-r="${name}"]`);

    const call = async (method, path, body) => {
      const res = await sb.fire('api:nginx', { path, method, body });
      if (!res.ok) { const e = new Error(res.message); e.status = res.status; throw e; }
      if (res.data && res.data.success === false) throw new Error(res.data.message || 'Request failed');
      return res.data;
    };

    // ------------------------------------------------------------------ template

    const tile = (ic, label, key, cls) =>
      `<div class="stat ${cls || ''}"><div class="stat-ic">${icon(ic)}</div><div><div class="stat-v" data-t="${key}">0</div><div class="stat-l">${label}</div></div></div>`;

    const template = () => `
      <div class="page ng">
        <header class="page-head row-between">
          <div><h1>Nginx / DNS monitor</h1><p class="muted">Vhost health, DNS records and certificate expiry</p></div>
          <div class="row">
            <span class="pill" data-r="badge"><i class="dot"></i>monitor off</span>
            <span class="pill" data-r="last">no data</span>
            <button type="button" class="btn ng-act" data-a="check">${icon('refresh-cw')} Run check</button>
            <button type="button" class="btn ng-act" data-a="monitor" data-r="monitorBtn">${icon('play')} Start monitor</button>
            <button type="button" class="btn btn-ghost ng-act" data-a="test">${icon('terminal')} nginx -t</button>
          </div>
        </header>

        <div class="callout hidden" data-r="msg">
          ${icon('circle-alert')}<div data-r="msgText"></div>
          <button type="button" class="btn btn-primary btn-sm hidden" data-r="msgLogin" data-action="login">${icon('log-in')} Sign in</button>
        </div>

        <div class="stat-grid">
          ${tile('globe', 'Vhosts', 'hosts')}
          ${tile('check', 'Up', 'up', 'ng-good')}
          ${tile('circle-alert', 'Down', 'down', 'ng-bad')}
          ${tile('shield', 'Certs expiring (14d)', 'certs', 'ng-warn')}
          ${tile('activity', 'Avg response', 'avg')}
        </div>

        <div class="ng-row">
          <section class="panel"><h2>${icon('activity')} Response time</h2>
            <div class="ng-plot"><canvas data-r="line"></canvas>
              <div class="ng-empty" data-r="lineEmpty">Not enough history yet. Run a check or start the monitor to build a trend.</div></div></section>
          <section class="panel"><h2>${icon('zap')} Fleet health</h2><div class="ng-plot"><canvas data-r="ring"></canvas></div></section>
        </div>

        <section class="panel"><h2>${icon('shield')} Certificates</h2><div class="ng-body" data-r="certs"></div></section>
        <section class="panel"><h2>${icon('server')} Vhosts</h2><div class="ng-body"><div class="ng-hosts" data-r="hosts"></div></div></section>
        <section class="panel"><h2>${icon('circle-alert')} Events</h2><ul class="ng-ev" data-r="events"></ul></section>
      </div>`;

    // ------------------------------------------------------------------ rendering

    const note = (text, isErr, isAuth) => {
      if (!mounted) return;
      r('msg').toggleClass('hidden', !text).toggleClass('is-err', !!isErr);
      r('msgText').text(text || '');
      r('msgLogin').toggleClass('hidden', !isAuth);
    };

    const renderCerts = (hosts) => {
      const rows = hosts.filter((e) => e[1].cert && e[1].cert.ok).sort((a, b) => a[1].cert.daysLeft - b[1].cert.daysLeft);
      const $c = r('certs');
      if (!rows.length) { $c.html('<p class="muted">No SSL vhosts checked yet.</p>'); return; }
      $c.html(rows.map((e) => {
        const d = e[1].cert.daysLeft;
        const col = d < 0 ? RED : d <= 14 ? AMBER : GREEN;
        return `<div class="ng-cert"><span title="${esc(e[0])}">${esc(e[0])}</span>
          <div class="ng-track"><div class="ng-fill" data-w="${clamp(d / 90, 0.03, 1) * 100}" style="background:${col};box-shadow:0 0 8px ${col}"></div></div>
          <b style="color:${col}">${d}d</b></div>`;
      }).join(''));
      // widths are set a frame later so the CSS transition animates from 0
      requestAnimationFrame(() => requestAnimationFrame(() => {
        $c.find('.ng-fill').each(function () { this.style.width = this.getAttribute('data-w') + '%'; });
      }));
    };

    const spark = (series) => {
      const vals = fillGaps(series);
      if (vals.length < 2) return '';
      const max = Math.max.apply(null, vals) || 1;
      const min = Math.min.apply(null, vals);
      const span = max - min || 1;
      const pts = vals.map((v, i) => `${((i / (vals.length - 1)) * 100).toFixed(1)},${(28 - ((v - min) / span) * 26).toFixed(1)}`).join(' ');
      return `<svg class="ng-spark" viewBox="0 0 100 30" preserveAspectRatio="none"><polyline pathLength="1" vector-effect="non-scaling-stroke" points="${pts}"/></svg>`;
    };

    // Cards are only rewritten when their signature changes, so unchanged sparklines don't re-animate every poll.
    const renderHosts = (hosts, trend) => {
      const $h = r('hosts');
      const keep = {};
      hosts.forEach((e) => {
        const name = e[0], h = e[1], ok = healthy(h);
        const series = trend.map((t) => (t.hosts && t.hosts[name] ? t.hosts[name].ms : null));
        const sig = JSON.stringify([ok, h.dns && h.dns.A, h.http && h.http.status, h.https && h.https.status, series]);
        keep[name] = true;

        let $el = $h.children().filter(function () { return $(this).data('host') === name; });
        if ($el.length && $el.data('sig') === sig) return;

        const st = (p) => (p ? (p.ok ? p.status : p.error) : '-');
        const html = `<div class="t"><i class="ng-dot"></i><span title="${esc(name)}">${esc(name)}</span><b>${probeMs(h) != null ? probeMs(h) + 'ms' : '-'}</b></div>
          <small>A ${esc(((h.dns && h.dns.A) || []).join(', ') || '-')}</small>
          <small>http ${esc(st(h.http))}${h.https ? `  https ${esc(st(h.https))}` : ''}</small>${spark(series)}`;

        if (!$el.length) $el = $('<div class="ng-host">').data('host', name).appendTo($h);
        $el.toggleClass('down', !ok).data('sig', sig).html(html);
      });
      $h.children().each(function () { if (!keep[$(this).data('host')]) $(this).remove(); });
    };

    const renderEvents = (events) => {
      const rows = events.slice(-25).reverse();
      const prev = lastEvent;
      lastEvent = rows.length ? rows[0].time : prev;

      if (prev) {
        rows.filter((e) => e.time > prev && e.level !== 'info').slice(0, 2)
          .forEach((e) => toast('bad', `${e.host}: ${e.msg}`));
      }
      r('events').html(rows.length
        ? rows.map((e) => `<li class="${prev && e.time > prev ? 'new' : ''}"><span class="lv ${esc(e.level)}">${esc(String(e.level).toUpperCase())}</span>${esc(e.host)}: ${esc(e.msg)}<time>${esc(hhmm(e.time))}</time></li>`).join('')
        : '<li class="muted">No alerts or changes recorded.</li>');
    };

    const render = (status, trend) => {
      if (!mounted) return;
      const snap = status.snapshot;
      monitoring = !!status.monitoring;
      r('badge').toggleClass('pill-ok', monitoring).html(`<i class="dot"></i>${monitoring ? 'monitor running' : 'monitor off'}`);
      r('monitorBtn').html(`${icon(monitoring ? 'square' : 'play')} ${monitoring ? 'Stop monitor' : 'Start monitor'}`);
      r('last').text(status.lastRun ? `last run ${hhmm(status.lastRun)}` : 'no data');

      const hosts = snap ? Object.entries(snap.hosts) : [];
      const up = hosts.filter((e) => healthy(e[1])).length;
      const expiring = hosts.filter((e) => e[1].cert && e[1].cert.ok && e[1].cert.daysLeft <= 14).length;
      const avgs = hosts.map((e) => probeMs(e[1])).filter((v) => v != null);
      const avg = avgs.length ? Math.round(avgs.reduce((a, b) => a + b, 0) / avgs.length) : 0;

      const t = (n) => view.el.find(`[data-t="${n}"]`);
      countTo(t('hosts'), hosts.length); countTo(t('up'), up); countTo(t('down'), hosts.length - up);
      countTo(t('certs'), expiring); countTo(t('avg'), avg, 'ms');
      ring.set(up, hosts.length);

      const hasTrend = trend.length >= 2;
      r('lineEmpty').css('display', hasTrend ? 'none' : 'flex');
      if (hasTrend) line.setData(trend.map((x) => x.avgMs), trend.map((x) => hhmm(x.time)));

      renderCerts(hosts);
      renderHosts(hosts, trend);
      renderEvents(status.events || []);
    };

    // ------------------------------------------------------------------ data

    const refresh = async () => {
      if (!mounted) return;
      try {
        const [s, t] = await Promise.all([call('GET', '/status'), call('GET', '/trend?limit=60')]);
        cache = { status: s.result, trend: t.result || [] };
        if (r('msg').hasClass('is-err')) note('');
        render(cache.status, cache.trend);
      } catch (err) {
        if (isAuthErr(err)) note('Admin login required to view monitor data.', true, true);
        else if (err.status === 404) note('Nginx monitor API not found. Is routes/nginx.js mounted at /fear/api/nginx?', true);
        else note(err.message, true);
      }
    };

    const action = async ($btn) => {
      const a = $btn.data('a');
      if (busy) return;
      busy = true;
      $btn.prop('disabled', true);
      try {
        if (a === 'check') {
          note('Running checks on every vhost…');
          await call('POST', '/check-all', {});
          note('');
        } else if (a === 'monitor') {
          const j = await call('POST', monitoring ? '/monitor/stop' : '/monitor/start', {});
          note(j.message);
        } else {
          const j = await call('POST', '/test', {});
          note(`nginx -t: ${j.result.output}`);
        }
      } catch (err) {
        note(err.message, true, isAuthErr(err));
      } finally {
        busy = false;
        $btn.prop('disabled', false);
        await refresh();
      }
    };

    // ------------------------------------------------------------------ module

    const events = {
      'click .ng-act': (e) => { action($(e.currentTarget)); },
    };

    const mount = () => {
      view = sb.View({ el: '#view-nginx', template, events });
      mounted = true;
      return view.render({}).then(() => {
        line = new LineChart(r('line')[0]);
        ring = new Ring(r('ring')[0]);
        if (cache) render(cache.status, cache.trend);
        refresh();
        poll = sb.interval(() => (document.hidden ? null : refresh()), POLL_MS);
        poll.promise.catch(() => {});
        if (pendingCheck) { pendingCheck = false; action(view.el.find('[data-a="check"]')); }
      });
    };

    const unmount = () => {
      if (!mounted) return;
      mounted = false;
      if (poll) poll.stop();
      if (line) line.destroy();
      if (ring) ring.destroy();
      line = null; ring = null; poll = null;
      view.destroy();
    };

    return {
      load() {
        sb.add('view:mount', (m) => (m.name === 'nginx' ? mount() : undefined));
        sb.add('route:start', (m) => { if (mounted && m.path !== 'nginx') unmount(); });
        sb.add('nginx:check', () => {
          if (mounted) action(view.el.find('[data-a="check"]')); else pendingCheck = true;
        });
        sb.add('session:changed', (s) => { if (mounted && s.user) refresh(); });
      },
      unload() { unmount(); },
    };
  });
}
