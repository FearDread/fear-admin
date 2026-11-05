import { prefersReducedMotion } from '../config.js';

/**
 * Animated "network" background: drifting nodes, links, packets in flight, and
 * nodes that randomly fail (with an error code) and reboot a few seconds later.
 * The cursor pushes nodes around and links to the ones near it.
 */
const TEAL = '#0af0c8', RED = '#ff4560', WHITE = '#f4f0e8';
const LINK = 150, MOUSE_R = 180, ERRORS = ['503', 'SEGFAULT', 'OOM', 'DNS?', 'ETIMEDOUT', '502', 'EOF', 'kernel panic'];
const rand = (a, b) => a + Math.random() * (b - a);

export default function backgroundModule(sb) {
    let canvas, ctx, w = 0, h = 0, raf = 0, last = 0, nextFail = 3000, nextPacket = 400, resizeTimer;
    const nodes = [], packets = [], rings = [], mouse = { x: -9999, y: -9999 };

    const makeNode = () => ({ x: rand(0, w), y: rand(0, h), vx: rand(-0.16, 0.16), vy: rand(-0.16, 0.16), r: rand(1.1, 2.6), down: 0, a: 1, pulse: 0, label: '' });
    const upNodes = () => nodes.filter((n) => n.down <= 0);

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth; h = window.innerHeight;
        canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const want = Math.max(24, Math.min(90, Math.round((w * h) / 17000)));
        while (nodes.length < want) nodes.push(makeNode());
        nodes.length = want;
        nodes.forEach((n) => { n.x = Math.min(n.x, w); n.y = Math.min(n.y, h); });
        if (prefersReducedMotion()) { update(0); draw(); }
    }

    function fail(n, ms) {
        if (n.down > 0) return;
        n.down = ms || rand(2600, 4200); n.label = ERRORS[(Math.random() * ERRORS.length) | 0];
        rings.push({ x: n.x, y: n.y, r: 2, a: 1 });
    }

    function spawnPacket() {
        if (packets.length > 40) return;
        const up = upNodes(); if (up.length < 2) return;
        const a = up[(Math.random() * up.length) | 0];
        const near = up.filter((b) => b !== a && Math.hypot(a.x - b.x, a.y - b.y) < LINK);
        if (!near.length) return;
        const b = near[(Math.random() * near.length) | 0];
        packets.push({ a, b, t: 0, dur: Math.max(450, Math.hypot(a.x - b.x, a.y - b.y) * 7) });
    }

    function update(dt) {
        const k = dt / 16;
        nodes.forEach((n) => {
            n.x += n.vx * k; n.y += n.vy * k;
            if (n.x < 0 || n.x > w) { n.vx *= -1; n.x = Math.max(0, Math.min(w, n.x)); }
            if (n.y < 0 || n.y > h) { n.vy *= -1; n.y = Math.max(0, Math.min(h, n.y)); }
            const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.hypot(dx, dy);
            if (d < 140 && d > 0.1) { const f = (1 - d / 140) * 0.7 * k; n.x += (dx / d) * f; n.y += (dy / d) * f; }
            if (n.down > 0) n.down = Math.max(0, n.down - dt);
            n.a += ((n.down > 0 ? 0.12 : 1) - n.a) * Math.min(1, dt / 300);
            n.pulse = Math.max(0, n.pulse - dt / 400);
        });

        nextFail -= dt;
        if (nextFail <= 0) {
            nextFail = rand(2500, 6000);
            const maxDown = Math.max(2, Math.round(nodes.length / 14));
            if (nodes.filter((n) => n.down > 0).length < maxDown) { const up = upNodes(); if (up.length) fail(up[(Math.random() * up.length) | 0]); }
        }
        nextPacket -= dt;
        if (nextPacket <= 0) { nextPacket = rand(220, 600); spawnPacket(); }

        for (let i = packets.length - 1; i >= 0; i--) {
            const p = packets[i];
            p.t += dt / p.dur;
            if (p.a.down > 0 || p.b.down > 0) {
                rings.push({ x: p.a.x + (p.b.x - p.a.x) * p.t, y: p.a.y + (p.b.y - p.a.y) * p.t, r: 1, a: 0.7 });
                packets.splice(i, 1);
            } else if (p.t >= 1) { p.b.pulse = 1; packets.splice(i, 1); }
        }
        for (let i = rings.length - 1; i >= 0; i--) { const r = rings[i]; r.r += dt * 0.045; r.a -= dt / 900; if (r.a <= 0) rings.splice(i, 1); }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        ctx.lineWidth = 1; ctx.strokeStyle = TEAL;
        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i]; if (a.down > 0) continue;
            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j]; if (b.down > 0) continue;
                const d = Math.hypot(a.x - b.x, a.y - b.y); if (d > LINK) continue;
                ctx.globalAlpha = (1 - d / LINK) * 0.2 * Math.min(a.a, b.a);
                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
        }
        ctx.strokeStyle = RED;
        nodes.forEach((n) => {
            if (n.down > 0) return;
            const d = Math.hypot(n.x - mouse.x, n.y - mouse.y); if (d > MOUSE_R) return;
            ctx.globalAlpha = (1 - d / MOUSE_R) * 0.55;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        });

        ctx.font = '10px ui-monospace, Menlo, Consolas, monospace';
        nodes.forEach((n) => {
            ctx.globalAlpha = n.a; ctx.fillStyle = n.down > 0 ? RED : WHITE;
            ctx.beginPath(); ctx.arc(n.x, n.y, n.r * (1 + n.pulse * 1.6), 0, Math.PI * 2); ctx.fill();
            if (n.down > 0) { ctx.globalAlpha = Math.min(1, n.down / 500) * 0.9; ctx.fillText(n.label, n.x + 8, n.y - 8); }
        });

        ctx.fillStyle = TEAL; ctx.shadowColor = TEAL; ctx.shadowBlur = 8; ctx.globalAlpha = 1;
        packets.forEach((p) => {
            const t = p.t < 0.5 ? 2 * p.t * p.t : 1 - Math.pow(-2 * p.t + 2, 2) / 2;
            ctx.beginPath(); ctx.arc(p.a.x + (p.b.x - p.a.x) * t, p.a.y + (p.b.y - p.a.y) * t, 2, 0, Math.PI * 2); ctx.fill();
        });
        ctx.shadowBlur = 0;

        ctx.strokeStyle = RED;
        rings.forEach((r) => { ctx.globalAlpha = Math.max(0, r.a) * 0.6; ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.stroke(); });
        ctx.globalAlpha = 1;
    }

    function frame(now) {
        const dt = Math.min(50, now - (last || now)); last = now;
        update(dt); draw();
        raf = requestAnimationFrame(frame);
    }

    const setMouse = (x, y) => { mouse.x = x; mouse.y = y; };

    return {
        load() {
            canvas = document.getElementById('bg-canvas');
            ctx = canvas && canvas.getContext('2d');
            if (!ctx) return sb.warn('background: no canvas');
            resize();
            $(window).on('resize.bg', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); })
                .on('mousemove.bg', (e) => setMouse(e.clientX, e.clientY))
                .on('touchmove.bg touchstart.bg', (e) => { const t = e.originalEvent.touches[0]; if (t) setMouse(t.clientX, t.clientY); })
                .on('mouseout.bg touchend.bg', () => setMouse(-9999, -9999));
            sb.add('section:change', () => { for (let i = 0; i < 8; i++) setTimeout(spawnPacket, i * 70); });
            sb.add('bg:chaos', () => nodes.forEach((n) => fail(n, rand(2500, 5000))));
            if (!prefersReducedMotion()) raf = requestAnimationFrame(frame);
        },
        unload() { cancelAnimationFrame(raf); clearTimeout(resizeTimer); $(window).off('.bg'); }
    };
}
