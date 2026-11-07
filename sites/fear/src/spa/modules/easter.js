// Konami code → fake kernel panic. Because every sysadmin has one nightmare they're fond of.
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const PANIC = [
    'Kernel panic - not syncing: Attempted to kill init!',
    'CPU: 0 PID: 1 Comm: garrett Not tainted (mostly)',
    'Call Trace:',
    ' dump_stack+0x42/0x69',
    ' panic+0x1337/0x4200',
    ' existential_dread+0xff/0xff',
    '---[ end Kernel panic ]---',
    '',
    '...just kidding. Everything is fine.',
    '(Everything is not fine. Press any key to pretend.)'
];

export default function easterModule(sb) {
    let seq = 0, timers = [];

    function close() { timers.forEach(clearTimeout); timers = []; $('.panic').remove(); $(document).off('keydown.panic click.panic'); }

    function panic() {
        if ($('.panic').length) return;
        sb.emit('bg:chaos');
        const $pre = $('<pre></pre>');
        $('<div class="panic" role="alert"></div>').append($pre).appendTo('body');
        PANIC.forEach((line, n) => timers.push(setTimeout(() => $pre.append(document.createTextNode(line + '\n')), n * 260)));
        timers.push(setTimeout(close, PANIC.length * 260 + 4000));
        setTimeout(() => $(document).on('keydown.panic click.panic', close), 400);
    }

    return {
        load() {
            console.info('%cFEAR // garrett', 'color:#c9a84c;font:600 14px monospace', '\nPoking around in devtools? Respect. Try the Konami code.');
            $(document).on('keydown.easter', (e) => {
                const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
                seq = key === KONAMI[seq] ? seq + 1 : (key === KONAMI[0] ? 1 : 0);
                if (seq === KONAMI.length) { seq = 0; panic(); }
            });
        },
        unload() { close(); $(document).off('.easter'); }
    };
}
