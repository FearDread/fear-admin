import './jquery-global.js'; // must stay first: jquery.gui.js reads the global $
import { FEAR, Router } from './jquery.gui.js';
import { api } from './api.js';
import { state, go } from './state.js';
import { views } from './views.js';
import authModule from './modules/auth.js';
import lobbyModule from './modules/lobby.js';
import roomModule from './modules/room.js';

FEAR.configure({ logLevel: 2, name: 'vchat' });

FEAR.create('auth', authModule);
FEAR.create('lobby', lobbyModule);
FEAR.create('room', roomModule);

// Auth/room guard. Returning false cancels the load; go() then sends the router elsewhere.
function guard(name) {
    if (!state.user && name !== 'login') return go('login'), false;
    if (state.user && name === 'login') return go('lobby'), false;
    if (name === 'room' && !state.room) return go('lobby'), false;
}

// Any API call that comes back 401 (expired token, suspended account) sends the user to sign in.
window.addEventListener('vchat:unauthorized', () => {
    state.user = null;
    state.config = null;
    go('login');
});

async function main() {
    try {
        const session = await api.session();
        state.user = session.authenticated ? session.userId : null;
        if (!state.name && session.displayName) state.name = session.displayName;
    } catch (err) {
        state.user = null;
    }

    await FEAR.boot(); // once, before the parallel module starts (boot() isn't re-entrant)
    await FEAR.start(['auth', 'lobby', 'room']);

    const router = new Router({
        container: '#app',
        defaultRoute: 'lobby',
        pushState: false, // navigate() only loads a route via hashchange
        animations: { enabled: true, fadeSpeed: 120 },
        callbacks: { beforeRouteChange: guard },
    });

    Object.entries(views).forEach(([name, view]) => {
        router.addRoute(name, {
            title: view.title,
            html: view.html,
            callback: () => FEAR.broker.emit(`view:${name}`),
        });
    });

    router.init();
}

main().catch((err) => {
    console.error('vchat failed to start:', err);
    document.getElementById('app').textContent = 'vchat failed to start. Check the console.';
});
