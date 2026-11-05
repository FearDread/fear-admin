import { INTERACTIVE } from '../config.js';
export default function cursorModule(sb) {
    let ringTimer;
    return {
        load() {
            const $dot = sb.$('#cur'), $ring = sb.$('#cur-r'), $body = sb.$('body');
            $(document).on('mousemove.cursor', (e) => {
                $dot.css({ left: e.clientX, top: e.clientY });
                clearTimeout(ringTimer);
                ringTimer = setTimeout(() => $ring.css({ left: e.clientX, top: e.clientY }), 70);
            });
            $(document).on('mouseover.cursor', (e) => {
                $body.toggleClass('cur-grow', $(e.target).closest(INTERACTIVE).length > 0);
            });
        },
        unload() { clearTimeout(ringTimer); $(document).off('.cursor'); }
    };
}
