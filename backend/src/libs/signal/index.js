/**
 * FEAR Signal :: rooms, chat, and WebRTC call signaling over WebSocket
 */

const crypto = require("crypto");
const WebSocket = require("ws");

const HANDOFF_TTL_MS = 120000; // matches routes/vchat.js token mint TTL

module.exports = FearSignal = (() => {
    const DEFAULT_PATH = "/fear/ws/vchat";
    const DEFAULT_MAX_ROOM_SIZE = 12;
    const DEFAULT_ROOM = "lobby";
    const HEARTBEAT_INTERVAL = 30000;
    const MAX_PAYLOAD = 256 * 1024;
    const MAX_TEXT_LENGTH = 1000;
    const MAX_USERNAME_LENGTH = 24;

    // Token bucket: burst of 10, refilled at 5/sec.
    const RATE_BURST = 10;
    const RATE_REFILL_PER_SEC = 5;

    const DIRECTED_TYPES = new Set([
        "video-offer",
        "video-answer",
        "new-ice-candidate",
        "hang-up",
        "e2e-key", // ECDH public key relay — opaque to this server, see relay()
    ]);

    const MAX_KEY_LENGTH = 512; // raw P-256 SPKI key, base64: well under this

    const ROOM_PATTERN = /^[\w-]{1,64}$/;

    const FearSignal = function (fear, options = {}) {
        this.fear = fear;
        this.logger = fear.getLogger();
        this.env = fear.getEnvironment() || {};

        this.path = options.path || this.env.VCHAT_WS_PATH || DEFAULT_PATH;
        this.maxRoomSize = Number(options.maxRoomSize || this.env.VCHAT_MAX_ROOM || DEFAULT_MAX_ROOM_SIZE);
        this.requireAuth = options.requireAuth !== false;

        this.rooms = new Map(); // roomId -> Map(peerId -> ws)
        this.servers = [];
        this.heartbeat = null;

        this.wss = new WebSocket.Server({
            noServer: true,
            maxPayload: MAX_PAYLOAD,
            clientTracking: true,
            handleProtocols: (protocols) => (protocols.has("json") ? "json" : false),
        });

        this.wss.on("connection", (ws, req, context) => this.onConnection(ws, req, context));
        this.wss.on("error", (err) => this.logger.error(`FEAR Signal :: server error :: ${err.message}`));
    };

    FearSignal.prototype = {
        constructor: FearSignal,

        // ---------------------------------------------------------------- setup

        /**
         * Attach to an already-listening http/https server. No second port, no
         * second certificate, no second nginx vhost.
         */
        attach(server) {
            if (!server || typeof server.on !== "function") {
                throw new Error("FearSignal.attach requires an http/https server instance");
            }

            const onUpgrade = (req, socket, head) => this.handleUpgrade(req, socket, head);

            server.on("upgrade", onUpgrade);
            this.servers.push({ server, onUpgrade });

            if (!this.heartbeat) this.startHeartbeat();

            this.logger.info(`FEAR Signal :: listening for upgrades on ${this.path}`);
            return this;
        },

        handleUpgrade(req, socket, head) {
            let url;

            try {
                url = new URL(req.url, `http://${req.headers.host}`);
            } catch (err) {
                return this.rejectUpgrade(socket, 400, "Bad Request");
            }

            // Not our path — leave the event for any other upgrade handler.
            if (url.pathname !== this.path) return;

            if (!this.isAllowedOrigin(req.headers.origin)) {
                this.logger.error(`FEAR Signal :: origin rejected :: ${req.headers.origin}`);
                return this.rejectUpgrade(socket, 403, "Forbidden");
            }

            this.authenticate(req, url.searchParams.get("token"))
                .then((context) => {
                    this.wss.handleUpgrade(req, socket, head, (ws) => {
                        this.wss.emit("connection", ws, req, context);
                    });
                })
                .catch((err) => {
                    this.logger.error(`FEAR Signal :: upgrade rejected :: ${err.message}`);
                    this.rejectUpgrade(socket, 401, "Unauthorized");
                });
        },

        rejectUpgrade(socket, code, message) {
            socket.write(`HTTP/1.1 ${code} ${message}\r\nConnection: close\r\n\r\n`);
            socket.destroy();
        },

        isAllowedOrigin(origin) {
            if (!origin) return true; // native clients send no Origin header
            const origins = this.fear.origins || [];
            return origins.length === 0 || origins.includes(origin);
        },

        /**
         * Two ways in:
         *
         *   1. Session cookie — replay express-session against the upgrade
         *      request so the socket inherits the REST login. Works when the
         *      client is talking to the same origin it logged in on.
         *
         *   2. Handoff token — a short-lived HMAC-signed token minted by
         *      GET /fear/api/vchat/token while authenticated on one origin, then
         *      passed as ?token= when connecting through a *different* origin
         *      (e.g. a fallback tunnel). Session cookies don't cross origins;
         *      this does, deliberately, for exactly long enough to fail over —
         *      see verifyHandoffToken() for what it does and doesn't let you do.
         *
         * Session cookie wins when both are present; the token is only consulted
         * when there's no valid session on this request.
         */
        authenticate(req, token) {
            return new Promise((resolve, reject) => {
                const parser = this.fear.sessionParser;

                const tryToken = () => {
                    const claim = this.verifyHandoffToken(token);
                    if (claim) return resolve({ userId: claim.userId, via: "handoff" });
                    if (this.requireAuth) return reject(new Error("no valid session or token"));
                    return resolve({ userId: null });
                };

                if (!parser) return tryToken();

                parser(req, {}, (err) => {
                    if (err) return reject(err);

                    // passport.session() does not run on upgrade, so read the
                    // serialized user id straight off the session.
                    const userId = req.session?.passport?.user || null;

                    if (userId) return resolve({ userId, via: "session" });

                    tryToken();
                });
            });
        },

        /**
         * Verifies a token minted by routes/vchat.js's /token endpoint:
         * base64url(JSON payload) + "." + hex HMAC-SHA256 of that payload, keyed
         * with SESSION_SECRET. Deliberately narrow: it only proves "someone with
         * a valid session on this app recently asked to reconnect as this user
         * id," for HANDOFF_TTL_MS. It is not a bearer credential for anything
         * else — it isn't accepted by the REST API, and a leaked token is
         * useless once it expires.
         */
        verifyHandoffToken(token) {
            if (!token || typeof token !== "string" || !this.env.SESSION_SECRET) return null;

            const parts = token.split(".");
            if (parts.length !== 2) return null;

            const [payloadB64, signature] = parts;

            let expected;
            try {
                expected = crypto.createHmac("sha256", this.env.SESSION_SECRET).update(payloadB64).digest("hex");
            } catch (err) {
                return null;
            }

            const sigBuf = Buffer.from(signature, "hex");
            const expectedBuf = Buffer.from(expected, "hex");
            if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
                return null;
            }

            let payload;
            try {
                payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
            } catch (err) {
                return null;
            }

            if (!payload.userId || typeof payload.exp !== "number" || Date.now() > payload.exp) return null;

            return payload;
        },

        // ----------------------------------------------------------- connection

        onConnection(ws, req, context) {
            ws.peerId = crypto.randomUUID();
            ws.userId = context.userId;
            ws.username = null;
            ws.roomId = null;
            ws.isAlive = true;
            ws.tokens = RATE_BURST;
            ws.lastRefill = Date.now();

            ws.on("pong", () => {
                ws.isAlive = true;
            });

            ws.on("message", (raw) => this.onMessage(ws, raw));
            ws.on("close", () => this.leaveRoom(ws));
            ws.on("error", (err) => {
                this.logger.error(`FEAR Signal :: socket error :: ${ws.peerId} :: ${err.message}`);
                this.leaveRoom(ws);
            });

            this.send(ws, { type: "id", peerId: ws.peerId, userId: ws.userId });
            this.logger.info(`FEAR Signal :: connected :: ${ws.peerId} :: user ${ws.userId || "anon"}`);
        },

        onMessage(ws, raw) {
            if (!this.consumeToken(ws)) {
                return this.send(ws, { type: "error", reason: "rate-limited" });
            }

            let msg;

            try {
                msg = JSON.parse(raw.toString());
            } catch (err) {
                return this.send(ws, { type: "error", reason: "malformed-json" });
            }

            if (!msg || typeof msg.type !== "string") {
                return this.send(ws, { type: "error", reason: "missing-type" });
            }

            if (DIRECTED_TYPES.has(msg.type)) return this.relay(ws, msg);

            switch (msg.type) {
                case "join":
                    return this.joinRoom(ws, msg);
                case "leave":
                    return this.leaveRoom(ws);
                case "message":
                    return this.chat(ws, msg);
                case "userlist":
                    return this.send(ws, this.makeUserList(ws.roomId));
                case "ping":
                    return this.send(ws, { type: "pong" });
                default:
                    return this.send(ws, { type: "error", reason: "unknown-type", detail: msg.type });
            }
        },

        consumeToken(ws) {
            const now = Date.now();
            const elapsed = (now - ws.lastRefill) / 1000;

            ws.tokens = Math.min(RATE_BURST, ws.tokens + elapsed * RATE_REFILL_PER_SEC);
            ws.lastRefill = now;

            if (ws.tokens < 1) return false;

            ws.tokens -= 1;
            return true;
        },

        // ----------------------------------------------------------------- rooms

        joinRoom(ws, msg) {
            const roomId = typeof msg.room === "string" ? msg.room : DEFAULT_ROOM;

            if (!ROOM_PATTERN.test(roomId)) {
                return this.send(ws, { type: "error", reason: "invalid-room" });
            }

            if (ws.roomId === roomId) return;
            if (ws.roomId) this.leaveRoom(ws);

            if (!this.rooms.has(roomId)) this.rooms.set(roomId, new Map());
            const room = this.rooms.get(roomId);

            if (room.size >= this.maxRoomSize) {
                return this.send(ws, { type: "error", reason: "room-full", room: roomId });
            }

            ws.username = this.resolveUsername(room, msg.username, ws);

            // Peers already present, built before we join so the list excludes us.
            const peers = [...room.values()].map((peer) => ({
                peerId: peer.peerId,
                username: peer.username,
            }));

            room.set(ws.peerId, ws);
            ws.roomId = roomId;

            this.send(ws, {
                type: "joined",
                room: roomId,
                peerId: ws.peerId,
                username: ws.username,
                peers,
                date: Date.now(),
            });

            this.broadcast(
                roomId,
                { type: "peer-joined", peerId: ws.peerId, username: ws.username, date: Date.now() },
                ws.peerId
            );

            this.logger.info(
                `FEAR Signal :: ${ws.username} (${ws.peerId}) joined ${roomId} :: ${room.size}/${this.maxRoomSize}`
            );
        },

        leaveRoom(ws) {
            const roomId = ws.roomId;
            if (!roomId) return;

            const room = this.rooms.get(roomId);
            ws.roomId = null;

            if (!room) return;

            room.delete(ws.peerId);

            // Peers mid-call with this one need to tear down, so the departure
            // doubles as an implicit hang-up.
            this.broadcast(roomId, { type: "peer-left", peerId: ws.peerId, username: ws.username }, ws.peerId);

            if (room.size === 0) this.rooms.delete(roomId);

            this.logger.info(`FEAR Signal :: ${ws.username || ws.peerId} left ${roomId}`);
        },

        /**
         * Display name. Prefers the session user id; a client-supplied name is
         * accepted only as a label — trimmed, length-capped, and de-duplicated
         * within the room the way the MDN sample does it.
         */
        resolveUsername(room, requested, ws) {
            const raw =
                (typeof requested === "string" && requested.trim()) ||
                (ws.userId ? String(ws.userId) : "") ||
                `guest-${ws.peerId.slice(0, 6)}`;

            const base = raw.replace(/[^\w .-]/g, "").slice(0, MAX_USERNAME_LENGTH) || "guest";

            const taken = new Set([...room.values()].map((peer) => peer.username));
            if (!taken.has(base)) return base;

            let suffix = 2;
            while (taken.has(`${base}-${suffix}`)) suffix++;

            return `${base}-${suffix}`;
        },

        makeUserList(roomId) {
            const room = this.rooms.get(roomId);

            return {
                type: "userlist",
                room: roomId || null,
                users: room
                    ? [...room.values()].map((peer) => ({ peerId: peer.peerId, username: peer.username }))
                    : [],
            };
        },

        // ------------------------------------------------------------ messaging

        chat(ws, msg) {
            if (!ws.roomId) return this.send(ws, { type: "error", reason: "not-in-room" });

            const text = typeof msg.text === "string" ? msg.text.trim().slice(0, MAX_TEXT_LENGTH) : "";
            if (!text) return;

            // Relayed raw; the client renders with textContent. Stripping tags
            // server-side (as the MDN sample does) is the weaker defence — it
            // mangles legitimate text and still loses to a mismatched filter.
            this.broadcast(ws.roomId, {
                type: "message",
                from: ws.peerId,
                username: ws.username,
                text,
                date: Date.now(),
            });
        },

        /**
         * Point-to-point relay for call signaling. The sender's identity is
         * stamped by the server, so `from` cannot be forged.
         *
         * "e2e-key" carries one peer's ephemeral ECDH public key to the other.
         * This server relays the bytes and nothing more — it never sees a
         * private key or the derived AES key, so it cannot decrypt the call even
         * with full access to the signaling log. That's what makes the
         * encryption on top of it end-to-end rather than hop-to-hop: DTLS-SRTP
         * already protects each leg, but a relay (this server, a TURN box) is
         * itself one of those hops and can see plaintext today. The e2e-key
         * exchange lets the two browsers agree on a key this process never
         * holds, so frame content stays opaque here as well.
         */
        relay(ws, msg) {
            if (!ws.roomId) return this.send(ws, { type: "error", reason: "not-in-room" });

            const room = this.rooms.get(ws.roomId);
            const target = room && room.get(msg.to);

            if (!target || target.readyState !== WebSocket.OPEN) {
                return this.send(ws, { type: "error", reason: "peer-unavailable", to: msg.to });
            }

            const out = {
                type: msg.type,
                from: ws.peerId,
                username: ws.username,
                room: ws.roomId,
                date: Date.now(),
            };

            if (msg.type === "video-offer" || msg.type === "video-answer") out.sdp = msg.sdp;
            if (msg.type === "new-ice-candidate") out.candidate = msg.candidate;

            if (msg.type === "e2e-key") {
                if (typeof msg.publicKey !== "string" || msg.publicKey.length > MAX_KEY_LENGTH) {
                    return this.send(ws, { type: "error", reason: "invalid-key" });
                }
                out.publicKey = msg.publicKey;
            }

            this.send(target, out);
        },

        broadcast(roomId, message, exceptPeerId = null) {
            const room = this.rooms.get(roomId);
            if (!room) return;

            room.forEach((peer, peerId) => {
                if (peerId === exceptPeerId) return;
                this.send(peer, message);
            });
        },

        send(ws, message) {
            if (!ws || ws.readyState !== WebSocket.OPEN) return;

            try {
                ws.send(JSON.stringify(message));
            } catch (err) {
                this.logger.error(`FEAR Signal :: send failed :: ${err.message}`);
            }
        },

        // ------------------------------------------------------------ lifecycle

        startHeartbeat() {
            this.heartbeat = setInterval(() => {
                this.wss.clients.forEach((ws) => {
                    if (ws.isAlive === false) return ws.terminate();
                    ws.isAlive = false;
                    ws.ping();
                });
            }, HEARTBEAT_INTERVAL);

            if (typeof this.heartbeat.unref === "function") this.heartbeat.unref();
        },

        getStats() {
            return {
                path: this.path,
                clients: this.wss.clients.size,
                maxRoomSize: this.maxRoomSize,
                rooms: [...this.rooms.entries()].map(([room, peers]) => ({
                    room,
                    peers: peers.size,
                    users: [...peers.values()].map((peer) => peer.username),
                })),
            };
        },

        close() {
            if (this.heartbeat) clearInterval(this.heartbeat);
            this.heartbeat = null;

            this.servers.forEach(({ server, onUpgrade }) => server.removeListener("upgrade", onUpgrade));
            this.servers = [];

            this.wss.clients.forEach((ws) => ws.close(1001, "server shutting down"));
            this.rooms.clear();

            return new Promise((resolve) => this.wss.close(() => resolve()));
        },
    };

    return FearSignal;
})();