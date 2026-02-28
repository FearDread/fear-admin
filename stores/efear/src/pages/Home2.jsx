import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from "../components/home/v2/ComicHero";
import TrustBar from "../components/home/v2/TrustBar";

const CategoryCards = () => {
  const cats = [
    {
      label: 'Comics',
      tagline: 'Marvel, DC & beyond',
      blurb: 'From first prints to modern variants. Every issue bagged, boarded, near-mint.',
      accent: "#c40717",
      image: 'assets/images/comics/super1.png',
      link: '/shop?cat=comics',
    },
    {
      label: 'E-Books',
      tagline: 'Starting at $9',
      blurb: 'Cookbooks, manifestos, graphic novels, and more. Also available on Amazon.',
      accent: "#6f11e1",
      image: 'assets/images/ebooks/01.jpg',
      link: '/shop?cat=books',
    },
    {
      label: 'Collectibles',
      tagline: 'Cards, slabs & rarities',
      blurb: 'Pokémon, NFL, NBA, Baseball. Some packs will make you cry. All of them will.',
      accent: "#1081a7",
      image: 'assets/images/comics/super3.png',
      link: '/shop?cat=cards',
    },
  ];

  return (
    <section className="cat-section">
      <div className="container">
        <div className="cat-header">
          <p className="cat-eyebrow">Shop by category</p>
          <h2 className="cat-title">What are you into?</h2>
        </div>
        <div className="cat-grid">
          {cats.map(c => (
            <Link to={c.link} className="cat-card" key={c.label} style={{ '--cat-accent': c.accent }}>
              <div className="cat-img-wrap">
                <img src={c.image} alt={c.label} className="cat-img" />
              </div>
              <div className="cat-info">
                <span className="cat-badge">{c.tagline}</span>
                <h3 className="cat-name">{c.label}</h3>
                <p className="cat-blurb">{c.blurb}</p>
                <span className="cat-cta">Shop {c.label} →</span>
              </div>
              <div className="cat-glow" />
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .cat-section { padding: 5rem 0; }
        .cat-header { text-align: center; margin-bottom: 3rem; }
        .cat-eyebrow {
          font-family: 'Courier New', monospace;
          font-size: .75rem; letter-spacing: .2em; text-transform: uppercase;
          color: rgba(255,255,255,.4); margin-bottom: .5rem;
        }
        .cat-title {
          font-family: 'Anton', 'Impact', sans-serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          color: #fff; text-transform: uppercase; margin: 0;
        }
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .cat-card {
          position: relative;
          background: #141414;
          border: 1px solid #222;
          overflow: hidden;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          transition: border-color .3s, transform .3s;
          clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%);
        }
        .cat-card:hover { border-color: var(--cat-accent); transform: translateY(-4px); }
        .cat-card:hover .cat-glow { opacity: 1; }
        .cat-img-wrap { height: 220px; overflow: hidden; background: #1a1a1a; }
        .cat-img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s; }
        .cat-card:hover .cat-img { transform: scale(1.05); }
        .cat-info { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
        .cat-badge {
          font-family: 'Courier New', monospace;
          font-size: .7rem; letter-spacing: .15em; text-transform: uppercase;
          color: var(--cat-accent); margin-bottom: .5rem;
        }
        .cat-name {
          font-family: 'Anton', 'Impact', sans-serif;
          font-size: 1.75rem; color: #fff; text-transform: uppercase; margin: 0 0 .6rem;
        }
        .cat-blurb { font-size: .88rem; color: rgba(255,255,255,.5); line-height: 1.6; flex: 1; }
        .cat-cta {
          display: inline-block;
          margin-top: 1rem;
          font-family: 'Courier New', monospace;
          font-size: .78rem; letter-spacing: .1em; text-transform: uppercase;
          color: var(--cat-accent);
          transition: letter-spacing .2s;
        }
        .cat-card:hover .cat-cta { letter-spacing: .18em; }
        .cat-glow {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, var(--cat-accent) 0%, transparent 60%);
          opacity: 0; transition: opacity .4s; pointer-events: none;
          mix-blend-mode: overlay;
        }
      `}</style>
    </section>
  );
};

/* ─────────────────────────────────────────────
   MARQUEE BAND  –  scrolling brand names
───────────────────────────────────────────────*/
const MarqueeBand = () => {
  const items = ['Marvel', 'DC Comics', 'Dark Horse', 'Image Comics', 'IDW', 'Boom! Studios', 'Pokémon', 'Vertigo', 'Valiant', 'Dynamite', 'BOOM!', 'Fantagraphics'];
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {[...items, ...items].map((b, i) => (
          <span key={i} className="marquee-item">{b} <span className="marquee-sep">✦</span></span>
        ))}
      </div>
      <style>{`
        .marquee-wrap { background: #b30e1c; overflow: hidden; padding: .75rem 0; }
        .marquee-track {
          display: flex; width: max-content;
          animation: marqueeScroll 28s linear infinite;
        }
        @keyframes marqueeScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-item {
          font-family: 'Anton', 'Impact', sans-serif;
          font-size: 1rem; text-transform: uppercase; letter-spacing: .08em;
          color: #fff; white-space: nowrap; padding: 0 1.5rem;
        }
        .marquee-sep { opacity: .5; margin-left: 1.5rem; }
      `}</style>
    </div>
  );
};

/* ─────────────────────────────────────────────
   WHY US  –  origin story + 4 feature cards
───────────────────────────────────────────────*/
const WhyUs = () => (
  <section className="why-section">
    <div className="container">
      <div className="why-grid">
        {/* left story */}
        <div className="why-story">
          <p className="why-eyebrow">Our Origin Story</p>
          <h2 className="why-title">Tragically Less Interesting<br />Than Batman's</h2>
          <p className="why-body">
            We started this business because someone told us "following your dreams doesn't pay the bills." Joke's on them — we're still broke, but now we get to read comics while doing it.
          </p>
          <p className="why-body">
            Founded in a dimly lit basement that may or may not have violated several building codes, our shop emerged from a simple question: <em>"What if we could lose money doing something we actually enjoy?"</em> Turns out, we could. We really, really could.
          </p>
          <Link to="/about" className="btn-text-link">Read the full story →</Link>
        </div>

        {/* right feature grid */}
        <div className="why-features">
          {[
            { icon: '🚚', title: 'Free Shipping', body: "We'll bring it to your door for free. Because if we charged you shipping, you'd probably just steal it from a neighbor's porch anyway." },
            { icon: '💰', title: '100% Money Back', body: "Regret your life choices? Us too. Send it back within 30 days. No judgment. We've seen worse." },
            { icon: '🏷️', label: 'NM Quality', title: 'Mint Condition', body: 'All comics ship bagged and boarded in Near Mint condition. Those coffee stains? Those are our copies.' },
            { icon: '💬', title: '24/7 Support', body: "Can't sleep at 3 AM? Neither can we. Misery loves company. Vent freely." },
          ].map(f => (
            <div className="why-card" key={f.title}>
              <span className="why-icon">{f.icon}</span>
              <h4 className="why-card-title">{f.title}</h4>
              <p className="why-card-body">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <style>{`
      .why-section { padding: 6rem 0; background: #111; }
      .why-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 5rem;
        align-items: start;
      }
      @media(max-width: 900px) { .why-grid { grid-template-columns: 1fr; gap: 3rem; } }
      .why-eyebrow {
        font-family: 'Courier New', monospace; font-size: .75rem;
        letter-spacing: .2em; text-transform: uppercase;
        color: #b30e1c; margin-bottom: .75rem;
      }
      .why-title {
        font-family: 'Anton', 'Impact', sans-serif;
        font-size: clamp(1.8rem, 4vw, 2.75rem);
        line-height: 1.05; color: #fff; text-transform: uppercase;
        margin: 0 0 1.5rem;
      }
      .why-body { font-size: .95rem; line-height: 1.7; color: rgba(255,255,255,.6); margin-bottom: 1rem; }
      .why-body em { color: rgba(255,255,255,.85); font-style: italic; }
      .btn-text-link {
        display: inline-block; margin-top: .5rem;
        font-family: 'Courier New', monospace; font-size: .78rem;
        letter-spacing: .12em; text-transform: uppercase;
        color: #b30e1c; text-decoration: none; border-bottom: 1px solid #b30e1c;
        padding-bottom: 2px; transition: opacity .2s;
      }
      .btn-text-link:hover { opacity: .7; }
      .why-features {
        display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;
      }
      .why-card {
        background: #161616; border: 1px solid #252525;
        padding: 1.5rem;
        transition: border-color .3s;
      }
      .why-card:hover { border-color: #b30e1c; }
      .why-icon { font-size: 1.75rem; display: block; margin-bottom: .75rem; }
      .why-card-title {
        font-family: 'Anton', 'Impact', sans-serif;
        font-size: 1rem; text-transform: uppercase; color: #fff; margin: 0 0 .5rem;
      }
      .why-card-body { font-size: .82rem; color: rgba(255,255,255,.5); line-height: 1.6; margin: 0; }
    `}</style>
  </section>
);

/* ─────────────────────────────────────────────
   BIG CTA BANNER  –  full-width promo push
───────────────────────────────────────────────*/
const CtaBanner = () => (
  <section className="cta-banner">
    <div className="cta-noise" />
    <div className="container cta-inner">
      <div className="cta-text">
        <h2 className="cta-heading">Your Backissue Box<br />Is Embarrassingly Empty.</h2>
        <p className="cta-sub">Let's fix that. Thousands of comics, e-books, and collectibles ready to ship today.</p>
      </div>
      <div className="cta-actions">
        <Link to="/shop" className="btn-cta-main">Shop Everything</Link>
        <Link to="/about" className="btn-cta-text">Why buy from us?</Link>
      </div>
    </div>
    <style>{`
      .cta-banner {
        position: relative;
        background: #b30e1c;
        overflow: hidden;
        padding: 5rem 0;
      }
      .cta-noise {
        position: absolute; inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
        opacity: .15; pointer-events: none;
      }
      .cta-inner {
        position: relative; z-index: 1;
        display: flex; align-items: center; justify-content: space-between;
        gap: 2rem; flex-wrap: wrap;
      }
      .cta-heading {
        font-family: 'Anton', 'Impact', sans-serif;
        font-size: clamp(1.8rem, 4vw, 3rem);
        text-transform: uppercase; color: #fff; line-height: 1.05;
        margin: 0 0 .75rem;
      }
      .cta-sub { color: rgba(255,255,255,.8); font-size: 1rem; max-width: 460px; margin: 0; }
      .cta-actions { display: flex; flex-direction: column; gap: 1rem; align-items: flex-start; }
      .btn-cta-main {
        display: inline-block; padding: 1rem 2.5rem;
        background: #fff; color: #b30e1c;
        font-family: 'Courier New', monospace; font-size: .85rem;
        letter-spacing: .1em; text-transform: uppercase;
        text-decoration: none; white-space: nowrap;
        clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
        transition: opacity .2s;
      }
      .btn-cta-main:hover { opacity: .88; color: #b30e1c; }
      .btn-cta-text {
        font-family: 'Courier New', monospace; font-size: .78rem;
        letter-spacing: .1em; text-transform: uppercase;
        color: rgba(255,255,255,.8); text-decoration: none;
        border-bottom: 1px solid rgba(255,255,255,.4);
        padding-bottom: 2px; transition: color .2s;
      }
      .btn-cta-text:hover { color: #fff; border-color: #fff; }
    `}</style>
  </section>
);

/* ─────────────────────────────────────────────
   OFFER HIGHLIGHTS  –  3 promo cards
───────────────────────────────────────────────*/
const OfferHighlights = () => {
  const offers = [
    { image: 'assets/images/comics/super2.png', category: 'E-Books', note: 'Starting at $9', link: '/shop?cat=books' },
    { image: 'assets/images/comics/super1.png', category: 'Comics', note: 'Bagged & Boarded', link: '/shop?cat=comics' },
    { image: 'assets/images/comics/super3.png', category: 'Collectibles', note: 'Limited Stock', link: '/shop?cat=cards' },
  ];
  return (
    <section className="offers-section">
      <div className="container">
        <div className="offers-grid">
          {offers.map(o => (
            <Link to={o.link} className="offer-card" key={o.category}>
              <img src={o.image} alt={o.category} className="offer-img" />
              <div className="offer-overlay">
                <span className="offer-note">{o.note}</span>
                <h3 className="offer-cat">{o.category}</h3>
                <span className="offer-btn">Shop Now →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .offers-section { padding: 5rem 0; }
        .offers-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
        .offer-card {
          position: relative; overflow: hidden;
          aspect-ratio: 3/4; display: block; text-decoration: none;
          background: #141414; border: 1px solid #222;
        }
        .offer-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform .5s;
        }
        .offer-card:hover .offer-img { transform: scale(1.08); }
        .offer-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,.9) 0%, transparent 55%);
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 1.75rem;
        }
        .offer-note {
          font-family: 'Courier New', monospace; font-size: .7rem;
          letter-spacing: .15em; text-transform: uppercase;
          color: #b30e1c; margin-bottom: .35rem;
        }
        .offer-cat {
          font-family: 'Anton', 'Impact', sans-serif;
          font-size: 2rem; text-transform: uppercase; color: #fff; margin: 0 0 .75rem;
        }
        .offer-btn {
          font-family: 'Courier New', monospace; font-size: .78rem;
          letter-spacing: .1em; text-transform: uppercase;
          color: rgba(255,255,255,.6); transition: color .2s;
        }
        .offer-card:hover .offer-btn { color: #fff; }
      `}</style>
    </section>
  );
};

/* ─────────────────────────────────────────────
   HOME PAGE  –  assembled
───────────────────────────────────────────────*/
const Home2 = () => (
  <>
    {/* Google Font for display */}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet" />

    <style>{`
      *, *::before, *::after { box-sizing: border-box; }
      body { background: #0d0d0d; color: rgba(255,255,255,.75); margin: 0; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
    `}</style>

    <HeroSection />
    <TrustBar />
    <CategoryCards />
    <MarqueeBand />
    <WhyUs />
    <OfferHighlights />
    <CtaBanner />
  </>
);

export default Home2;