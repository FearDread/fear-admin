import { SECTIONS } from '../config.js';
export default function statsModule(sb) {
    function run() {
        $('.sk-fill').each(function () { $(this).css('width', $(this).data('w') + '%'); });
        $('.counter').each(function () {
            const $el = $(this);
            const plus = $el.find('.stat-sup').length ? '<span class="stat-sup">+</span>' : '';
            const target = parseInt($el.data('t'), 10);
            $({ n: 0 }).animate({ n: target }, {
                duration: 1500, easing: 'swing',
                step() { $el.html(plus + (Math.floor(this.n) || '')); },
                complete() { $el.html(plus + target); }
            });
        });
    }
    return { load() {
        sb.add('section:change', (d) => { if (d.name === 'stats') run(); });
        if ($('.section.active').attr('id') === 's' + SECTIONS.indexOf('stats')) run();
    }};
}
