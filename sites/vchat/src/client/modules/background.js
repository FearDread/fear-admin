const STORE_KEY = 'vchat:background';
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_W = 1280;
const MAX_H = 720;
const SEG_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1.1675465747/';

export default function backgroundModule(sb) {
    let bgImage = null; // canvas holding the downscaled background
    let seg = null;
    let segReady = null;
    let pipeline = null; // { video, canvas, ctx, out, source, owned, running, busy }
    let input = null;
    let origGetUserMedia = null;
    const channels = [];

    // ------------------------------------------------------------- helpers

    function on(channel, fn) {
        sb.add(channel, fn);
        channels.push([channel, fn]);
    }

    function fail(message) {
        sb.warn('background:', message);
        sb.$('#room-status').text(message);
        return sb.emit('background:error', { message });
    }

    function loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Could not read that image'));
            img.src = url;
        });
    }

    function toCanvas(img) {
        const iw = img.naturalWidth || img.width;
        const ih = img.naturalHeight || img.height;
        const scale = Math.min(1, MAX_W / iw, MAX_H / ih);
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(iw * scale));
        c.height = Math.max(1, Math.round(ih * scale));
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        return c;
    }

    // object-fit: cover
    function drawCover(ctx, img, w, h) {
        const r = Math.max(w / img.width, h / img.height);
        const dw = img.width * r;
        const dh = img.height * r;
        ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    }

    function persist(dataUrl) {
        try {
            if (dataUrl) localStorage.setItem(STORE_KEY, dataUrl);
            else localStorage.removeItem(STORE_KEY);
        } catch (err) {
            sb.warn('background: could not persist image', err.message);
        }
    }

    function restore() {
        let saved = null;
        try {
            saved = localStorage.getItem(STORE_KEY);
        } catch (err) {
            return Promise.resolve();
        }
        if (!saved) return Promise.resolve();

        return loadImage(saved)
            .then((img) => {
                bgImage = toCanvas(img);
            })
            .catch(() => persist(null));
    }

    function updateUI() {
        sb.$('#btn-bg-clear').toggle(!!bgImage);
        sb.$('#btn-bg').text(bgImage ? 'Change background' : 'Background');
    }

    // -------------------------------------------------------- segmentation

    function loadSegmenter() {
        if (segReady) return segReady;

        segReady = (window.SelfieSegmentation ? Promise.resolve() : sb.loadScript(SEG_BASE + 'selfie_segmentation.js'))
            .then(() => {
                seg = new window.SelfieSegmentation({ locateFile: (file) => SEG_BASE + file });
                seg.setOptions({ modelSelection: 1 }); // landscape model: faster
                seg.onResults(onResults);
                return seg.initialize();
            })
            .catch((err) => {
                segReady = null; // allow a retry
                throw err;
            });

        return segReady;
    }

    function ensureSegmenter() {
        if (!bgImage || seg) return Promise.resolve();
        return loadSegmenter().catch((err) => fail('Background model failed to load: ' + err.message));
    }

    function onResults(results) {
        const p = pipeline;
        if (!p || !p.running) return;

        const { ctx, canvas } = p;
        const w = canvas.width;
        const h = canvas.height;

        ctx.save();
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(results.segmentationMask, 0, 0, w, h); // person-shaped mask
        ctx.globalCompositeOperation = 'source-in'; // keep camera pixels inside the mask
        ctx.drawImage(results.image, 0, 0, w, h);
        ctx.globalCompositeOperation = 'destination-over'; // background goes behind
        if (bgImage) drawCover(ctx, bgImage, w, h);
        ctx.restore();
    }

    // ------------------------------------------------------------ pipeline

    function schedule(fn) {
        // rAF is paused in hidden tabs, which would freeze outgoing video.
        if (document.hidden) setTimeout(fn, 33);
        else requestAnimationFrame(fn);
    }

    function loop() {
        const p = pipeline;
        if (!p || !p.running) return;

        if (p.video.readyState >= 2) {
            if (bgImage && seg) {
                if (!p.busy) {
                    p.busy = true;
                    seg.send({ image: p.video })
                        .catch(() => { })
                        .then(() => {
                            p.busy = false;
                        });
                }
            } else {
                // no background chosen: plain copy, no model work
                p.ctx.drawImage(p.video, 0, 0, p.canvas.width, p.canvas.height);
            }
        }

        schedule(loop);
    }

    function detach() {
        const p = pipeline;
        if (!p) return Promise.resolve();

        pipeline = null; // first, so the patched track.stop() below doesn't recurse
        p.running = false;
        p.out.getVideoTracks().forEach((t) => t.stop());
        p.video.srcObject = null;
        if (p.owned) p.source.stop(); // we opened the camera via the hook, so we release it

        return Promise.resolve();
    }

    function attach(data) {
        const stream = data && data.stream;
        const track = stream && stream.getVideoTracks()[0];

        if (!track) return Promise.resolve({ stream, processed: false });

        detach();

        const settings = track.getSettings();
        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.srcObject = new MediaStream([track]);

        const canvas = document.createElement('canvas');
        canvas.width = settings.width || 640;
        canvas.height = settings.height || 480;

        const out = canvas.captureStream(settings.frameRate || 30);
        stream.getAudioTracks().forEach((t) => out.addTrack(t)); // mic stays shared

        const p = {
            video,
            canvas,
            ctx: canvas.getContext('2d'),
            out,
            source: track,
            owned: !!(data && data.owned),
            running: true,
            busy: false,
        };
        pipeline = p;

        // room.js stops tracks on leave; make that tear the pipeline down too.
        const outTrack = out.getVideoTracks()[0];
        const stopOut = outTrack.stop.bind(outTrack);
        outTrack.stop = function () {
            stopOut();
            if (pipeline === p) detach();
        };

        return video
            .play()
            .then(ensureSegmenter)
            .then(() => {
                loop();
                return { stream: out, processed: true };
            })
            .catch((err) => {
                if (pipeline === p) detach();
                throw err;
            });
    }

    // -------------------------------------------------------- set / clear

    function setBackground(img) {
        bgImage = toCanvas(img);
        persist(bgImage.toDataURL('image/jpeg', 0.85));
        updateUI();

        return ensureSegmenter().then(() => sb.emit('background:changed', { active: true }));
    }

    function clear() {
        bgImage = null;
        persist(null);
        updateUI();
        return sb.emit('background:changed', { active: false });
    }

    function handleFile(file) {
        if (!file) return Promise.resolve();
        if (!/^image\//.test(file.type)) return fail('Please choose an image file');
        if (file.size > MAX_FILE_BYTES) return fail('Image is too large (10 MB max)');

        const url = URL.createObjectURL(file);

        return loadImage(url)
            .then((img) => setBackground(img))
            .catch((err) => fail(err.message))
            .then(() => URL.revokeObjectURL(url));
    }

    // ------------------------------------------------------------ room UI

    // Runs every time the room view renders (the router replaces #app's HTML).
    function bindRoom() {
        sb.$('#btn-bg')
            .off('click.bg')
            .on('click.bg', () => input.click());

        sb.$('#btn-bg-clear')
            .off('click.bg')
            .on('click.bg', () => clear());

        updateUI();
        return Promise.resolve();
    }

    function hookCamera() {
        const md = navigator.mediaDevices;
        if (!md || !md.getUserMedia || origGetUserMedia) return;

        origGetUserMedia = md.getUserMedia.bind(md);

        md.getUserMedia = function (constraints) {
            return origGetUserMedia(constraints).then((stream) => {
                if (!constraints || !constraints.video || !stream.getVideoTracks().length) return stream;

                return attach({ stream, owned: true })
                    .then((res) => res.stream)
                    .catch((err) => {
                        sb.warn('background: falling back to raw camera', err.message);
                        return stream;
                    });
            });
        };
    }

    // ----------------------------------------------------------- lifecycle

    return {
        load: function (options) {
            input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.hidden = true;
            input.addEventListener('change', () => {
                const file = input.files && input.files[0];
                input.value = ''; // allow re-picking the same file
                handleFile(file);
            });
            document.body.appendChild(input);

            on('view:room', bindRoom);
            on('background:attach', attach);
            on('background:detach', detach);
            on('background:clear', clear);
            on('background:pick', function () {
                input.click();
                return Promise.resolve();
            });

            if (options.hookCamera !== false) hookCamera();

            return restore();
        },

        unload: function () {
            channels.forEach(([channel, fn]) => sb.remove(channel, fn));
            channels.length = 0;

            if (origGetUserMedia) {
                navigator.mediaDevices.getUserMedia = origGetUserMedia;
                origGetUserMedia = null;
            }

            if (input) input.remove();
            input = null;

            return detach();
        },
    };
}