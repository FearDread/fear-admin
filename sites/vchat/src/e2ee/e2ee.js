/**
 * Main-thread half of the E2EE layer. Per peer pair: ephemeral ECDH P-256 keypair ->
 * public key relayed via the server's `e2e-key` message -> AES-GCM key derived here and
 * handed to the worker (non-extractable CryptoKey). The server never holds either secret.
 *
 * Keys are not authenticated by the server, so a malicious server could MITM the exchange.
 * The safety code lets users detect that by comparing it out of band.
 */
const ECDH = { name: 'ECDH', namedCurve: 'P-256' };

const toB64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const fromB64 = (str) => Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
const hex = (bytes) => [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');

export class E2EE {
    constructor() {
        this.supported =
            typeof RTCRtpScriptTransform !== 'undefined' && !!(window.crypto && window.crypto.subtle) && typeof Worker !== 'undefined';
        this.worker = null;
        this.sessions = new Map(); // peerId -> { pair, publicRaw }
    }

    init() {
        if (!this.supported || this.worker) return;
        this.worker = new Worker(new URL('./e2ee-worker.js', import.meta.url));
    }

    senderTransform(peerId) {
        return new RTCRtpScriptTransform(this.worker, { operation: 'encrypt', peerId });
    }

    receiverTransform(peerId) {
        return new RTCRtpScriptTransform(this.worker, { operation: 'decrypt', peerId });
    }

    /** Generate our keypair for this peer; resolves to the base64 public key to send. */
    async begin(peerId) {
        const pair = await crypto.subtle.generateKey(ECDH, false, ['deriveKey']);
        const publicRaw = new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey));
        this.sessions.set(peerId, { pair, publicRaw });
        return toB64(publicRaw);
    }

    /** Derive the shared key from the peer's public key; resolves to a safety code. */
    async accept(peerId, remoteB64) {
        const session = this.sessions.get(peerId);
        if (!session) throw new Error('no key session for peer');

        const remoteRaw = fromB64(remoteB64);
        const remote = await crypto.subtle.importKey('raw', remoteRaw, ECDH, false, []);

        const key = await crypto.subtle.deriveKey(
            { name: 'ECDH', public: remote },
            session.pair.privateKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );

        this.worker.postMessage({ type: 'key', peerId, key });

        // Both sides hash the same pair of keys in the same (sorted) order -> same code.
        const [a, b] = [hex(session.publicRaw), hex(remoteRaw)].sort();
        const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(a + b));
        return hex(new Uint8Array(digest).slice(0, 6)).match(/.{4}/g).join(' ');
    }

    drop(peerId) {
        this.sessions.delete(peerId);
        if (this.worker) this.worker.postMessage({ type: 'drop', peerId });
    }

    dispose() {
        this.sessions.clear();
        if (this.worker) this.worker.terminate();
        this.worker = null;
    }
}
