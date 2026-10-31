import { useEffect, useRef } from "react";

/**
 * Random-walk particle field that fades into a background colour.
 * Ported from a jQuery/canvas snippet.
 *
 * Props:
 *  - colors:     [primary, secondary, accent] particle colours
 *  - background: fade/background colour
 *  - count:      target number of live particles
 */
export default function AlienParticles({
  colors = ["#00ff9c", "#00b8ff", "#ff2bd6"],
  background = "#000000",
  count = 1000,
  className,
  style,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const [color1, color2, color3] = colors;

    class Particle {
      constructor() {
        const r = Math.random();
        this.x = width / 2 + (200 * Math.random() - 200 * Math.random());
        this.y = height / 2 + (200 * Math.random() - 200 * Math.random());
        this.speed = Math.random();
        this.angle = 0;

        // size/colour tiers: 80% small primary, 15% larger secondary, 5% accent
        if (r > 0.8) {
          this.radius = 2 * Math.random();
          this.color = color3;
        } else if (r > 0.2) {
          this.radius = Math.random();
          this.color = color1;
        } else {
          this.radius = 3 * Math.random();
          this.color = color2;
        }
      }

      render() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }

      // returns false once the particle leaves the screen
      move() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.angle += 0.8 * Math.random() - 0.4;

        if (
          this.x < 0 ||
          this.x > width - this.radius ||
          this.y < 0 ||
          this.y > height - this.radius
        ) {
          return false;
        }
        this.render();
        return true;
      }
    }

    let particles = [];
    let rafId;

    const loop = () => {
      particles = particles.filter((p) => p.move());

      // top up gradually (staggered, like the original's 20ms spawn delay)
      const missing = count - particles.length;
      for (let i = 0; i < Math.min(missing, 2); i++) {
        particles.push(new Particle());
      }

      ctx.globalAlpha = 0.05;
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(loop);
    };
    loop();

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, [colors, background, count]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: "fixed", inset: 0, display: "block", ...style }}
    />
  );
}
