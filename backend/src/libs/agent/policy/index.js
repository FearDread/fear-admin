'use strict';

/**
 * What the HTTP API may run. Default deny: a command only works over HTTP if it is listed in POLICY
 * with a validator for its arguments. The interactive CLI (SecurityAgent.start) is unaffected.
 *
 * Deliberately NOT listed (add one only together with a validator that pins down its arguments):
 *   - reads or writes files from a caller-supplied path: ls cd pwd cat less find file-info tree bookmark,
 *     analyze-code/-project, ai-analyze/-batch/-compare/-improve (these also send the file to an LLM),
 *     scan-deps, check-deps, security-audit, refactor-*, *-to-react, batch-convert, every export-* / save-*
 *     command, chat-save/-load/-export, card-security-report
 *   - probes arbitrary hosts from this server: scan-ports, scrape*, analyze-headers, vuln-assess,
 *     test-endpoint/-collection, the dork generators, fetch-proxies, test-proxy, check-ip
 *   - controls the host or the process: exit (process.exit), clear, chat (takes over stdin),
 *     monitor-traffic (tcpdump), network-info
 *   - takes secrets in the request: ai-setup, configure-*
 *   - tests card numbers: check-card-*, validate-*, analyze-bin
 */

const MAX_ARGS = 8;
const MAX_ARG_LENGTH = 2000;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

/* ----- argument checks: each returns an error message, or null when the args are fine ----- */

const none = (args) => (args.length ? 'This command takes no arguments' : null);

const freeText = (maxLength) => (args) => {
    const text = args.join(' ').trim();
    if (!text) return 'This command needs some text';
    if (text.length > maxLength) return `Text is too long (max ${maxLength} characters)`;
    return null;
};

const arg = (re, optional = false) => ({ re, optional });

const positional = (...specs) => (args) => {
    const required = specs.filter((spec) => !spec.optional).length;
    if (args.length < required) return `Expected at least ${required} argument(s)`;
    if (args.length > specs.length) return `Expected at most ${specs.length} argument(s)`;
    for (let i = 0; i < args.length; i++) {
        if (!specs[i].re.test(args[i])) return `Argument ${i + 1} is not valid`;
    }
    return null;
};

const SYMBOL = /^[A-Za-z]{2,10}$/;
const FIAT = /^[A-Za-z]{3}$/;
const AMOUNT = /^\d{1,12}(\.\d{1,8})?$/;
const SERVICE_ID = /^[a-z0-9-]{1,32}$/;
const PACKAGE = /^(@[\w.-]+\/)?[\w.-]{1,100}$/;
const VERSION = /^[\w.^~<>=*-]{1,40}$/;
const PROVIDER = /^(anthropic|claude|openai|gpt|google|gemini|ollama)$/i;

const POLICY = {
    // Print-only
    help: none,
    status: none,
    version: none,
    tips: none,
    banner: none,
    history: none,

    // AI. These call the configured provider, so they cost money (hence admin only)
    'ai-status': none,
    'ai-help': none,
    'ai-provider': positional(arg(PROVIDER)),
    'ai-explain': freeText(500),
    'ai-threat': freeText(1000),
    'ai-ask': freeText(2000),
    'ai-generate': freeText(1000),
    'chat-quick': freeText(2000),
    'chat-history': none,
    'chat-clear': none,

    // CVE lookups (fixed upstream host, the query is URL-encoded)
    'search-cve': freeText(100),
    'check-cwe': positional(arg(/^(CWE-)?\d{1,5}$/i)),
    'check-package': positional(arg(PACKAGE), arg(VERSION, true)),

    // Crypto prices (fixed upstream hosts, symbols checked against the module's own list)
    'crypto-price': positional(arg(SYMBOL), arg(FIAT, true)),
    'compare-rates': positional(arg(SYMBOL), arg(FIAT)),
    'crypto-convert': positional(arg(AMOUNT), arg(SYMBOL), arg(SYMBOL)),
    'track-portfolio': (args) =>
        args.length > 10 ? 'At most 10 symbols' : args.every((a) => SYMBOL.test(a)) ? null : 'Symbols must be letters only',
    'market-summary': none,
    'crypto-help': none,

    // Background services
    'service-list': none,
    'service-status': positional(arg(SERVICE_ID, true)),
    'service-start': positional(arg(SERVICE_ID)),
    'service-stop': positional(arg(SERVICE_ID)),
    'service-restart': positional(arg(SERVICE_ID)),
    'service-logs': positional(arg(SERVICE_ID), arg(/^\d{1,3}$/, true)),

    // Proxies: read-only
    'proxy-status': none,
    'list-proxies': none,
    'proxy-help': none,
};

/* ----- lookups ----- */

// hasOwnProperty, so 'constructor', '__proto__' and friends never count as commands
const isAllowed = (command) =>
    typeof command === 'string' && Object.prototype.hasOwnProperty.call(POLICY, command);

const list = () => Object.keys(POLICY);

/** Turns the request's `args` into a clean array of strings, or { error }. */
const normalizeArgs = (raw) => {
    if (raw === undefined || raw === null) return { args: [] };

    const items = Array.isArray(raw) ? raw : [raw];
    if (items.length > MAX_ARGS) return { error: `Too many arguments (max ${MAX_ARGS})` };

    const args = [];
    for (const item of items) {
        if (typeof item !== 'string' && typeof item !== 'number') {
            return { error: 'Arguments must be strings or numbers' };
        }
        const value = String(item).trim();
        if (value.length > MAX_ARG_LENGTH) return { error: 'An argument is too long' };
        if (CONTROL_CHARS.test(value)) return { error: 'Arguments contain control characters' };
        args.push(value);
    }
    return { args };
};

/** Returns an error message, or null when `args` are acceptable for `command`. */
const validate = (command, args) => (isAllowed(command) ? POLICY[command](args) : 'Command not available');

module.exports = { isAllowed, list, normalizeArgs, validate };