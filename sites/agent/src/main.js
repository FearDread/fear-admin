// Boots the FEAR GUI framework, registers the modules and starts them.
import { FEAR } from './gui/jquery_gui.js';
import settings from './modules/settings.js';
import api from './modules/api.js';
import overview from './modules/overview.js';
import terminal from './modules/terminal.js';
import chat from './modules/chat.js';
import shell from './modules/shell.js';
import background from './modules/background.js';

FEAR.configure({ logLevel: 1 });

[settings, background, api, overview, terminal, chat, shell].forEach((register) => register(FEAR));

// View modules start before the shell: the shell's router mounts the first view as soon as it starts.
const order = ['settings', 'background', 'api', 'overview', 'terminal', 'chat', 'shell'];

FEAR.utils.run.series(order.map((id) => () => FEAR.start(id)))
  .then(() => FEAR.broker.emit('app:ready'))
  .then(() => FEAR.broker.fire('api:restore')) // pick up an existing session cookie, then initialise the agent
  .catch((err) => {
    console.error(err);
    window.jQuery('#app').html(`<div class="boot boot-err">Failed to start: ${String(err && err.message || err).replace(/[<>&]/g, '')}</div>`);
  });
