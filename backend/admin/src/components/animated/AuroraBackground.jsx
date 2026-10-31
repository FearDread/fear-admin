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

const rand = (n) => n * Math.random();
const fadeInOut = (t, life) => {
  const half = 0.5 * life;
  return Math.abs(((t + half) % life) - half) / half;
};

const RAY_PROP_COUNT = 8;
const NOISE_OFFSET = 0.0015; // x / y / z noise step

/**
 * Animated aurora of blurred vertical rays.
 *
 * Props:
 *  - rayCount:   number of rays
 *  - speed:      base horizontal drift speed (random +/-0.1 is added per ray)
 *  - background: background fill colour
 */
export default function AuroraBackground({
  rayCount = 200,
  speed = 0.1,
  background = "#0a0a1a",
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
    const rayProps = new Float32Array(rayCount * RAY_PROP_COUNT);
    let tick = 0;
    let centerY = 0;
    let rafId;

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      work.width = display.width = w;
      work.height = display.height = h;
      centerY = h * 0.5;
    };

    // props layout: [x, y1, y2, life, ttl, width, speed, hue]
    const initRay = (i) => {
      const length = 200 + rand(200);
      const x = rand(work.width);
      let y1 = centerY + 100;
      let y2 = centerY + 100 - length;
      const offset = 100 * noise3D(x * NOISE_OFFSET, y1 * NOISE_OFFSET, tick * NOISE_OFFSET);
      y1 += offset;
      y2 += offset;

      const ttl = 50 + rand(100);
      const width = 10 + rand(20);
      const velocity = speed + rand(0.1) * (Math.round(rand(1)) ? 1 : -1);
      const hue = 120 + rand(60);
      rayProps.set([x, y1, y2, 0, ttl, width, velocity, hue], i);
    };

    const drawRay = (x, y1, y2, life, ttl, width, hue) => {
      const gradient = wctx.createLinearGradient(x, y1, x, y2);
      gradient.addColorStop(0, `hsla(${hue},100%,65%,0)`);
      gradient.addColorStop(0.5, `hsla(${hue},100%,65%,${fadeInOut(life, ttl)})`);
      gradient.addColorStop(1, `hsla(${hue},100%,65%,0)`);

      wctx.save();
      wctx.beginPath();
      wctx.strokeStyle = gradient;
      wctx.lineWidth = width;
      wctx.moveTo(x, y1);
      wctx.lineTo(x, y2);
      wctx.stroke();
      wctx.closePath();
      wctx.restore();
    };

    const updateRay = (i) => {
      let x = rayProps[i];
      const y1 = rayProps[i + 1];
      const y2 = rayProps[i + 2];
      let life = rayProps[i + 3];
      const ttl = rayProps[i + 4];
      const width = rayProps[i + 5];
      const velocity = rayProps[i + 6];
      const hue = rayProps[i + 7];

      drawRay(x, y1, y2, life, ttl, width, hue);

      x += velocity;
      life++;
      rayProps[i] = x;
      rayProps[i + 3] = life;

      if (x < 0 || x > work.width || life > ttl) initRay(i);
    };

    const draw = () => {
      tick++;
      wctx.clearRect(0, 0, work.width, work.height);

      dctx.fillStyle = background;
      dctx.fillRect(0, 0, display.width, display.height);

      for (let i = 0; i < rayProps.length; i += RAY_PROP_COUNT) updateRay(i);

      // blurred composite of the rays onto the visible canvas
      dctx.save();
      dctx.filter = "blur(12px)";
      wctx.globalCompositeOperation = "lighter";
      dctx.drawImage(work, 0, 0);
      dctx.restore();

      rafId = requestAnimationFrame(draw);
    };

    resize();
    for (let i = 0; i < rayProps.length; i += RAY_PROP_COUNT) initRay(i);
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [rayCount, speed, background]);

  return (
    <canvas
      ref={displayRef}
      className={className}
      style={{ position: "fixed", inset: 0, display: "block", ...style }}
    />
  );
}
