// terminal: the agent command line. State lives in the module (so it survives navigation);
// the View is rebuilt from it each time the #terminal route mounts.
import { esc, highlight, clock, redactLogin, EMAIL_PATTERN } from '../lib/format.js';
import { icon } from '../lib/icons.js';

const $ = window.jQuery;

const LOGO = `
@@@@@@@@  @@@@@@@@   @@@@@@   @@@@@@@
@@@@@@@@  @@@@@@@@  @@@@@@@@  @@@@@@@@
@@!       @@!       @@!  @@@  @@!  @@@
!@!       !@!       !@!  @!@  !@!  @!@
@!!!:!    @!!!:!    @!@!@!@!  @!@!!@!
!!!!!:    !!!!!:    !!!@!!!!  !!@!@!
!!:       !!:       !!:  !!!  !!: :!!
:!:       :!:       :!:  !:!  :!:  !:!
 ::        :: ::::  ::   :::  ::   :::
 :        : :: ::    :   : :   :   : :`;
const BANNER = '───────────────────────────────────────\n SECURITY AI AGENT v2.4\n Advanced Security Testing Framework\n───────────────────────────────────────';

const LOCAL = ['help', 'status', 'history', 'version', 'commands', 'clear', 'banner', 'set-api', 'login', 'logout', 'search-cve'];
const CHIPS = ['status', 'help', 'service-list', 'ai-status', 'version'];

export default function register(FEAR) {
  FEAR.create('terminal', (sb) => {
    const st = sb.Model({ busy: false, login: null });
    let entries = [
      { type: 'banner', ts: new Date() },
      { type: 'output', content: 'Initializing agent...', ts: new Date() },
    ];
    let cmdHist = [];
    let hIdx = -1;
    let completions = [...LOCAL];
    let pending = [];
    let session = { user: null, online: false };
    let announced = null;
    let view = null;
    let mounted = false;
    let timer = null;
    let t0 = 0;
    let cfg = {};

    const agent = (path, method, body) => sb.fire('api:agent', { path, method: method || 'GET', body });
    const must = async (path, method, body) => {
      const res = await agent(path, method, body);
      if (!res.ok) { const e = new Error(res.message); e.status = res.status; throw e; }
      return res.data;
    };

    // ------------------------------------------------------------------ rendering

    const entryHtml = (e) => {
      const t = `<span class="t">${clock(e.ts)}</span>`;
      if (e.type === 'banner') return `<pre class="tl-banner">${esc(LOGO)}\n\n${esc(BANNER)}</pre>`;
      if (e.type === 'input') return `<div class="tl tl-in">${t}<span class="chev">❯</span><span class="txt">${esc(e.content)}</span></div>`;
      if (e.type === 'system') return `<div class="tl tl-sys">${t}<pre class="txt">${esc(e.content)}</pre></div>`;
      return `<div class="tl tl-out">${t}<pre class="txt">${highlight(e.content)}</pre></div>`;
    };
    const $log = () => view.el.find('.term-log');
    const scroll = () => { const s = view.el.find('.term-scroll')[0]; if (s) s.scrollTop = s.scrollHeight; };

    const add = (type, content) => {
      const e = { type, content, ts: new Date() };
      entries.push(e);
      if (mounted) {
        const $b = $log().find('.tl-busy');
        const $n = $(entryHtml(e));
        $b.length ? $b.before($n) : $log().append($n);
        scroll();
      }
    };

    const syncPrompt = () => {
      if (!mounted) return;
      const lg = st.get('login');
      const $f = view.el.find('.term-field');
      $f.attr({
        type: lg && lg.step === 'password' ? 'password' : 'text',
        placeholder: lg ? (lg.step === 'password' ? 'Password' : 'Email') : 'Enter command…',
        autocomplete: lg && lg.step === 'password' ? 'current-password' : 'off',
      });
      const who = session.user ? session.user.email.split('@')[0] : 'guest';
      view.el.find('.ps').text(lg ? (lg.step === 'password' ? 'password' : 'email') : `${who}@fear`);
      view.el.find('.term-state').attr('class', `pill ${session.online ? 'pill-ok' : 'pill-bad'} term-state`)
        .html(`<i class="dot"></i>${session.online ? 'connected' : 'offline'}${session.user ? ' · ' + esc(session.user.email) : ''}`);
    };

    const syncBusy = () => {
      if (!mounted) return;
      const busy = st.get('busy');
      const $f = view.el.find('.term-field').prop('disabled', busy);
      $log().find('.tl-busy').remove();
      clearInterval(timer);
      if (busy) {
        $log().append(`<div class="tl tl-busy"><span class="t">${clock()}</span>${icon('loader-circle', 'spin')}<span>processing… <b class="el">0.0s</b></span></div>`);
        timer = setInterval(() => $log().find('.el').text(((Date.now() - t0) / 1000).toFixed(1) + 's'), 100);
        scroll();
      } else {
        $f.trigger('focus');
      }
    };

    // ------------------------------------------------------------------ commands

    const helpText = () => `SECURITY AI AGENT - COMMAND REFERENCE

ACCOUNT:
  login <email> <password>  - sign in (admin account required)
  login <email>             - sign in, asking for the password (hidden)
  login                     - sign in, asking for email and password
  logout

AI:
  ai-status, ai-provider, ai-explain, ai-threat
  ai-ask, ai-generate, chat-quick, chat-history, chat-clear

CVE & SECURITY:
  search-cve, check-cwe, check-package

CRYPTO:
  crypto-price, compare-rates, crypto-convert
  track-portfolio, market-summary

BACKGROUND SERVICES:
  service-list, service-status, service-start
  service-stop, service-restart, service-logs

PROXIES:
  proxy-status, list-proxies

SYSTEM:
  help, status, history, version, commands, clear, banner
  set-api <url> - Set API base URL

KEYS:
  Tab complete · ↑/↓ history · Ctrl+L clear · Ctrl+K command palette

API Status: ${session.online ? 'Connected' : 'Disconnected'}
Signed in: ${session.user ? session.user.email : 'no'}
API URL: ${cfg.apiRoot}/agent`;

    const performLogin = async (email, password) => {
      const res = await sb.fire('api:login', { email, password });
      if (!res.ok) return add('system', `Login failed: ${res.message}`);
      add('output', `Signed in as ${res.user.email}${res.user.role ? ` (${res.user.role})` : ''}`);
    };

    const handleLogin = async (line) => {
      const rest = line.replace(/^login\s*/, '');
      const m = rest.match(/^(\S+)\s+(\S.*)$/); // email is the first word, the rest is the password
      if (m) return performLogin(m[1], m[2]);
      if (rest) {
        if (!EMAIL_PATTERN.test(rest)) return add('system', 'Invalid email address');
        st.set('login', { step: 'password', email: rest });
        return add('output', 'Password:');
      }
      st.set('login', { step: 'email' });
      return add('output', 'Email:');
    };

    const dispatch = async (command, args, line) => {
      switch (command) {
        case 'clear':
          entries = [{ type: 'output', content: 'Terminal cleared', ts: new Date() }];
          if (mounted) $log().html(entryHtml(entries[0]));
          return;
        case 'banner': return add('banner');
        case 'set-api':
          if (args[0]) {
            await sb.fire('settings:set', { apiRoot: args[0].replace(/\/+$/, '').replace(/\/agent$/, '') });
            return add('output', `API base URL set to: ${cfg.apiRoot}/agent`);
          }
          return add('output', `Current API base URL: ${cfg.apiRoot}/agent`);
        case 'login': return handleLogin(line);
        case 'logout': {
          await sb.fire('api:logout');
          return add('output', 'Signed out');
        }
        case 'help': return add('output', helpText());
        case 'status': {
          const r = await must('/status');
          let out = 'SYSTEM STATUS\n\n';
          Object.entries(r.modules || {}).forEach(([n, m]) => { out += `${n.padEnd(25)} [${String(m.status).toUpperCase()}]\n`; });
          const v = r.version && (r.version.version || r.version.agentVersion);
          if (v) out += `\nVersion: ${v}`;
          if (r.stats) out += `\nModules: ${r.stats.modulesLoaded}  Commands: ${r.stats.commandsAvailable}  Services running: ${r.stats.servicesRunning}`;
          return add('output', out);
        }
        case 'history': {
          const r = await must(`/history?limit=${encodeURIComponent(args[0] || 20)}`);
          let out = 'COMMAND HISTORY\n\n';
          (r.history || []).forEach((c, i) => { out += `${i + 1}. ${c}\n`; });
          return add('output', out);
        }
        case 'version': {
          const r = await must('/version');
          return add('output', `VERSION INFORMATION\n\nAgent Version: ${r.version || r.agentVersion || 'Unknown'}\nNode Version: ${r.nodeVersion || 'Unknown'}\nPlatform: ${r.platform || 'Unknown'}\n`);
        }
        case 'commands': {
          const r = await must('/commands');
          let out = 'AVAILABLE COMMANDS\n\n';
          Object.entries(r.commands || {}).forEach(([c, d]) => { out += `${c.padEnd(25)} - ${(d && d.description) || d}\n`; });
          return add('output', out);
        }
        case 'search-cve': {
          if (!args.length) return add('output', 'Usage: search-cve <query>');
          const r = await must('/cve/search', 'POST', { query: args.join(' ') });
          return add('output', r.output || 'CVE search completed');
        }
        default: {
          const r = await must('/execute', 'POST', { command, args });
          if (r.output) return add('output', r.output);
          return add('output', r.message || 'Command executed successfully');
        }
      }
    };

    const drain = () => { if (pending.length && !st.get('busy')) { const n = pending.shift(); execute(n.cmd, n.display); } };

    async function execute(cmd, display) {
      const line = cmd.trim();
      if (!line) return;
      if (st.get('busy')) { pending.push({ cmd, display }); return; }
      add('input', display == null ? line : display);
      t0 = Date.now();
      await st.set('busy', true);
      const [command, ...args] = line.split(' ');
      try {
        await dispatch(command, args, line);
      } catch (err) {
        add('system', `Error: ${err.message}`);
        if (err.status === 401 || err.status === 403) add('output', 'Sign in with an admin account: login <email> <password>');
        else add('output', 'Check API connection and try again');
      } finally {
        await st.set('busy', false);
        drain();
      }
    }

    const submit = async () => {
      if (st.get('busy')) return;
      const $f = view.el.find('.term-field');
      const raw = String($f.val());
      const lg = st.get('login');

      // While a login prompt is open the input is a credential: keep it out of history, never echo a password.
      if (lg) {
        const value = lg.step === 'password' ? raw : raw.trim();
        if (!value) return;
        $f.val('');
        if (lg.step === 'email') {
          add('input', value);
          if (!EMAIL_PATTERN.test(value)) return add('system', 'Invalid email address, try again (Esc to cancel)');
          await st.set('login', { step: 'password', email: value });
          return add('output', 'Password:');
        }
        add('input', '********');
        await st.set('login', null);
        t0 = Date.now();
        await st.set('busy', true);
        try { await performLogin(lg.email, value); } finally { await st.set('busy', false); drain(); }
        return;
      }

      if (!raw.trim()) return;
      const cmd = raw.trim();
      cmdHist.push(redactLogin(cmd));
      hIdx = -1;
      $f.val('');
      hideSuggest();
      execute(cmd, redactLogin(cmd));
    };

    // ------------------------------------------------------------------ completion

    const hideSuggest = () => view && view.el.find('.term-suggest').empty();
    const suggest = (list) => {
      view.el.find('.term-suggest').html(list.slice(0, 8).map((c) => `<button type="button" class="chip sg" data-c="${esc(c)}">${esc(c)}</button>`).join(''));
    };
    const matches = (v) => (v && !/\s/.test(v) ? completions.filter((c) => c.startsWith(v) && c !== v) : []);

    const complete = () => {
      const $f = view.el.find('.term-field');
      const v = String($f.val());
      const m = matches(v);
      if (!m.length) return;
      if (m.length === 1) { $f.val(m[0] + ' '); return hideSuggest(); }
      let p = m[0];
      m.forEach((c) => { while (!c.startsWith(p)) p = p.slice(0, -1); });
      if (p.length > v.length) $f.val(p);
      suggest(m);
    };

    // ------------------------------------------------------------------ view

    const template = () => `
      <div class="term">
        <div class="term-bar">
          <span class="pill term-state"></span>
          <div class="term-chips">${CHIPS.map((c) => `<button type="button" class="chip term-chip" data-cmd="${c}">${c}</button>`).join('')}</div>
          <button type="button" class="btn btn-ghost btn-sm term-clear" title="Clear (Ctrl+L)">${icon('trash-2')} Clear</button>
        </div>
        <div class="term-scroll"><div class="term-log"></div></div>
        <div class="term-suggest"></div>
        <form class="term-form" autocomplete="off">
          <span class="ps"></span><span class="chev">❯</span>
          <input class="term-field" type="text" spellcheck="false" autocapitalize="off" autocorrect="off" aria-label="Command">
        </form>
      </div>`;

    const events = {
      'submit .term-form': (e) => { e.preventDefault(); submit(); },
      'input .term-field': () => {
        const m = matches(String(view.el.find('.term-field').val()));
        m.length ? suggest(m) : hideSuggest();
      },
      'keydown .term-field': (e) => {
        const lg = st.get('login');
        if (lg) {
          if (e.key === 'Escape') { e.preventDefault(); st.set('login', null); view.el.find('.term-field').val(''); add('output', 'Login cancelled'); }
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
          return;
        }
        const $f = view.el.find('.term-field');
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (hIdx + 1 < cmdHist.length) { hIdx += 1; $f.val(cmdHist[cmdHist.length - 1 - hIdx]); }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (hIdx > 0) { hIdx -= 1; $f.val(cmdHist[cmdHist.length - 1 - hIdx]); }
          else if (hIdx === 0) { hIdx = -1; $f.val(''); }
        } else if (e.key === 'Tab') {
          e.preventDefault();
          complete();
        } else if (e.key === 'l' && e.ctrlKey) {
          e.preventDefault();
          entries = [];
          $log().empty();
        }
      },
      'click .sg': (e) => { view.el.find('.term-field').val($(e.currentTarget).data('c') + ' ').trigger('focus'); hideSuggest(); },
      'click .term-chip': (e) => execute(String($(e.currentTarget).data('cmd'))),
      'click .term-clear': () => execute('clear'),
      'click .term-scroll': () => { if (!String(window.getSelection())) view.el.find('.term-field').trigger('focus'); },
    };

    const mount = () => {
      view = sb.View({ el: '#view-terminal', template, events });
      mounted = true;
      return view.render({}).then(() => {
        $log().html(entries.map(entryHtml).join(''));
        syncPrompt();
        syncBusy();
        scroll();
        view.el.find('.term-field').trigger('focus');
      });
    };
    const unmount = () => { if (mounted) { mounted = false; clearInterval(timer); view.destroy(); } };

    // ------------------------------------------------------------------ module

    const loadCompletions = async () => {
      const res = await agent('/commands');
      if (res.ok && res.data.commands) completions = [...new Set([...LOCAL, ...Object.keys(res.data.commands)])].sort();
    };

    const onAgent = (s) => {
      session.online = !!s.online;
      const key = `${s.online}:${s.status || ''}`;
      if (key !== announced) {
        announced = key;
        if (s.online) {
          add('output', 'Agent initialized successfully');
          add('output', 'Type "help" for commands, "status" for system status');
          loadCompletions();
        } else if (s.status === 401) add('system', 'Not signed in. Use: login <email> <password>');
        else if (s.status === 403) add('system', `${s.message}. Sign in with an admin account: login <email> <password>`);
        else if (s.status === 404) add('system', 'The agent API is disabled on this server (AGENT_API_ENABLED)');
        else if (s.status) add('system', `Agent initialization failed: ${s.message}`);
        else if (s.message) add('system', 'Failed to connect to agent API');
        if (!s.online && s.message) add('output', 'Running in offline mode with limited functionality');
      }
      syncPrompt();
    };

    return {
      load() {
        st.on('busy', syncBusy);
        st.on('login', syncPrompt);
        sb.add('agent:status', (s) => onAgent(s));
        sb.add('session:changed', (s) => { session.user = s.user; syncPrompt(); });
        sb.add('settings:changed', (s) => { cfg = s; });
        sb.add('terminal:run', (m) => { execute(m.cmd); });
        sb.add('view:mount', (m) => (m.name === 'terminal' ? mount() : undefined));
        sb.add('route:start', (m) => { if (mounted && m.path !== 'terminal') unmount(); });
        return sb.fire('settings:get').then((s) => { cfg = s; });
      },
      unload() { unmount(); },
    };
  });
}
