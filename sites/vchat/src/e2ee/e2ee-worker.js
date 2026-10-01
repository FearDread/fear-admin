/**
 * FEAR vchat :: e2ee-worker.js
 *
 * Runs off the main thread (required by RTCRtpScriptTransform) and does the
 * actual per-frame encrypt/decrypt. Holds AES-GCM keys as non-extractable
 * CryptoKey objects — even a main-thread XSS that could message this worker
 * can ask it to encrypt/decrypt but can never pull the raw key bytes back out.
 *
 * Frame format (SFrame-lite, not the IETF SFrame spec — no key-id byte,
 * because a call here only ever has one active key per direction):
 *
 *   [ 4-byte big-endian counter ][ AES-GCM ciphertext, tag included ]
 *
 * IV = 8-byte per-key salt (from HKDF) || 4-byte counter. The counter is
 * sent in clear so the receiver can rebuild the IV; it only needs to be
 * unique per key, which a strictly-incrementing per-sender counter gives us.
 */

const keys = new Map(); // peerId -> { aesKey, ivSalt: Uint8Array(8), sendCounter }

self.onmessage = (event) => {
    const { type, peerId } = event.data;

    if (type === "setKey") {
        keys.set(peerId, {
            aesKey: event.data.aesKey,
            ivSalt: new Uint8Array(event.data.ivSalt),
            sendCounter: 0,
        });
    } else if (type === "clearKey") {
        keys.delete(peerId);
    }
};

function buildIV(ivSalt, counter) {
    const iv = new Uint8Array(12);
    iv.set(ivSalt, 0);
    new DataView(iv.buffer).setUint32(8, counter, false);
    return iv;
}

// Best-effort AAD: binds ciphertext to the frame kind so a swapped key/delta
// frame fails auth instead of decoding as garbage. Not load-bearing security
// on its own — the AES-GCM tag is what actually authenticates the frame.
function frameAAD(frame) {
    return new Uint8Array([frame.type === "key" ? 1 : 0]);
}

async function encryptFrame(frame, peerId, controller) {
    const entry = keys.get(peerId);
    if (!entry) return; // no key yet — drop rather than ever send plaintext

    const counter = entry.sendCounter++;
    const iv = buildIV(entry.ivSalt, counter);

    const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv, additionalData: frameAAD(frame) },
        entry.aesKey,
        frame.data
    );

    const out = new Uint8Array(4 + ciphertext.byteLength);
    new DataView(out.buffer).setUint32(0, counter, false);
    out.set(new Uint8Array(ciphertext), 4);

    frame.data = out.buffer;
    controller.enqueue(frame);
}

async function decryptFrame(frame, peerId, controller) {
    const entry = keys.get(peerId);
    if (!entry || frame.data.byteLength < 4) return; // no key yet, or malformed

    const view = new DataView(frame.data);
    const counter = view.getUint32(0, false);
    const iv = buildIV(entry.ivSalt, counter);
    const ciphertext = frame.data.slice(4);

    try {
        frame.data = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv, additionalData: frameAAD(frame) },
            entry.aesKey,
            ciphertext
        );
        controller.enqueue(frame);
    } catch (err) {
        // Wrong key, key not yet installed on this side, or a tampered frame.
        // Drop it — never enqueue ciphertext as if it were a valid frame.
    }
}

if (self.RTCTransformEvent) {
    self.onrtctransform = (event) => {
        const { operation, peerId } = event.transformer.options;
        const step = operation === "encode" ? encryptFrame : decryptFrame;

        const transform = new TransformStream({
            transform: (frame, controller) => step(frame, peerId, controller),
        });

        event.transformer.readable.pipeThrough(transform).pipeTo(event.transformer.writable);
    };
}