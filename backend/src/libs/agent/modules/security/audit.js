// modules/security/site-audit.js - TLS certificate, HTTP header/redirect and DNS audit
const { spawn } = require('child_process');
const colorizer = require('../utils/colorizer');

// Plain hostnames only: no IPs, ports, paths or shell metacharacters.
const HOST_RE = /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;
const DNS_TYPES = ['A', 'AAAA', 'CNAME', 'NS', 'MX', 'TXT'];
const MAX_OUTPUT = 256 * 1024;

const SECURITY_HEADERS = [
    { name: 'strict-transport-security', label: 'HSTS' },
    { name: 'content-security-policy', label: 'CSP' },
    { name: 'x-frame-options', label: 'X-Frame-Options' },
    { name: 'x-content-type-options', label: 'X-Content-Type-Options' },
    { name: 'referrer-policy', label: 'Referrer-Policy' },
    { name: 'permissions-policy', label: 'Permissions-Policy' }
];
const LEAKY_HEADERS = ['server', 'x-powered-by'];

// Runs a binary with an argument array (no shell), a timeout and a capped output size.
function run(cmd, args, { input = '', timeout = 15000 } = {}) {
    return new Promise((resolve) => {
        let out = '';
        let err = '';
        let timedOut = false;
        let proc;

        try {
            proc = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'pipe'] });
        } catch (e) {
            return resolve({ code: -1, out, err: e.message, timedOut });
        }

        const timer = setTimeout(() => { timedOut = true; proc.kill('SIGKILL'); }, timeout);

        proc.stdout.on('data', (d) => { if (out.length < MAX_OUTPUT) out += d; });
        proc.stderr.on('data', (d) => { if (err.length < MAX_OUTPUT) err += d; });
        proc.stdin.on('error', () => { });
        proc.on('error', (e) => { clearTimeout(timer); resolve({ code: -1, out, err: e.message, timedOut }); });
        proc.on('close', (code) => { clearTimeout(timer); resolve({ code, out, err, timedOut }); });

        proc.stdin.end(input); // closing stdin is what lets `openssl s_client` exit
    });
}

const SiteAudit = function () { };

SiteAudit.prototype = {

    normalizeHost(raw) {
        if (!raw) return null;
        const host = String(raw).trim().replace(/^https?:\/\//i, '').split(/[/?#]/)[0].toLowerCase();
        return HOST_RE.test(host) ? host : null;
    },

    usage(cmd) {
        console.log(colorizer.error(`Usage: ${cmd} <hostname>`));
        console.log(colorizer.info(`Example: ${cmd} example.com`));
        console.log(colorizer.dim('Hostnames only (no IPs, ports or paths).\n'));
    },

    // ---------------------------------------------------------------- certificate

    async getCertificate(host) {
        const sc = await run('openssl', ['s_client', '-connect', `${host}:443`, '-servername', host]);
        if (sc.code === -1) return { error: `openssl unavailable: ${sc.err}` };
        if (sc.timedOut) return { error: 'Connection timed out' };

        const pem = (sc.out.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/) || [])[0];
        if (!pem) return { error: (sc.err || sc.out).trim().split('\n')[0] || 'No certificate returned' };

        const x = await run('openssl', ['x509', '-noout', '-dates', '-subject', '-issuer'], { input: pem });
        if (x.code !== 0) return { error: x.err.trim() || 'Could not parse certificate' };

        const field = (name) => (x.out.match(new RegExp(`^${name}=(.*)$`, 'm')) || [])[1];
        const notBefore = field('notBefore');
        const notAfter = field('notAfter');
        const expires = notAfter ? new Date(notAfter.replace(/\s+/g, ' ')) : null;
        const daysLeft = expires && !isNaN(expires) ? Math.floor((expires - Date.now()) / 86400000) : null;
        const verify = (sc.out.match(/Verify return code: (.*)/) || [])[1] || null;
        const protocol = (sc.out.match(/Protocol\s*:\s*(\S+)/) || sc.out.match(/New, (TLSv[\d.]+)/) || [])[1] || null;

        return {
            subject: field('subject'),
            issuer: field('issuer'),
            notBefore,
            notAfter,
            daysLeft,
            verify,
            protocol
        };
    },

    async auditCert(args) {
        const host = this.normalizeHost(args && args[0]);
        if (!host) return this.usage('audit-cert');
        const result = await this.getCertificate(host);
        this.printCert(host, result);
        return result;
    },

    printCert(host, c) {
        console.log(colorizer.section(`TLS Certificate: ${host}`));
        if (c.error) return console.log(colorizer.error(c.error) + '\n');

        console.log(colorizer.cyan('  Subject:    ') + c.subject);
        console.log(colorizer.cyan('  Issuer:     ') + c.issuer);
        console.log(colorizer.cyan('  Not before: ') + c.notBefore);
        console.log(colorizer.cyan('  Not after:  ') + c.notAfter);
        if (c.protocol) console.log(colorizer.cyan('  Protocol:   ') + c.protocol);

        if (c.daysLeft !== null) {
            const msg = c.daysLeft < 0 ? `EXPIRED ${-c.daysLeft} days ago`
                : `${c.daysLeft} days remaining`;
            const fn = c.daysLeft < 0 ? 'critical' : c.daysLeft < 14 ? 'high' : c.daysLeft < 30 ? 'warning' : 'success';
            console.log(colorizer[fn](msg));
        }
        if (c.verify) {
            const ok = /\(ok\)/i.test(c.verify);
            console.log(colorizer.cyan('  Verify:     ') + (ok ? colorizer.green(c.verify) : colorizer.yellow(c.verify)));
        }
        console.log();
    },

    // -------------------------------------------------------------------- headers

    parseHeaderBlocks(raw) {
        return raw.split(/\r?\n\r?\n/).map((b) => b.trim()).filter(Boolean).map((block) => {
            const lines = block.split(/\r?\n/);
            const headers = {};
            lines.slice(1).forEach((line) => {
                const i = line.indexOf(':');
                if (i > 0) headers[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
            });
            return { status: lines[0], headers };
        });
    },

    async getHeaders(host) {
        // https only for the initial request and for every redirect hop
        const r = await run('curl', [
            '-sS', '-I', '-L', '--max-redirs', '5', '-m', '15',
            '--proto', '=https', '--proto-redir', '=https',
            `https://${host}`
        ], { timeout: 20000 });

        if (r.code === -1) return { error: `curl unavailable: ${r.err}` };
        if (r.timedOut) return { error: 'Request timed out' };
        if (!r.out.trim()) return { error: r.err.trim() || `curl exited with ${r.code}` };

        const hops = this.parseHeaderBlocks(r.out);
        return { hops, final: hops[hops.length - 1], warning: r.code !== 0 ? r.err.trim() : null };
    },

    async auditHeaders(args) {
        const host = this.normalizeHost(args && args[0]);
        if (!host) return this.usage('audit-headers');
        const result = await this.getHeaders(host);
        this.printHeaders(host, result);
        return result;
    },

    printHeaders(host, r) {
        console.log(colorizer.section(`HTTP Headers: ${host}`));
        if (r.error) return console.log(colorizer.error(r.error) + '\n');

        console.log(colorizer.cyan('Redirect chain:'));
        r.hops.forEach((hop, i) => {
            const loc = hop.headers.location ? ` -> ${hop.headers.location}` : '';
            console.log(colorizer.dim(`  ${i + 1}. `) + hop.status + colorizer.dim(loc));
        });
        if (r.warning) console.log(colorizer.warning(r.warning));

        const h = r.final.headers;
        console.log(colorizer.cyan('\nSecurity headers (final response):'));
        SECURITY_HEADERS.forEach(({ name, label }) => {
            console.log(h[name]
                ? `  ${colorizer.green('✓')} ${label}: ${colorizer.dim(h[name].slice(0, 90))}`
                : `  ${colorizer.red('✗')} ${label} missing`);
        });

        const leaks = LEAKY_HEADERS.filter((n) => h[n]);
        if (leaks.length) {
            console.log(colorizer.cyan('\nInformation disclosure:'));
            leaks.forEach((n) => console.log(colorizer.warning(`${n}: ${h[n]}`)));
        }
        console.log();
    },

    // ------------------------------------------------------------------------ DNS

    async getDns(host) {
        const records = {};
        for (const type of DNS_TYPES) {
            const r = await run('dig', ['+noall', '+answer', '+time=3', '+tries=1', host, type], { timeout: 10000 });
            if (r.code === -1) return { error: `dig unavailable: ${r.err}` };
            records[type] = r.out.split('\n').map((l) => l.trim()).filter(Boolean);
        }
        return { records };
    },

    async auditDns(args) {
        const host = this.normalizeHost(args && args[0]);
        if (!host) return this.usage('audit-dns');
        const result = await this.getDns(host);
        this.printDns(host, result);
        return result;
    },

    printDns(host, r) {
        console.log(colorizer.section(`DNS: ${host}`));
        if (r.error) return console.log(colorizer.error(r.error) + '\n');

        DNS_TYPES.forEach((type) => {
            const rows = r.records[type];
            console.log(colorizer.cyan(`  ${type}`) + colorizer.dim(rows.length ? '' : '  (none)'));
            rows.forEach((row) => console.log(colorizer.dim('    ') + row));
        });
        console.log();
    },

    // ------------------------------------------------------------------ all-in-one

    async audit(args) {
        const host = this.normalizeHost(args && args[0]);
        if (!host) return this.usage('site-audit');

        console.log(colorizer.header(`Site Audit: ${host}`));
        console.log(colorizer.separator());

        const [cert, headers, dns] = await Promise.all([
            this.getCertificate(host),
            this.getHeaders(host),
            this.getDns(host)
        ]);

        this.printDns(host, dns);
        this.printCert(host, cert);
        this.printHeaders(host, headers);

        return { host, cert, headers, dns };
    }
};

module.exports = SiteAudit;