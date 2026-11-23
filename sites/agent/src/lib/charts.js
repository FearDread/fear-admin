// Canvas charts and tween helpers for the nginx dashboard (ported from nginx.js, no chart library).
// Colours match the console theme. With prefers-reduced-motion the tweens collapse to an instant jump.

export const GREEN = '#2bff88';
export const CYAN = '#38d9ff';
export const AMBER = '#ffb52e';
export const RED = '#ff3b4f';
const DIM = '#17212c';
const AXIS = '#6f8194';
const MONO = '"JetBrains Mono", ui-monospace, Menlo, monospace';

const REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const TAU = Math.PI * 2;

export const ease = (p) => 1 - Math.pow(1 - p, 3);
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const hhmm = (t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export function resample(arr, n) {
  if (!arr.length) return new Array(n).fill(0);
  if (arr.length === n) return arr.slice();
  const out = [];
  for (let i = 0; i < n; i++) {
    const pos = n === 1 ? 0 : (i * (arr.length - 1)) / (n - 1);
    const lo = Math.floor(pos);
    const hi = Math.min(arr.length - 1, lo + 1);
    out.push(arr[lo] + (arr[hi] - arr[lo]) * (pos - lo));
  }
  return out;
}

// Probe gaps (null) take the previous value so lines stay continuous.
export function fillGaps(values) {
  let last = 0;
  return values.map((v) => (v == null ? last : (last = v)));
}

/** Animated count-up on a jQuery element that remembers its last value in data('v'). */
export function countTo($el, to, suffix) {
  const from = parseFloat($el.data('v')) || 0;
  $el.data('v', to);
  if (REDUCED) { $el.text(Math.round(to) + (suffix || '')); return; }
  const t0 = performance.now();
  (function step(now) {
    const p = clamp((now - t0) / 700, 0, 1);
    $el.text(Math.round(from + (to - from) * ease(p)) + (suffix || ''));
    if (p < 1 && document.body.contains($el[0])) requestAnimationFrame(step);
  })(t0);
}

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.parentNode.clientWidth;
  const h = canvas.clientHeight || canvas.parentNode.clientHeight;
  canvas.width = Math.max(1, w * dpr);
  canvas.height = Math.max(1, h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

// ------------------------------------------------------------------ line chart

export function LineChart(canvas) {
  const self = this;
  this.canvas = canvas;
  this.from = []; this.to = []; this.labels = [];
  this.t0 = performance.now(); this.born = this.t0;
  this.dur = REDUCED ? 1 : 800;
  this.hover = -1;
  this.alive = true;
  this.size = setupCanvas(canvas);

  this.ro = new ResizeObserver(() => { self.size = setupCanvas(canvas); });
  this.ro.observe(canvas.parentNode);
  this.onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    const n = self.to.length;
    if (n < 2) return;
    self.hover = clamp(Math.round(((e.clientX - r.left - 44) / (self.size.w - 44 - 14)) * (n - 1)), 0, n - 1);
  };
  this.onLeave = () => { self.hover = -1; };
  canvas.addEventListener('mousemove', this.onMove);
  canvas.addEventListener('mouseleave', this.onLeave);

  this.loop = this.loop.bind(this);
  requestAnimationFrame(this.loop);
}

LineChart.prototype = {
  current(now) {
    const p = ease(clamp((now - this.t0) / this.dur, 0, 1));
    return this.to.map((v, i) => this.from[i] + (v - this.from[i]) * p);
  },
  setData(values, labels) {
    const now = performance.now();
    const next = fillGaps(values);
    this.from = resample(this.current(now), next.length);
    this.to = next;
    this.labels = labels;
    this.t0 = now;
  },
  destroy() {
    this.alive = false;
    this.ro.disconnect();
    this.canvas.removeEventListener('mousemove', this.onMove);
    this.canvas.removeEventListener('mouseleave', this.onLeave);
  },
  loop(now) {
    if (!this.alive || !document.body.contains(this.canvas)) return;
    this.draw(now);
    requestAnimationFrame(this.loop);
  },
  draw(now) {
    const { ctx, w, h } = this.size;
    const L = 44, R = 14, T = 12, B = 24;
    ctx.clearRect(0, 0, w, h);

    const vals = this.current(now);
    const n = vals.length;
    if (n < 2) return;

    const max = Math.max(20, Math.ceil((Math.max.apply(null, vals) * 1.2) / 10) * 10);
    const X = (i) => L + (i * (w - L - R)) / (n - 1);
    const Y = (v) => T + (1 - v / max) * (h - T - B);

    ctx.font = `11px ${MONO}`;
    ctx.textBaseline = 'middle';
    for (let g = 0; g <= 4; g++) {
      const y = T + (g / 4) * (h - T - B);
      ctx.strokeStyle = 'rgba(43,255,136,0.08)';
      ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(w - R, y); ctx.stroke();
      ctx.fillStyle = AXIS; ctx.textAlign = 'right';
      ctx.fillText(Math.round(max * (1 - g / 4)) + 'ms', L - 6, y);
    }
    ctx.textAlign = 'center';
    [0, Math.floor((n - 1) / 2), n - 1].forEach((i) => {
      if (this.labels[i]) ctx.fillText(this.labels[i], X(i), h - 8);
    });

    // draw-in reveal on first render
    const reveal = REDUCED ? 1 : ease(clamp((now - this.born) / 1100, 0, 1));
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, L + (w - L) * reveal, h); ctx.clip();

    const grad = ctx.createLinearGradient(0, T, 0, h - B);
    grad.addColorStop(0, 'rgba(43,255,136,0.28)'); grad.addColorStop(1, 'rgba(43,255,136,0)');
    ctx.beginPath(); ctx.moveTo(X(0), h - B);
    vals.forEach((v, i) => ctx.lineTo(X(i), Y(v)));
    ctx.lineTo(X(n - 1), h - B); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();

    ctx.beginPath();
    vals.forEach((v, i) => (i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v))));
    ctx.strokeStyle = GREEN; ctx.lineWidth = 2; ctx.lineJoin = 'round';
    ctx.shadowColor = GREEN; ctx.shadowBlur = 8; ctx.stroke(); ctx.shadowBlur = 0;
    ctx.restore();

    // pulsing head
    const pulse = REDUCED ? 0.5 : Math.abs(Math.sin(now / 500));
    const hx = X(n - 1), hy = Y(vals[n - 1]);
    ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(hx, hy, 3, 0, TAU); ctx.fill();
    ctx.strokeStyle = `rgba(43,255,136,${0.5 - 0.4 * pulse})`;
    ctx.beginPath(); ctx.arc(hx, hy, 5 + 5 * pulse, 0, TAU); ctx.stroke();

    if (this.hover >= 0 && this.hover < n) {
      const i = this.hover, x = X(i), y = Y(vals[i]);
      ctx.strokeStyle = 'rgba(56,217,255,0.5)';
      ctx.beginPath(); ctx.moveTo(x, T); ctx.lineTo(x, h - B); ctx.stroke();
      ctx.fillStyle = CYAN; ctx.beginPath(); ctx.arc(x, y, 4, 0, TAU); ctx.fill();
      const label = `${this.labels[i] || ''}  ${Math.round(this.to[i])}ms`;
      const tw = ctx.measureText(label).width + 14;
      const tx = clamp(x - tw / 2, L, w - R - tw);
      ctx.fillStyle = '#080b10'; ctx.strokeStyle = CYAN;
      ctx.fillRect(tx, T, tw, 20); ctx.strokeRect(tx, T, tw, 20);
      ctx.fillStyle = CYAN; ctx.textAlign = 'left'; ctx.fillText(label, tx + 7, T + 10);
    }
  },
};

// ------------------------------------------------------------------ health ring

export function Ring(canvas) {
  const self = this;
  this.canvas = canvas;
  this.alive = true;
  this.up = 0; this.total = 0; this.shown = 0; this.start = 0; this.target = 0;
  this.t0 = performance.now();
  this.size = setupCanvas(canvas);
  this.ro = new ResizeObserver(() => { self.size = setupCanvas(canvas); });
  this.ro.observe(canvas.parentNode);
  this.loop = this.loop.bind(this);
  requestAnimationFrame(this.loop);
}

Ring.prototype = {
  set(up, total) {
    this.start = this.shown;
    this.target = total ? up / total : 0;
    this.up = up; this.total = total;
    this.t0 = performance.now();
  },
  destroy() { this.alive = false; this.ro.disconnect(); },
  loop(now) {
    if (!this.alive || !document.body.contains(this.canvas)) return;
    this.draw(now);
    requestAnimationFrame(this.loop);
  },
  draw(now) {
    const { ctx, w, h } = this.size;
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 16;
    ctx.clearRect(0, 0, w, h);

    const p = REDUCED ? 1 : ease(clamp((now - this.t0) / 1000, 0, 1));
    this.shown = this.start + (this.target - this.start) * p;

    // rotating tick ring (static when motion is reduced)
    const head = REDUCED ? 0 : (now / 2500) % 1;
    for (let i = 0; i < 60; i++) {
      const f = i / 60, a = f * TAU - Math.PI / 2;
      const glow = REDUCED ? 0 : Math.max(0, 1 - ((head - f + 1) % 1) * 5);
      ctx.strokeStyle = `rgba(56,217,255,${0.12 + glow * 0.8})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * (r + 6), cy + Math.sin(a) * (r + 6));
      ctx.lineTo(cx + Math.cos(a) * (r + 11), cy + Math.sin(a) * (r + 11));
      ctx.stroke();
    }

    ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.strokeStyle = DIM; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();

    const s = -Math.PI / 2;
    if (this.total && this.shown < 0.999) {
      ctx.strokeStyle = RED; ctx.shadowColor = RED; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(cx, cy, r, s + TAU * this.shown, s + TAU); ctx.stroke();
    }
    if (this.shown > 0.002) {
      ctx.strokeStyle = GREEN; ctx.shadowColor = GREEN; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(cx, cy, r, s, s + TAU * this.shown); ctx.stroke();
    }
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#d8ffee'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `700 28px ${MONO}`;
    ctx.fillText(Math.round(this.shown * 100) + '%', cx, cy - 6);
    ctx.fillStyle = AXIS; ctx.font = `11px ${MONO}`;
    ctx.fillText(`${this.up} / ${this.total} vhosts up`, cx, cy + 16);
  },
};

