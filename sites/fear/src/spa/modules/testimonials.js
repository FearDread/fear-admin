export default function testimonialsModule(sb) {
    let i = 0, timer;
    const cards = () => $('.testi-card');
    const dots = () => $('.testi-dot');
    function show(n) {
        const count = cards().length; if (!count) return;
        i = (n + count) % count;
        cards().removeClass('active').eq(i).addClass('active');
        dots().removeClass('active').eq(i).addClass('active');
    }
    const start = () => { clearInterval(timer); timer = setInterval(() => show(i + 1), 4000); };
    return {
        load() {
            $(document).on('click.testi', '.testi-dot', function () { show($(this).index()); start(); });
            sb.add('testimonials:refresh', () => { show(0); start(); }); start();
        },
        unload() { clearInterval(timer); $(document).off('.testi'); }
    };
}
