import Link from 'next/link';
import type { CSSProperties } from 'react';

interface Category {
  label: string;
  tagline: string;
  blurb: string;
  accent: string;
  image: string;
  link: string;
}

export const CategoryCards = () => {
  const cats: Category[] = [
    {
      label: 'Comics',
      tagline: 'Marvel, DC & beyond',
      blurb: 'From first prints to modern variants. Every issue bagged, boarded, near-mint.',
      accent: '#c40717',
      image: '/assets/images/comics/super1.png',
      link: '/shop?cat=comics',
    },
    {
      label: 'E-Books',
      tagline: 'Starting at $9',
      blurb: 'Cookbooks, manifestos, graphic novels, and more. Also available on Amazon.',
      accent: '#6f11e1',
      image: '/assets/images/ebooks/01.jpg',
      link: '/shop?cat=books',
    },
    {
      label: 'Collectibles',
      tagline: 'Cards, slabs & rarities',
      blurb: 'Pokémon, NFL, NBA, Baseball. Some packs will make you cry. All of them will.',
      accent: '#1081a7',
      image: '/assets/images/comics/super3.png',
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
          {cats.map((c) => (
            <Link
              href={c.link}
              className="cat-card"
              key={c.label}
              style={{ '--cat-accent': c.accent } as CSSProperties}
            >
              <div className="cat-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
          font-family: var(--font-anton), Impact, sans-serif;
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
          font-family: var(--font-anton), Impact, sans-serif;
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

export default CategoryCards;
