import type { Metadata } from 'next';
import Link from 'next/link';
import { T, AboutStyles } from '@/components/styles';
import { GoogleAdSense } from '@/components/common/AdSense';

export const metadata: Metadata = {
  title: 'About Us | eFear',
  description:
    'Comics, e-books, and collectibles sold by people who probably should have gotten real jobs. Learn the (mostly true) story behind eFear.',
};

// Fully static content — no dynamic data — so this renders as SSG at build time.
export const dynamic = 'force-static';

const PageHero = () => (
  <section style={{ position: 'relative', background: T.dark0, overflow: 'hidden', padding: '6rem 0 5rem' }}>
    <div className="halftone-overlay" />

    <span style={{
      position: 'absolute', right: '-1rem', top: '50%', transform: 'translateY(-50%)',
      fontFamily: "'Anton','Impact',sans-serif", fontSize: 'clamp(8rem,18vw,16rem)',
      textTransform: 'uppercase', color: 'rgba(255,255,255,.03)',
      lineHeight: 1, userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
    }}>ABOUT US</span>

    <div style={{ position: 'absolute', left: 0, top: 0, width: '4px', height: '100%', background: T.red }} />

    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '2rem' }}>
        <Link href="/" style={{ fontFamily: "'Space Mono',monospace", fontSize: '.7rem', letterSpacing: '.15em', textTransform: 'uppercase', color: T.textDim, textDecoration: 'none' }}>Home</Link>
        <span style={{ color: T.red, fontSize: '.7rem' }}>✦</span>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '.7rem', letterSpacing: '.15em', textTransform: 'uppercase', color: T.red }}>About Us</span>
      </div>

      <span className="about-eyebrow">Est. in a code-violating basement</span>
      <h1 style={{
        fontFamily: "'Anton','Impact',sans-serif",
        fontSize: 'clamp(3.5rem, 10vw, 8rem)',
        textTransform: 'uppercase', lineHeight: .92,
        color: '#fff', margin: '0 0 1.5rem',
        WebkitTextStroke: `2px ${T.red}`,
      }}>
        About<br />
        <span style={{ WebkitTextStroke: '0px', color: T.red }}>Us.</span>
      </h1>
      <p style={{ fontSize: '1.15rem', color: T.textMid, maxWidth: '520px', lineHeight: 1.65, margin: '0 0 2.5rem' }}>
        We sell comics, e-books, and collectibles because someone told us it was a terrible idea. Spoiler: they were right. We did it anyway.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link href="/shop" className="btn-about-primary">Shop Now</Link>
        <a href="#our-story" className="btn-about-ghost">Our Story ↓</a>
      </div>
    </div>

    <style>{`
      @media(max-width:600px){ section { padding: 4rem 0 3rem !important; } }
    `}</style>
  </section>
);

const MarqueeBand = () => {
  const items = ['Marvel', 'DC Comics', 'Dark Horse', 'Image Comics', 'IDW', 'Boom! Studios', 'Pokémon', 'Vertigo', 'Valiant', 'Dynamite', 'Fantagraphics'];
  return (
    <div style={{ background: T.red, overflow: 'hidden', padding: '.7rem 0' }}>
      <div style={{ display: 'flex', width: 'max-content', animation: 'marqueeScroll 28s linear infinite' }}>
        {[...items, ...items].map((b, i) => (
          <span key={i} style={{
            fontFamily: "'Anton','Impact',sans-serif",
            fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '.08em',
            color: '#fff', whiteSpace: 'nowrap', padding: '0 1.5rem',
          }}>{b} <span style={{ opacity: .5, marginLeft: '1.5rem' }}>✦</span></span>
        ))}
      </div>
      <style>{`@keyframes marqueeScroll{ from{transform:translateX(0)} to{transform:translateX(-50%)} }`}</style>
    </div>
  );
};

const OriginStory = () => (
  <section id="our-story" style={{ padding: '6rem 0', background: T.dark1 }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            background: T.dark2, border: `1px solid ${T.border}`,
            aspectRatio: '4/5', overflow: 'hidden', position: 'relative',
          }} className="clip-corner">
            {/* eslint-disable-next-line @next/next/no-img-element -- TODO: swap for next/image once product/marketing image domains are configured */}
            <img
              src="assets/images/about/01.png"
              alt="About us"
              style={{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                filter: 'grayscale(30%) contrast(1.1)',
              }}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(to top, rgba(230,57,70,.85) 0%, transparent 55%)',
              padding: '2rem 1.5rem 1.5rem',
            }}>
              <span style={{
                fontFamily: "'Anton','Impact',sans-serif",
                fontSize: '1.1rem', textTransform: 'uppercase', color: '#fff',
              }}>Tragically Less Interesting Than Batman&apos;s</span>
            </div>
          </div>
          <div style={{
            position: 'absolute', top: '-1.5rem', right: '-1.5rem',
            background: T.red, padding: '1.25rem 1.5rem',
            // NOTE: source had this clipPath key twice — de-duped during conversion.
            clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
          }}>
            <div style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: '2.5rem', color: '#fff', lineHeight: 1 }}>1000+</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '.65rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)', marginTop: '.25rem' }}>Titles In Stock</div>
          </div>
        </div>

        <div>
          <span className="about-eyebrow">Chapter One</span>
          <h2 className="about-section-title">Welcome to<br />the Void<br /><span style={{ color: T.red }}>(With Better<br />Graphics)</span></h2>

          <p className="about-body-text">
            We started this business because someone once told us <em>&quot;following your dreams doesn&apos;t pay the bills.&quot;</em> Well, joke&apos;s on them — we&apos;re still broke, but now we get to read comics while doing it.
          </p>
          <p className="about-body-text">
            Founded in a dimly lit basement that may or may not have violated several building codes, our shop emerged from a simple question: <em>&quot;What if we could lose money doing something we actually enjoy?&quot;</em> Turns out, we could. We really, really could.
          </p>
          <p className="about-body-text">
            After years of hoarding graphic novels and e-books like a literary dragon with questionable taste, we realized our collection had become large enough to either start a business or seek professional help. We chose the path with fewer feelings.
          </p>

          <div style={{ borderLeft: `3px solid ${T.red}`, paddingLeft: '1.25rem', margin: '2rem 0' }}>
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: '.9rem', fontStyle: 'italic', color: T.textHi, lineHeight: 1.7, margin: 0 }}>
              &quot;We sell comics and e-books. Revolutionary, we know.<br />Someone should write a comic about it.<br />(Please don&apos;t.)&quot;
            </p>
          </div>

          <Link href="/shop" className="btn-about-primary">Start Shopping</Link>
        </div>
      </div>
    </div>
    <style>{`@media(max-width:900px){ #our-story .container > div { grid-template-columns: 1fr !important; gap: 3rem !important; } }`}</style>
  </section>
);

const StatsRow = () => {
  const stats = [
    { value: '1000+', label: 'Comics In Stock', note: 'And counting' },
    { value: 'NM', label: 'Quality Standard', note: 'Near Mint only' },
    { value: '24/7', label: 'Support Available', note: "We also can't sleep" },
    { value: '30', label: 'Day Return Window', note: 'No questions asked' },
  ];
  return (
    <section style={{ background: T.dark0, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              padding: '3rem 1.5rem', textAlign: 'center',
              borderRight: i < 3 ? `1px solid ${T.border}` : 'none',
            }}>
              <div style={{
                fontFamily: "'Anton','Impact',sans-serif",
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                color: T.red, lineHeight: 1, marginBottom: '.5rem',
              }}>{s.value}</div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '.72rem', letterSpacing: '.15em', textTransform: 'uppercase', color: '#fff', marginBottom: '.35rem' }}>{s.label}</div>
              <div style={{ fontSize: '.78rem', color: T.textDim }}>{s.note}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:600px){ .stats-row-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>
    </section>
  );
};

const WhatWeOffer = () => {
  const offers = [
    {
      accent: T.red,
      icon: '📦',
      title: 'Comics',
      sub: 'Marvel · DC · Dark Horse · Indie · Manga',
      body: "Our carefully curated selection ranges from mainstream superhero fare to independent titles so obscure even their creators have forgotten about them. We've got everything from capes and tights to existential dread in panel form.",
      detail: 'Every issue bagged, boarded, near-mint.',
      link: '/shop?cat=comics',
    },
    {
      accent: T.orange,
      icon: '📚',
      title: 'E-Books',
      sub: 'Cookbooks · Manifestos · Biographies',
      body: "Words that hit harder than a Mjolnir swing. Our e-book selection spans cookbooks you'll bookmark but never use, manifestos that will change your worldview, and graphic novels for when you want pictures with your existential crises.",
      detail: 'Also available on Amazon.',
      link: '/shop?cat=books',
    },
    {
      accent: T.teal,
      icon: '🃏',
      title: 'Collectibles',
      sub: 'Pokémon · NFL · NBA · Baseball · Graded',
      body: 'Rare cards, graded slabs, pack pulls that will either make your day or haunt your dreams. We carry NFL, NBA, Pokémon, and Baseball. Some of these will appreciate in value. Most will not. We believe in honest uncertainty.',
      detail: 'Limited stock. Move fast.',
      link: '/shop?cat=cards',
    },
  ];

  return (
    <section style={{ padding: '6rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="about-eyebrow">What We Do</span>
          <h2 className="about-section-title">Here&apos;s What<br /><span style={{ color: T.red }}>We Offer</span></h2>
          <p style={{ maxWidth: '520px', margin: '0 auto', color: T.textMid, fontSize: '1rem', lineHeight: 1.65 }}>
            Three categories. Zero pretension. One extremely questionable business plan.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.5rem' }}>
          {offers.map(o => (
            <div
              key={o.title}
              className="offer-tile"
              style={{ '--o-accent': o.accent } as React.CSSProperties}
            >
              <div className="offer-tile-top">
                <span className="offer-tile-icon">{o.icon}</span>
                <span className="offer-tile-eyebrow">{o.sub}</span>
                <h3 className="offer-tile-title">{o.title}</h3>
              </div>
              <p className="offer-tile-body">{o.body}</p>
              <div className="offer-tile-footer">
                <span className="offer-tile-detail">{o.detail}</span>
                <Link href={o.link} className="offer-tile-link">Shop {o.title} →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .offer-tile {
          background: ${T.dark2};
          border: 1px solid ${T.border};
          padding: 2.25rem;
          display: flex; flex-direction: column; gap: 1rem;
          clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%);
          transition: border-color .3s, transform .3s;
          position: relative; overflow: hidden;
        }
        .offer-tile::before {
          content: '';
          position: absolute; left: 0; top: 0; width: 4px; height: 100%;
          background: var(--o-accent);
          transition: width .3s;
        }
        .offer-tile:hover { border-color: var(--o-accent); transform: translateY(-4px); }
        .offer-tile:hover::before { width: 6px; }
        .offer-tile-top { display: flex; flex-direction: column; gap: .5rem; }
        .offer-tile-icon { font-size: 2.25rem; }
        .offer-tile-eyebrow {
          font-family: 'Space Mono', monospace; font-size: .65rem;
          letter-spacing: .18em; text-transform: uppercase;
          color: var(--o-accent);
        }
        .offer-tile-title {
          font-family: 'Anton','Impact',sans-serif;
          font-size: 2rem; text-transform: uppercase; color: #fff; margin: 0;
        }
        .offer-tile-body {
          font-size: .875rem; line-height: 1.7;
          color: ${T.textMid}; flex: 1; margin: 0;
        }
        .offer-tile-footer {
          display: flex; justify-content: space-between; align-items: center;
          border-top: 1px solid ${T.border}; padding-top: 1rem; margin-top: .5rem;
        }
        .offer-tile-detail {
          font-family: 'Space Mono', monospace; font-size: .65rem;
          letter-spacing: .1em; text-transform: uppercase; color: ${T.textDim};
        }
        .offer-tile-link {
          font-family: 'Space Mono', monospace; font-size: .72rem;
          letter-spacing: .08em; text-transform: uppercase;
          color: var(--o-accent); text-decoration: none;
          transition: letter-spacing .2s;
        }
        .offer-tile:hover .offer-tile-link { letter-spacing: .15em; }
      `}</style>
    </section>
  );
};

const OurPromise = () => {
  const items = [
    {
      icon: '🚀',
      title: 'Fast Shipping',
      body: "Your comics will arrive before the heat death of the universe. Probably. We ship within 24 hours and use carriers that haven't lost a package since last Tuesday.",
    },
    {
      icon: '🧤',
      title: 'Mint Condition',
      body: "No coffee stains. Those are our copies. Every item ships bagged, boarded, and inspected. Near Mint or we don't ship it.",
    },
    {
      icon: '🔐',
      title: 'Secure Payment',
      body: 'Your credit card info is safer with us than your browser history. Military-grade encryption — because your impulse purchases deserve witness protection.',
    },
    {
      icon: '💬',
      title: 'Honest Support',
      body: "We respond faster than DC responds to fan criticism. We'll tell you if something is terrible. Then sell it to you anyway, because capitalism.",
    },
  ];

  return (
    <section style={{ padding: '6rem 0', background: T.dark0, position: 'relative', overflow: 'hidden' }}>
      <div className="halftone-overlay" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '5rem', alignItems: 'start' }}>
          <div>
            <span className="about-eyebrow">No Fine Print</span>
            <h2 className="about-section-title">Our<br /><span style={{ color: T.red }}>Promise</span><br />To You.</h2>
            <p className="about-body-text">
              Listen — you&apos;re already here reading this. The hard part is over. At this point you&apos;re pot-committed. Plus, we need to make rent.
            </p>
            <p className="about-body-text">
              Our landlord has made it very clear that <em>&quot;exposure&quot;</em> is not legal tender.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {items.map(it => (
              <div key={it.title} className="promise-item">
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>{it.icon}</span>
                <h4 style={{
                  fontFamily: "'Anton','Impact',sans-serif",
                  fontSize: '1.1rem', textTransform: 'uppercase', color: '#fff', margin: '0 0 .65rem',
                }}>{it.title}</h4>
                <p style={{ fontSize: '.85rem', color: T.textMid, lineHeight: 1.65, margin: 0 }}>{it.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .promise-item {
          background: ${T.dark2};
          border: 1px solid ${T.border};
          padding: 1.75rem;
          transition: border-color .3s;
        }
        .promise-item:hover { border-color: ${T.red}; }
        @media(max-width:900px){ .promise-grid { grid-template-columns: 1fr !important; gap: 3rem !important; } }
      `}</style>
    </section>
  );
};

const WhatMakesUsDifferent = () => {
  const diffs = [
    {
      img: 'assets/images/icons/delivery.png',
      accent: T.red,
      title: 'Free Shipping',
      body: "We'll bring it to your door for free. Because if we charged you shipping, you'd probably just steal it from a neighbor's porch anyway.",
    },
    {
      img: 'assets/images/icons/money-bag.png',
      accent: T.orange,
      title: '100% Money Back',
      body: "Regret your life choices? Us too. Send it back within 30 days, no judgment. We've seen worse decisions, trust us.",
    },
    {
      img: 'assets/images/icons/support.png',
      accent: T.teal,
      title: '24/7 Online Support',
      body: "Can't sleep at 3 AM? Neither can our support team — misery loves company. We're here for your questions and your 3 AM spirals.",
    },
  ];

  return (
    <section style={{ padding: '6rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="about-eyebrow">The Differentiators</span>
          <h2 className="about-section-title">What Makes<br /><span style={{ color: T.red }}>Us Different</span></h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
          {diffs.map(d => (
            <div key={d.title} className="diff-card">
              <div style={{
                width: '80px', height: '80px', margin: '0 auto 1.5rem',
                background: `${d.accent}18`,
                border: `1px solid ${d.accent}40`,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- TODO: swap for next/image once icon assets are hosted through a configured domain */}
                <img src={d.img} alt="" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
              </div>
              <h4 style={{
                fontFamily: "'Anton','Impact',sans-serif",
                fontSize: '1.25rem', textTransform: 'uppercase',
                color: '#fff', margin: '0 0 .85rem',
              }}>{d.title}</h4>
              <p style={{ fontSize: '.875rem', color: T.textMid, lineHeight: 1.7, margin: 0 }}>{d.body}</p>

              <div className="diff-underline" style={{ background: d.accent }} />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .diff-card {
          background: ${T.dark2};
          border: 1px solid ${T.border};
          padding: 2.5rem 2rem; text-align: center;
          transition: border-color .3s, transform .3s;
          position: relative;
        }
        .diff-underline {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 3px;
          transform: scaleX(0); transform-origin: left;
          transition: transform .35s;
        }
        .diff-card:hover { border-color: transparent; transform: translateY(-4px); }
        .diff-card:hover .diff-underline { transform: scaleX(1); }
        @media(max-width:768px){ .diff-card { text-align:left; } }
        @media(max-width:600px){
          section .container > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

const OurTeam = () => (
  <section style={{ padding: '6rem 0', background: T.dark0 }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
        <div>
          <span className="about-eyebrow">The Humans Behind This</span>
          <h2 className="about-section-title">Our<br /><span style={{ color: T.red }}>Team</span></h2>
          <p className="about-body-text">
            We&apos;re a small operation, which is a fancy way of saying we can&apos;t afford to hire anyone else. But what we lack in manpower, we make up for in caffeine addiction and the sinking feeling that we should have gotten real jobs.
          </p>
          <p className="about-body-text">
            Every order is packed by a real human who has read at least some of what they&apos;re shipping to you. We have opinions. Strong ones. About the Knightfall arc, about which Spider-Man run is definitive, and about whether the New 52 was a good idea.
          </p>
          <p className="about-body-text">
            <em>(It wasn&apos;t. Don&apos;t @ us.)</em>
          </p>

          <div style={{
            display: 'flex', gap: '2.5rem', marginTop: '2.5rem',
            paddingTop: '2.5rem', borderTop: `1px solid ${T.border}`,
          }}>
            {[['☕', 'Fuel Source', 'Dark roast, no milk'], ['📦', 'Daily Orders', 'Packed with love*'], ['📖', 'Comics Read', 'Too many to count']].map(([icon, label, sub]) => (
              <div key={label}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '.35rem' }}>{icon}</span>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '.68rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#fff' }}>{label}</div>
                <div style={{ fontSize: '.75rem', color: T.textDim, marginTop: '.2rem' }}>{sub}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '.7rem', color: T.textDim, marginTop: '1rem' }}>*Love not legally guaranteed. Please see returns policy.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {[
            { label: 'On Product Selection', quote: "If a book is terrible, we'll tell you. Then sell it to you anyway because capitalism.", accent: T.red },
            { label: 'On Shipping Speed', quote: "Your comics will arrive before the heat death of the universe. That's a promise and also our SLA.", accent: T.orange },
            { label: 'On Customer Service', quote: "We respond to emails faster than DC responds to fan criticism. That bar is low, but we're proud.", accent: T.teal },
          ].map(q => (
            <div key={q.label} style={{
              background: T.dark2, border: `1px solid ${T.border}`,
              borderLeft: `4px solid ${q.accent}`,
              padding: '1.5rem 1.75rem',
            }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '.65rem', letterSpacing: '.15em', textTransform: 'uppercase', color: q.accent, marginBottom: '.6rem' }}>{q.label}</div>
              <p style={{ fontFamily: "'Space Mono',monospace", fontSize: '.82rem', fontStyle: 'italic', color: T.textHi, lineHeight: 1.65, margin: 0 }}>&quot;{q.quote}&quot;</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <style>{`@media(max-width:900px){ #team-grid { grid-template-columns: 1fr !important; gap: 3rem !important; } }`}</style>
  </section>
);

const DisclaimerBanner = () => (
  <div style={{
    background: T.dark2, borderTop: `1px solid ${T.border}`,
    borderBottom: `1px solid ${T.border}`, padding: '1.25rem 0',
  }}>
    <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '.68rem', letterSpacing: '.15em', textTransform: 'uppercase', color: T.red }}>⚠ Disclaimer</span>
      <p style={{ fontFamily: "'Space Mono',monospace", fontSize: '.72rem', color: T.textDim, margin: 0, lineHeight: 1.6 }}>
        No comic book characters were harmed in the making of this website. Our dignity, however, didn&apos;t make it. Contact us about existential crises: we&apos;re available for approximately 60% of those things.
      </p>
    </div>
  </div>
);

const CtaBanner = () => (
  <section style={{ position: 'relative', background: T.red, overflow: 'hidden', padding: '5.5rem 0' }}>
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.08) 1px, transparent 1px)',
      backgroundSize: '22px 22px', pointerEvents: 'none',
    }} />
    <span style={{
      position: 'absolute', right: '-2rem', top: '50%', transform: 'translateY(-50%)',
      fontFamily: "'Anton','Impact',sans-serif",
      fontSize: 'clamp(6rem,15vw,13rem)',
      color: 'rgba(255,255,255,.07)', textTransform: 'uppercase',
      lineHeight: 1, userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
    }}>SHOP NOW</span>

    <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
      <div>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '.72rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.65)', display: 'block', marginBottom: '.75rem' }}>You&apos;ve read this far.</span>
        <h2 style={{
          fontFamily: "'Anton','Impact',sans-serif",
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          textTransform: 'uppercase', color: '#fff',
          lineHeight: 1.0, margin: '0 0 .75rem',
        }}>
          Your Backissue Box<br />Is Embarrassingly Empty.
        </h2>
        <p style={{ color: 'rgba(255,255,255,.8)', fontSize: '1rem', maxWidth: '460px', margin: 0 }}>
          Let&apos;s fix that. Thousands of comics, e-books, and collectibles. All bagged, boarded, and ready to ruin your budget.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <Link href="/shop" style={{
          display: 'inline-block', padding: '1rem 2.5rem',
          background: '#fff', color: T.red,
          fontFamily: "'Space Mono',monospace", fontSize: '.8rem',
          letterSpacing: '.1em', textTransform: 'uppercase',
          textDecoration: 'none', whiteSpace: 'nowrap',
          clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
          transition: 'opacity .2s',
        }}>Shop Everything</Link>
        <Link href="/contact" style={{
          fontFamily: "'Space Mono',monospace", fontSize: '.72rem',
          letterSpacing: '.1em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,.75)', textDecoration: 'none',
          borderBottom: '1px solid rgba(255,255,255,.35)', paddingBottom: '2px',
          transition: 'color .2s',
        }}>Contact Us Instead</Link>
      </div>
    </div>
  </section>
);

const BrandsRow = () => {
  const brands = ['Marvel', 'DC', 'Dark Horse', 'Image', 'IDW', 'Boom!', 'Valiant', 'Dynamite'];
  return (
    <section style={{ padding: '4rem 0', background: T.dark1, borderBottom: `1px solid ${T.border}` }}>
      <div className="container">
        <p style={{ fontFamily: "'Space Mono',monospace", fontSize: '.68rem', letterSpacing: '.2em', textTransform: 'uppercase', color: T.textDim, textAlign: 'center', marginBottom: '2rem' }}>Publishers &amp; Brands We Carry</p>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          {brands.map(b => (
            <div key={b} className="brand-chip">{b}</div>
          ))}
        </div>
      </div>
      <style>{`
        .brand-chip {
          padding: .65rem 1.5rem;
          border: 1px solid ${T.border};
          font-family: 'Anton','Impact',sans-serif;
          font-size: 1rem; letter-spacing: .05em; text-transform: uppercase;
          color: ${T.textDim};
          transition: border-color .25s, color .25s;
          cursor: default;
        }
        .brand-chip:hover { border-color: ${T.red}; color: #fff; }
      `}</style>
    </section>
  );
};

export default function AboutUsPage() {
  return (
    <>
      <AboutStyles />
      <PageHero />
      <MarqueeBand />
      <OriginStory />
      <StatsRow />
      <GoogleAdSense slot="horizontal" format="auto" responsive={true} />
      <WhatWeOffer />
      <OurPromise />
      <WhatMakesUsDifferent />
      <OurTeam />
      <DisclaimerBanner />
      <BrandsRow />
      <CtaBanner />
    </>
  );
}