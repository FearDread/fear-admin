import { api } from '../app/api.js';
import { state, go } from '../app/state.js';

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

    function bindRegister() {
        const $error = $('#register-error');

        $('#register-form').on('submit', async (e) => {
            e.preventDefault();
            console.log('sumbitting');
            $error.prop('hidden', true);

            try {
                const email = $('$register-email').val().trim();
                const password = $('#register-password').val();
                const firstName = $('#firstName').val();
                const lastName = $('#lastName').val();
                const displayName = firstName + ' ' + lastName;
                const match = $('#repeat-password').val();

                const userData = { password, email, firstName, lastName, displayName }

                if (pass !== match) {
                    $error.text('Passwords do not match').prop('hidden', false);
                    return;
                } 
                await api.register(userData);

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
            sb.add('view:register', () => bindRegister());

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
