import { PROJECTS, TECH } from '../data/resume.js';
import { prefersReducedMotion } from '../config.js';

/**
 * Storm background. Lightning forks down from the clouds and strikes "towers"
 * built from resume.js: every project is a labeled tower (red = active work,
 * teal = finished), and TECH entries are small unlabeled antennas between them.
 * A struck tower flashes its title and status. Cursor sometimes draws a strike.
 * Section changes and the Konami easter egg (bg:chaos) trigger extra bolts.
 */

// ── Tuning ──────────────────────────────────────────────────────────────────
const STRIKE_EVERY = [2800, 7000]; // ms between ambient strikes
const FLASH_MAX = 0.5;             // peak screen flash (overlay alpha is flash * 0.12)
const RAIN = true;                 // set false to drop the rain streaks

const TEAL = '10,240,200', RED = '255,69,96', WHITE = '244,240,232';
const ACTIVE = /progress|develop|ongoing/i;
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const short = (s) => (s.length > 24 ? s.slice(0, 23) + '\u2026' : s);

export default function backgroundModule(sb) {
    let canvas, ctx, w = 0, h = 0, raf = 0, last = 0, clock = 0, resizeTimer;
    let flash = 0, nextStrike = 1800, lastAnchor = -1, reduced = false;
    const clouds = [], drops = [], anchors = [], bolts = [], rings = [], queue = [];
    const mouse = { x: -9999, y: -9999 };

    // ── Towers from resume.js ───────────────────────────────────────────────
    function buildAnchors() {
        anchors.length = 0;
        const P = PROJECTS.map((p) => ({ label: short(p.title), status: p.status || '', hot: ACTIVE.test(p.status || ''), labeled: true }));
        const T = TECH.slice(0, 8).map((name) => ({ label: name, status: '', hot: false, labeled: false }));
        const order = [];
        while (P.length || T.length) { if (P.length) order.push(P.shift()); if (T.length) order.push(T.shift()); }
        order.forEach((a, k) => {
            a.fx = clamp((k + 0.5) / order.length + rand(-0.012, 0.012), 0.04, 0.96);
            a.fy = a.labeled ? rand(0.82, 0.9) : rand(0.88, 0.94);
            a.vx = rand(-0.0016, 0.0016);
            a.flash = 0; a.x = 0; a.y = 0;
            anchors.push(a);
        });
        layout();
    }

    function layout() { anchors.forEach((a) => { a.x = a.fx * w; a.y = a.fy * h; }); }

    // ── Bolt geometry (midpoint displacement + branches) ────────────────────
    function path(x1, y1, x2, y2, rough) {
        let pts = [[x1, y1], [x2, y2]], d = rough;
        for (let i = 0; i < 6; i++) {
            const next = [pts[0]];
            for (let j = 0; j < pts.length - 1; j++) {
                const a = pts[j], b = pts[j + 1];
                const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1, off = (Math.random() - 0.5) * d;
                next.push([(a[0] + b[0]) / 2 - (dy / len) * off, (a[1] + b[1]) / 2 + (dx / len) * off], b);
            }
            pts = next; d *= 0.55;
        }
        return pts;
    }

    function targetOf(t) { return t.ref ? { x: t.ref.x, y: t.ref.y - 14, hot: t.ref.hot } : { x: t.x, y: t.y, hot: false }; }

    function buildBolt(target, life) {
        const t = targetOf(target);
        const sx = clamp(t.x + rand(-w * 0.22, w * 0.22), 0, w), sy = -20;
        const main = path(sx, sy, t.x, t.y, Math.hypot(t.x - sx, t.y - sy) * 0.3);
        const branches = [];
        const n = 3 + ((Math.random() * 3) | 0);
        for (let i = 0; i < n; i++) {
            const o = main[Math.floor(main.length * rand(0.15, 0.8))];
            const ex = o[0] + (Math.random() < 0.5 ? -1 : 1) * rand(60, 220), ey = o[1] + rand(60, 200);
            branches.push(path(o[0], o[1], ex, ey, Math.hypot(ex - o[0], ey - o[1]) * 0.4));
        }
        return { main, branches, born: clock, life, seed: rand(0, 100), sx, sy, tx: t.x, ty: t.y, col: t.hot ? RED : TEAL };
    }

    function strike(target, life) {
        const b = buildBolt(target, life || rand(650, 950));
        bolts.push(b);
        if (bolts.length > 8) bolts.shift();
        flash = Math.min(FLASH_MAX, flash + 0.35);
        rings.push({ x: b.tx, y: b.ty, r: 4, a: 1, col: b.col });
        if (target.ref) target.ref.flash = 1;
    }

    function randomStrike() {
        if (document.hidden || !w) return;
        let target;
        if (mouse.x > -1000 && Math.random() < 0.12) {
            target = { x: mouse.x, y: mouse.y };
        } else {
            let i, tries = 0;
            do { i = Math.random() < 0.6 ? Math.floor(Math.random() * anchors.length) : (anchors.findIndex((a) => a.labeled) + Math.floor(Math.random() * PROJECTS.length)) % anchors.length; } while ((i === lastAnchor || i < 0) && ++tries < 6);
            lastAnchor = i;
            target = { ref: anchors[i] };
        }
        strike(target);
        if (Math.random() < 0.5) queue.push({ t: rand(120, 260), fn: () => strike(target, rand(350, 500)) });
    }

    function barrage() {
        for (let i = 0; i < 6; i++) queue.push({ t: i * 190 + rand(0, 90), fn: () => strike({ ref: anchors[(Math.random() * anchors.length) | 0] }, rand(500, 800)) });
    }

    // ── Simulation ──────────────────────────────────────────────────────────
    function buildScene() {
        clouds.length = 0;
        const scale = clamp(w / 1440, 0.6, 1.3);
        for (let i = 0; i < 5; i++) clouds.push({ x: ((i + 0.5) / 5) * w + rand(-60, 60), y: rand(-0.05, 0.08) * h, r: rand(260, 460) * scale, vx: rand(-6, 6), lit: rand(0.6, 1) });
        drops.length = 0;
        if (RAIN && !reduced) {
            const count = clamp(Math.round((w * h) / 26000), 20, 70);
            for (let i = 0; i < count; i++) drops.push({ x: rand(0, w), y: rand(0, h), len: rand(10, 22), v: rand(0.5, 0.9) });
        }
    }

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth; h = window.innerHeight;
        canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildScene(); layout();
        if (reduced) staticFrame();
    }

    function update(dt) {
        clock += dt;
        anchors.forEach((a) => {
            a.fx += a.vx * (dt / 16);
            if (a.fx < 0.03 || a.fx > 0.97) a.vx *= -1;
            a.x = a.fx * w; a.y = a.fy * h;
            a.flash = Math.max(0, a.flash - dt / 700);
        });
        flash = Math.max(0, flash - dt / 450);
        clouds.forEach((c) => { c.x += (c.vx * dt) / 1000; if (c.x < -c.r) c.x = w + c.r; if (c.x > w + c.r) c.x = -c.r; });
        drops.forEach((d) => { d.y += d.v * dt; d.x -= d.v * dt * 0.15; if (d.y > h) { d.y = -d.len; d.x = rand(0, w + 60); } });

        for (let i = queue.length - 1; i >= 0; i--) { queue[i].t -= dt; if (queue[i].t <= 0) { const q = queue.splice(i, 1)[0]; q.fn(); } }
        nextStrike -= dt;
        if (nextStrike <= 0) { nextStrike = rand(STRIKE_EVERY[0], STRIKE_EVERY[1]); randomStrike(); }

        for (let i = bolts.length - 1; i >= 0; i--) if (clock - bolts[i].born >= bolts[i].life) bolts.splice(i, 1);
        for (let i = rings.length - 1; i >= 0; i--) { const r = rings[i]; r.r += dt * 0.09; r.a -= dt / 800; if (r.a <= 0) rings.splice(i, 1); }
    }

    // ── Drawing ─────────────────────────────────────────────────────────────
    function drawClouds() {
        clouds.forEach((c) => {
            let g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
            g.addColorStop(0, 'rgba(40,52,84,0.35)'); g.addColorStop(1, 'rgba(40,52,84,0)');
            ctx.fillStyle = g; ctx.fillRect(c.x - c.r, c.y - c.r, c.r * 2, c.r * 2);
            if (flash > 0.01) {
                g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
                g.addColorStop(0, `rgba(${TEAL},${(flash * 0.35 * c.lit).toFixed(3)})`); g.addColorStop(1, `rgba(${TEAL},0)`);
                ctx.globalCompositeOperation = 'lighter';
                ctx.fillStyle = g; ctx.fillRect(c.x - c.r, c.y - c.r, c.r * 2, c.r * 2);
                ctx.globalCompositeOperation = 'source-over';
            }
        });
        const g = ctx.createLinearGradient(0, h * 0.72, 0, h);
        g.addColorStop(0, `rgba(${TEAL},0)`); g.addColorStop(1, `rgba(${TEAL},${(0.04 + flash * 0.1).toFixed(3)})`);
        ctx.fillStyle = g; ctx.fillRect(0, h * 0.72, w, h * 0.28);
    }

    function drawRain() {
        if (!drops.length) return;
        ctx.strokeStyle = 'rgba(180,210,230,0.10)'; ctx.lineWidth = 1; ctx.beginPath();
        drops.forEach((d) => { ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + d.len * 0.15, d.y - d.len); });
        ctx.stroke();
    }

    function drawAnchors() {
        ctx.font = '11px ui-monospace, Menlo, Consolas, monospace'; ctx.textAlign = 'center';
        anchors.forEach((a) => {
            const col = a.hot ? RED : TEAL, f = a.flash;
            ctx.strokeStyle = `rgba(${f > 0.05 ? col : WHITE},${(0.22 + f * 0.7).toFixed(3)})`;
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x, a.y - 14); ctx.stroke();
            ctx.fillStyle = `rgba(${f > 0.05 ? col : WHITE},${(0.35 + f * 0.65).toFixed(3)})`;
            ctx.beginPath(); ctx.arc(a.x, a.y - 14, (a.labeled ? 2.4 : 1.6) * (1 + f * 1.4), 0, Math.PI * 2); ctx.fill();
            if (a.labeled && (w > 900 || f > 0.05)) {
                const x = clamp(a.x, 90, w - 90);
                ctx.fillStyle = `rgba(${WHITE},${(0.28 + f * 0.7).toFixed(3)})`;
                ctx.fillText(a.label, x, a.y + 6);
                if (f > 0.3 && a.status) { ctx.fillStyle = `rgba(${col},${Math.min(1, f).toFixed(3)})`; ctx.fillText(`[${a.status}]`, x, a.y + 20); }
            }
        });
        ctx.textAlign = 'start';
    }

    function trace(pts) { ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); }

    function drawBolt(b, fixed) {
        let a;
        if (fixed != null) a = fixed;
        else {
            const age = clock - b.born, t = age / b.life;
            const flick = 0.65 + 0.35 * Math.sin(age * 0.07 + b.seed) * Math.sin(age * 0.031 + b.seed * 2);
            a = clamp((1 - t) * (1 - t) * flick + 0.45 * Math.exp(-Math.pow((t - 0.4) / 0.05, 2)), 0, 1);
        }
        if (a <= 0.003) return;
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        [[10, 0.1, b.col], [4, 0.35, b.col], [1.6, 1, WHITE]].forEach(([lw, al, col]) => {
            ctx.strokeStyle = `rgba(${col},${(a * al).toFixed(3)})`;
            ctx.lineWidth = lw; ctx.beginPath(); trace(b.main); ctx.stroke();
            ctx.lineWidth = lw * 0.5; ctx.beginPath(); b.branches.forEach(trace); ctx.stroke();
        });
        [[b.sx, b.sy + 30, 160], [b.tx, b.ty, 120]].forEach(([x, y, r]) => {
            const g = ctx.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0, `rgba(${b.col},${(a * 0.35).toFixed(3)})`); g.addColorStop(1, `rgba(${b.col},0)`);
            ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
        });
        ctx.globalCompositeOperation = 'source-over';
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        drawClouds(); drawRain(); drawAnchors();
        bolts.forEach((b) => drawBolt(b));
        rings.forEach((r) => { ctx.strokeStyle = `rgba(${r.col},${(Math.max(0, r.a) * 0.6).toFixed(3)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.stroke(); });
        if (flash > 0.005) { ctx.fillStyle = `rgba(180,255,245,${(flash * 0.12).toFixed(3)})`; ctx.fillRect(0, 0, w, h); }
    }

    // Reduced motion: one dim, frozen bolt over the clouds and towers.
    function staticFrame() {
        ctx.clearRect(0, 0, w, h);
        drawClouds(); drawAnchors();
        const pick = anchors.find((a) => a.labeled);
        if (pick) drawBolt(buildBolt({ ref: pick }, 1000), 0.28);
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
            reduced = prefersReducedMotion();
            buildAnchors();
            resize();
            $(window).on('resize.bg', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); })
                .on('mousemove.bg', (e) => setMouse(e.clientX, e.clientY))
                .on('touchmove.bg touchstart.bg', (e) => { const t = e.originalEvent.touches[0]; if (t) setMouse(t.clientX, t.clientY); })
                .on('mouseout.bg touchend.bg', () => setMouse(-9999, -9999));
            if (reduced) return;
            sb.add('section:change', (d) => {
                queue.push({ t: 250, fn: () => strike({ ref: anchors[d.name === 'work' ? anchors.findIndex((a) => a.labeled) + ((Math.random() * PROJECTS.length) | 0) : (Math.random() * anchors.length) | 0] }) });
            });
            sb.add('bg:chaos', barrage);
            raf = requestAnimationFrame(frame);
        },
        unload() { cancelAnimationFrame(raf); clearTimeout(resizeTimer); queue.length = 0; $(window).off('.bg'); }
    };
}