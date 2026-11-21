// background: animated canvas behind the app. Keeps the console's look (dark grid, green top-left glow,
// red bottom-right glow) and animates it: drifting glows plus either matrix rain or a network that reacts
// to the cursor. Mode comes from settings.background: 'matrix' | 'network' | 'off'.
//
// Cheap on purpose: 30 fps cap, DPR capped at 1.5, pauses while the tab is hidden, and with
// prefers-reduced-motion it paints one still frame instead of animating.

const $ = window.jQuery;

export const BG_MODES = ['matrix', 'network', 'off'];

const GREEN = '43,255,136';
const RED = '236,17,17';
const GLYPHS = '0123456789abcdef<>/{}[]$#%&*+=;:'.split('');
const CELL = 16;      // matrix column width / row height (css px)
const TRAIL = 16;     // glyphs per matrix trail
const LINK = 135;     // network link distance (css px)
const FRAME_MS = 1000 / 30;

const rnd = (a, b) => a + Math.random() * (b - a);
const glyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

export default function register(FEAR) {
  FEAR.create('background', (sb) => {
    let canvas = null;
    let ctx = null;
    let mode = 'matrix';
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let t = 0;
    let cols = [];
    let nodes = [];
    const mouse = { x: -9999, y: -9999 };
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ------------------------------------------------------------------ layers

    // Soft drifting glows: the animated version of the radial gradients the CSS used to paint.
    const glows = () => {
      const r = Math.max(w, h);
      const orb = (x, y, rad, rgb, a) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, `rgba(${rgb},${a})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      };
      orb(w * (0.2 + 0.06 * Math.sin(t * 0.00018)), h * (0.02 + 0.05 * Math.cos(t * 0.00023)), r * 0.62, GREEN, 0.085);
      orb(w * (0.95 + 0.05 * Math.cos(t * 0.00021)), h * (1.05 + 0.05 * Math.sin(t * 0.00017)), r * 0.55, RED, 0.085);
    };

    const initMatrix = () => {
      const n = Math.ceil(w / CELL);
      const rows = Math.ceil(h / CELL);
      cols = Array.from({ length: n }, () => ({
        y: rnd(-rows, rows),
        speed: rnd(0.12, 0.42),
        red: Math.random() < 0.1,
        chars: Array.from({ length: TRAIL }, glyph),
      }));
    };

    const drawMatrix = () => {
      const rows = h / CELL;
      ctx.font = `${CELL - 3}px "JetBrains Mono", monospace`;
      ctx.textBaseline = 'top';
      cols.forEach((c, i) => {
        c.y += reduced ? 0 : c.speed;
        if (c.y - TRAIL > rows) { c.y = rnd(-TRAIL, 0); c.speed = rnd(0.12, 0.42); c.red = Math.random() < 0.1; }
        if (Math.random() < 0.08) c.chars[(Math.random() * TRAIL) | 0] = glyph();
        const rgb = c.red ? RED : GREEN;
        for (let k = 0; k < TRAIL; k++) {
          const row = Math.floor(c.y) - k;
          if (row < 0 || row > rows) continue;
          const a = k === 0 ? 0.55 : 0.2 * (1 - k / TRAIL);
          ctx.fillStyle = k === 0 ? `rgba(215,255,232,${a})` : `rgba(${rgb},${a})`;
          ctx.fillText(c.chars[k], i * CELL, row * CELL);
        }
      });
    };

    const initNetwork = () => {
      const n = Math.max(28, Math.min(90, Math.round((w * h) / 19000)));
      nodes = Array.from({ length: n }, () => ({
        x: rnd(0, w), y: rnd(0, h), vx: rnd(-0.22, 0.22), vy: rnd(-0.22, 0.22), red: Math.random() < 0.12,
      }));
    };

    const drawNetwork = () => {
      nodes.forEach((p) => {
        if (!reduced) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
      });
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(${a.red || b.red ? RED : GREEN},${0.32 * (1 - d / LINK)})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y); // the cursor acts as an extra, brighter node
        if (dm < LINK * 1.5) {
          ctx.strokeStyle = `rgba(${GREEN},${0.5 * (1 - dm / (LINK * 1.5))})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      nodes.forEach((p) => {
        ctx.fillStyle = `rgba(${p.red ? RED : GREEN},0.75)`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); ctx.fill();
      });
    };

    // ------------------------------------------------------------------ loop

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      glows();
      if (mode === 'matrix') drawMatrix(); else if (mode === 'network') drawNetwork();
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (now - last < FRAME_MS) return;
      t = now;
      last = now;
      frame();
    };

    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const run = () => {
      stop();
      if (mode === 'off' || !ctx) return;
      if (reduced || document.hidden) { frame(); return; } // still frame; visibilitychange restarts the loop
      raf = requestAnimationFrame(tick);
    };

    const resize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initMatrix();
      initNetwork();
      if (mode !== 'off') frame();
    };

    const setMode = (m) => {
      mode = BG_MODES.includes(m) ? m : 'matrix';
      $('body').toggleClass('bg-live', mode !== 'off');
      $(canvas).toggleClass('hidden', mode === 'off');
      if (mode === 'off' && ctx) ctx.clearRect(0, 0, w, h);
      run();
    };

    let resizeTimer = 0;

    return {
      load() {
        canvas = document.createElement('canvas');
        canvas.className = 'bg-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        document.body.prepend(canvas);
        ctx = canvas.getContext('2d');

        $(window)
          .on('resize.bg', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { resize(); run(); }, 150); })
          .on('mousemove.bg', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; })
          .on('mouseleave.bg blur.bg', () => { mouse.x = -9999; mouse.y = -9999; });
        $(document).on('visibilitychange.bg', run);

        sb.add('settings:changed', (s) => { if (s.background !== mode) setMode(s.background); });
        sb.add('background:cycle', () => {
          const next = BG_MODES[(BG_MODES.indexOf(mode) + 1) % BG_MODES.length];
          return sb.fire('settings:set', { background: next });
        });

        return sb.fire('settings:get').then((s) => { resize(); setMode(s.background); });
      },
      unload() {
        stop();
        $(window).off('.bg');
        $(document).off('.bg');
        $('body').removeClass('bg-live');
        if (canvas) canvas.remove();
      },
    };
  });
}
