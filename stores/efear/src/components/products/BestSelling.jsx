import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchProducts,
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
} from '../../features/products/slice';
import { dispatch } from '../../features/store';
import { ProductListItem } from './ProductListItem';

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────*/
const T = {
  red:     '#e63946',
  orange:  '#f4a261',
  teal:    '#2a9d8f',
  dark0:   '#0d0d0d',
  dark1:   '#111111',
  dark2:   '#141414',
  dark3:   '#1a1a1a',
  border:  '#222222',
  textDim: 'rgba(255,255,255,0.32)',
  textMid: 'rgba(255,255,255,0.58)',
  textHi:  'rgba(255,255,255,0.92)',
};

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────*/
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap');

  /* ── Section shell ── */
  .bs-section {
    background: ${T.dark1};
    border-top: 1px solid ${T.border};
    padding: 4.5rem 0;
    position: relative; overflow: hidden;
  }
  .bs-section::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px);
    background-size: 22px 22px;
    pointer-events: none;
  }

  /* ── Section header ── */
  .bs-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-bottom: 2.5rem; gap: 1rem; flex-wrap: wrap;
  }
  .bs-eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: .68rem; letter-spacing: .22em; text-transform: uppercase;
    color: ${T.red}; display: block; margin-bottom: .5rem;
  }
  .bs-title {
    font-family: 'Anton', 'Impact', sans-serif;
    font-size: clamp(1.75rem, 4vw, 2.75rem);
    text-transform: uppercase; color: #fff; margin: 0; line-height: 1;
  }
  .bs-title span { color: ${T.red}; }
  .bs-view-all {
    display: inline-flex; align-items: center; gap: .5rem;
    padding: .65rem 1.4rem;
    background: transparent; border: 1px solid ${T.border};
    color: ${T.textMid};
    font-family: 'Space Mono', monospace; font-size: .68rem;
    letter-spacing: .1em; text-transform: uppercase;
    text-decoration: none; white-space: nowrap;
    transition: border-color .2s, color .2s;
    flex-shrink: 0;
  }
  .bs-view-all:hover { border-color: ${T.red}; color: ${T.red}; }

  /* ── Tab bar ── */
  .bs-tabs {
    display: flex; gap: 0;
    border-bottom: 1px solid ${T.border};
    margin-bottom: 0; overflow-x: auto;
    scrollbar-width: none;
  }
  .bs-tabs::-webkit-scrollbar { display: none; }
  .bs-tab {
    display: flex; align-items: center; gap: .5rem;
    padding: .75rem 1.25rem;
    background: none; border: none; border-bottom: 2px solid transparent;
    color: ${T.textDim};
    font-family: 'Space Mono', monospace; font-size: .65rem;
    letter-spacing: .1em; text-transform: uppercase;
    cursor: pointer; white-space: nowrap;
    transition: color .2s, border-color .2s;
    margin-bottom: -1px;
  }
  .bs-tab:hover { color: ${T.textMid}; }
  .bs-tab.active { color: #fff; border-bottom-color: var(--tab-accent, ${T.red}); }
  .bs-tab-dot {
    width: 6px; height: 6px;
    background: var(--tab-accent, ${T.red});
    border-radius: 50%;
    opacity: 0; transition: opacity .2s;
  }
  .bs-tab.active .bs-tab-dot { opacity: 1; }

  /* ── Grid of columns ── */
  .bs-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border: 1px solid ${T.border};
    border-top: none;
  }
  @media(max-width: 1100px) { .bs-grid { grid-template-columns: repeat(2, 1fr); } }
  @media(max-width: 580px)  { .bs-grid { grid-template-columns: 1fr; } }

  /* ── Column ── */
  .bs-col {
    border-right: 1px solid ${T.border};
    padding: 1.5rem;
    display: flex; flex-direction: column; gap: 0;
  }
  .bs-col:last-child { border-right: none; }
  @media(max-width: 1100px) {
    .bs-col:nth-child(2)  { border-right: none; }
    .bs-col:nth-child(3)  { border-top: 1px solid ${T.border}; }
    .bs-col:nth-child(4)  { border-top: 1px solid ${T.border}; border-right: none; }
  }
  @media(max-width: 580px) {
    .bs-col { border-right: none; border-top: 1px solid ${T.border}; }
    .bs-col:first-child { border-top: none; }
  }

  /* ── Column header ── */
  .bs-col-head {
    display: flex; align-items: center; gap: .65rem;
    margin-bottom: 1.1rem; padding-bottom: .85rem;
    border-bottom: 1px solid ${T.border};
  }
  .bs-col-accent-bar {
    width: 3px; height: 1.1rem; flex-shrink: 0;
    background: var(--col-accent, ${T.red});
  }
  .bs-col-title {
    font-family: 'Anton', 'Impact', sans-serif;
    font-size: .85rem; letter-spacing: .12em; text-transform: uppercase;
    color: #fff; margin: 0; flex: 1;
  }
  .bs-col-count {
    font-family: 'Space Mono', monospace;
    font-size: .6rem; color: ${T.textDim};
    background: ${T.dark3}; border: 1px solid ${T.border};
    padding: .1rem .4rem;
  }

  /* ── Product list item (wrapper) ── */
  .bs-item {
    display: flex; align-items: center; gap: .85rem;
    padding: .75rem 0;
    border-bottom: 1px solid ${T.border};
    text-decoration: none;
    transition: background .15s;
    cursor: pointer;
  }
  .bs-item:last-child { border-bottom: none; padding-bottom: 0; }
  .bs-item:hover { background: ${T.dark0}; margin: 0 -.5rem; padding: .75rem .5rem; }

  /* ── Skeleton loader ── */
  .bs-skeleton {
    animation: bsPulse 1.6s ease-in-out infinite;
  }
  @keyframes bsPulse {
    0%,100% { opacity: 1; }
    50%      { opacity: .35; }
  }
  .bs-skeleton-line {
    height: 10px; background: ${T.dark3}; border-radius: 1px;
    margin-bottom: .5rem;
  }
  .bs-skeleton-img {
    width: 52px; height: 52px; flex-shrink: 0;
    background: ${T.dark3}; border: 1px solid ${T.border};
  }

  /* ── Empty state (per column) ── */
  .bs-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 2.5rem 1rem; text-align: center; flex: 1;
  }
  .bs-empty-icon { font-size: 2rem; color: ${T.border}; margin-bottom: .75rem; }
  .bs-empty-txt {
    font-family: 'Space Mono', monospace;
    font-size: .65rem; color: ${T.textDim};
    text-transform: uppercase; letter-spacing: .1em;
  }

  /* ── Error banner ── */
  .bs-error {
    background: rgba(230,57,70,.08); border: 1px solid rgba(230,57,70,.3);
    padding: 1.5rem; display: flex; align-items: center; gap: 1rem;
  }
  .bs-error-icon {
    font-family: 'Anton', 'Impact', sans-serif;
    font-size: 2rem; color: ${T.red}; flex-shrink: 0; line-height: 1;
  }
  .bs-error-title {
    font-family: 'Anton', 'Impact', sans-serif;
    font-size: 1rem; text-transform: uppercase; color: #fff; margin: 0 0 .25rem;
  }
  .bs-error-body {
    font-family: 'Space Mono', monospace;
    font-size: .7rem; color: ${T.textMid}; margin: 0;
  }
`;

/* ─────────────────────────────────────────────
   SKELETON LOADER (per column)
───────────────────────────────────────────────*/
const SkeletonItems = () => (
  <div className="bs-skeleton">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bs-item" style={{ cursor: 'default' }}>
        <div className="bs-skeleton-img" />
        <div style={{ flex: 1 }}>
          <div className="bs-skeleton-line" style={{ width: '80%' }} />
          <div className="bs-skeleton-line" style={{ width: '45%', marginBottom: 0 }} />
        </div>
      </div>
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   SINGLE COLUMN
───────────────────────────────────────────────*/
const ProductListSection = ({ title, products, loading, accent, count }) => (
  <div className="bs-col" style={{ '--col-accent': accent }}>
    {/* Column header */}
    <div className="bs-col-head">
      <div className="bs-col-accent-bar" />
      <h6 className="bs-col-title">{title}</h6>
      {!loading && products?.length > 0 && (
        <span className="bs-col-count">{Math.min(products.length, count)}</span>
      )}
    </div>

    {/* Content */}
    {loading ? (
      <SkeletonItems />
    ) : !products || products.length === 0 ? (
      <div className="bs-empty">
        <div className="bs-empty-icon">📦</div>
        <p className="bs-empty-txt">Nothing here yet</p>
      </div>
    ) : (
      products.slice(0, count).map((product, index) => (
        <ProductListItem key={product.id || product._id || index} product={product} />
      ))
    )}
  </div>
);

/* ─────────────────────────────────────────────
   TAB DEFINITIONS
───────────────────────────────────────────────*/
const TABS = [
  { id: 'all',   label: 'All',         accent: T.red    },
  { id: 'best',  label: 'Best Selling', accent: T.red    },
  { id: 'new',   label: 'New Arrivals', accent: T.orange },
  { id: 'rated', label: 'Top Rated',    accent: T.teal   },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────*/
export const BestSelling = ({ products: propProducts }) => {
  const allProducts = useSelector(selectAllProducts);
  const loading     = useSelector(selectProductsLoading);
  const error       = useSelector(selectProductsError);

  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!propProducts) dispatch(fetchProducts());
  }, [dispatch]);

  const source = propProducts || allProducts;

  // Product slices (TODO: replace with real selectors when available)
  const bestSelling = source.slice(10, 16);
  const newArrivals = source.slice(17, 22);
  const topRated    = source.slice(4,  9);
  const featured    = source.slice(0,  6);

  // Columns config
  const columns = [
    { id: 'best',     title: 'Best Selling',  products: bestSelling, accent: T.red,    count: 4 },
    { id: 'featured', title: 'Featured',      products: featured,    accent: T.orange, count: 4 },
    { id: 'new',      title: 'New Arrivals',  products: newArrivals, accent: T.teal,   count: 4 },
    { id: 'rated',    title: 'Top Rated',     products: topRated,    accent: T.red,    count: 4 },
  ];

  // Filtered columns based on active tab
  const visibleColumns = activeTab === 'all'
    ? columns
    : columns.filter(c => c.id === activeTab || c.id === 'featured');

  return (
    <>
      <style>{styles}</style>
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap" rel="stylesheet" />

      <section className="bs-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>

          {/* ── Section header ── */}
          <div className="bs-header">
            <div>
              <span className="bs-eyebrow">Handpicked for you</span>
              <h2 className="bs-title">Related <span>Products</span></h2>
            </div>
            <Link to="/shop" className="bs-view-all">
              More Products →
            </Link>
          </div>

          {/* ── Error state ── */}
          {error && (
            <div className="bs-error" style={{ marginBottom: '1.5rem' }}>
              <span className="bs-error-icon">!</span>
              <div>
                <p className="bs-error-title">Failed to load products</p>
                <p className="bs-error-body">{typeof error === 'string' ? error : 'Something went wrong. Try refreshing.'}</p>
              </div>
            </div>
          )}

          {/* ── Tab bar ── */}
          <div className="bs-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`bs-tab${activeTab === tab.id ? ' active' : ''}`}
                style={{ '--tab-accent': tab.accent }}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="bs-tab-dot" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Product columns ── */}
          <div
            className="bs-grid"
            style={{
              gridTemplateColumns: activeTab === 'all'
                ? 'repeat(4, 1fr)'
                : 'repeat(2, 1fr)',
            }}
          >
            {visibleColumns.map(col => (
              <ProductListSection
                key={col.id}
                title={col.title}
                products={col.products}
                loading={loading}
                accent={col.accent}
                count={col.count}
              />
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default BestSelling;