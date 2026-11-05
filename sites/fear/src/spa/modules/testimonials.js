// Auto-rotates only while the testimonials section is on screen, pauses on hover/hidden tab.
export default function testimonialsModule(sb) {
    let i = 0, timer, visible = false, hovering = false;
    const cards = () => $('.testi-card');
    const dots = () => $('.testi-dot');

    function show(n) {
        const count = cards().length; if (!count) return;
        i = (n + count) % count;
        cards().removeClass('active').eq(i).addClass('active');
        dots().removeClass('active').eq(i).addClass('active');
    }
    function restart() {
        clearInterval(timer);
        if (visible && !hovering && !document.hidden) timer = setInterval(() => show(i + 1), 5000);
    }

    return {
        load() {
            $(document)
                .on('click.testi', '.testi-dot', function () { show($(this).index()); restart(); })
                .on('mouseenter.testi', '.testi-layout', () => { hovering = true; restart(); })
                .on('mouseleave.testi', '.testi-layout', () => { hovering = false; restart(); })
                .on('visibilitychange.testi', restart)
                .on('keydown.testi', (e) => {
                    if (!visible || $(e.target).closest('input,textarea,select').length) return;
                    if (e.key === 'ArrowRight') { show(i + 1); restart(); }
                    if (e.key === 'ArrowLeft') { show(i - 1); restart(); }
                });
            sb.add('testimonials:refresh', () => { show(0); restart(); });
            sb.add('section:change', (d) => { visible = d.name === 'clients'; if (visible) show(i); restart(); });
            visible = $('#s5').hasClass('active'); restart();
        },
        unload() { clearInterval(timer); $(document).off('.testi'); }
    };
}
