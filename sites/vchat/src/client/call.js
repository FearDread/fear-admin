import { E2EE } from './../e2ee/e2ee.js';

/**
 * Full-mesh WebRTC. The joiner offers to everyone already present; existing peers answer.
 * Hooks: onLocal, onJoined, onPeer, onPeerGone, onPeerState, onChat, onSafety, onError, onDisconnected.
 */
export class Call {
    constructor({ signal, iceServers, room, username, hooks = {} }) {
        this.signal = signal;
        this.iceServers = iceServers;
        this.room = room;
        this.username = username;
        this.hooks = hooks;
        this.peers = new Map();
        this.local = null;
        this.myId = null;
        this.closed = false;
        this.e2ee = new E2EE();
    }

    emit(name, ...args) {
        if (this.hooks[name]) this.hooks[name](...args);
    }

    async start() {
        try {
            this.local = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            });
        } catch (err) {
            // No camera (or denied): still allow joining with audio only.
            this.local = await navigator.mediaDevices.getUserMedia({ audio: true });
        }

        this.e2ee.init();
        this.emit('onLocal', this.local);
        this.wire();
        this.signal.send({ type: 'join', room: this.room, username: this.username });
    }

    wire() {
        const s = this.signal;

        s.on('joined', (m) => {
            this.myId = m.peerId;
            this.emit('onJoined', m);
            return Promise.all(m.peers.map((p) => this.connect(p)));
        });
        s.on('peer-joined', (m) => {
            this.ensure(m.peerId, m.username);
        });
        s.on('peer-left', (m) => this.drop(m.peerId));
        s.on('video-offer', (m) => this.onOffer(m));
        s.on('video-answer', (m) => this.onAnswer(m));
        s.on('new-ice-candidate', (m) => this.onCandidate(m));
        s.on('e2e-key', (m) => this.onKey(m));
        s.on('message', (m) => this.emit('onChat', m, m.from === this.myId));
        s.on('error', (m) => this.emit('onError', m));
        s.on('close', () => {
            if (!this.closed) this.emit('onDisconnected');
        });
    }

    ensure(id, username) {
        const existing = this.peers.get(id);
        if (existing) return existing;

        const pc = new RTCPeerConnection({ iceServers: this.iceServers });
        const peer = { id, username: username || 'guest', pc, stream: new MediaStream(), queued: [], remoteSet: false };
        this.peers.set(id, peer);

        this.local.getTracks().forEach((track) => {
            const sender = pc.addTrack(track, this.local);
            if (this.e2ee.supported) {
                sender.transform = this.e2ee.senderTransform(id);
                if (track.kind === 'video') this.preferVp8(pc, sender);
            }
        });

        pc.ontrack = (event) => {
            if (this.e2ee.supported) event.receiver.transform = this.e2ee.receiverTransform(id);
            peer.stream.addTrack(event.track);
        };
        pc.onicecandidate = (event) => {
            if (event.candidate) this.signal.send({ type: 'new-ice-candidate', to: id, candidate: event.candidate });
        };
        pc.onconnectionstatechange = () => this.emit('onPeerState', peer, pc.connectionState);

        if (this.e2ee.supported) {
            peer.keyReady = this.e2ee.begin(id).then((publicKey) => {
                this.signal.send({ type: 'e2e-key', to: id, publicKey });
            });
        }

        this.emit('onPeer', peer);
        return peer;
    }

    // The frame transform only knows VP8's clear-header layout, so pin video to it.
    preferVp8(pc, sender) {
        try {
            const transceiver = pc.getTransceivers().find((t) => t.sender === sender);
            const caps = RTCRtpSender.getCapabilities('video');
            if (!transceiver || !caps || !transceiver.setCodecPreferences) return;

            const codecs = caps.codecs.filter((c) => /^video\/(vp8|rtx)$/i.test(c.mimeType));
            if (codecs.some((c) => /vp8/i.test(c.mimeType))) transceiver.setCodecPreferences(codecs);
        } catch (err) {
            console.warn('could not pin VP8:', err);
        }
    }

    async connect({ peerId, username }) {
        const peer = this.ensure(peerId, username);
        const offer = await peer.pc.createOffer();
        await peer.pc.setLocalDescription(offer);
        this.signal.send({ type: 'video-offer', to: peerId, sdp: peer.pc.localDescription });
    }

    async onOffer(m) {
        const peer = this.ensure(m.from, m.username);
        await peer.pc.setRemoteDescription(m.sdp);
        peer.remoteSet = true;
        await this.flush(peer);

        const answer = await peer.pc.createAnswer();
        await peer.pc.setLocalDescription(answer);
        this.signal.send({ type: 'video-answer', to: m.from, sdp: peer.pc.localDescription });
    }

    async onAnswer(m) {
        const peer = this.peers.get(m.from);
        if (!peer) return;
        await peer.pc.setRemoteDescription(m.sdp);
        peer.remoteSet = true;
        await this.flush(peer);
    }

    async onCandidate(m) {
        const peer = this.peers.get(m.from);
        if (!peer) return;
        if (!peer.remoteSet) return peer.queued.push(m.candidate);
        await peer.pc.addIceCandidate(m.candidate).catch(() => {});
    }

    async flush(peer) {
        const pending = peer.queued.splice(0);
        await Promise.all(pending.map((c) => peer.pc.addIceCandidate(c).catch(() => {})));
    }

    async onKey(m) {
        if (!this.e2ee.supported) return;
        const peer = this.ensure(m.from, m.username);
        await peer.keyReady;
        const code = await this.e2ee.accept(m.from, m.publicKey);
        this.emit('onSafety', peer, code);
    }

    drop(id) {
        const peer = this.peers.get(id);
        if (!peer) return;
        peer.pc.close();
        this.e2ee.drop(id);
        this.peers.delete(id);
        this.emit('onPeerGone', id);
    }

    setAudio(on) {
        this.local.getAudioTracks().forEach((t) => (t.enabled = on));
    }

    setVideo(on) {
        this.local.getVideoTracks().forEach((t) => (t.enabled = on));
    }

    sendChat(text) {
        this.signal.send({ type: 'message', text });
    }

    close() {
        if (this.closed) return;
        this.closed = true;
        this.signal.send({ type: 'leave' });
        [...this.peers.keys()].forEach((id) => this.drop(id));
        if (this.local) this.local.getTracks().forEach((t) => t.stop());
        // let the leave message flush before the socket goes away
        setTimeout(() => {
            this.signal.close();
            this.e2ee.dispose();
        }, 150);
    }
}
