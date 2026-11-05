import { FEAR, Router } from '../gui/jquery.gui.js';
import navModule from './modules/nav.js';
import cursorModule from './modules/cursor.js';
import clockModule from './modules/clock.js';
import statsModule from './modules/stats.js';
import testimonialsModule from './modules/testimonials.js';
import parallaxModule from './modules/parallax.js';
import contentModule from './modules/content.js';
import contactModule from './modules/contact.js';
import introModule from './modules/intro.js';
void Router;
FEAR.configure({ name: 'fear-spa', logLevel: 1 });
const modules = { nav: navModule, cursor: cursorModule, clock: clockModule, stats: statsModule, testimonials: testimonialsModule, parallax: parallaxModule, content: contentModule, contact: contactModule, intro: introModule };
Object.entries(modules).forEach(([name, module]) => FEAR.create(name, module));
$(async function () {
    try {
        await FEAR.boot();
        await Promise.all(Object.keys(modules).map((name) => FEAR.start(name)));
        console.info('[fear-spa] application started');
    } catch (error) { console.error('[fear-spa] start failed:', error); }
});
