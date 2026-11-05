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
import typewriterModule from './modules/typewriter.js';
import terminalModule from './modules/terminal.js';
import easterModule from './modules/easter.js';

void Router;


// `content` renders the DOM the other modules read, so it always starts first.
const modules = {
    content: contentModule,
    nav: navModule,
    cursor: cursorModule,
    clock: clockModule,
    stats: statsModule,
    testimonials: testimonialsModule,
    parallax: parallaxModule,
    typewriter: typewriterModule,
    terminal: terminalModule,
    contact: contactModule,
    easter: easterModule,
    intro: introModule
};

FEAR.configure({ name: 'fear-spa', logLevel: 1 });
Object.entries(modules).forEach(([name, module]) => FEAR.create(name, module));

$(function () {
    const rest = Object.keys(modules).filter((name) => name !== 'content');

    FEAR.boot()
        .then(() => FEAR.start('content'))
        .then(() => Promise.allSettled(rest.map((name) => FEAR.start(name))))
        .then((results) => {
            results.forEach((r, n) => {
                if (r.status === 'rejected') console.error(`[fear-spa] module "${rest[n]}" failed:`, r.reason);
            });
            console.info('[fear-spa] application started');
        })
        .catch((error) => console.error('[fear-spa] start failed:', error));
});