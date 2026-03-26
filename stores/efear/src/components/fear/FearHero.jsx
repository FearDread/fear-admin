import React, { useEffect, useRef, useState } from "react";

export default function FearHero() {
  const progressRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Stagger reveal after mount
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="hero-section fear-hero">

      {/* ── Halftone dot texture ── */}
      <div className="fh-halftone" />

      {/* ── Animated scanline overlay ── */}
      <div className="fh-overlay" />

      {/* ── Left accent stripe ── */}
      <div className="fh-stripe" />

      {/* ── Ambient glow pool ── */}
      <div className="fh-glow" />

      {/* ── Main content ── */}
      <div className={`fh-content${visible ? " fh-visible" : ""}`}>

        {/* Eyebrow tag */}
        <span className="fh-eyebrow">AW 2025 — Limited Drop</span>

        {/* Glitch heading */}
        <h1 className="fh-glitch" data-text="EMBRACE FEAR">
          EMBRACE FEAR
        </h1>

        {/* Sub-line */}
        <p className="fh-sub">
          Engineered for discomfort. Worn by the relentless.
        </p>

        {/* Tagline */}
        <p className="fh-tagline">Not for the comfortable.</p>

        {/* CTA row */}
        <div className="fh-actions">
          <a href="#featured" className="fh-btn-primary">Shop Now</a>
          <a href="#why"      className="fh-btn-ghost">Explore</a>
        </div>

        {/* Trust micro-row */}
        <div className="fh-trust">
          <span className="fh-trust-item">✓ Free shipping over $80</span>
          <span className="fh-trust-sep">|</span>
          <span className="fh-trust-item">✓ 30-day returns</span>
          <span className="fh-trust-sep">|</span>
          <span className="fh-trust-item">✓ US delivery</span>
        </div>
      </div>

      {/* ── Ghost text watermark ── */}
      <div className="fh-ghost" aria-hidden="true">FEAR</div>

      {/* ── Bottom progress bar ── */}
      <div className="fh-progress" ref={progressRef} />

      {/* ── Scroll cue ── */}
      <div className="fh-scroll-cue">
        <span className="fh-scroll-label">Scroll</span>
        <div className="fh-scroll-arrow" />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap');

        /* ── Token bridge ── */
        .fear-hero {
          --red:      #b30e1c;
          --dark-0:   #0d0d0d;
          --dark-1:   #111111;
          --border:   #222222;
          --text-hi:  rgba(255,255,255,0.92);
          --text-mid: rgba(255,255,255,0.58);
          --text-dim: rgba(255,255,255,0.32);
          --font-display: 'Anton', 'Impact', sans-serif;
          --font-mono:    'Space Mono', monospace;
        }

        /* ── Section shell ── */
        .fear-hero {
          position: relative;
          min-height: 100vh;
          background:
            radial-gradient(ellipse at 60% 40%, rgba(179,14,28,.18) 0%, transparent 55%),
            radial-gradient(ellipse at 20% 80%, rgba(179,14,28,.08) 0%, transparent 45%),
            var(--dark-0);
          color: var(--text-hi);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid var(--border);
        }

        /* ── Halftone texture ── */
        .fh-halftone {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,.055) 1px, transparent 1px);
          background-size: 22px 22px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── CRT scanline sweep ── */
        .fh-overlay {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(179, 14, 28, 0.028),
            rgba(179, 14, 28, 0.028) 1px,
            transparent 1px,
            transparent 4px
          );
          animation: fhScan 8s linear infinite;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes fhScan {
          from { transform: translateY(-100%); }
          to   { transform: translateY(100%);  }
        }

        /* ── Left accent stripe ── */
        .fh-stripe {
          position: absolute;
          left: 0; top: 0;
          width: 4px;
          height: 100%;
          background: var(--red);
          z-index: 2;
          box-shadow: 0 0 24px var(--red), 0 0 60px rgba(179,14,28,.4);
        }

        /* ── Glow pool ── */
        .fh-glow {
          position: absolute;
          left: 50%; bottom: -60px;
          transform: translateX(-50%);
          width: 600px; height: 220px;
          background: radial-gradient(ellipse at center, rgba(179,14,28,.35) 0%, transparent 68%);
          filter: blur(40px);
          pointer-events: none;
          z-index: 0;
          animation: fhGlowPulse 3.5s ease-in-out infinite;
        }

        @keyframes fhGlowPulse {
          0%,100% { opacity: .8;  transform: translateX(-50%) scaleY(1);   }
          50%      { opacity: 1;   transform: translateX(-50%) scaleY(1.3); }
        }

        /* ── Ghost watermark ── */
        .fh-ghost {
          position: absolute;
          right: -0.5rem; bottom: -2rem;
          font-family: var(--font-display);
          font-size: clamp(8rem, 22vw, 18rem);
          text-transform: uppercase;
          color: rgba(255,255,255,.025);
          line-height: 1;
          user-select: none;
          pointer-events: none;
          letter-spacing: -.02em;
          z-index: 0;
        }

        /* ── Content wrapper ── */
        .fh-content {
          position: relative;
          z-index: 3;
          text-align: center;
          padding: 2rem 1.5rem;
          max-width: 860px;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity .65s ease, transform .65s ease;
        }

        .fh-content.fh-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Eyebrow ── */
        .fh-eyebrow {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: .72rem;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: var(--red);
          border: 1px solid var(--red);
          padding: .3rem .9rem;
          margin-bottom: 1.75rem;
          animation: fhFadeUp .5s ease .1s both;
        }

        /* ── Glitch heading ── */
        .fh-glitch {
          font-family: var(--font-display);
          font-size: clamp(4.5rem, 13vw, 10rem);
          font-weight: 400; /* Anton is inherently bold */
          line-height: .9;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: -.02em;
          position: relative;
          margin: 0 0 1.25rem;
          -webkit-text-stroke: 2px var(--red);
          text-shadow:
            0 0 40px rgba(179,14,28,.5),
            0 0 80px rgba(179,14,28,.2);
          animation: fhFadeUp .55s ease .15s both;
        }

        /* Ghost layers */
        .fh-glitch::before,
        .fh-glitch::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          font-family: var(--font-display);
          font-size: inherit;
          letter-spacing: inherit;
          -webkit-text-stroke: 0;
        }

        .fh-glitch::before {
          color: var(--red);
          clip-path: polygon(0 0, 100% 0, 100% 42%, 0 42%);
          animation: fhGlitchTop 1.4s steps(1) infinite;
          text-shadow: none;
        }

        .fh-glitch::after {
          color: #c0392b;
          clip-path: polygon(0 58%, 100% 58%, 100% 100%, 0 100%);
          animation: fhGlitchBot 1.7s steps(1) infinite;
          text-shadow: none;
        }

        @keyframes fhGlitchTop {
          0%,90%,100% { transform: translate(0,0);    opacity: 0;   }
          91%          { transform: translate(-3px,-2px); opacity: .9; }
          93%          { transform: translate(3px, 1px);  opacity: .9; }
          95%          { transform: translate(-1px,2px);  opacity: .9; }
          97%          { transform: translate(0,0);    opacity: 0;   }
        }

        @keyframes fhGlitchBot {
          0%,85%,100% { transform: translate(0,0);   opacity: 0;   }
          86%          { transform: translate(3px,2px); opacity: .9; }
          89%          { transform: translate(-3px,-1px); opacity: .9; }
          92%          { transform: translate(2px,3px); opacity: .9; }
          94%          { transform: translate(0,0);   opacity: 0;   }
        }

        /* ── Sub line ── */
        .fh-sub {
          font-family: var(--font-mono);
          font-size: clamp(.82rem, 1.5vw, 1rem);
          letter-spacing: .1em;
          color: var(--text-mid);
          line-height: 1.7;
          margin: 0 auto .5rem;
          max-width: 520px;
          animation: fhFadeUp .55s ease .22s both;
        }

        /* ── Tagline ── */
        .fh-tagline {
          font-family: var(--font-mono);
          font-size: .72rem;
          letter-spacing: .28em;
          text-transform: uppercase;
          color: var(--text-dim);
          margin: 0 0 2.5rem;
          animation: fhFadeUp .55s ease .28s both;
        }

        /* ── CTA row ── */
        .fh-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
          animation: fhFadeUp .55s ease .35s both;
        }

        /* Primary button — chamfered, red fill */
        .fh-btn-primary {
          display: inline-block;
          padding: .9rem 2.5rem;
          background: var(--red);
          color: #fff;
          font-family: var(--font-mono);
          font-size: .8rem;
          letter-spacing: .14em;
          text-transform: uppercase;
          text-decoration: none;
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
          transition: opacity .2s, transform .2s, box-shadow .2s;
          box-shadow: 0 0 20px rgba(179,14,28,.5);
        }

        .fh-btn-primary:hover {
          opacity: .88;
          transform: translateY(-3px);
          box-shadow: 0 0 36px rgba(179,14,28,.7);
          color: #fff;
        }

        /* Ghost button — border only */
        .fh-btn-ghost {
          display: inline-block;
          padding: .9rem 2.5rem;
          border: 1px solid rgba(255,255,255,.28);
          color: var(--text-mid);
          font-family: var(--font-mono);
          font-size: .8rem;
          letter-spacing: .14em;
          text-transform: uppercase;
          text-decoration: none;
          transition: border-color .2s, color .2s, transform .2s;
        }

        .fh-btn-ghost:hover {
          border-color: rgba(255,255,255,.75);
          color: #fff;
          transform: translateY(-3px);
        }

        /* ── Trust micro-row ── */
        .fh-trust {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: .85rem;
          flex-wrap: wrap;
          animation: fhFadeUp .55s ease .45s both;
        }

        .fh-trust-item {
          font-family: var(--font-mono);
          font-size: .6rem;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: var(--text-dim);
        }

        .fh-trust-sep {
          color: var(--border);
          font-size: .65rem;
        }

        /* ── Bottom progress bar ── */
        .fh-progress {
          position: absolute;
          bottom: 0; left: 0;
          height: 3px;
          width: 100%;
          background: linear-gradient(90deg, var(--red), #f4a261, #2a9d8f, var(--red));
          background-size: 300% 100%;
          animation: fhGrad 4s linear infinite;
          z-index: 4;
        }

        @keyframes fhGrad {
          to { background-position: 300% center; }
        }

        /* ── Scroll cue ── */
        .fh-scroll-cue {
          position: absolute;
          bottom: 2.25rem;
          right: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: .45rem;
          z-index: 4;
          animation: fhFadeUp .6s ease .6s both;
        }

        .fh-scroll-label {
          font-family: var(--font-mono);
          font-size: .58rem;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: var(--text-dim);
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }

        .fh-scroll-arrow {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, rgba(179,14,28,.7), transparent);
          animation: fhArrowPulse 1.8s ease-in-out infinite;
        }

        @keyframes fhArrowPulse {
          0%,100% { transform: scaleY(1);   opacity: .7; }
          50%      { transform: scaleY(.5); opacity: 1;  }
        }

        /* ── Shared fade-up entry ── */
        @keyframes fhFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        /* ── Mobile adjustments ── */
        @media (max-width: 600px) {
          .fh-ghost       { display: none; }
          .fh-scroll-cue  { display: none; }
          .fh-actions     { flex-direction: column; align-items: center; }
          .fh-btn-primary,
          .fh-btn-ghost   { width: 100%; max-width: 300px; text-align: center; }
        }
      `}</style>
    </section>
  );
}