// settings: persisted app settings (the shared store) and the Settings view.
//
// Framework note: broker handlers must declare ONE plain parameter, e.g. (req) => ...
// utils.hasArgs() counts "(a, b, c)" and treats 3+ as a node-style callback, and it only
// looks at the first parenthesis group, so destructured/default params confuse it.
import { esc } from '../lib/format.js';
import { icon } from '../lib/icons.js';

const $ = window.jQuery;
const KEY = 'fear.agent.settings.v1';

const DEFAULT_PROMPT =
    'You are FEAR, an assistant for security engineers and developers. Be concise and precise. ' +
    'Prefer defensive guidance: explain vulnerabilities, hardening, secure code, and how to detect and fix issues. ' +
    'Use fenced code blocks for code.';

const defaults = () => ({
    apiRoot: location.protocol.startsWith('http') ? `${location.origin}/fear/api` : 'http://fear.dedyn.io:4000/fear/api',
    ollamaHost: 'http://localhost:11434',
    ollamaModel: '',
    systemPrompt: DEFAULT_PROMPT,
    collapsed: false,
});

const normUrl = (v) => String(v || '').trim().replace(/\/+$/, '');
const validUrl = (v) => { try { const u = new URL(v); return /^https?:$/.test(u.protocol); } catch { return false; } };

export default function register(FEAR) {
    FEAR.create('settings', (sb) => {
        let model;
        let view = null;
        let mounted = false;

        const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
        const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(model.toJSON())); } catch { /* storage blocked */ } };
        const toast = (type, text) => sb.emit('toast', { type, text }).catch(() => { });

        const apply = (patch) =>
            model.update(patch).then(() => {
                const snap = model.toJSON();
                return sb.emit('settings:changed', snap).then(() => snap);
            });

        const template = (s) => `
      <div class="page page-narrow">
        <header class="page-head">
          <h1>Settings</h1>
          <p class="muted">Stored in this browser only. Credentials are never saved: sign-in uses an httpOnly session cookie.</p>
        </header>
        <form class="panel form" id="settings-form" autocomplete="off" novalidate>
          <h2>${icon('server')} Agent API</h2>
          <label class="field"><span>API root</span>
            <input name="apiRoot" value="${esc(s.apiRoot)}" spellcheck="false" placeholder="https://host/fear/api">
            <small>Commands go to <code>{root}/agent</code>, sign-in to <code>{root}/auth</code>. Keep it same-origin with this page so the session cookie is sent.</small>
          </label>
          <div class="row"><button type="button" class="btn btn-test" data-test="agent">${icon('zap')} Test connection</button><span class="test-result" data-for="agent"></span></div>

          <h2>${icon('cpu')} Local LLM (Ollama)</h2>
          <label class="field"><span>Ollama host</span>
            <input name="ollamaHost" value="${esc(s.ollamaHost)}" spellcheck="false" placeholder="http://localhost:11434">
            <small>The browser talks to Ollama directly. Start it with <code>OLLAMA_ORIGINS</code> including this page's origin.</small>
          </label>
          <label class="field"><span>Default model</span>
            <input name="ollamaModel" value="${esc(s.ollamaModel)}" spellcheck="false" placeholder="chat-ai (leave empty to auto-pick)">
          </label>
          <label class="field"><span>System prompt</span>
            <textarea name="systemPrompt" rows="5" spellcheck="false">${esc(s.systemPrompt)}</textarea>
          </label>
          <div class="row"><button type="button" class="btn btn-test" data-test="ollama">${icon('zap')} Test Ollama</button><span class="test-result" data-for="ollama"></span></div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">${icon('check')} Save</button>
            <button type="button" class="btn btn-ghost btn-reset">Reset to defaults</button>
          </div>
          <p class="form-error" role="alert"></p>
        </form>
      </div>`;

        const result = (which, ok, text) =>
            view.el.find(`.test-result[data-for="${which}"]`).attr('class', `test-result ${ok ? 'ok' : 'bad'}`).text(text);

        const formValues = () => {
            const $f = view.el.find('#settings-form');
            const val = (n) => $f.find(`[name="${n}"]`).val();
            return {
                apiRoot: normUrl(val('apiRoot')),
                ollamaHost: normUrl(val('ollamaHost')),
                ollamaModel: String(val('ollamaModel') || '').trim(),
                systemPrompt: String(val('systemPrompt') || '').trim() || DEFAULT_PROMPT,
            };
        };

        const events = {
            'submit #settings-form': function (e) {
                e.preventDefault();
                const v = formValues();
                const $err = view.el.find('.form-error');
                if (!validUrl(v.apiRoot)) return $err.text('API root must be a full http(s) URL.');
                if (!validUrl(v.ollamaHost)) return $err.text('Ollama host must be a full http(s) URL.');
                $err.text('');
                apply(v).then(() => toast('ok', 'Settings saved'));
            },
            'click .btn-reset': function () {
                const d = defaults();
                apply({ ...d, collapsed: model.get('collapsed') }).then(() => view.render(model.toJSON())).then(() => toast('ok', 'Defaults restored'));
            },
            'click .btn-test': async function (e) {
                const which = $(e.currentTarget).data('test');
                const v = formValues();
                result(which, true, 'testing…');
                try {
                    if (which === 'agent') {
                        const res = await fetch(`${v.apiRoot}/agent/version`, { credentials: 'include' });
                        if (res.status === 401 || res.status === 403) return result(which, true, `reachable (HTTP ${res.status}: sign in as admin)`);
                        result(which, res.ok, res.ok ? 'reachable' : `HTTP ${res.status}`);
                    } else {
                        const res = await fetch(`${v.ollamaHost}/api/tags`);
                        const data = await res.json();
                        result(which, true, `${(data.models || []).length} model(s) found`);
                    }
                } catch (err) {
                    result(which, false, which === 'ollama' ? 'unreachable (is Ollama running? check OLLAMA_ORIGINS)' : `unreachable: ${err.message}`);
                }
            },
        };

        const mount = () => {
            view = sb.View({ el: '#view-settings', template, events });
            mounted = true;
            return view.render(model.toJSON());
        };
        const unmount = () => { if (mounted) { mounted = false; view.destroy(); } };

        return {
            load() {
                model = sb.Model({ ...defaults(), ...read() });
                model.on('*', persist);
                sb.add('settings:get', () => model.toJSON());
                sb.add('settings:set', (patch) => apply(patch));
                sb.add('view:mount', (m) => (m.name === 'settings' ? mount() : undefined));
                sb.add('route:start', (m) => { if (mounted && m.path !== 'settings') unmount(); });
                return Promise.resolve();
            },
            unload() { unmount(); },
        };
    });
}