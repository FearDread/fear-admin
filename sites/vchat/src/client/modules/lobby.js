import { api } from '../api.js';
import { state, go, setName, ROOM_PATTERN } from '../state.js';

// Accept either a bare code or a pasted invite link.
function parseRoom(value) {
    const v = value.trim();
    try {
        return new URL(v).searchParams.get('room') || '';
    } catch (err) {
        return v;
    }
}

export default function lobbyModule(sb) {
    const $ = sb.$;

    function fail(message) {
        $('#lobby-error').text(message).prop('hidden', false);
    }

    function join(room) {
        const name = $('#display-name').val().trim();

        if (!name) return fail('Enter a name so others know who you are.');
        if (!ROOM_PATTERN.test(room)) return fail('Room codes use letters, numbers, - and _ (up to 64 characters).');

        setName(name);
        state.room = room;
        state.pendingRoom = null;
        history.replaceState(null, '', location.pathname + location.hash);
        go('room');
    }

    return {
        load() {
            sb.add('view:lobby', () => {
                $('#display-name').val(state.name);
                $('#room-code').val(state.pendingRoom || '');
                if (state.pendingRoom) $('#display-name').trigger('focus');

                $('#logout').on('click', () => sb.emit('auth:logout'));

                $('#create-room').on('click', async () => {
                    try {
                        const { room } = await api.createRoom();
                        join(room);
                    } catch (err) {
                        fail(err.message);
                    }
                });

                $('#join-room').on('click', () => join(parseRoom($('#room-code').val())));
                $('#room-code').on('keydown', (e) => {
                    if (e.key === 'Enter') join(parseRoom($('#room-code').val()));
                });
            });

            return Promise.resolve();
        },
    };
}
