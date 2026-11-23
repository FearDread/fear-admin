// Local preview: serves the SPA and fakes the FEAR agent/auth API plus an Ollama endpoint.
//   node dev/mock-server.mjs              serves src/   -> http://localhost:4000   (sign in: admin@fear.dev / admin)
//   SERVE=build node dev/mock-server.mjs  serves the production build/
// Not for production. It exists so the UI can be developed without the real backend.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', process.env.SERVE === 'build' ? 'build' : 'src');
const PORT = +process.env.PORT || 4000;
const OLLAMA_PORT = +process.env.OLLAMA_PORT || 11434;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.json': 'application/json', '.svg': 'image/svg+xml' };

const services = { 'auto-scan': 'stopped', 'log-monitor': 'running', 'cve-check': 'stopped', 'net-monitor': 'stopped', 'file-watch': 'stopped' };
const modules = {
  scanner: 'Security Scanner', webScraper: 'Web Scraper', vulnAssessment: 'Vuln Assessment', trafficMonitor: 'Traffic Monitor',
  cveDatabase: 'CVE Database', aiAnalyzer: 'AI Analyzer', aiChat: 'AI Chat Session', codeAnalyzer: 'Code Analyzer', serviceManager: 'Service Manager',
};
const history = [];
let initialized = false;

const json = (res, code, body, extra = {}) => { res.writeHead(code, { 'Content-Type': 'application/json', ...extra }); res.end(JSON.stringify(body)); };
const body = (req) => new Promise((r) => { let d = ''; req.on('data', (c) => (d += c)); req.on('end', () => { try { r(JSON.parse(d || '{}')); } catch { r({}); } }); });
const authed = (req) => /(^|;\s*)jwt=ok/.test(req.headers.cookie || '');


// ---- fake nginx / DNS monitor (/fear/api/nginx/*) ------------------------------
const HOSTS = {
  'efear.shop':               { ip: '203.0.113.10', base: 70,  cert: 61, https: true },
  'vchat.efear.shop':         { ip: '203.0.113.10', base: 95,  cert: 61, https: true },
  'vchat-direct.efear.shop':  { ip: '203.0.113.10', base: 55,  cert: 12, https: true },
  'api.efear.shop':           { ip: '203.0.113.11', base: 120, cert: 33, https: true },
  'fear.dedyn.io':            { ip: '198.51.100.7', base: 0,   cert: 0,  https: true, down: true },
};
const nginx = { monitoring: false, lastRun: Date.now() - 45_000, trend: [], events: [] };
const jitter = (n) => Math.max(8, Math.round(n + (Math.random() - 0.5) * n * 0.5));

function probe() {
  const hosts = {};
  Object.entries(HOSTS).forEach(([name, h]) => {
    const ms = h.down ? null : jitter(h.base);
    hosts[name] = {
      dns: { A: [h.ip] },
      http: h.down ? { ok: false, error: 'ETIMEDOUT' } : { ok: true, status: 301, ms: Math.round(ms * 0.5) },
      https: h.down ? { ok: false, error: 'ETIMEDOUT' } : { ok: true, status: 200, ms },
      cert: h.down ? { ok: false } : { ok: true, daysLeft: h.cert },
    };
  });
  return hosts;
}
function record() {
  const hosts = probe();
  const ms = Object.values(hosts).map((h) => (h.https.ok ? h.https.ms : null)).filter((v) => v != null);
  nginx.trend.push({ time: Date.now(), avgMs: Math.round(ms.reduce((a, b) => a + b, 0) / ms.length), hosts: Object.fromEntries(Object.entries(hosts).map(([k, h]) => [k, { ms: h.https.ok ? h.https.ms : null }])) });
  nginx.trend = nginx.trend.slice(-120);
  nginx.snapshot = { hosts };
  nginx.lastRun = Date.now();
}
for (let i = 40; i > 0; i--) { record(); nginx.trend[nginx.trend.length - 1].time = Date.now() - i * 60_000; }
nginx.events = [
  { time: Date.now() - 3_600_000, level: 'info', host: 'efear.shop', msg: 'DNS A record unchanged (203.0.113.10)' },
  { time: Date.now() - 1_800_000, level: 'warn', host: 'vchat-direct.efear.shop', msg: 'certificate expires in 12 days' },
  { time: Date.now() - 600_000, level: 'error', host: 'fear.dedyn.io', msg: 'https probe failed: ETIMEDOUT' },
];
setInterval(() => { if (nginx.monitoring) record(); }, 10_000).unref();

function nginxApi(res, a, req, b) {
  if (a === '/status') return json(res, 200, { success: true, result: { monitoring: nginx.monitoring, lastRun: nginx.lastRun, snapshot: nginx.snapshot, events: nginx.events } });
  if (a.startsWith('/trend')) return json(res, 200, { success: true, result: nginx.trend.slice(-(+new URL('http://x' + a).searchParams.get('limit') || 60)) });
  if (a === '/check-all') {
    record();
    nginx.events.push({ time: Date.now(), level: 'error', host: 'fear.dedyn.io', msg: 'https probe failed: ETIMEDOUT' });
    return json(res, 200, { success: true, result: nginx.snapshot });
  }
  if (a === '/monitor/start' || a === '/monitor/stop') { nginx.monitoring = a.endsWith('start'); return json(res, 200, { success: true, message: nginx.monitoring ? 'Monitor started (every 10s)' : 'Monitor stopped' }); }
  if (a === '/test') return json(res, 200, { success: true, result: { output: 'syntax is ok / test is successful' } });
  return json(res, 404, { success: false, message: `no mock for /nginx${a}` });
}

async function api(req, res, url) {
  const p = url.pathname.replace('/fear/api', '');
  const b = req.method === 'POST' || req.method === 'PUT' ? await body(req) : {};

  if (p === '/auth/login') {
    if (b.email === 'admin@fear.dev' && b.password === 'admin') {
      return json(res, 200, { success: true, message: 'Login successful', result: { user: { email: b.email, role: 'admin' } } },
        { 'Set-Cookie': 'jwt=ok; HttpOnly; Path=/; SameSite=Strict' });
    }
    return json(res, 401, { success: false, message: 'Invalid credentials' });
  }
  if (p === '/auth/logout') { initialized = false; return json(res, 200, { success: true }, { 'Set-Cookie': 'jwt=; Max-Age=0; Path=/' }); }
  if (p === '/auth/me') return authed(req) ? json(res, 200, { success: true, data: { user: { email: 'admin@fear.dev', role: 'admin' } } }) : json(res, 401, { success: false, message: 'Access denied. Authentication required.' });

  if (p.startsWith('/nginx')) return authed(req) ? nginxApi(res, p.replace('/nginx', ''), req, b) : json(res, 401, { success: false, message: 'Access denied. Authentication required.' });
  if (!p.startsWith('/agent')) return json(res, 404, { success: false, message: 'not found' });
  if (!authed(req)) return json(res, 401, { success: false, message: 'Access denied. Authentication required.' });
  const a = p.replace('/agent', '');

  if (a === '/initialize') { initialized = true; return json(res, 200, { success: true, initialized: true, modulesLoaded: 9 }); }
  if (a === '/status') {
    return json(res, 200, {
      success: true, initialized, version: { version: '2.4.0', nodeVersion: process.version },
      modules: Object.fromEntries(Object.entries(modules).map(([k, v]) => [k, { displayName: v, loaded: true, status: 'ready', ...(k === 'aiAnalyzer' ? { configured: false } : {}) }])),
      services, stats: { modulesLoaded: 9, commandsAvailable: 112, servicesRunning: Object.values(services).filter((s) => s === 'running').length, commandHistory: history.length },
    });
  }
  if (a === '/version') return json(res, 200, { success: true, version: '2.4.0', nodeVersion: process.version, platform: process.platform });
  if (a === '/history') return json(res, 200, { success: true, history });
  if (a === '/commands') return json(res, 200, { success: true, commands: Object.fromEntries(['help', 'status', 'service-list', 'service-start', 'ai-status', 'ai-provider', 'ai-explain', 'proxy-status', 'search-cve', 'check-cwe', 'scan-ports', 'security-audit'].map((c) => [c, { description: c }])) });
  if (a === '/service/start' || a === '/service/stop') { services[b.service] = a.endsWith('start') ? 'running' : 'stopped'; return json(res, 200, { success: true }); }
  if (a === '/cve/search') return json(res, 200, { success: true, output: `CVE SEARCH: ${b.query}\n\n[CRITICAL] CVE-2021-44228  Apache Log4j2 JNDI injection\n[HIGH] CVE-2022-22965  Spring4Shell\n[LOW] CVE-2020-0000  example\n` });
  if (a === '/execute') {
    history.push(b.command);
    const out = {
      'service-list': `Available Background Services\n\n${Object.entries(services).map(([k, v]) => `[${v.toUpperCase()}] ${k}`).join('\n')}\n`,
      'ai-status': 'AI Module Status\n\n  Status: ✗ Not initialized\n  Anthropic Claude: ✗ Not configured\n  OpenAI GPT: ✓ Available\n',
      'proxy-status': 'Proxy Manager Status\n\n  Active Proxy: Direct connection\n',
    }[b.command];
    return json(res, 200, { success: true, command: b.command, output: out || `[INFO] executed: ${b.command} ${(b.args || []).join(' ')}\n[SUCCESS] done` });
  }
  return json(res, 404, { success: false, message: `no mock for ${p}` });
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith('/fear/api')) return api(req, res, url);
  let file = path.join(ROOT, url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(ROOT, 'index.html');
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`SPA + mock API  http://localhost:${PORT}   (admin@fear.dev / admin)`));

// ---- fake Ollama -------------------------------------------------------------
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS' };
const REPLY = "Here's a **safe** pattern:\n\n- Validate input\n- Use `helmet()` and a rate limiter\n\n```js\nconst rateLimit = require('express-rate-limit');\napp.use(rateLimit({ windowMs: 60_000, max: 100 }));\n```\n\nLet me know if you want a *Redis-backed* store.";

http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }
  if (req.url === '/api/tags') return json(res, 200, { models: [{ name: 'code-ai:latest' }, { name: 'chat-ai:latest' }] }, cors);
  if (req.url === '/api/chat') {
    const b = await body(req);
    res.writeHead(200, { 'Content-Type': 'application/x-ndjson', ...cors });
    const parts = REPLY.match(/.{1,6}/gs);
    let i = 0;
    const t = setInterval(() => {
      if (i < parts.length) res.write(JSON.stringify({ model: b.model, message: { role: 'assistant', content: parts[i++] }, done: false }) + '\n');
      else { clearInterval(t); res.end(JSON.stringify({ done: true }) + '\n'); }
    }, 15);
    req.on('close', () => clearInterval(t));
    return;
  }
  json(res, 404, { error: 'not found' }, cors);
}).listen(OLLAMA_PORT, () => console.log(`mock Ollama     http://localhost:${OLLAMA_PORT}`));
