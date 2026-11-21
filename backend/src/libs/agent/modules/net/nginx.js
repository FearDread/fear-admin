// modules/net/nginx.js - Nginx vhost + DNS tracking and monitoring
//
// Parses the nginx config tree, then checks every vhost's DNS records, HTTP/HTTPS
// response and TLS certificate. Snapshots are saved so changes can be diffed over
// time, and a background monitor can run the checks on an interval.
//
// Env (all optional):
//   NGINX_CONF_DIR       nginx config root            (default /etc/nginx)
//   NGINX_BIN            nginx binary                 (default nginx)
//   NGINX_DNS_SERVERS    comma list of resolvers      (default system resolvers)
//   NGINX_MONITOR_DIR    where snapshots are stored   (default ./monitor-data)
//   NGINX_CERT_WARN_DAYS cert expiry warning window   (default 14)

const fs = require('fs').promises;
const path = require('path');
const dns = require('dns').promises;
const tls = require('tls');
const http = require('http');
const https = require('https');
const { execFile } = require('child_process');
const colorizer = require('../utils/colorizer');

const DOMAIN_RE = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;
const MAX_HISTORY = 200;
const MAX_EVENTS = 200;

const NginxMonitor = function(agent) {
    this.agent = agent;
    this.confDir = process.env.NGINX_CONF_DIR || '/etc/nginx';
    this.nginxBin = process.env.NGINX_BIN || 'nginx';
    this.dataDir = process.env.NGINX_MONITOR_DIR || path.join(process.cwd(), 'monitor-data');
    this.certWarnDays = parseInt(process.env.NGINX_CERT_WARN_DAYS, 10) || 14;
    this.timeout = 6000;
    this.concurrency = 4;

    this.resolver = new dns.Resolver({ timeout: 3000, tries: 2 });
    if (process.env.NGINX_DNS_SERVERS) {
        this.resolver.setServers(process.env.NGINX_DNS_SERVERS.split(',').map(s => s.trim()).filter(Boolean));
    }

    this.timer = null;
    this.intervalMs = 300000;
    this.lastRun = null;
    this.lastSnapshot = null;
    this.events = [];
    this.running = false;

    // Shows up in GET /agent/status and is stopped by the controller's shutdown().
    if (agent && typeof agent.registerService === 'function') {
        agent.registerService('nginx-monitor', {
            start: () => this.startTimer(),
            stop: () => this.stopTimer()
        });
    }
};

NginxMonitor.prototype = {

    // ───────────────────────── nginx config parsing ─────────────────────────

    tokenize(text) {
        const tokens = [];
        let i = 0;
        while (i < text.length) {
            const c = text[i];
            if (/\s/.test(c)) { i++; continue; }
            if (c === '#') { while (i < text.length && text[i] !== '\n') i++; continue; }
            if (c === ';' || c === '{' || c === '}') { tokens.push(c); i++; continue; }
            if (c === '"' || c === "'") {
                let j = i + 1, s = '';
                while (j < text.length && text[j] !== c) {
                    if (text[j] === '\\') { s += text[j + 1] || ''; j += 2; continue; }
                    s += text[j++];
                }
                tokens.push({ word: s });
                i = j + 1;
                continue;
            }
            let j = i;
            while (j < text.length && !/[\s;{}]/.test(text[j])) j++;
            tokens.push({ word: text.slice(i, j) });
            i = j;
        }
        return tokens;
    },

    parse(tokens) {
        let pos = 0;
        const block = () => {
            const nodes = [];
            while (pos < tokens.length) {
                if (tokens[pos] === '}') { pos++; return nodes; }
                const words = [];
                while (pos < tokens.length && typeof tokens[pos] === 'object') words.push(tokens[pos++].word);
                const end = tokens[pos++];
                if (words.length === 0) continue;
                const [name, ...args] = words;
                nodes.push({ name, args, children: end === '{' ? block() : null });
            }
            return nodes;
        };
        return block();
    },

    async globFiles(pattern) {
        const full = path.isAbsolute(pattern) ? pattern : path.join(this.confDir, pattern);
        if (!full.includes('*')) {
            try { await fs.access(full); return [full]; } catch (e) { return []; }
        }
        const dir = path.dirname(full);
        const re = new RegExp('^' + path.basename(full).replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
        try {
            return (await fs.readdir(dir)).filter(f => re.test(f)).sort().map(f => path.join(dir, f));
        } catch (e) {
            return [];
        }
    },

    // Inlines `include` directives and tags every node with the file it came from.
    async expand(nodes, file, depth = 0) {
        const out = [];
        for (const n of nodes) {
            if (n.name === 'include' && n.args[0]) {
                if (depth >= 8) continue;
                for (const f of await this.globFiles(n.args[0])) {
                    try {
                        const inc = this.parse(this.tokenize(await fs.readFile(f, 'utf8')));
                        out.push(...await this.expand(inc, f, depth + 1));
                    } catch (e) { /* unreadable include, skip */ }
                }
                continue;
            }
            n.file = file;
            if (n.children) n.children = await this.expand(n.children, file, depth);
            out.push(n);
        }
        return out;
    },

    async loadConfig() {
        const main = path.join(this.confDir, 'nginx.conf');
        const text = await fs.readFile(main, 'utf8');
        return this.expand(this.parse(this.tokenize(text)), main);
    },

    collect(nodes, servers = [], upstreams = {}) {
        for (const n of nodes) {
            if (n.name === 'server' && n.children) servers.push(this.summarize(n));
            else if (n.name === 'upstream' && n.children) {
                upstreams[n.args[0]] = n.children.filter(c => c.name === 'server').map(c => c.args[0]);
            } else if (n.children) this.collect(n.children, servers, upstreams);
        }
        return { servers, upstreams };
    },

    summarize(server) {
        const dirs = (name) => server.children.filter(c => c.name === name);
        const listens = dirs('listen').map(d => d.args.join(' '));
        const proxies = [];
        const walk = (nodes, loc) => {
            for (const n of nodes) {
                if (n.name === 'proxy_pass' || n.name === 'fastcgi_pass' || n.name === 'grpc_pass') {
                    proxies.push({ location: loc, target: n.args[0] });
                }
                if (n.children) walk(n.children, n.name === 'location' ? n.args.join(' ') : loc);
            }
        };
        walk(server.children, '/');

        const ret = dirs('return')[0];
        const names = dirs('server_name').flatMap(d => d.args);
        const ssl = listens.some(l => /\b(443|ssl)\b/.test(l)) || dirs('ssl_certificate').length > 0;

        return {
            names,
            listens,
            ssl,
            defaultServer: listens.some(l => /default_server/.test(l)),
            cert: (dirs('ssl_certificate')[0] || {}).args ? dirs('ssl_certificate')[0].args[0] : null,
            root: (dirs('root')[0] || {}).args ? dirs('root')[0].args[0] : null,
            redirect: ret && /^30\d$/.test(ret.args[0]) ? ret.args.slice(1).join(' ') : null,
            proxies,
            file: server.file
        };
    },

    // Only real, resolvable hostnames: drops regex (~), wildcard, catch-all and "_" names.
    monitorable(server) {
        return server.names.filter(n => DOMAIN_RE.test(n));
    },

    async getVhosts() {
        const tree = await this.loadConfig();
        return this.collect(tree);
    },

    // ───────────────────────────── network checks ───────────────────────────

    async resolveAll(host) {
        const r = this.resolver;
        const q = (fn) => fn.call(r, host).catch(() => []);
        const [A, AAAA, CNAME, MX, NS, TXT] = await Promise.all([
            q(r.resolve4), q(r.resolve6), q(r.resolveCname), q(r.resolveMx), q(r.resolveNs), q(r.resolveTxt)
        ]);
        return {
            A: A.sort(),
            AAAA: AAAA.sort(),
            CNAME,
            MX: MX.sort((a, b) => a.priority - b.priority).map(m => `${m.priority} ${m.exchange}`),
            NS: NS.sort(),
            TXT: TXT.map(t => t.join(''))
        };
    },

    getPublicIp() {
        return new Promise((resolve) => {
            const req = https.get('https://api.ipify.org', { timeout: 5000 }, (res) => {
                let data = '';
                res.on('data', c => { data += c; });
                res.on('end', () => resolve(/^[\d.]+$/.test(data.trim()) ? data.trim() : null));
            });
            req.on('timeout', () => req.destroy());
            req.on('error', () => resolve(null));
        });
    },

    // local=true connects to 127.0.0.1 with a Host header, so you can test the vhost
    // itself even when DNS is wrong or points through a tunnel/CDN.
    probe(host, secure, local) {
        return new Promise((resolve) => {
            const start = Date.now();
            const opts = {
                method: 'HEAD',
                path: '/',
                port: secure ? 443 : 80,
                timeout: this.timeout,
                headers: { 'User-Agent': 'FEAR-NginxMonitor/1.0' }
            };
            if (local) {
                opts.hostname = '127.0.0.1';
                opts.headers.Host = host;
                if (secure) { opts.servername = host; opts.rejectUnauthorized = false; }
            } else {
                opts.hostname = host;
            }

            const req = (secure ? https : http).request(opts, (res) => {
                res.resume();
                resolve({ ok: true, status: res.statusCode, ms: Date.now() - start, location: res.headers.location || null });
            });
            req.on('timeout', () => req.destroy(new Error('timeout')));
            req.on('error', (e) => resolve({ ok: false, error: e.code || e.message, ms: Date.now() - start }));
            req.end();
        });
    },

    certInfo(host, local) {
        return new Promise((resolve) => {
            const sock = tls.connect({
                host: local ? '127.0.0.1' : host,
                port: 443,
                servername: host,
                rejectUnauthorized: false,
                timeout: this.timeout
            }, () => {
                const c = sock.getPeerCertificate();
                const authorized = sock.authorized;
                const authError = sock.authorizationError || null;
                sock.end();
                if (!c || !c.valid_to) return resolve({ ok: false, error: 'no certificate' });
                const validTo = new Date(c.valid_to);
                resolve({
                    ok: true,
                    validTo: validTo.toISOString(),
                    daysLeft: Math.floor((validTo.getTime() - Date.now()) / 86400000),
                    issuer: c.issuer ? (c.issuer.O || c.issuer.CN) : null,
                    authorized,
                    authError
                });
            });
            sock.on('timeout', () => { sock.destroy(); resolve({ ok: false, error: 'timeout' }); });
            sock.on('error', (e) => resolve({ ok: false, error: e.code || e.message }));
        });
    },

    async checkHost(host, vhost, opts = {}) {
        const local = !!opts.local;
        const wantsSsl = vhost ? vhost.ssl : true;
        const [dnsRes, httpRes, httpsRes, cert] = await Promise.all([
            this.resolveAll(host),
            this.probe(host, false, local),
            wantsSsl ? this.probe(host, true, local) : Promise.resolve(null),
            wantsSsl ? this.certInfo(host, local) : Promise.resolve(null)
        ]);
        return { host, dns: dnsRes, http: httpRes, https: httpsRes, cert };
    },

    async pool(items, worker) {
        const results = new Array(items.length);
        let next = 0;
        const runners = Array.from({ length: Math.min(this.concurrency, items.length) }, async () => {
            while (next < items.length) {
                const i = next++;
                results[i] = await worker(items[i], i);
            }
        });
        await Promise.all(runners);
        return results;
    },

    // ─────────────────────── snapshots, diffing, events ─────────────────────

    async runChecks(opts = {}) {
        const { servers } = await this.getVhosts();
        const publicIp = await this.getPublicIp();

        const targets = [];
        const seen = new Set();
        servers.forEach(s => this.monitorable(s).forEach(n => {
            if (!seen.has(n)) { seen.add(n); targets.push({ host: n, vhost: s }); }
        }));

        const results = await this.pool(targets, t => this.checkHost(t.host, t.vhost, opts));

        const hosts = {};
        results.forEach((r, i) => {
            hosts[r.host] = {
                dns: r.dns,
                http: r.http,
                https: r.https,
                cert: r.cert,
                ssl: targets[i].vhost.ssl,
                upstream: targets[i].vhost.proxies.map(p => p.target)
            };
        });

        const snapshot = { time: new Date().toISOString(), publicIp, hosts };
        const previous = this.lastSnapshot || (await this.loadHistory()).slice(-1)[0] || null;
        const events = this.diff(previous, snapshot);

        this.lastSnapshot = snapshot;
        this.lastRun = snapshot.time;
        this.pushEvents(events);
        await this.saveSnapshot(snapshot);
        return { snapshot, events, previous };
    },

    healthy(h) {
        const httpOk = h.http && h.http.ok && h.http.status < 500;
        const httpsOk = !h.https || (h.https.ok && h.https.status < 500);
        return !!(httpOk && httpsOk);
    },

    diff(prev, cur) {
        const events = [];
        const now = cur.time;
        const add = (level, host, msg) => events.push({ time: now, level, host, msg });

        if (prev && prev.publicIp && cur.publicIp && prev.publicIp !== cur.publicIp) {
            add('warn', '*', `Server public IP changed ${prev.publicIp} -> ${cur.publicIp}`);
        }

        for (const [host, h] of Object.entries(cur.hosts)) {
            const p = prev && prev.hosts ? prev.hosts[host] : null;

            if (!p && prev) add('info', host, 'New vhost detected');
            if (h.dns.A.length === 0 && h.dns.AAAA.length === 0 && h.dns.CNAME.length === 0) {
                add('error', host, 'No DNS records resolve for this vhost');
            }
            if (p) {
                if (p.dns.A.join() !== h.dns.A.join()) add('warn', host, `A record changed [${p.dns.A}] -> [${h.dns.A}]`);
                if (p.dns.NS.join() !== h.dns.NS.join() && p.dns.NS.length) add('warn', host, `NS changed [${p.dns.NS}] -> [${h.dns.NS}]`);
                if (this.healthy(p) && !this.healthy(h)) add('error', host, 'Went DOWN');
                if (!this.healthy(p) && this.healthy(h)) add('info', host, 'Recovered');
            } else if (!this.healthy(h)) {
                add('error', host, 'Unhealthy');
            }

            if (h.cert && h.cert.ok) {
                if (h.cert.daysLeft < 0) add('error', host, `Certificate EXPIRED ${-h.cert.daysLeft}d ago`);
                else if (h.cert.daysLeft <= this.certWarnDays) add('warn', host, `Certificate expires in ${h.cert.daysLeft}d`);
                if (!h.cert.authorized) add('warn', host, `Certificate not trusted: ${h.cert.authError}`);
            } else if (h.cert && !h.cert.ok) {
                add('error', host, `TLS check failed: ${h.cert.error}`);
            }
        }

        if (prev) {
            for (const host of Object.keys(prev.hosts)) {
                if (!cur.hosts[host]) add('info', host, 'Vhost removed from nginx config');
            }
        }
        return events;
    },

    pushEvents(events) {
        this.events.push(...events);
        if (this.events.length > MAX_EVENTS) this.events.splice(0, this.events.length - MAX_EVENTS);
    },

    async loadHistory() {
        try {
            return JSON.parse(await fs.readFile(path.join(this.dataDir, 'nginx-snapshots.json'), 'utf8'));
        } catch (e) {
            return [];
        }
    },

    async saveSnapshot(snapshot) {
        try {
            await fs.mkdir(this.dataDir, { recursive: true });
            const history = await this.loadHistory();
            history.push(snapshot);
            await fs.writeFile(path.join(this.dataDir, 'nginx-snapshots.json'),
                JSON.stringify(history.slice(-MAX_HISTORY), null, 2));
        } catch (e) { /* persistence is best-effort */ }
    },

    // JSON-friendly accessor if you later want a dedicated route instead of captured console output.
    getSnapshot() {
        return { lastRun: this.lastRun, snapshot: this.lastSnapshot, events: this.events, monitoring: !!this.timer };
    },

    // ───────────────────────────── background timer ─────────────────────────
    // No console output in here: the controller swaps console.log while a command
    // runs, so timer logging could leak into an unrelated response.

    startTimer(ms) {
        if (this.timer) return;
        if (ms) this.intervalMs = ms;
        const tick = () => {
            if (this.running) return;
            this.running = true;
            this.runChecks()
                .catch(err => this.pushEvents([{ time: new Date().toISOString(), level: 'error', host: '*', msg: `Monitor run failed: ${err.message}` }]))
                .then(() => { this.running = false; });
        };
        tick();
        this.timer = setInterval(tick, this.intervalMs);
        if (typeof this.timer.unref === 'function') this.timer.unref();
    },

    stopTimer() {
        if (this.timer) clearInterval(this.timer);
        this.timer = null;
    },

    // ───────────────────────────── commands ─────────────────────────────────

    async listVhosts() {
        console.log(colorizer.header('Nginx Virtual Hosts'));
        console.log(colorizer.separator());
        try {
            const { servers, upstreams } = await this.getVhosts();
            if (servers.length === 0) {
                console.log(colorizer.warning('No server blocks found in ' + this.confDir + '\n'));
                return;
            }
            console.log(colorizer.cyan('Config: ') + this.confDir + colorizer.dim('  (' + servers.length + ' server blocks)\n'));

            servers.forEach(s => {
                const tag = s.ssl ? colorizer.green('[SSL]') : colorizer.dim('[HTTP]');
                console.log(tag + ' ' + colorizer.bright(s.names.join(' ') || '(no server_name)') + (s.defaultServer ? colorizer.yellow(' [default]') : ''));
                console.log(colorizer.dim('   listen: ' + (s.listens.join(', ') || 'n/a')));
                if (s.redirect) console.log(colorizer.dim('   redirect -> ' + s.redirect));
                if (s.root) console.log(colorizer.dim('   root: ' + s.root));
                s.proxies.forEach(p => console.log(colorizer.dim('   ' + p.location + ' -> ' + p.target)));
                if (s.cert) console.log(colorizer.dim('   cert: ' + s.cert));
                console.log(colorizer.dim('   file: ' + s.file));
            });

            const ups = Object.keys(upstreams);
            if (ups.length) {
                console.log(colorizer.section('Upstreams'));
                ups.forEach(u => console.log(colorizer.bullet(u + ' -> ' + upstreams[u].join(', '))));
            }
            console.log();
        } catch (err) {
            console.log(colorizer.error('Could not read nginx config: ' + err.message));
            console.log(colorizer.info('Set NGINX_CONF_DIR if nginx.conf is not in ' + this.confDir + '\n'));
        }
    },

    async checkVhost(args) {
        const host = args[0];
        const local = args.includes('--local');
        if (!host || !DOMAIN_RE.test(host)) {
            console.log(colorizer.error('Usage: nginx-check <domain> [--local]'));
            console.log(colorizer.dim('  --local  test the vhost via 127.0.0.1 with a Host header (bypasses DNS)\n'));
            return;
        }

        console.log(colorizer.header('Vhost Check: ' + host));
        console.log(colorizer.separator());

        let vhost = null;
        try {
            const { servers } = await this.getVhosts();
            vhost = servers.find(s => s.names.includes(host)) || null;
        } catch (e) { /* nginx config unreadable, still check the domain */ }
        if (!vhost) console.log(colorizer.warning('Not found in nginx config, checking as a plain domain'));

        const r = await this.checkHost(host, vhost, { local });
        this.printHost(r);
    },

    printHost(r) {
        console.log(colorizer.section('DNS'));
        ['A', 'AAAA', 'CNAME', 'NS', 'MX', 'TXT'].forEach(t => {
            const v = r.dns[t];
            console.log(colorizer.cyan('  ' + t.padEnd(6)) + (v.length ? v.join(', ').slice(0, 120) : colorizer.dim('-')));
        });

        const line = (label, p) => {
            if (!p) return;
            const ok = p.ok && p.status < 500;
            const status = p.ok ? String(p.status) + (p.location ? ' -> ' + p.location : '') : p.error;
            console.log(colorizer.cyan('  ' + label.padEnd(6)) + (ok ? colorizer.green(status) : colorizer.red(status)) + colorizer.dim('  ' + p.ms + 'ms'));
        };
        console.log(colorizer.section('HTTP'));
        line('http', r.http);
        line('https', r.https);

        if (r.cert) {
            console.log(colorizer.section('Certificate'));
            if (!r.cert.ok) console.log(colorizer.red('  ' + r.cert.error));
            else {
                const c = r.cert;
                const days = c.daysLeft < 0 ? colorizer.red(c.daysLeft + 'd (EXPIRED)')
                    : c.daysLeft <= this.certWarnDays ? colorizer.yellow(c.daysLeft + 'd') : colorizer.green(c.daysLeft + 'd');
                console.log(colorizer.cyan('  Expires ') + c.validTo.slice(0, 10) + '  ' + days);
                console.log(colorizer.cyan('  Issuer  ') + (c.issuer || 'unknown'));
                console.log(colorizer.cyan('  Trusted ') + (c.authorized ? colorizer.green('yes') : colorizer.yellow('no: ' + c.authError)));
            }
        }
        console.log();
    },

    async checkAll(args) {
        const local = args.includes('--local');
        console.log(colorizer.header('Nginx Vhost Health'));
        console.log(colorizer.separator());
        console.log(colorizer.dim('Checking all vhosts, this can take a few seconds...\n'));

        try {
            const { snapshot, events } = await this.runChecks({ local });
            console.log(colorizer.cyan('Server public IP: ') + (snapshot.publicIp || colorizer.dim('unknown')) + '\n');

            const hosts = Object.entries(snapshot.hosts);
            hosts.forEach(([host, h]) => {
                const up = this.healthy(h);
                const st = (p) => (p ? (p.ok ? p.status : p.error) : '-');
                const cert = h.cert && h.cert.ok ? h.cert.daysLeft + 'd' : '-';
                console.log((up ? colorizer.green('UP  ') : colorizer.red('DOWN')) + ' ' + host.padEnd(34) +
                    colorizer.dim(('http:' + st(h.http)).padEnd(14) + ('https:' + st(h.https)).padEnd(16) +
                        ('cert:' + cert).padEnd(11) + 'A:' + (h.dns.A.join(',') || '-')));
            });

            const down = hosts.filter(([, h]) => !this.healthy(h)).length;
            console.log('\n' + colorizer.cyan('Total: ') + hosts.length + '  ' + colorizer.green('Up: ' + (hosts.length - down)) + '  ' + colorizer.red('Down: ' + down));

            this.printEvents(events, 'Changes / Alerts');
        } catch (err) {
            console.log(colorizer.error('Check failed: ' + err.message + '\n'));
        }
    },

    printEvents(events, title) {
        if (!events.length) {
            console.log(colorizer.dim('\nNo changes or alerts.\n'));
            return;
        }
        console.log(colorizer.section(title));
        events.forEach(e => {
            const fn = e.level === 'error' ? colorizer.red : e.level === 'warn' ? colorizer.yellow : colorizer.cyan;
            console.log(fn('  [' + e.level.toUpperCase() + '] ') + e.host + ': ' + e.msg + colorizer.dim('  ' + e.time.slice(0, 19).replace('T', ' ')));
        });
        console.log();
    },

    async dnsLookup(args) {
        const host = args[0];
        if (!host || !DOMAIN_RE.test(host)) {
            console.log(colorizer.error('Usage: dns-lookup <domain>\n'));
            return;
        }
        console.log(colorizer.header('DNS Lookup: ' + host));
        console.log(colorizer.separator());
        const d = await this.resolveAll(host);
        Object.entries(d).forEach(([t, v]) => {
            console.log(colorizer.cyan(t.padEnd(7)) + (v.length ? v.join('\n       ') : colorizer.dim('-')));
        });
        console.log();
    },

    // Compares each vhost's A records with this server's public IP. A mismatch is not
    // always a problem (Cloudflare proxy / tunnel), so it is reported, not failed.
    async dnsCheck() {
        console.log(colorizer.header('DNS vs Server IP'));
        console.log(colorizer.separator());
        try {
            const [{ servers }, publicIp] = await Promise.all([this.getVhosts(), this.getPublicIp()]);
            console.log(colorizer.cyan('Server public IP: ') + (publicIp || colorizer.dim('unknown')) + '\n');

            const names = [...new Set(servers.flatMap(s => this.monitorable(s)))];
            const rows = await this.pool(names, async n => ({ n, d: await this.resolveAll(n) }));

            rows.forEach(({ n, d }) => {
                if (d.A.length === 0 && d.CNAME.length === 0) {
                    console.log(colorizer.red('NONE    ') + n);
                } else if (publicIp && d.A.includes(publicIp)) {
                    console.log(colorizer.green('MATCH   ') + n.padEnd(34) + colorizer.dim(d.A.join(', ')));
                } else {
                    console.log(colorizer.yellow('DIFFERS ') + n.padEnd(34) + colorizer.dim(d.A.join(', ') + '  (proxied / tunnel / stale?)'));
                }
            });
            console.log();
        } catch (err) {
            console.log(colorizer.error('DNS check failed: ' + err.message + '\n'));
        }
    },

    async certStatus() {
        console.log(colorizer.header('Certificate Expiry'));
        console.log(colorizer.separator());
        try {
            const { servers } = await this.getVhosts();
            const names = [...new Set(servers.filter(s => s.ssl).flatMap(s => this.monitorable(s)))];
            const rows = (await this.pool(names, async n => ({ n, c: await this.certInfo(n, false) })))
                .sort((a, b) => (a.c.daysLeft ?? -1e9) - (b.c.daysLeft ?? -1e9));

            rows.forEach(({ n, c }) => {
                if (!c.ok) return console.log(colorizer.red('FAIL    ') + n.padEnd(34) + colorizer.dim(c.error));
                const fn = c.daysLeft < 0 ? colorizer.red : c.daysLeft <= this.certWarnDays ? colorizer.yellow : colorizer.green;
                console.log(fn((c.daysLeft + 'd').padEnd(8)) + n.padEnd(34) + colorizer.dim(c.validTo.slice(0, 10) + '  ' + (c.issuer || '')));
            });
            console.log();
        } catch (err) {
            console.log(colorizer.error('Certificate check failed: ' + err.message + '\n'));
        }
    },

    // Same as testConfig but returns data instead of printing (used by routes/nginx.js).
    configTest() {
        return new Promise((resolve) => {
            execFile(this.nginxBin, ['-t', '-c', path.join(this.confDir, 'nginx.conf')], { timeout: 10000 }, (err, stdout, stderr) => {
                resolve({ ok: !err, output: (stdout + stderr).trim() || (err ? err.message : '') });
            });
        });
    },

    // Runs `nginx -t`. execFile with fixed args, no shell.
    testConfig() {
        console.log(colorizer.header('nginx -t'));
        console.log(colorizer.separator());
        return new Promise((resolve) => {
            execFile(this.nginxBin, ['-t', '-c', path.join(this.confDir, 'nginx.conf')], { timeout: 10000 }, (err, stdout, stderr) => {
                const out = (stdout + stderr).trim();
                console.log(err ? colorizer.red(out || err.message) : colorizer.green(out));
                console.log(err ? colorizer.error('Config test FAILED\n') : colorizer.success('Config OK\n'));
                resolve();
            });
        });
    },

    monitorStart(args) {
        const secs = parseInt(args[0], 10);
        if (this.timer) {
            console.log(colorizer.warning('Monitor already running\n'));
            return Promise.resolve();
        }
        if (args[0] && (isNaN(secs) || secs < 30)) {
            console.log(colorizer.error('Interval must be at least 30 seconds\n'));
            return Promise.resolve();
        }
        this.startTimer(secs ? secs * 1000 : undefined);
        if (this.agent && this.agent.serviceStatus) this.agent.serviceStatus.set('nginx-monitor', 'running');
        console.log(colorizer.success('Nginx monitor started, interval ' + Math.round(this.intervalMs / 1000) + 's'));
        console.log(colorizer.dim('  Use nginx-events to see alerts, nginx-monitor-status for state\n'));
        return Promise.resolve();
    },

    monitorStop() {
        if (!this.timer) {
            console.log(colorizer.warning('Monitor is not running\n'));
            return Promise.resolve();
        }
        this.stopTimer();
        if (this.agent && this.agent.serviceStatus) this.agent.serviceStatus.set('nginx-monitor', 'stopped');
        console.log(colorizer.success('Nginx monitor stopped\n'));
        return Promise.resolve();
    },

    monitorStatus() {
        console.log(colorizer.header('Nginx Monitor'));
        console.log(colorizer.separator());
        console.log(colorizer.cyan('Status:   ') + (this.timer ? colorizer.green('running') : colorizer.dim('stopped')));
        console.log(colorizer.cyan('Interval: ') + Math.round(this.intervalMs / 1000) + 's');
        console.log(colorizer.cyan('Last run: ') + (this.lastRun || 'never'));
        console.log(colorizer.cyan('Hosts:    ') + (this.lastSnapshot ? Object.keys(this.lastSnapshot.hosts).length : 0));
        console.log(colorizer.cyan('Events:   ') + this.events.length + '\n');
        return Promise.resolve();
    },

    showEvents(args) {
        const limit = parseInt(args[0], 10) || 30;
        console.log(colorizer.header('Monitor Events'));
        console.log(colorizer.separator());
        this.printEvents(this.events.slice(-limit), 'Last ' + Math.min(limit, this.events.length));
        return Promise.resolve();
    },

    // Shows how a host's DNS / health changed across saved snapshots.
    async history(args) {
        const host = args[0];
        if (!host) {
            console.log(colorizer.error('Usage: nginx-history <domain>\n'));
            return;
        }
        const hist = await this.loadHistory();
        const rows = hist.filter(s => s.hosts[host]);
        console.log(colorizer.header('History: ' + host));
        console.log(colorizer.separator());
        if (!rows.length) {
            console.log(colorizer.warning('No snapshots for this host yet. Run nginx-check-all first.\n'));
            return;
        }
        let lastA = null;
        rows.slice(-20).forEach(s => {
            const h = s.hosts[host];
            const a = h.dns.A.join(',') || '-';
            const changed = lastA !== null && a !== lastA ? colorizer.yellow(' (A changed)') : '';
            lastA = a;
            console.log(colorizer.dim(s.time.slice(0, 19).replace('T', ' ')) + '  ' +
                (this.healthy(h) ? colorizer.green('UP  ') : colorizer.red('DOWN')) + '  A:' + a + changed);
        });
        console.log();
    },

    async exportReport(args) {
        const filename = args[0] || 'nginx-report-' + Date.now() + '.json';
        try {
            const { servers, upstreams } = await this.getVhosts();
            const report = {
                generated: new Date().toISOString(),
                vhosts: servers,
                upstreams,
                lastSnapshot: this.lastSnapshot || (await this.loadHistory()).slice(-1)[0] || null,
                events: this.events
            };
            await fs.writeFile(filename, JSON.stringify(report, null, 2));
            console.log(colorizer.success('Report exported to: ' + filename + '\n'));
        } catch (err) {
            console.log(colorizer.error('Export failed: ' + err.message + '\n'));
        }
    },

    showHelp() {
        console.log(colorizer.section('Nginx Monitor - Help'));
        [
            ['nginx-vhosts', 'List parsed server blocks, upstreams, certs'],
            ['nginx-check <domain> [--local]', 'DNS + HTTP/HTTPS + cert for one vhost'],
            ['nginx-check-all [--local]', 'Check every vhost, save snapshot, show changes'],
            ['dns-lookup <domain>', 'A / AAAA / CNAME / NS / MX / TXT'],
            ['dns-check', 'Compare vhost DNS with this server\'s public IP'],
            ['cert-status', 'TLS expiry for all SSL vhosts'],
            ['nginx-test', 'Run nginx -t'],
            ['nginx-monitor-start [seconds]', 'Background monitor (default 300s)'],
            ['nginx-monitor-stop', 'Stop background monitor'],
            ['nginx-monitor-status', 'Monitor state'],
            ['nginx-events [n]', 'Recent alerts and changes'],
            ['nginx-history <domain>', 'DNS / health history from snapshots'],
            ['nginx-export [file]', 'Export vhosts + latest snapshot as JSON']
        ].forEach(([c, d]) => console.log(colorizer.bullet(c.padEnd(34) + colorizer.dim(d))));
        console.log();
        return Promise.resolve();
    }
};

module.exports = NginxMonitor;