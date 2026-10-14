import { api } from './api.js';

// The server allows a burst of 10 then 5/sec (see index.js). Trickle ICE across several
// peers easily exceeds that, so outgoing messages are paced. Keep PACE_MS * server refill >= 1.
const PACE_MS = 40;

export class SignalClient {
    constructor() {
        this.ws = null;
        this.handlers = new Map();
        this.queue = [];
        this.timer = null;
        this.peerId = null;
    }

    on(type, fn) {
        if (!this.handlers.has(type)) this.handlers.set(type, []);
        this.handlers.get(type).push(fn);
    }

    dispatch(msg) {
        (this.handlers.get(msg.type) || []).forEach((fn) => {
            try {
                Promise.resolve(fn(msg)).catch((err) => console.error(`signal handler ${msg.type}:`, err));
            } catch (err) {
                console.error(`signal handler ${msg.type}:`, err);
            }
        });
    }

    open(url) {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(url, 'json');
            let opened = false;

            ws.onopen = () => {
                opened = true;
                this.ws = ws;
                resolve();
            };
            ws.onerror = () => {
                if (!opened) reject(new Error('Could not reach the signaling server'));
            };
            ws.onclose = () => {
                if (opened) this.dispatch({ type: 'close' });
                else reject(new Error('Signaling connection refused'));
            };
            ws.onmessage = (event) => {
                let msg;
                try {
                    msg = JSON.parse(event.data);
                } catch (err) {
                    return;
                }
                if (msg.type === 'id') this.peerId = msg.peerId;
                this.dispatch(msg);
            };
        });
    }

    /** Same-origin first (session cookie); fall back to the handoff-token origin if configured. */
    async connect(config) {
        const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';

        try {
            await this.open(`${proto}//${location.host}${config.socketPath}`);
        } catch (err) {
            if (!config.fallbackOrigin) throw err;

            const { token } = await api.token();
            const url = new URL(config.socketPath, config.fallbackOrigin);
            url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
            url.searchParams.set('token', token);
            await this.open(url.toString());
        }
    }

    send(msg) {
        this.queue.push(JSON.stringify(msg));
        this.pump();
    }

    pump() {
        if (this.timer) return;

        const tick = () => {
            const next = this.queue.shift();
            if (next === undefined) {
                this.timer = null;
                return;
            }
            if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(next);
            this.timer = setTimeout(tick, PACE_MS);
        };

        tick();
    }

    close() {
        this.queue = [];
        clearTimeout(this.timer);
        this.timer = null;
        if (this.ws) {
            this.ws.onclose = null;
            this.ws.close();
        }
        this.ws = null;
    }
}
