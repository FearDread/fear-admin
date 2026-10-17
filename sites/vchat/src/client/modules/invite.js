import { state } from '../app/state.js';

const ENDPOINT = '/fear/api/vchat/email/invite';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// "Invite by email" in the room sidebar. Binds on view:room like the other modules.
export default function inviteModule(sb) {
    // state.room is the room code; tolerate an object with an id just in case.
    const roomId = () => (typeof state.room === 'string' ? state.room : state.room && state.room.id);

    function bind() {
        const $form = sb.$('#invite-form');
        if (!$form.length) return;

        const $email = sb.$('#invite-email');
        const $note = sb.$('#invite-note');
        const $btn = sb.$('#send-invite');
        const $status = sb.$('#invite-status');

        const show = (text, isError) => {
            $status.text(text).toggleClass('error', !!isError);
        };

        $form.on('submit', async (event) => {
            event.preventDefault();

            const email = String($email.val() || '').trim();
            const room = roomId();

            if (!EMAIL.test(email)) return show('Enter a valid email address.', true);
            if (!room) return show('No active room.', true);

            $btn.prop('disabled', true);
            show('Sending…');

            try {
                const res = await fetch(ENDPOINT, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, room, message: String($note.val() || '').trim() || undefined }),
                });

                if (res.status === 401) {
                    window.dispatchEvent(new Event('vchat:unauthorized'));
                    return;
                }

                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.message || 'Could not send the invite.');

                show(`Invite sent to ${email}.`);
                $email.val('');
                $note.val('');
            } catch (err) {
                show(err.message, true);
            } finally {
                $btn.prop('disabled', false);
            }
        });
    }

    return {
        load() {
            sb.add('view:room', bind);
        },
        unload() {
            sb.remove('view:room', bind);
        },
    };
}