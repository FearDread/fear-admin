// Boots the FEAR GUI framework, registers the app and starts them.
import { FEAR } from './gui/jquery.gui.js';
import settings from './app/settings.js';
import api from './app/api.js';
import overview from './app/overview.js';
import terminal from './app/terminal.js';
import chat from './app/chat.js';
import shell from './app/shell.js';

FEAR.configure({ logLevel: 1 });

[settings, api, overview, terminal, chat, shell].forEach((register) => register(FEAR));

// View app start before the shell: the shell's router mounts the first view as soon as it starts.
const order = ['settings', 'api', 'overview', 'terminal', 'chat', 'shell'];

FEAR.utils.run.series(order.map((id) => () => FEAR.start(id)))
    .then(() => FEAR.broker.emit('app:ready'))
    .then(() => FEAR.fire('api:restore')) // pick up an existing session cookie, then initialise the agent
    .catch((err) => {
        console.error(err);
        window.jQuery('#app').html(`<div class="boot boot-err">Failed to start: ${String(err && err.message || err).replace(/[<>&]/g, '')}</div>`);
    });