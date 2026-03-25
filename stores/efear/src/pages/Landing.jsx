import React, { useState } from "react";

// Imported components
import CyberpunkIntro from "../components/fear/CyberpunkIntro"; // :contentReference[oaicite:1]{index=1}
import FearHero from "../components/fear/FearHero";             // :contentReference[oaicite:2]{index=2}

// Optional: global CSS
import "../assets/css/efear.css";

export const LandingPage = () => {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="efear-app">

      {/* ───────────────────────────── */}
      {/* CYBERPUNK INTRO */}
      {/* ───────────────────────────── */}
      {!introDone && (
        <CyberpunkIntro onFinish={() => setIntroDone(true)} />
      )}

      {/* ───────────────────────────── */}
      {/* MAIN CONTENT */}
      {/* ───────────────────────────── */}
      {introDone && (
        <>
          {/* HERO */}
          <FearHero />

          {/* TRUST STRIP */}
          <section className="trust-bar">
            <div className="trust-item">
              <span className="trust-icon">⚡</span>
              <div>
                <strong>Fast Drops</strong>
                <span>New fear weekly</span>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🩸</span>
              <div>
                <strong>Dark Quality</strong>
                <span>No safe designs</span>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">☠️</span>
              <div>
                <strong>Exclusive</strong>
                <span>Limited releases</span>
              </div>
            </div>
          </section>

          {/* MARQUEE */}
          <div className="marquee-wrap">
            <div className="marquee-track">
              {[
                "FEAR",
                "UNKNOWN",
                "GLITCH",
                "SYSTEM BREACH",
                "NO ESCAPE",
                "EFEAR"
              ].map((item, i) => (
                <span key={i} className="marquee-item">
                  {item} <span className="marquee-sep">✦</span>
                </span>
              ))}
            </div>
          </div>

          {/* WHY / BRAND MESSAGE */}
          <section className="why-section dark-1">
            <div className="efear-container why-grid">
              <div>
                <span className="why-eyebrow">WHY EFEAR</span>
                <h2 className="why-title">
                  BUILT FOR THE <br /> UNCOMFORTABLE
                </h2>

                <p className="why-body">
                  eFear isn’t fashion. It’s a signal.
                  A distortion in the system.
                  A rejection of comfort and conformity.
                </p>

                <p className="why-body">
                  If it feels wrong — you’re in the right place.
                </p>

                <a href="#about" className="btn-text-link">
                  Learn More →
                </a>
              </div>

              <div className="why-features">
                <div className="why-card">
                  <span className="why-icon">🧠</span>
                  <h4 className="why-card-title">Psychological</h4>
                  <p className="why-card-body">
                    Designs that provoke thought and discomfort.
                  </p>
                </div>

                <div className="why-card">
                  <span className="why-icon">⚠️</span>
                  <h4 className="why-card-title">Disruptive</h4>
                  <p className="why-card-body">
                    Break norms. Reject safe aesthetics.
                  </p>
                </div>

                <div className="why-card">
                  <span className="why-icon">👁️</span>
                  <h4 className="why-card-title">Identity</h4>
                  <p className="why-card-body">
                    Wear something that actually says something.
                  </p>
                </div>

                <div className="why-card">
                  <span className="why-icon">💀</span>
                  <h4 className="why-card-title">Fear Driven</h4>
                  <p className="why-card-body">
                    Fear isn’t weakness — it’s power.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="cta-banner">
            <div className="cta-noise" />

            <div className="efear-container cta-inner">
              <div>
                <h2 className="cta-heading">
                  ENTER THE SYSTEM
                </h2>
                <p className="cta-sub">
                  You’ve seen enough. Step into eFear.
                </p>
              </div>

              <div className="cta-actions">
                <a href="/shop" className="btn-cta-main">
                  Shop Now
                </a>
                <a href="#about" className="btn-cta-text">
                  Learn More
                </a>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer style={{
            borderTop: "1px solid #222",
            padding: "2rem",
            textAlign: "center",
            fontSize: ".75rem",
            color: "rgba(255,255,255,.4)"
          }}>
            © {new Date().getFullYear()} EFEAR — SYSTEM ACTIVE
          </footer>
        </>
      )}
    </div>
  );
}

export default LandingPage;