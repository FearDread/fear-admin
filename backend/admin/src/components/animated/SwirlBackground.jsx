import { useEffect, useRef } from "react";

/* ---------- Simplex noise (3D only, ported from the bundled SimplexNoise) ---------- */

const F3 = 1 / 3;
const G3 = 1 / 6;

const GRAD3 = new Float32Array([
  1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0,
  1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1,
  0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
]);

function buildPermutationTable(random) {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 0; i < 255; i++) {
    const r = i + ~~(random() * (256 - i));
    const tmp = p[i];
    p[i] = p[r];
    p[r] = tmp;
  }
  return p;
}

function createNoise3D(random = Math.random) {
  const p = buildPermutationTable(random);
  const perm = new Uint8Array(512);
  const permMod12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    permMod12[i] = perm[i] % 12;
  }

  return function noise3D(xin, yin, zin) {
    let n0, n1, n2, n3;
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);
    const t = (i + j + k) * G3;
    const x0 = xin - (i - t);
    const y0 = yin - (j - t);
    const z0 = zin - (k - t);

    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 1, 0];
      else if (x0 >= z0) [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 0, 1];
      else [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 1, 0, 1];
    } else if (y0 < z0) [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 0, 1, 1];
    else if (x0 < z0) [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 0, 1, 1];
    else [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 1, 1, 0];

    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3;

    const ii = i & 255, jj = j & 255, kk = k & 255;

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 < 0) n0 = 0;
    else {
      const gi = permMod12[ii + perm[jj + perm[kk]]] * 3;
      t0 *= t0;
      n0 = t0 * t0 * (GRAD3[gi] * x0 + GRAD3[gi + 1] * y0 + GRAD3[gi + 2] * z0);
    }

    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 < 0) n1 = 0;
    else {
      const gi = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
      t1 *= t1;
      n1 = t1 * t1 * (GRAD3[gi] * x1 + GRAD3[gi + 1] * y1 + GRAD3[gi + 2] * z1);
    }

    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 < 0) n2 = 0;
    else {
      const gi = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
      t2 *= t2;
      n2 = t2 * t2 * (GRAD3[gi] * x2 + GRAD3[gi + 1] * y2 + GRAD3[gi + 2] * z2);
    }

    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 < 0) n3 = 0;
    else {
      const gi = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
      t3 *= t3;
      n3 = t3 * t3 * (GRAD3[gi] * x3 + GRAD3[gi + 1] * y3 + GRAD3[gi + 2] * z3);
    }

    return 32 * (n0 + n1 + n2 + n3);
  };
}

/* ---------- Helpers ---------- */

const { PI, cos, sin, abs } = Math;
const TAU = 2 * PI;

const rand = (n) => n * Math.random();
const lerp = (a, b, t) => (1 - t) * a + t * b;
const fadeInOut = (t, life) => {
  const half = 0.5 * life;
  return abs(((t + half) % life) - half) / half;
};

const PARTICLE_PROP_COUNT = 9;
const RANGE_Y = 100;
const NOISE_STEPS = 8;
const X_OFF = 0.00125;
const Y_OFF = 0.00125;
const Z_OFF = 0.0005;

/**
 * Glowing flow-field swirl: particles follow simplex noise and leave
 * short, blurred, additive-blended strokes.
 *
 * Props:
 *  - particleCount: number of particles
 *  - speed:         base particle speed (a random 0-2 is added per particle)
 *  - background:    background fill colour
 */
export default function SwirlBackground({
  particleCount = 700,
  speed = 0.1,
  background = "#000000",
  className,
  style,
}) {
  const displayRef = useRef(null);

  useEffect(() => {
    const display = displayRef.current; // visible canvas ("b")
    const dctx = display.getContext("2d");
    const work = document.createElement("canvas"); // offscreen canvas ("a")
    const wctx = work.getContext("2d");

    const noise3D = createNoise3D();
    const props = new Float32Array(particleCount * PARTICLE_PROP_COUNT);
    let tick = 0;
    let centerY = 0;
    let rafId;

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      work.width = display.width = w;
      work.height = display.height = h;
      centerY = h * 0.5;
    };

    // props layout: [x, y, vx, vy, life, ttl, speed, width, hue]
    const initParticle = (i) => {
      const x = rand(work.width);
      const y = centerY + (RANGE_Y - rand(2 * RANGE_Y));
      const ttl = 50 + rand(150);
      const velocity = speed + rand(2);
      const width = 1 + rand(4);
      const hue = 220 + rand(100);
      props.set([x, y, 0, 0, 0, ttl, velocity, width, hue], i);
    };

    const drawParticle = (x1, y1, x2, y2, life, ttl, width, hue) => {
      wctx.save();
      wctx.lineCap = "round";
      wctx.lineWidth = width;
      wctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
      wctx.beginPath();
      wctx.moveTo(x1, y1);
      wctx.lineTo(x2, y2);
      wctx.stroke();
      wctx.closePath();
      wctx.restore();
    };

    const updateParticle = (i) => {
      const x = props[i];
      const y = props[i + 1];
      const theta = NOISE_STEPS * noise3D(x * X_OFF, y * Y_OFF, tick * Z_OFF) * TAU;
      const vx = lerp(props[i + 2], cos(theta), 0.5);
      const vy = lerp(props[i + 3], sin(theta), 0.5);
      let life = props[i + 4];
      const ttl = props[i + 5];
      const velocity = props[i + 6];
      const width = props[i + 7];
      const hue = props[i + 8];

      const x2 = x + vx * velocity;
      const y2 = y + vy * velocity;

      drawParticle(x, y, x2, y2, life, ttl, width, hue);

      life++;
      props[i] = x2;
      props[i + 1] = y2;
      props[i + 2] = vx;
      props[i + 3] = vy;
      props[i + 4] = life;

      // bounds are checked against the position *before* this move, as in the original
      const outOfBounds = x > work.width || x < 0 || y > work.height || y < 0;
      if (outOfBounds || life > ttl) initParticle(i);
    };

    const renderGlow = () => {
      dctx.save();
      dctx.filter = "blur(8px) brightness(200%)";
      dctx.globalCompositeOperation = "lighter";
      dctx.drawImage(work, 0, 0);
      dctx.restore();

      dctx.save();
      dctx.filter = "blur(4px) brightness(200%)";
      dctx.globalCompositeOperation = "lighter";
      dctx.drawImage(work, 0, 0);
      dctx.restore();
    };

    const renderToScreen = () => {
      dctx.save();
      dctx.globalCompositeOperation = "lighter";
      dctx.drawImage(work, 0, 0);
      dctx.restore();
    };

    const draw = () => {
      tick++;
      wctx.clearRect(0, 0, work.width, work.height);

      dctx.fillStyle = background;
      dctx.fillRect(0, 0, display.width, display.height);

      for (let i = 0; i < props.length; i += PARTICLE_PROP_COUNT) updateParticle(i);

      renderGlow();
      renderToScreen();
      rafId = requestAnimationFrame(draw);
    };

    resize();
    for (let i = 0; i < props.length; i += PARTICLE_PROP_COUNT) initParticle(i);
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [particleCount, speed, background]);

  return (
    <canvas
      ref={displayRef}
      className={className}
      style={{ position: "fixed", inset: 0, display: "block", ...style }}
    />
  );
}
