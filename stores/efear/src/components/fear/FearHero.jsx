import React from "react";

export default function FearHero() {
  return (
    <section className="fear-hero">
      <div className="overlay" />

      <div className="content">
        <h1 className="glitch" data-text="EMBRACE FEAR">
          EMBRACE FEAR
        </h1>

        <p className="tagline">
          Not for the comfortable.
        </p>

        <div className="actions">
          <button className="primary">Shop Now</button>
          <button className="secondary">Explore</button>
        </div>
      </div>

      <style>{`
        .fear-hero {
          position: relative;
          height: 100vh;
          background: radial-gradient(circle at center, #0a0a0a 0%, #000 100%);
          color: white;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255,0,0,0.03),
            rgba(255,0,0,0.03) 1px,
            transparent 1px,
            transparent 3px
          );
          animation: scan 6s linear infinite;
        }

        @keyframes scan {
          from { transform: translateY(0); }
          to { transform: translateY(100%); }
        }

        .content {
          position: relative;
          text-align: center;
          z-index: 2;
        }

        .glitch {
          font-size: 4rem;
          font-weight: 900;
          color: #ff1a1a;
          position: relative;
          text-shadow: 0 0 10px #ff1a1a;
        }

        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          width: 100%;
        }

        .glitch::before {
          animation: glitchTop 1s infinite;
          color: #ff0000;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
        }

        .glitch::after {
          animation: glitchBottom 1.2s infinite;
          color: #ff4d4d;
          clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
        }

        @keyframes glitchTop {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-1px, 1px); }
          80% { transform: translate(1px, -1px); }
          100% { transform: translate(0); }
        }

        @keyframes glitchBottom {
          0% { transform: translate(0); }
          20% { transform: translate(2px, 1px); }
          40% { transform: translate(-2px, -1px); }
          60% { transform: translate(1px, -2px); }
          80% { transform: translate(-1px, 2px); }
          100% { transform: translate(0); }
        }

        .tagline {
          margin-top: 10px;
          color: #aaa;
          letter-spacing: 2px;
        }

        .actions {
          margin-top: 30px;
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        button {
          padding: 12px 24px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .primary {
          background: #ff1a1a;
          color: black;
          box-shadow: 0 0 10px #ff1a1a;
        }

        .secondary {
          background: transparent;
          color: #ff1a1a;
          border: 1px solid #ff1a1a;
        }
      `}</style>
    </section>
  );
}