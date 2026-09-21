/**
 * FEAR vchat client :: replaces MDN's chatclient.js
 *
 * Serve as an ES module: <script type="module" src="vchat-client.js"></script>
 */

import * as E2EE from "./e2ee.js";

const API_PATH = "/fear/api/vchat";

/**
 * Two doors into the same FEAR backend. FALLBACK should be a genuinely
 * separate ingress — a Cloudflare Tunnel hostname, a backup VPS reverse
 * proxy, anything that doesn't depend on the same router/port-forward/
 * dynamic-DNS record as PRIMARY. If that path goes down, this one won't.
 *
 * Fill in your fallback hostname below. Leaving it as-is means failover
 * degrades to "retry the same endpoint," which is still fine — it's just
 * not a second path.
 */
const ENDPOINTS = [
    { label: "primary", origin: `${location.protocol}//${location.host}` },
    { label: "fallback", origin: "https://REPLACE-WITH-YOUR-TUNNEL-HOSTNAME" },
];

const CONNECT_TIMEOUT_MS = 5000;
const HANDOFF_REFRESH_MS = 90000; // token TTL is 120s server-side; refresh with margin

const ui = {
    room: document.getElementById("room"),
    name: document.getElementById("name"),
    login: document.getElementById("login"),
    userlist: document.querySelector(".userlistbox"),
    chatbox: document.querySelector(".chatbox"),
    text: document.getElementById("text"),
    send: document.getElementById("send"),
    hangup: document.getElementById("hangup-button"),
    localVideo: document.getElementById("local_video"),
    remoteVideo: document.getElementById("received_video"),
    connStatus: document.getElementById("conn-status"),
    e2eeStatus: document.getElementById("e2ee-status"),
};

const state = {
    ws: null,
    config: null,
    activeEndpoint: null,
    peerId: null,
    username: null,
    room: null,
    peers: new Map(), // peerId -> username
    call: null, // { peerId, pc, polite, makingOffer, ignoreOffer }
    localStream: null,
    reconnectDelay: 1000,
    handoffToken: null,
    handoffTimer: null,
    joinParams: null, // { room, username } — remembered so reconnects can rejoin
};

const MEDIA = {
    audio: { echoCancellation: true, noiseSuppression: true },
    video: { width: { ideal: 1280 }, aspectRatio: { ideal: 1.3333 } },
};

// ---------------------------------------------------------------- utilities

const log = (...args) => console.log("[vchat]", ...args);

const write = (text, className = "") => {
    const line = document.createElement("div");
    line.className = `chat-line ${className}`.trim();
    line.textContent = text; // never innerHTML
    ui.chatbox.append(line);
    ui.chatbox.scrollTop = ui.chatbox.scrollHeight;
};

const stamp = (date) => new Date(date || Date.now()).toLocaleTimeString();

const send = (msg) => {
    if (state.ws?.readyState !== WebSocket.OPEN) return log("socket not open, dropped", msg.type);
    state.ws.send(JSON.stringify(msg));
};

function setConnStatus(text) {
    if (ui.connStatus) ui.connStatus.textContent = text;
}

// --------------------------------------------------------- endpoint racing

function withTimeout(promise, ms, label) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
        promise.then(
            (v) => {
                clearTimeout(timer);
                resolve(v);
            },
            (err) => {
                clearTimeout(timer);
                reject(err);
            }
        );
    });
}

function openSocket(url) {
    return withTimeout(
        new Promise((resolve, reject) => {
            const ws = new WebSocket(url, "json");
            ws.onopen = () => resolve(ws);
            ws.onerror = () => reject(new Error("socket error"));
            ws.onclose = (evt) => reject(new Error(`socket closed during handshake (${evt.code})`));
        }),
        CONNECT_TIMEOUT_MS,
        "socket open"
    );
}

/**
 * Fetch config + open the socket against one candidate endpoint. When this
 * isn't the endpoint we're already authenticated on, ride along a handoff
 * token — session cookies don't cross origins, this does, briefly.
 */
async function tryEndpoint(endpoint) {
    const isCrossOrigin = endpoint.origin !== ENDPOINTS[0].origin;
    const wantsToken = isCrossOrigin && state.handoffToken && state.handoffToken.expiresAt > Date.now();

    const config = await withTimeout(
        fetch(`${endpoint.origin}${API_PATH}/config`, { credentials: "include" }).then((res) => {
            if (!res.ok) throw new Error(`config ${res.status}`);
            return res.json();
        }),
        CONNECT_TIMEOUT_MS,
        "config fetch"
    );

    const scheme = endpoint.origin.startsWith("https") ? "wss" : "ws";
    const host = endpoint.origin.replace(/^https?:\/\//, "");
    const tokenQS = wantsToken ? `?token=${encodeURIComponent(state.handoffToken.token)}` : "";
    const url = `${scheme}://${host}${config.socketPath}${tokenQS}`;

    const ws = await openSocket(url);
    return { ws, config };
}

function orderedEndpoints() {
    if (!state.activeEndpoint) return ENDPOINTS;
    return [state.activeEndpoint, ...ENDPOINTS.filter((e) => e !== state.activeEndpoint)];
}

async function connect() {
    const room = (ui.room?.value || "lobby").trim();
    const username = (ui.name?.value || "").trim();
    state.joinParams = { room, username };

    const failures = [];

    for (const endpoint of orderedEndpoints()) {
        setConnStatus(`Connecting via ${endpoint.label}…`);

        try {
            const { ws, config } = await tryEndpoint(endpoint);

            state.ws = ws;
            state.config = config;
            state.activeEndpoint = endpoint;
            state.reconnectDelay = 1000;

            wireSocket(ws);
            send({ type: "join", ...state.joinParams });
            setConnStatus(`Connected (${endpoint.label})`);
            maybeStartHandoffRefresh(endpoint);
            return;
        } catch (err) {
            failures.push(`${endpoint.label}: ${err.message}`);
            log(`${endpoint.label} unreachable —`, err.message);
        }
    }

    setConnStatus("All endpoints unreachable");
    throw new Error(failures.join("; "));
}

function wireSocket(ws) {
    ws.onmessage = (evt) => handleMessage(JSON.parse(evt.data));

    ws.onclose = (evt) => {
        setComposerEnabled(false);
        setConnStatus(`Disconnected (${evt.code}) — reconnecting…`);
        write(`Disconnected. Reconnecting…`, "system");
        scheduleReconnect();
    };

    ws.onerror = () => log("socket error");
}

function scheduleReconnect() {
    const delay = Math.min(state.reconnectDelay, 30000);
    state.reconnectDelay *= 2;
    // connect() re-races every endpoint, so a primary outage fails over here
    // exactly the same way the initial connect does.
    setTimeout(() => connect().catch((err) => write(`Reconnect failed: ${err.message}`, "system")), delay);
}

/**
 * While connected to the primary origin, keep a fresh handoff token cached
 * so a *sudden* failover (primary dies mid-call) always has a valid one
 * ready rather than needing to fetch it from the endpoint that just died.
 */
function maybeStartHandoffRefresh(endpoint) {
    clearTimeout(state.handoffTimer);
    if (endpoint !== ENDPOINTS[0]) return; // only meaningful from the primary

    const refresh = async () => {
        try {
            const res = await fetch(`${endpoint.origin}${API_PATH}/token`, { credentials: "include" });
            if (res.ok) state.handoffToken = await res.json();
        } catch (err) {
            log("handoff token refresh failed", err.message);
        }
        state.handoffTimer = setTimeout(refresh, HANDOFF_REFRESH_MS);
    };

    refresh();
}

// ------------------------------------------------------------------- inbox

function handleMessage(msg) {
    switch (msg.type) {
        case "id":
            state.peerId = msg.peerId;
            return;

        case "joined":
            state.room = msg.room;
            state.username = msg.username;
            state.peers = new Map(msg.peers.map((p) => [p.peerId, p.username]));
            renderUserList();
            setComposerEnabled(true);
            return write(`Joined ${msg.room} as ${msg.username}`, "system");

        case "peer-joined":
            state.peers.set(msg.peerId, msg.username);
            renderUserList();
            return write(`${msg.username} joined at ${stamp(msg.date)}`, "system");

        case "peer-left":
            state.peers.delete(msg.peerId);
            renderUserList();
            if (state.call?.peerId === msg.peerId) closeCall();
            return write(`${msg.username || "A user"} left`, "system");

        case "userlist":
            state.peers = new Map(msg.users.map((u) => [u.peerId, u.username]));
            return renderUserList();

        case "message":
            return write(`(${stamp(msg.date)}) ${msg.username}: ${msg.text}`);

        case "video-offer":
        case "video-answer":
            return handleDescription(msg);

        case "new-ice-candidate":
            return handleCandidate(msg);

        case "e2e-key":
            return handleE2eKey(msg);

        case "hang-up":
            write(`${msg.username} hung up`, "system");
            return closeCall();

        case "error":
            return write(`Server error: ${msg.reason}`, "system");

        default:
            log("unhandled message", msg);
    }
}

// --------------------------------------------------------------------- chat

function setComposerEnabled(enabled) {
    ui.text.disabled = !enabled;
    ui.send.disabled = !enabled;
}

function sendChat() {
    const text = ui.text.value.trim();
    if (!text) return;

    send({ type: "message", text });
    ui.text.value = "";
}

function renderUserList() {
    ui.userlist.replaceChildren();

    for (const [peerId, username] of state.peers) {
        const item = document.createElement("li");
        item.textContent = username;
        item.dataset.peerId = peerId;
        item.title = "Click to start a video call";
        item.addEventListener("click", () => invite(peerId));
        ui.userlist.append(item);
    }
}

// --------------------------------------------------------------------- call

/**
 * Perfect negotiation: the peer with the lexicographically smaller id is
 * "polite" and yields on collision. Both sides can offer at any time without
 * the rollback special-casing the sample needed.
 */
function createPeerConnection(peerId) {
    const pc = new RTCPeerConnection({ iceServers: state.config.iceServers });

    const call = {
        peerId,
        pc,
        polite: state.peerId < peerId,
        makingOffer: false,
        ignoreOffer: false,
    };

    state.call = call;
    setE2eeStatus("negotiating");

    // Kick off the ECDH exchange immediately so the key is usually ready
    // before the first frame needs encrypting — the worker just drops frames
    // in the brief window before it isn't.
    E2EE.begin(peerId).then((publicKey) => {
        if (publicKey) send({ type: "e2e-key", to: peerId, publicKey });
    });

    pc.onicecandidate = ({ candidate }) => {
        if (candidate) send({ type: "new-ice-candidate", to: peerId, candidate });
    };

    pc.ontrack = ({ track, receiver, streams }) => {
        E2EE.attachReceiverTransform(receiver, peerId);

        track.onunmute = () => {
            if (ui.remoteVideo.srcObject !== streams[0]) ui.remoteVideo.srcObject = streams[0];
        };
    };

    pc.onnegotiationneeded = async () => {
        try {
            call.makingOffer = true;
            await pc.setLocalDescription();
            send({ type: "video-offer", to: peerId, sdp: pc.localDescription });
        } catch (err) {
            log("negotiation failed", err);
        } finally {
            call.makingOffer = false;
        }
    };

    pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === "failed") pc.restartIce();
    };

    pc.onconnectionstatechange = () => {
        if (["closed", "failed", "disconnected"].includes(pc.connectionState)) closeCall();
    };

    ui.hangup.disabled = false;
    return call;
}

function addTrackWithE2ee(call, track, stream) {
    const sender = call.pc.addTrack(track, stream);
    E2EE.attachSenderTransform(sender, call.peerId);
    return sender;
}

async function startLocalMedia() {
    if (state.localStream) return state.localStream;

    try {
        state.localStream = await navigator.mediaDevices.getUserMedia(MEDIA);
    } catch (err) {
        reportMediaError(err);
        throw err;
    }

    ui.localVideo.srcObject = state.localStream;
    return state.localStream;
}

async function invite(peerId) {
    if (peerId === state.peerId) return write("You cannot call yourself.", "system");
    if (state.call) return write("You already have a call open.", "system");

    write(`Calling ${state.peers.get(peerId)}…`, "system");

    const call = createPeerConnection(peerId);
    const stream = await startLocalMedia();

    // addTrack fires negotiationneeded, which sends the offer.
    stream.getTracks().forEach((track) => addTrackWithE2ee(call, track, stream));
}

async function handleDescription(msg) {
    const description = msg.sdp;

    if (!state.call) {
        if (msg.type !== "video-offer") return;
        createPeerConnection(msg.from);
        write(`Incoming call from ${msg.username}`, "system");
    }

    const call = state.call;
    if (call.peerId !== msg.from) return; // busy with someone else

    const offerCollision =
        description.type === "offer" && (call.makingOffer || call.pc.signalingState !== "stable");

    call.ignoreOffer = !call.polite && offerCollision;
    if (call.ignoreOffer) return;

    await call.pc.setRemoteDescription(description);

    if (description.type !== "offer") return;

    await startLocalMedia();

    const senders = call.pc.getSenders();
    state.localStream.getTracks().forEach((track) => {
        if (!senders.some((sender) => sender.track === track)) {
            addTrackWithE2ee(call, track, state.localStream);
        }
    });

    await call.pc.setLocalDescription();
    send({ type: "video-answer", to: msg.from, sdp: call.pc.localDescription });
}

async function handleCandidate(msg) {
    const call = state.call;
    if (!call || call.peerId !== msg.from) return;

    try {
        await call.pc.addIceCandidate(msg.candidate);
    } catch (err) {
        if (!call.ignoreOffer) log("addIceCandidate failed", err);
    }
}

async function handleE2eKey(msg) {
    const call = state.call;
    if (!call || call.peerId !== msg.from) return;

    await E2EE.receivePeerKey(msg.from, msg.publicKey);
    setE2eeStatus("ready", E2EE.getFingerprint(msg.from));
}

function setE2eeStatus(callState, fingerprint) {
    if (!ui.e2eeStatus) return;

    if (!E2EE.isSupported()) {
        ui.e2eeStatus.textContent = "⚠ E2EE unsupported in this browser — media relies on DTLS-SRTP only";
        return;
    }

    if (callState === "negotiating") {
        ui.e2eeStatus.textContent = "🔓 Negotiating end-to-end key…";
    } else if (callState === "ready") {
        ui.e2eeStatus.textContent = `🔒 End-to-end encrypted — verify: ${fingerprint}`;
    } else {
        ui.e2eeStatus.textContent = "";
    }
}

function hangUp() {
    if (state.call) send({ type: "hang-up", to: state.call.peerId });
    closeCall();
}

function closeCall() {
    const call = state.call;
    state.call = null;

    if (call) {
        E2EE.teardown(call.peerId);
        call.pc.getTransceivers().forEach((t) => t.stop());
        call.pc.close();
    }

    state.localStream?.getTracks().forEach((track) => track.stop());
    state.localStream = null;

    ui.localVideo.srcObject = null;
    ui.remoteVideo.srcObject = null;
    ui.hangup.disabled = true;
    setE2eeStatus(null);
}

function reportMediaError(err) {
    const messages = {
        NotFoundError: "No camera or microphone was found.",
        NotAllowedError: "Camera/microphone permission was denied.",
        NotReadableError: "Another application is using your camera.",
    };

    write(messages[err.name] || `Media error: ${err.message}`, "system");
    closeCall();
}

// ------------------------------------------------------------------- wiring

ui.login.addEventListener("click", () =>
    connect().catch((err) => write(`Connect failed: ${err.message}`, "system"))
);
ui.send.addEventListener("click", sendChat);
ui.hangup.addEventListener("click", hangUp);
ui.text.addEventListener("keyup", (evt) => {
    if (evt.key === "Enter") sendChat();
});
window.addEventListener("beforeunload", () => {
    if (state.call) hangUp();
    clearTimeout(state.handoffTimer);
    state.ws?.close(1000, "page unload");
});