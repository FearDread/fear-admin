import Link from 'next/link';
import { Anton } from 'next/font/google';
import HeroSection from '@/components/home/v2/ComicHero';
import TrustBar from '@/components/home/v2/TrustBar';
import FeaturedProducts from '@/components/home/v2/FeaturedProducts';
import CategoryCards from '@/components/home/v2/CategoryCards';
import GoogleAdSense from '@/components/common/AdSense';

// Replaces the manual <link> Google Fonts tags — self-hosted, no render-blocking fetch.
const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-anton',
});

const MarqueeBand = () => {
  const items = [
    'Marvel',
    'DC Comics',
    'Dark Horse',
    'Image Comics',
    'IDW',
    'Boom! Studios',
    'Pokémon',
    'Vertigo',
    'Valiant',
    'Dynamite',
    'BOOM!',
    'Fantagraphics',
  ];
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {[...items, ...items].map((b, i) => (
          <span key={i} className="marquee-item">
            {b} <span className="marquee-sep">✦</span>
          </span>
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
          font-family: var(--font-anton), Impact, sans-serif;
          font-size: 1rem; text-transform: uppercase; letter-spacing: .08em;
          color: #fff; white-space: nowrap; padding: 0 1.5rem;
        }
        .marquee-sep { opacity: .5; margin-left: 1.5rem; }
      `}</style>
    </div>
  );
};

const WhyUs = () => (
  <section className="why-section">
    <div className="container">
      <div className="why-grid">
        {/* left story */}
        <div className="why-story">
          <p className="why-eyebrow">Our Origin Story</p>
          <h2 className="why-title">
            Tragically Less Interesting
            <br />
            Than Batman&apos;s
          </h2>
          <p className="why-body">
            We started this business because someone told us &quot;following your dreams
            doesn&apos;t pay the bills.&quot; Joke&apos;s on them — we&apos;re still broke, but now
            we get to read comics while doing it.
          </p>
          <p className="why-body">
            Founded in a dimly lit basement that may or may not have violated several building
            codes, our shop emerged from a simple question:{' '}
            <em>&quot;What if we could lose money doing something we actually enjoy?&quot;</em>{' '}
            Turns out, we could. We really, really could.
          </p>
          <Link href="/about" className="btn-text-link">
            Read the full story →
          </Link>
        </div>

        {/* right feature grid */}
        <div className="why-features">
          {[
            {
              icon: '🚚',
              title: 'Free Shipping',
              body: "We'll bring it to your door for free. Because if we charged you shipping, you'd probably just steal it from a neighbor's porch anyway.",
            },
            {
              icon: '💰',
              title: '100% Money Back',
              body: "Regret your life choices? Us too. Send it back within 30 days. No judgment. We've seen worse.",
            },
            {
              icon: '🏷️',
              title: 'Mint Condition',
              body: 'All comics ship bagged and boarded in Near Mint condition. Those coffee stains? Those are our copies.',
            },
            {
              icon: '💬',
              title: '24/7 Support',
              body: "Can't sleep at 3 AM? Neither can we. Misery loves company. Vent freely.",
            },
          ].map((f) => (
            <div className="why-card" key={f.title}>
              <span className="why-icon">{f.icon}</span>
              <h4 className="why-card-title">{f.title}</h4>
              <p className="why-card-body">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const CtaBanner = () => (
  <section className="cta-banner">
    <div className="cta-noise" />
    <div className="container cta-inner">
      <div className="cta-text">
        <h2 className="cta-heading">
          Your Backissue Box
          <br />
          Is Embarrassingly Empty.
        </h2>
        <p className="cta-sub">
          Let&apos;s fix that. Thousands of comics, e-books, and collectibles ready to ship today.
        </p>
      </div>
      <div className="cta-actions">
        <Link href="/shop" className="btn-cta-main">
          Shop Everything
        </Link>
        <Link href="/about" className="btn-cta-text">
          Why buy from us?
        </Link>
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
        font-family: var(--font-anton), Impact, sans-serif;
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

const OfferHighlights = () => {
  const offers = [
    {
      image: '/assets/images/comics/super2.png',
      category: 'E-Books',
      note: 'Starting at $9',
      link: '/shop?cat=books',
    },
    {
      image: '/assets/images/comics/super1.png',
      category: 'Comics',
      note: 'Bagged & Boarded',
      link: '/shop?cat=comics',
    },
    {
      image: '/assets/images/comics/super3.png',
      category: 'Collectibles',
      note: 'Limited Stock',
      link: '/shop?cat=cards',
    },
  ];
  return (
    <section className="offers-section">
      <div className="container">
        <div className="offers-grid">
          {offers.map((o) => (
            <Link href={o.link} className="offer-card" key={o.category}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
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
          font-family: var(--font-anton), Impact, sans-serif;
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

export default function Home2() {
  return (
    <div className={anton.variable}>
      <HeroSection />
      <TrustBar />
      <CategoryCards />
      <MarqueeBand />
      <WhyUs />
      <FeaturedProducts />
      <GoogleAdSense slot="horizontal" format="auto" responsive={true} />
      <CtaBanner />
      <OfferHighlights />
    </div>
  );
}
