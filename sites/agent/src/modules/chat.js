// chat: streaming chat with a local Ollama model. Transcript lives in the module (survives navigation).
import { esc, clock, markdown, copyText } from '../lib/format.js';
import { icon } from '../lib/icons.js';

const $ = window.jQuery;

const STARTERS = [
  'Explain CVE-2021-44228 and how to mitigate it',
  'Review this Express route for security issues',
  'What are the OWASP Top 10 risks for a Node API?',
  'Write a safe rate limiter middleware for Express',
];

let uid = 0;

export default function register(FEAR) {
  FEAR.create('chat', (sb) => {
    const st = sb.Model({ busy: false, online: null, models: [] });
    let msgs = [];
    let cfg = {};
    let view = null;
    let mounted = false;
    let abort = null;
    let raf = 0;

    const toast = (type, text) => sb.emit('toast', { type, text }).catch(() => {});
    const model = () => cfg.ollamaModel || '';
    const $log = () => view.el.find('.chat-log');
    const nearBottom = () => { const s = view.el.find('.chat-scroll')[0]; return !s || s.scrollHeight - s.scrollTop - s.clientHeight < 140; };
    const scroll = (force) => { const s = view.el.find('.chat-scroll')[0]; if (s && (force || nearBottom())) s.scrollTop = s.scrollHeight; };

    // ------------------------------------------------------------------ rendering

    const msgHtml = (m) => {
      const ai = m.role === 'assistant';
      const label = m.role === 'user' ? 'you' : (m.model || 'assistant');
      const body = m.role === 'user' ? `<div class="msg-body plain">${esc(m.content)}</div>`
        : m.error ? `<div class="msg-body plain">${esc(m.content)}</div>`
        : `<div class="msg-body md">${markdown(m.content)}${m.streaming ? '<span class="caret"></span>' : ''}</div>`;
      return `<article class="msg ${ai ? 'msg-ai' : 'msg-user'}${m.error ? ' msg-err' : ''}" data-id="${m.id}">
        <div class="msg-head"><span class="msg-role">${esc(label)}</span><span class="msg-time">${clock(m.ts)}</span>
        <span class="msg-tools"><button type="button" class="icon-btn msg-copy" title="Copy">${icon('copy')}</button></span></div>${body}</article>`;
    };

    const emptyHtml = () => `
      <div class="chat-empty">
        <div class="empty-mark">${icon('sparkles')}</div>
        <h2>FEAR AI Chat</h2>
        <p class="muted">Runs on your local Ollama model. Nothing leaves your machine.</p>
        <div class="starters">${STARTERS.map((s) => `<button type="button" class="starter">${esc(s)}</button>`).join('')}</div>
      </div>`;

    const renderLog = () => {
      if (!mounted) return;
      $log().html(msgs.length ? msgs.map(msgHtml).join('') : emptyHtml());
      scroll(true);
    };

    const patchMsg = (m) => {
      if (!mounted) return;
      const $m = $log().find(`.msg[data-id="${m.id}"]`);
      if ($m.length) $m.replaceWith(msgHtml(m));
      else { $log().find('.chat-empty').remove(); $log().append($(msgHtml(m)).addClass('enter')); }
    };

    const syncUi = () => {
      if (!mounted) return;
      const busy = st.get('busy');
      const online = st.get('online');
      view.el.find('.composer').toggleClass('is-busy', busy);
      view.el.find('.btn-send').toggleClass('hidden', busy);
      view.el.find('.btn-stop').toggleClass('hidden', !busy);
      view.el.find('.chat-state').attr('class', `pill chat-state ${online ? 'pill-ok' : online === false ? 'pill-bad' : ''}`)
        .html(`<i class="dot"></i>${online ? 'ollama online' : online === false ? 'ollama offline' : 'checking…'}`);
      const models = st.get('models');
      const cur = model();
      view.el.find('.model-select').html(
        (models.length ? models : [cur || 'chat-ai']).map((n) => `<option value="${esc(n)}"${n === cur ? ' selected' : ''}>${esc(n)}</option>`).join('')
      ).prop('disabled', !models.length);
      view.el.find('.btn-regen').toggleClass('hidden', busy || !msgs.length);
    };

    // ------------------------------------------------------------------ ollama

    const refreshModels = async () => {
      try {
        const res = await fetch(`${cfg.ollamaHost}/api/tags`);
        const data = await res.json();
        const names = (data.models || []).map((m) => m.name);
        await st.set('models', names);
        await st.set('online', true);
        if (names.length && !names.includes(cfg.ollamaModel)) {
          // Prefer the user's chat-ai preset, then whatever is installed first
          cfg = { ...cfg, ollamaModel: names.find((n) => n.split(':')[0] === 'chat-ai') || names[0] };
        }
      } catch {
        await st.set('online', false);
        await st.set('models', []);
      }
      sb.emit('llm:status', { online: st.get('online') }).catch(() => {});
      syncUi();
    };

    const stream = async (history, onToken, signal) => {
      const messages = [{ role: 'system', content: cfg.systemPrompt }, ...history.map((m) => ({ role: m.role, content: m.content }))];
      const res = await fetch(`${cfg.ollamaHost}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: model(), messages, stream: true }),
        signal,
      });
      if (!res.ok) {
        let detail = '';
        try { detail = (await res.json()).error || ''; } catch { /* not json */ }
        throw new Error(`Ollama responded with ${res.status}${detail ? `: ${detail}` : ''}`);
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = '';
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let i;
        while ((i = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, i).trim();
          buf = buf.slice(i + 1);
          if (!line) continue;
          let obj;
          try { obj = JSON.parse(line); } catch { continue; }
          if (obj.error) throw new Error(obj.error);
          if (obj.message && obj.message.content) onToken(obj.message.content);
        }
      }
    };

    const generate = async () => {
      const history = msgs.filter((m) => !m.error);
      const reply = { id: ++uid, role: 'assistant', content: '', ts: new Date(), model: model(), streaming: true };
      msgs.push(reply);
      patchMsg(reply);
      scroll(true);
      abort = new AbortController();
      await st.set('busy', true);
      syncUi();
      try {
        await stream(history, (tok) => {
          reply.content += tok;
          if (!raf) raf = requestAnimationFrame(() => { raf = 0; patchMsg(reply); scroll(); });
        }, abort.signal);
        if (!reply.content.trim()) throw new Error('The model returned an empty response');
      } catch (err) {
        if (err.name === 'AbortError') {
          if (!reply.content) msgs = msgs.filter((m) => m !== reply);
        } else {
          msgs = msgs.filter((m) => m !== reply || reply.content);
          msgs.push({
            id: ++uid, role: 'assistant', error: true, ts: new Date(),
            content: `Error: ${err.message}\nMake sure Ollama is running (${cfg.ollamaHost}), allows this origin (OLLAMA_ORIGINS) and the model "${model()}" is pulled.`,
          });
          refreshModels();
        }
      } finally {
        reply.streaming = false;
        cancelAnimationFrame(raf); raf = 0;
        abort = null;
        await st.set('busy', false);
        renderLog();
        syncUi();
        if (mounted) view.el.find('.composer-field').trigger('focus');
      }
    };

    const send = (text) => {
      const content = String(text || '').trim();
      if (!content || st.get('busy')) return;
      msgs = msgs.filter((m) => !m.error);
      msgs.push({ id: ++uid, role: 'user', content, ts: new Date() });
      if (mounted) {
        view.el.find('.composer-field').val('').css('height', 'auto');
        renderLog();
      }
      generate();
    };

    const regenerate = () => {
      if (st.get('busy')) return;
      while (msgs.length && msgs[msgs.length - 1].role !== 'user') msgs.pop();
      if (!msgs.length) return;
      renderLog();
      generate();
    };

    const newChat = () => {
      if (abort) abort.abort();
      msgs = [];
      renderLog();
      syncUi();
      if (mounted) view.el.find('.composer-field').trigger('focus');
    };

    // ------------------------------------------------------------------ view

    const template = () => `
      <div class="chat">
        <div class="chat-bar">
          <select class="model-select" aria-label="Model"></select>
          <span class="pill chat-state"></span>
          <span class="spacer"></span>
          <button type="button" class="btn btn-ghost btn-sm btn-regen hidden">${icon('refresh-cw')} Regenerate</button>
          <button type="button" class="btn btn-ghost btn-sm btn-refresh" title="Refresh models">${icon('refresh-cw')} Models</button>
          <button type="button" class="btn btn-ghost btn-sm btn-new" title="New chat (Ctrl+L)">${icon('plus')} New chat</button>
        </div>
        <div class="chat-scroll"><div class="chat-log"></div></div>
        <form class="composer">
          <textarea class="composer-field" rows="1" placeholder="Message the model…  (Enter to send, Shift+Enter for a new line)" aria-label="Message"></textarea>
          <button type="submit" class="btn btn-primary btn-send" title="Send">${icon('send')}</button>
          <button type="button" class="btn btn-danger btn-stop hidden" title="Stop (Esc)">${icon('square')}</button>
        </form>
      </div>`;

    const grow = (el) => { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 180) + 'px'; };

    const events = {
      'submit .composer': (e) => { e.preventDefault(); send(view.el.find('.composer-field').val()); },
      'input .composer-field': (e) => grow(e.currentTarget),
      'keydown .composer-field': (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.originalEvent.isComposing) { e.preventDefault(); send(e.currentTarget.value); }
        else if (e.key === 'Escape' && abort) abort.abort();
        else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); newChat(); }
      },
      'click .btn-stop': () => abort && abort.abort(),
      'click .btn-new': () => newChat(),
      'click .btn-regen': () => regenerate(),
      'click .btn-refresh': () => refreshModels(),
      'change .model-select': (e) => { const v = e.currentTarget.value; cfg = { ...cfg, ollamaModel: v }; sb.fire('settings:set', { ollamaModel: v }); },
      'click .starter': (e) => send($(e.currentTarget).text()),
      'click .msg-copy': (e) => {
        const m = msgs.find((x) => x.id === +$(e.currentTarget).closest('.msg').data('id'));
        if (m) copyText(m.content).then(() => toast('ok', 'Copied'), () => toast('bad', 'Copy failed'));
      },
      'click .copy-code': (e) => {
        const code = $(e.currentTarget).closest('.codeblock').find('code').text();
        copyText(code).then(() => { const $b = $(e.currentTarget).text('copied'); setTimeout(() => $b.text('copy'), 1200); }, () => toast('bad', 'Copy failed'));
      },
    };

    const mount = () => {
      view = sb.View({ el: '#view-chat', template, events });
      mounted = true;
      return view.render({}).then(() => {
        renderLog();
        syncUi();
        view.el.find('.composer-field').trigger('focus');
        if (st.get('online') === null || !st.get('models').length) refreshModels();
      });
    };
    const unmount = () => { if (mounted) { mounted = false; view.destroy(); } };

    return {
      load() {
        st.on('busy', syncUi);
        sb.add('settings:changed', (s) => { const hostChanged = s.ollamaHost !== cfg.ollamaHost; cfg = s; if (hostChanged) refreshModels(); });
        sb.add('chat:new', () => newChat());
        sb.add('view:mount', (m) => (m.name === 'chat' ? mount() : undefined));
        sb.add('route:start', (m) => { if (mounted && m.path !== 'chat') unmount(); });
        return sb.fire('settings:get').then((s) => { cfg = s; });
      },
      unload() { if (abort) abort.abort(); unmount(); },
    };
  });
}
