/**
 * Encoded-frame transform (runs via RTCRtpScriptTransform). AES-GCM per frame, fresh
 * random 96-bit IV appended to the ciphertext, leading codec bytes left in the clear
 * (and authenticated as AAD) so the packetizer still works. Written for VP8 video and
 * Opus audio — the client only enables E2EE where VP8 is available and pins video to it.
 *
 * Fails closed: no key yet -> frames are dropped, never sent or played unencrypted.
 *
 * Dropping frames costs the receiver its reference frames, which shows up as smeared or
 * blocky video until the next keyframe. So whenever a key arrives, and whenever a video
 * frame can't be decrypted, the transform asks for a fresh keyframe.
 */
const keys = new Map(); // peerId -> CryptoKey
const live = new Map(); // peerId -> Set<{ operation, transformer }>
const IV_LENGTH = 12;
const KEYFRAME_ASK_INTERVAL_MS = 1000;

function forPeer(peerId, fn) {
    (live.get(peerId) || []).forEach(fn);
}

function safely(fn) {
    try {
        Promise.resolve(fn()).catch(() => { }); // audio transformers reject keyframe calls; that's fine
    } catch (err) {
        /* method missing or threw synchronously */
    }
}

self.onmessage = (event) => {
    const msg = event.data;

    if (msg.type === 'key') {
        keys.set(msg.peerId, msg.key);

        // Sender: start the stream with a keyframe. Receiver: ask the other side for one.
        forPeer(msg.peerId, ({ operation, transformer }) => {
            if (operation === 'encrypt' && typeof transformer.generateKeyFrame === 'function') {
                safely(() => transformer.generateKeyFrame());
            } else if (operation === 'decrypt' && typeof transformer.sendKeyFrameRequest === 'function') {
                safely(() => transformer.sendKeyFrameRequest());
            }
        });
    } else if (msg.type === 'drop') {
        keys.delete(msg.peerId);
        live.delete(msg.peerId);
    }
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
    const { transformer } = event;
    const { readable, writable } = transformer;
    const { operation, peerId } = transformer.options;

    const entry = { operation, transformer };
    if (!live.has(peerId)) live.set(peerId, new Set());
    live.get(peerId).add(entry);

    let lastAsk = 0;
    const askForKeyFrame = (frame) => {
        const now = Date.now();
        // video frames only (audio has no `type`), receiver side only, at most once a second
        if (operation !== 'decrypt' || frame.type === undefined || now - lastAsk < KEYFRAME_ASK_INTERVAL_MS) return;
        if (typeof transformer.sendKeyFrameRequest !== 'function') return;
        lastAsk = now;
        safely(() => transformer.sendKeyFrameRequest());
    };

    readable
        .pipeThrough(
            new TransformStream({
                async transform(frame, controller) {
                    const key = keys.get(peerId);
                    if (!key) return askForKeyFrame(frame);

                    try {
                        controller.enqueue(operation === 'encrypt' ? await encrypt(frame, key) : await decrypt(frame, key));
                    } catch (err) {
                        askForKeyFrame(frame); // bad or tampered frame: drop it, and don't wait for the next keyframe
                    }
                },
            })
        )
        .pipeTo(writable)
        .catch(() => { })
        .finally(() => {
            const set = live.get(peerId);
            if (set) set.delete(entry);
        });
};