/**
 * FEAR vchat :: e2ee.js
 *
 * End-to-end media encryption on top of WebRTC's mandatory DTLS-SRTP.
 * DTLS-SRTP already encrypts each hop; what it doesn't do is stop a relay
 * that sits on the path — this app's own signaling/TURN server, or whoever
 * operates it — from seeing plaintext, because SRTP is decrypted and
 * re-encrypted at every hop it passes through. This module derives a key
 * the server never has access to and uses it to encrypt each encoded video/
 * audio frame before it ever reaches SRTP, so the frame content stays
 * opaque even to a relay that's fully in the media path.
 *
 * What this does NOT defend against: an ACTIVE attacker on the signaling
 * path at the moment of the call — e.g. a compromised server substituting
 * its own ECDH public keys to both sides and quietly relaying/decrypting
 * everything (a classic Diffie-Hellman MITM). The fingerprint this module
 * computes and displays is the mitigation for that: read it out on a call
 * you both trust (or compare over a different channel) and confirm it
 * matches on both ends before trusting the "encrypted" badge.
 *
 * Browser support: requires RTCRtpScriptTransform (Chrome/Edge 94+, and
 * shipping elsewhere as the "Encoded Transform" spec matures). Where it's
 * missing, isSupported() returns false, calls proceed without the extra
 * layer, and the UI should say so rather than showing a false lock icon.
 */

const WORKER_URL = new URL("./e2ee-worker.js", import.meta.url);
const HKDF_SALT = new TextEncoder().encode("FEAR-vchat-e2ee-v1");
const AES_INFO = new TextEncoder().encode("fear-vchat-aes-key");
const IV_INFO = new TextEncoder().encode("fear-vchat-iv-salt");

let worker = null;
const calls = new Map(); // peerId -> { keyPair, publicKeyB64, sharedBits, fingerprint, ready }

function getWorker() {
    if (!worker) worker = new Worker(WORKER_URL, { type: "module" });
    return worker;
}

export function isSupported() {
    return typeof RTCRtpScriptTransform === "function" && typeof Worker === "function";
}

function toBase64(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function fromBase64(str) {
    return Uint8Array.from(atob(str), (c) => c.charCodeAt(0)).buffer;
}

/**
 * Starts a call's key exchange: generates an ephemeral ECDH keypair and
 * returns the public key to send to the peer over signaling. The private
 * key never leaves this function's closure — it's held on the keyPair
 * object, not serialized anywhere.
 */
export async function begin(peerId) {
    if (!isSupported()) return null;

    const keyPair = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, false, [
        "deriveKey",
        "deriveBits",
    ]);

    const rawPublic = await crypto.subtle.exportKey("raw", keyPair.publicKey);
    const publicKeyB64 = toBase64(rawPublic);

    calls.set(peerId, { keyPair, publicKeyB64, sharedBits: null, fingerprint: null, ready: false });
    return publicKeyB64;
}

/**
 * Call when the peer's "e2e-key" message arrives. Completes the ECDH
 * exchange, derives the AES-GCM key and IV salt via HKDF, and hands the AES
 * key to the worker as a non-extractable CryptoKey — it crosses postMessage
 * by structured clone, never as exportable bytes.
 */
export async function receivePeerKey(peerId, peerPublicKeyB64) {
    if (!isSupported()) return;

    const call = calls.get(peerId);
    if (!call) return; // begin() wasn't called for this peer — nothing to complete

    const peerPublicKey = await crypto.subtle.importKey(
        "raw",
        fromBase64(peerPublicKeyB64),
        { name: "ECDH", namedCurve: "P-256" },
        false,
        []
    );

    const sharedBits = await crypto.subtle.deriveBits(
        { name: "ECDH", public: peerPublicKey },
        call.keyPair.privateKey,
        256
    );

    const hkdfKey = await crypto.subtle.importKey("raw", sharedBits, "HKDF", false, [
        "deriveKey",
        "deriveBits",
    ]);

    const aesKey = await crypto.subtle.deriveKey(
        { name: "HKDF", hash: "SHA-256", salt: HKDF_SALT, info: AES_INFO },
        hkdfKey,
        { name: "AES-GCM", length: 128 },
        false, // non-extractable — the worker can use it, nothing can read it back out
        ["encrypt", "decrypt"]
    );

    const ivSalt = await crypto.subtle.deriveBits(
        { name: "HKDF", hash: "SHA-256", salt: HKDF_SALT, info: IV_INFO },
        hkdfKey,
        64
    );

    const fingerprintBits = await crypto.subtle.digest("SHA-256", sharedBits);
    call.fingerprint = formatFingerprint(fingerprintBits);
    call.ready = true;

    getWorker().postMessage({ type: "setKey", peerId, aesKey, ivSalt });
}

function formatFingerprint(digestBuf) {
    const bytes = new Uint8Array(digestBuf).slice(0, 5);
    return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase().match(/.{1,2}/g).join("-");
}

export function getFingerprint(peerId) {
    return calls.get(peerId)?.fingerprint || null;
}

export function isReady(peerId) {
    return !!calls.get(peerId)?.ready;
}

/** Attach to a freshly-added RTCRtpSender. Safe to call before the key lands — the worker just drops frames until setKey arrives. */
export function attachSenderTransform(sender, peerId) {
    if (!isSupported() || !sender) return;
    sender.transform = new RTCRtpScriptTransform(getWorker(), { operation: "encode", peerId });
}

/** Attach to an RTCRtpReceiver from pc.ontrack's event.receiver. */
export function attachReceiverTransform(receiver, peerId) {
    if (!isSupported() || !receiver) return;
    receiver.transform = new RTCRtpScriptTransform(getWorker(), { operation: "decode", peerId });
}

export function teardown(peerId) {
    if (!calls.has(peerId)) return;
    calls.delete(peerId);
    if (worker) worker.postMessage({ type: "clearKey", peerId });
}