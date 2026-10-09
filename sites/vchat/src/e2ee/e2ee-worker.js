/**
 * Encoded-frame transform (runs via RTCRtpScriptTransform). AES-GCM per frame, fresh
 * random 96-bit IV appended to the ciphertext, leading codec bytes left in the clear
 * (and authenticated as AAD) so the packetizer still works. Written for VP8 video and
 * Opus audio — the client pins video to VP8 when E2EE is on.
 *
 * Fails closed: no key yet -> frames are dropped, never sent or played unencrypted.
 */
const keys = new Map(); // peerId -> CryptoKey
const IV_LENGTH = 12;

self.onmessage = (event) => {
    const msg = event.data;
    if (msg.type === 'key') keys.set(msg.peerId, msg.key);
    else if (msg.type === 'drop') keys.delete(msg.peerId);
};

function clearBytes(frame) {
    if (frame.type === 'key') return 10;
    if (frame.type === 'delta') return 3;
    return 1; // audio frames have no `type`
}

async function encrypt(frame, key) {
    const data = new Uint8Array(frame.data);
    const head = clearBytes(frame);
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    const sealed = new Uint8Array(
        await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: data.subarray(0, head) }, key, data.subarray(head))
    );

    const out = new Uint8Array(head + sealed.length + IV_LENGTH);
    out.set(data.subarray(0, head), 0);
    out.set(sealed, head);
    out.set(iv, head + sealed.length);

    frame.data = out.buffer;
    return frame;
}

async function decrypt(frame, key) {
    const data = new Uint8Array(frame.data);
    const head = clearBytes(frame);
    if (data.length < head + IV_LENGTH + 16) throw new Error('frame too short');

    const iv = data.subarray(data.length - IV_LENGTH);
    const sealed = data.subarray(head, data.length - IV_LENGTH);

    const plain = new Uint8Array(
        await crypto.subtle.decrypt({ name: 'AES-GCM', iv, additionalData: data.subarray(0, head) }, key, sealed)
    );

    const out = new Uint8Array(head + plain.length);
    out.set(data.subarray(0, head), 0);
    out.set(plain, head);

    frame.data = out.buffer;
    return frame;
}

self.onrtctransform = (event) => {
    const { readable, writable } = event.transformer;
    const { operation, peerId } = event.transformer.options;

    readable
        .pipeThrough(
            new TransformStream({
                async transform(frame, controller) {
                    const key = keys.get(peerId);
                    if (!key) return;

                    try {
                        controller.enqueue(operation === 'encrypt' ? await encrypt(frame, key) : await decrypt(frame, key));
                    } catch (err) {
                        /* bad or tampered frame: drop it */
                    }
                },
            })
        )
        .pipeTo(writable);
};
