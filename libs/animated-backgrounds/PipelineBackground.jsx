import { useEffect, useRef } from "react";

const { PI, cos, sin, abs, round, random } = Math;
const HALF_PI = 0.5 * PI;
const TAU = 2 * PI;
const TO_RAD = PI / 180;

const rand = (n) => n * random();
const fadeInOut = (t, life) => {
  const half = 0.5 * life;
  return abs(((t + half) % life) - half) / half;
};

const PIPE_PROP_COUNT = 8;
const TURN_AMOUNT = 45 * TO_RAD;
const TURN_CHANCE_RANGE = 58;

/**
 * Animated "pipeline" of drifting circles that turn at right angles,
 * leaving glowing trails.
 *
 * Props:
 *  - pipeCount:  number of pipes
 *  - background: background fill colour
 */
export default function PipelineBackground({
  pipeCount = 100,
  background = "#000000",
  className,
  style,
}) {
  const displayRef = useRef(null);

  useEffect(() => {
    const display = displayRef.current; // visible canvas ("b")
    const dctx = display.getContext("2d");
    const trails = document.createElement("canvas"); // offscreen accumulation canvas ("a")
    const tctx = trails.getContext("2d");

    const pipeProps = new Float32Array(pipeCount * PIPE_PROP_COUNT);
    let tick = 0;
    let centerY = 0;
    let rafId;

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;

      // trails are never cleared, so keep what has been drawn across resizes
      const snapshot = document.createElement("canvas");
      snapshot.width = trails.width;
      snapshot.height = trails.height;
      snapshot.getContext("2d").drawImage(trails, 0, 0);

      trails.width = display.width = w;
      trails.height = display.height = h;
      tctx.drawImage(snapshot, 0, 0);
      centerY = h * 0.5;
    };

    // props layout: [x, y, direction, speed, life, ttl, width, hue]
    const initPipe = (i) => {
      const x = rand(trails.width);
      const y = centerY;
      const direction = round(rand(1)) ? HALF_PI : TAU - HALF_PI;
      const speed = 0.5 + rand(1);
      const ttl = 100 + rand(300);
      const width = 2 + rand(4);
      const hue = 180 + rand(60);
      pipeProps.set([x, y, direction, speed, 0, ttl, width, hue], i);
    };

    const drawPipe = (x, y, life, ttl, width, hue) => {
      tctx.save();
      tctx.strokeStyle = `hsla(${hue},75%,50%,${0.125 * fadeInOut(life, ttl)})`;
      tctx.beginPath();
      tctx.arc(x, y, width, 0, TAU);
      tctx.stroke();
      tctx.closePath();
      tctx.restore();
    };

    const updatePipe = (i) => {
      let x = pipeProps[i];
      let y = pipeProps[i + 1];
      let direction = pipeProps[i + 2];
      const speed = pipeProps[i + 3];
      let life = pipeProps[i + 4];
      const ttl = pipeProps[i + 5];
      const width = pipeProps[i + 6];
      const hue = pipeProps[i + 7];

      drawPipe(x, y, life, ttl, width, hue);

      life++;
      x += cos(direction) * speed;
      y += sin(direction) * speed;

      // occasionally turn 45deg, favouring positions on a 6px grid
      const shouldTurn = !(
        tick % round(rand(TURN_CHANCE_RANGE)) ||
        (round(x) % 6 && round(y) % 6)
      );
      const turnDir = round(rand(1)) ? -1 : 1;
      if (shouldTurn) direction += TURN_AMOUNT * turnDir;

      // wrap around the edges
      const w = trails.width;
      const h = trails.height;
      if (x > w) x = 0;
      if (x < 0) x = w;
      if (y > h) y = 0;
      if (y < 0) y = h;

      pipeProps[i] = x;
      pipeProps[i + 1] = y;
      pipeProps[i + 2] = direction;
      pipeProps[i + 4] = life;

      if (life > ttl) initPipe(i);
    };

    const render = () => {
      dctx.save();
      dctx.fillStyle = background;
      dctx.fillRect(0, 0, display.width, display.height);
      dctx.restore();

      dctx.save();
      dctx.filter = "blur(12px)";
      dctx.drawImage(trails, 0, 0);
      dctx.restore();

      dctx.save();
      dctx.drawImage(trails, 0, 0);
      dctx.restore();
    };

    const draw = () => {
      tick++;
      for (let i = 0; i < pipeProps.length; i += PIPE_PROP_COUNT) updatePipe(i);
      render();
      rafId = requestAnimationFrame(draw);
    };

    resize();
    for (let i = 0; i < pipeProps.length; i += PIPE_PROP_COUNT) initPipe(i);
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [pipeCount, background]);

  return (
    <canvas
      ref={displayRef}
      className={className}
      style={{ position: "fixed", inset: 0, display: "block", ...style }}
    />
  );
}
