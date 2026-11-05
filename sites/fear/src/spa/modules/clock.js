import { pad } from '../utils.js';

// Shows Killeen time (so visitors know exactly how rude 3 AM is) plus time wasted on this site.
export default function clockModule() {
    let timer;
    const t0 = Date.now();
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Chicago', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
    const mood = (h) => h < 5 ? 'Awake. Regrettably.' : h < 9 ? 'Coffee loading\u2026' : h < 18 ? 'Available for work' : h < 22 ? 'Available (ominously)' : 'Technically available';

    function tick() {
        const clock = fmt.format(new Date());
        const spent = Math.floor((Date.now() - t0) / 1000);
        $('#clock').text(`KILLEEN ${clock}`);
        $('#wasted').text(`${pad(Math.floor(spent / 60))}:${pad(spent % 60)} wasted here`);
        $('#avail-text').text(mood(Number(clock.slice(0, 2))));
    }

    return {
        load() { tick(); timer = setInterval(tick, 1000); },
        unload() { clearInterval(timer); }
    };
}
