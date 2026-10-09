import { Call } from '../call.js';
import { SignalClient } from '../signal.js';
import { state, go, ensureConfig } from '../state.js';

const REASONS = {
    'room-full': 'This room is full.',
    'rate-limited': 'Sending too fast — some signaling was dropped.',
    'invalid-room': 'That room code is not valid.',
};

export default function roomModule(sb) {
    const $ = sb.$;
    let call = null;

    const status = (text) => $('#room-status').text(text || '');

    function addTile(id, name, stream, isLocal) {
        if ($(`.tile[data-peer="${id}"]`).length) return;

        const video = document.createElement('video');
        video.autoplay = true;
        video.playsInline = true;
        video.muted = !!isLocal;
        video.srcObject = stream;

        $('<figure class="tile">')
            .attr('data-peer', id)
            .append(video, $('<figcaption>').text(isLocal ? `${name} (you)` : name))
            .appendTo('#grid');
    }

    const removeTile = (id) => $(`.tile[data-peer="${id}"]`).remove();

    function addChat(msg, mine) {
        const $log = $('#chat-log');
        $('<li>')
            .toggleClass('me', mine)
            .append($('<b>').text(mine ? 'You' : msg.username), $('<span>').text(msg.text))
            .appendTo($log);
        $log.scrollTop($log[0].scrollHeight);
    }

    function setSafety(peer, code) {
        $('#safety-list li').filter((_, el) => $(el).attr('data-peer') === peer.id).remove();
        $('<li>')
            .attr('data-peer', peer.id)
            .append($('<span>').text(`${peer.username}: `), $('<code>').text(code))
            .appendTo('#safety-list');
    }

    function cleanup() {
        if (!call) return;
        call.close();
        call = null;
    }

    function bindControls() {
        $('#btn-mic').on('click', (e) => {
            const muted = $(e.currentTarget).attr('aria-pressed') !== 'true';
            call && call.setAudio(!muted);
            $(e.currentTarget).attr('aria-pressed', String(muted)).text(muted ? 'Unmute' : 'Mute');
        });

        $('#btn-cam').on('click', (e) => {
            const off = $(e.currentTarget).attr('aria-pressed') !== 'true';
            call && call.setVideo(!off);
            $(e.currentTarget).attr('aria-pressed', String(off)).text(off ? 'Camera on' : 'Camera off');
        });

        $('#btn-leave').on('click', () => {
            cleanup();
            state.room = null;
            go('lobby');
        });

        $('#copy-invite').on('click', async (e) => {
            const link = `${location.origin}${location.pathname}?room=${encodeURIComponent(state.room)}`;
            try {
                await navigator.clipboard.writeText(link);
                $(e.currentTarget).text('Link copied');
            } catch (err) {
                $(e.currentTarget).text(link);
            }
        });

        $('#chat-form').on('submit', (e) => {
            e.preventDefault();
            const text = $('#chat-input').val().trim();
            if (!text || !call) return;
            call.sendChat(text);
            $('#chat-input').val('');
        });
    }

    async function enter() {
        if (!state.room) return go('lobby');

        $('#room-name').text(state.room);
        bindControls();
        status('Starting camera and microphone…');

        const signal = new SignalClient();

        call = new Call({
            signal,
            room: state.room,
            username: state.name,
            iceServers: [],
            hooks: {
                onLocal: (stream) => addTile('local', state.name, stream, true),
                onJoined: (m) => {
                    state.name = m.username; // server may de-duplicate the name
                    status(m.peers.length ? '' : 'You are the only one here. Share the invite link.');
                },
                onPeer: (peer) => addTile(peer.id, peer.username, peer.stream, false),
                onPeerGone: (id) => {
                    removeTile(id);
                    $('#safety-list li').filter((_, el) => $(el).attr('data-peer') === id).remove();
                },
                onPeerState: (peer, st) => {
                    if (st === 'failed') status(`Connection to ${peer.username} failed.`);
                },
                onChat: (msg, mine) => addChat(msg, mine),
                onSafety: (peer, code) => setSafety(peer, code),
                onError: (m) => {
                    status(REASONS[m.reason] || `Error: ${m.reason}`);
                    if (m.reason === 'room-full') setTimeout(() => go('lobby'), 2000);
                },
                onDisconnected: () => status('Connection lost. Leave and rejoin the room.'),
            },
        });

        try {
            const config = await ensureConfig();
            call.iceServers = config.iceServers;

            await signal.connect(config);
            await call.start();

            const secure = call.e2ee.supported;
            $('#e2ee-badge')
                .addClass(secure ? 'on' : 'off')
                .text(secure ? 'End-to-end encrypted' : 'Not end-to-end encrypted')
                .attr('title', secure ? '' : 'This browser lacks encoded-transform support; media is encrypted hop-by-hop only.');
        } catch (err) {
            const denied = err && (err.name === 'NotAllowedError' || err.name === 'NotFoundError');
            status(denied ? 'Camera or microphone is blocked or missing.' : err.message);
            cleanup();
        }
    }

    return {
        load() {
            sb.add('view:room', () => enter());
            // Leaving the room by any route (back button, hash edit) must hang up.
            sb.add('route:start', (data) => {
                if (data.path !== 'room') cleanup();
            });
            window.addEventListener('beforeunload', cleanup);
            return Promise.resolve();
        },
        unload() {
            cleanup();
            return Promise.resolve();
        },
    };
}
