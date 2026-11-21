// shell: app frame, hash router, command palette, sign-in dialog, toasts.
import { esc } from '../lib/format.js';
import { icon } from '../lib/icons.js';

const $ = window.jQuery;

const ROUTES = [
    { name: 'overview', label: 'Overview', icon: 'layout-dashboard', sub: 'Agent health, modules and services' },
    { name: 'nginx', label: 'Vhosts', icon: 'internet', sub: 'View and monitor nginx vhosts'},
  { name: 'terminal', label: 'Terminal', icon: 'terminal', sub: 'Run agent commands' },
  { name: 'chat', label: 'AI Chat', icon: 'message-square', sub: 'Local model via Ollama' },
    { name: 'settings', label: 'Settings', icon: 'settings', sub: 'API, model and prompt' },
];

export default function register(FEAR) {
  FEAR.create('shell', (sb) => {
    let router = null;
    let session = { user: null, online: false };
    let llm = null;
    let palItems = [];
    let palSel = 0;
    let lastFocus = null;

    const go = (name) => { location.hash = name; };
    const runCmd = (cmd) => { go('terminal'); sb.emit('terminal:run', { cmd }); };

    // ------------------------------------------------------------------ frame

    const frame = (collapsed) => `
      <div class="app${collapsed ? ' is-collapsed' : ''}">
        <aside class="side">
          <div class="brand"><span class="brand-mark">F</span><span class="brand-text"><b>FEAR</b><small>agent console</small></span></div>
          <nav class="nav" aria-label="Main">
            ${ROUTES.map((r) => `<a class="nav-item" href="#${r.name}" data-route="${r.name}" title="${r.label}">${icon(r.icon)}<span>${r.label}</span></a>`).join('')}
          </nav>
          <div class="side-foot">
            <div class="conn" data-conn></div>
            <button type="button" class="icon-btn side-toggle" data-action="collapse" title="Collapse sidebar">${icon('panel-left')}</button>
          </div>
        </aside>
        <div class="main">
          <header class="top">
            <div class="top-title"><h1 data-title></h1><span class="muted" data-sub></span></div>
            <span class="spacer"></span>
            <span class="pill" data-pill-agent></span>
            <button type="button" class="kbd-btn" data-action="palette" title="Command palette">${icon('search')}<span>Search or run…</span><kbd>Ctrl K</kbd></button>
          </header>
          <main id="view" class="viewport" aria-live="polite"></main>
        </div>
      </div>
      <div class="palette hidden" data-palette role="dialog" aria-modal="true" aria-label="Command palette">
        <div class="palette-box">
          <div class="palette-in">${icon('search')}<input class="palette-field" placeholder="Type a command or page…" spellcheck="false" autocomplete="off"></div>
          <ul class="palette-list"></ul>
        </div>
      </div>
      <div class="modal hidden" data-modal role="dialog" aria-modal="true" aria-label="Sign in">
        <form class="modal-box" data-login-form autocomplete="on">
          <h2>${icon('shield')} Sign in</h2>
          <p class="muted">The agent API requires an admin account.</p>
          <label class="field"><span>Email</span><input name="email" type="email" autocomplete="username" required></label>
          <label class="field"><span>Password</span><input name="password" type="password" autocomplete="current-password" required></label>
          <p class="form-error" role="alert"></p>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">${icon('log-in')} Sign in</button>
            <button type="button" class="btn btn-ghost" data-action="close-modal">Cancel</button>
          </div>
        </form>
      </div>
      <div class="toasts" aria-live="polite"></div>`;

    // ------------------------------------------------------------------ status widgets

    const renderStatus = () => {
      const { user, online } = session;
      $('[data-conn]').html(`
        <span class="dot ${online ? 'dot-ok' : 'dot-bad'}"></span>
        <div class="conn-text"><div class="conn-title">${online ? 'Agent online' : 'Agent offline'}</div>
        <div class="conn-sub">${user ? esc(user.email) : 'Not signed in'}</div></div>
        <button type="button" class="icon-btn" data-action="${user ? 'logout' : 'login'}" title="${user ? 'Sign out' : 'Sign in'}">${icon(user ? 'log-out' : 'log-in')}</button>`);
      $('[data-pill-agent]').attr('class', `pill ${online ? 'pill-ok' : 'pill-bad'}`)
        .html(`<i class="dot"></i>${online ? 'agent' : 'offline'}${llm === false ? '' : ''}`);
    };

    const toast = (t) => {
      const $t = $(`<div class="toast toast-${t.type || 'ok'}">${icon(t.type === 'bad' ? 'circle-alert' : 'check')}<span>${esc(t.text)}</span></div>`);
      $('.toasts').append($t);
      setTimeout(() => $t.addClass('out'), 3200);
      setTimeout(() => $t.remove(), 3600);
    };

    // ------------------------------------------------------------------ palette

    const buildItems = () => [
      ...ROUTES.map((r) => ({ group: 'Go to', label: r.label, hint: r.sub, ic: r.icon, run: () => go(r.name) })),
      ...['status', 'version', 'service-list', 'ai-status', 'help'].map((c) => ({ group: 'Run', label: c, hint: 'in terminal', ic: 'play', run: () => runCmd(c) })),
      { group: 'Chat', label: 'New chat', hint: 'clear the transcript', ic: 'plus', run: () => { go('chat'); sb.emit('chat:new'); } },
      { group: 'Appearance', label: 'Cycle background', hint: 'matrix · network · off', ic: 'sparkles', run: () => sb.fire('background:cycle') },
      session.user
        ? { group: 'Account', label: 'Sign out', hint: session.user.email, ic: 'log-out', run: () => sb.fire('api:logout') }
        : { group: 'Account', label: 'Sign in', hint: 'admin account', ic: 'log-in', run: () => openLogin() },
    ];

    const drawPalette = () => {
      const q = String($('.palette-field').val()).trim().toLowerCase();
      const score = (i) => (i.label.toLowerCase().startsWith(q) ? 0 : i.label.toLowerCase().includes(q) ? 1 : 2);
      palItems = buildItems().filter((i) => !q || `${i.label} ${i.group} ${i.hint}`.toLowerCase().includes(q));
      if (q) palItems.sort((a, b) => score(a) - score(b)); // label matches beat hint matches (sort is stable)
      if (q) palItems.push({ group: 'Run', label: q, hint: 'run as terminal command', ic: 'corner-down-left', run: () => runCmd(q) });
      palSel = Math.min(palSel, Math.max(palItems.length - 1, 0));
      let last = '';
      $('.palette-list').html(palItems.map((i, n) => {
        const head = !q && i.group !== last ? `<li class="pal-group">${esc(i.group)}</li>` : '';
        last = i.group;
        return `${head}<li class="pal-item${n === palSel ? ' sel' : ''}" data-i="${n}">${icon(i.ic)}<span class="grow">${esc(i.label)}</span><small>${esc(i.hint)}</small></li>`;
      }).join('') || '<li class="pal-empty">No matches</li>');
      const sel = $('.pal-item.sel')[0];
      if (sel && sel.scrollIntoView) sel.scrollIntoView({ block: 'nearest' });
    };

    const openPalette = () => {
      lastFocus = document.activeElement;
      palSel = 0;
      $('[data-palette]').removeClass('hidden');
      $('.palette-field').val('').trigger('focus');
      drawPalette();
    };
    const closePalette = () => {
      $('[data-palette]').addClass('hidden');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    const runPalette = (n) => {
      const item = palItems[n];
      closePalette();
      if (item) setTimeout(item.run, 0);
    };

    // ------------------------------------------------------------------ login dialog

    const openLogin = () => {
      lastFocus = document.activeElement;
      $('[data-modal]').removeClass('hidden').find('.form-error').text('');
      $('[data-login-form] [name=email]').trigger('focus');
    };
    const closeLogin = () => {
      $('[data-modal]').addClass('hidden');
      $('[data-login-form] [name=password]').val('');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    // ------------------------------------------------------------------ wiring

    const bind = () => {
      $(document)
        .on('click.shell', '[data-action]', (e) => {
          const a = String($(e.currentTarget).data('action'));
          if (a.startsWith('goto:')) go(a.slice(5));
          else if (a === 'login') openLogin();
          else if (a === 'logout') sb.fire('api:logout').then(() => toast({ type: 'ok', text: 'Signed out' }));
          else if (a === 'retry') sb.fire('api:init');
          else if (a === 'palette') openPalette();
          else if (a === 'close-modal') closeLogin();
          else if (a === 'collapse') {
            const c = $('.app').toggleClass('is-collapsed').hasClass('is-collapsed');
            sb.fire('settings:set', { collapsed: c });
          }
        })
        .on('keydown.shell', (e) => {
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            $('[data-palette]').hasClass('hidden') ? openPalette() : closePalette();
          } else if (e.key === 'Escape') {
            if (!$('[data-palette]').hasClass('hidden')) closePalette();
            else if (!$('[data-modal]').hasClass('hidden')) closeLogin();
          }
        })
        .on('input.shell', '.palette-field', () => { palSel = 0; drawPalette(); })
        .on('keydown.shell', '.palette-field', (e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); palSel = (palSel + 1) % Math.max(palItems.length, 1); drawPalette(); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); palSel = (palSel - 1 + palItems.length) % Math.max(palItems.length, 1); drawPalette(); }
          else if (e.key === 'Enter') { e.preventDefault(); runPalette(palSel); }
        })
        .on('click.shell', '.pal-item', (e) => runPalette(+$(e.currentTarget).data('i')))
        .on('mousedown.shell', '[data-palette]', (e) => { if ($(e.target).is('[data-palette]')) closePalette(); })
        .on('mousedown.shell', '[data-modal]', (e) => { if ($(e.target).is('[data-modal]')) closeLogin(); })
        .on('submit.shell', '[data-login-form]', async (e) => {
          e.preventDefault();
          const $f = $(e.currentTarget);
          const $b = $f.find('[type=submit]').prop('disabled', true);
          const res = await sb.fire('api:login', { email: $f.find('[name=email]').val(), password: $f.find('[name=password]').val() });
          $b.prop('disabled', false);
          if (!res.ok) return $f.find('.form-error').text(res.message);
          closeLogin();
          toast({ type: 'ok', text: `Signed in as ${res.user.email}` });
        });
    };

    const onRendered = (m) => {
      const r = ROUTES.find((x) => x.name === m.route) || ROUTES[0];
      $('.nav-item').removeClass('active').removeAttr('aria-current').filter(`[data-route="${r.name}"]`).addClass('active').attr('aria-current', 'page');
      $('[data-title]').text(r.label);
      $('[data-sub]').text(r.sub);
      $('.app').attr('data-route', r.name);
    };

    const startRouter = () => {
      const routes = {};
      ROUTES.forEach((r) => {
        routes[r.name] = {
          name: r.name,
          title: `${r.label} · FEAR Agent`,
          html: `<section class="view" id="view-${r.name}" aria-label="${r.label}"></section>`,
          callback: () => sb.emit('view:mount', { name: r.name }),
        };
      });
      // The framework merges options shallowly, so nested option objects are given in full.
      router = sb.router({
        container: '#view',
        routes,
        defaultRoute: 'overview',
        pushState: false, // navigate() with pushState never triggers a load; plain hash does
        hashNavigation: true,
        smoothScroll: false,
        animations: { enabled: true, fadeSpeed: 80 },
        loading: { enabled: false, template: '', minDisplay: 0 },
        accessibility: { announceRoutes: true, focusContent: false },
      });
      $(window).on('hashchange.shell', () => {
        const n = location.hash.slice(1);
        if (n && !routes[n]) go('overview');
      });
      if (location.hash.slice(1) && !routes[location.hash.slice(1)]) location.hash = 'overview';
      if (!location.hash) history.replaceState(null, '', '#overview');
      router.init();
    };

    return {
      load() {
        return sb.fire('settings:get').then((s) => {
          $('#app').html(frame(s.collapsed));
          bind();
          renderStatus();
          sb.add('toast', (t) => toast(t));
          sb.add('router:rendered', (m) => onRendered(m));
          sb.add('session:changed', (s2) => { session = s2; renderStatus(); });
          sb.add('agent:status', (s2) => { session.online = !!s2.online; renderStatus(); });
          sb.add('llm:status', (s2) => { llm = s2.online; });
          startRouter();
        });
      },
      unload() {
        $(document).off('.shell');
        $(window).off('.shell');
        if (router) router.destroy();
      },
    };
  });
}
