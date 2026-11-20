// Small, dependency-free helpers shared by the modules.

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// "login me@x.com secret" -> "login me@x.com ********" (used for the echo and the command history)
export const redactLogin = (cmd) => cmd.replace(/^(login\s+\S+\s+)\S.*$/, '$1********');

const ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ENT[c]);

export const clock = (d = new Date()) =>
  d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

export const debounce = (fn, ms) => {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
};

export const copyText = (text) => {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  return new Promise((resolve, reject) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy') ? resolve() : reject(new Error('copy failed')); }
    catch (e) { reject(e); }
    finally { ta.remove(); }
  });
};

// ------------------------------------------------------------------ terminal output

// Escapes first, then wraps the agent's status tokens ([CRITICAL], [READY], ✓, ✗ ...) in spans.
const TOKENS = [
  [/\[(CRITICAL|HIGH)\]/g, 'tok-crit'],
  [/\[(MEDIUM|WARNING|NOT CONFIGURED)\]/g, 'tok-warn'],
  [/\[(LOW|SUCCESS|READY|RUNNING|OK)\]/g, 'tok-ok'],
  [/\[(ERROR|UNAVAILABLE|FAIL)\]/g, 'tok-err'],
  [/\[(INFO|STOPPED|SKIP)\]/g, 'tok-dim'],
];
export function highlight(text) {
  let h = esc(text);
  TOKENS.forEach(([re, cls]) => { h = h.replace(re, (m) => `<span class="${cls}">${m}</span>`); });
  return h.replace(/✓/g, '<span class="tok-ok">✓</span>').replace(/✗/g, '<span class="tok-err">✗</span>');
}

// ------------------------------------------------------------------ markdown (chat)

const fmt = (h) =>
  h
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*(?!\*)/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

// Inline code is split out first so nothing inside backticks gets formatted.
const inline = (s) =>
  s.split(/(`[^`]+`)/g)
    .map((p) => (p.length > 1 && p[0] === '`' && p[p.length - 1] === '`' ? `<code>${esc(p.slice(1, -1))}</code>` : fmt(esc(p))))
    .join('');

/**
 * Tiny markdown subset: fenced code, headings, lists, quotes, rules, bold/italic, inline code, https links.
 * Everything is escaped before any tag is added, and an unclosed fence (mid-stream) renders as code.
 */
export function markdown(src) {
  const blocks = [];
  const text = String(src || '').replace(/```([\w+#.-]*)[^\S\n]*\n?([\s\S]*?)(```|$)/g, (m, lang, code) => {
    blocks.push({ lang, code: code.replace(/\n$/, '') });
    return `\u0000${blocks.length - 1}\u0000`;
  });

  const out = [];
  let list = null; // 'ul' | 'ol'
  let para = [];
  const flushPara = () => { if (para.length) { out.push(`<p>${para.join('<br>')}</p>`); para = []; } };
  const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };

  text.split('\n').forEach((line) => {
    let m;
    if ((m = line.match(/^\u0000(\d+)\u0000$/))) {
      flushPara(); closeList();
      const b = blocks[+m[1]];
      out.push(
        `<div class="codeblock"><div class="codebar"><span>${esc(b.lang || 'text')}</span>` +
        `<button type="button" class="copy-code">copy</button></div><pre><code>${esc(b.code)}</code></pre></div>`
      );
    } else if ((m = line.match(/^(#{1,4})\s+(.*)$/))) {
      flushPara(); closeList();
      out.push(`<h${m[1].length + 2}>${inline(m[2])}</h${m[1].length + 2}>`);
    } else if ((m = line.match(/^\s*[-*+]\s+(.*)$/))) {
      flushPara();
      if (list !== 'ul') { closeList(); out.push('<ul>'); list = 'ul'; }
      out.push(`<li>${inline(m[1])}</li>`);
    } else if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) {
      flushPara();
      if (list !== 'ol') { closeList(); out.push('<ol>'); list = 'ol'; }
      out.push(`<li>${inline(m[1])}</li>`);
    } else if ((m = line.match(/^>\s?(.*)$/))) {
      flushPara(); closeList();
      out.push(`<blockquote>${inline(m[1])}</blockquote>`);
    } else if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
      flushPara(); closeList();
      out.push('<hr>');
    } else if (!line.trim()) {
      flushPara(); closeList();
    } else {
      closeList();
      para.push(inline(line));
    }
  });
  flushPara(); closeList();
  return out.join('');
}
