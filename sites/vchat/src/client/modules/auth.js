import { api } from '../api.js';
import { state, go } from '../state.js';

export default function authModule(sb) {
    const $ = sb.$;

    function bindLogin() {
        const $error = $('#login-error');

        $('#login-form').on('submit', async (e) => {
            e.preventDefault();
            $error.prop('hidden', true);

            try {
                await api.login($('#login-email').val().trim(), $('#login-password').val());

                // WebSocket auth rides on the session cookie, so confirm one exists.
                const session = await api.session();
                if (!session.authenticated) throw new Error('Signed in, but no session was created');

                state.user = session.userId;
                if (!state.name && session.displayName) state.name = session.displayName;
                go('lobby');
            } catch (err) {
                $error.text(err.message).prop('hidden', false);
            }
        });
    }

    return {
        load() {
            sb.add('view:login', () => bindLogin());

            sb.add('auth:logout', async () => {
                try {
                    await api.logout();
                } catch (err) {
                    /* session may already be gone */
                }
                state.user = null;
                state.config = null;
                go('login');
            });

            return Promise.resolve();
        },
    };
}
