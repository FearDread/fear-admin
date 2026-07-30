'use client';

import { useState, useRef, type CSSProperties } from 'react';
import Link from 'next/link';
import { useGetAllQuery } from '@/lib/redux/api/productsApi';
import type { Product } from './ProductCard';
import { ProductListItem } from './ProductListItem';

interface Tab {
  id: string;
  label: string;
  accent: string;
}

const TABS: Tab[] = [
  { id: 'all', label: 'All', accent: '#b30e1c' },
  { id: 'best', label: 'Best Selling', accent: '#b30e1c' },
  { id: 'new', label: 'New Arrivals', accent: '#6d00fb' },
  { id: 'rated', label: 'Top Rated', accent: '#2a9d8f' },
];

/* ── Skeleton loader ── */
const SkeletonItems = () => (
  <div className="bs-skeleton">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bs-item bs-item--skeleton">
        <div className="bs-skeleton-img" />
        <div style={{ flex: 1 }}>
          <div className="bs-skeleton-line" style={{ width: '75%' }} />
          <div className="bs-skeleton-line" style={{ width: '42%', marginBottom: 0 }} />
        </div>
      </div>
    ))}
  </div>
);

/* ── Single column ── */
interface ColumnProps {
  title: string;
  products: Product[];
  loading: boolean;
  accent: string;
  count: number;
  index: number;
}

const Column = ({ title, products, loading, accent, count, index }: ColumnProps) => (
  <div
    className="bs-col"
    style={
      {
        '--col-accent': accent,
        '--col-index': index,
      } as CSSProperties
    }
  >
    {/* Top accent glow bar */}
    <div className="bs-col-glow-bar" aria-hidden="true" />

    {/* Column header */}
    <div className="bs-col-head">
      <div className="bs-col-accent-bar" />
      <h6 className="bs-col-title">{title}</h6>
      {!loading && products?.length > 0 && (
        <span className="bs-col-count">{Math.min(products.length, count)}</span>
      )}
    </div>

    {/* Items */}
    {loading ? (
      <SkeletonItems />
    ) : !products || products.length === 0 ? (
      <div className="bs-empty">
        <div className="bs-empty-icon">
          <i className="bx bx-box" />
        </div>
        <p className="bs-empty-txt">Nothing here yet</p>
      </div>
    ) : (
      products.slice(0, count).map((product, i) => (
        <div
          key={product.id || product._id || i}
          className="bs-item-wrap"
          style={{ '--item-index': i } as CSSProperties}
        >
          <ProductListItem product={product} />
        </div>
      ))
    )}
  </div>
);

interface BestSellingProps {
  products?: Product[];
}

/* ── Main component ── */
export const BestSelling = ({ products: propProducts }: BestSellingProps) => {
  // RTK Query fetches on mount automatically, so there's no need for the old
  // "dispatch(fetchProducts()) if no propProducts" effect the thunk version had.
  const {
    data: allProducts = [],
    isLoading: loading,
    isError,
    error: queryError,
  } = useGetAllQuery();

  const errorMessage = isError
    ? queryError && 'status' in queryError
      ? `Request failed (${queryError.status})`
      : 'Something went wrong. Try refreshing.'
    : null;

  const [activeTab, setActiveTab] = useState('all');
  const [animKey, setAnimKey] = useState(0); // bumped on tab change → re-runs stagger
  const gridRef = useRef<HTMLDivElement>(null);

  const source = propProducts || allProducts;
  const bestSelling = source.slice(10, 16);
  const newArrivals = source.slice(17, 22);
  const topRated = source.slice(4, 9);
  const featured = source.slice(0, 6);

  const columns = [
    { id: 'best', title: 'Best Selling', products: bestSelling, accent: '#b30e1c', count: 4 },
    { id: 'featured', title: 'Featured', products: featured, accent: '#8500e4', count: 4 },
    { id: 'new', title: 'New Arrivals', products: newArrivals, accent: '#0deed4', count: 4 },
    { id: 'rated', title: 'Top Rated', products: topRated, accent: '#b30e1c', count: 4 },
  ];

  const visibleColumns =
    activeTab === 'all'
      ? columns
      : columns.filter((c) => c.id === activeTab || c.id === 'featured');

  const handleTab = (id: string) => {
    setActiveTab(id);
    setAnimKey((k) => k + 1);
  };

  /* Active tab indicator offset for the sliding underline */
  const tabIndex = TABS.findIndex((t) => t.id === activeTab);

  return (
    <section className="bs-section">
      {/* Atmosphere layers */}
      <div className="bs-halftone" aria-hidden="true" />
      <div className="bs-scanlines" aria-hidden="true" />

      <div className="bs-container">
        {/* ── Header ── */}
        <div className="bs-header">
          <div className="bs-header-left">
            <span className="bs-eyebrow">// Top Selections</span>
            <h2 className="bs-title">
              Best <span>Selling</span>
            </h2>
          </div>
          <Link href="/shop" className="bs-view-all">
            More Products <i className="bx bx-chevron-right" />
          </Link>
        </div>

        {/* ── Error banner ── */}
        {errorMessage && (
          <div className="bs-error">
            <span className="bs-error-icon">!</span>
            <div>
              <p className="bs-error-title">Failed to load products</p>
              <p className="bs-error-body">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* ── Tab bar ── */}
        <div className="bs-tabs-wrap">
          <div className="bs-tabs" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`bs-tab${activeTab === tab.id ? ' bs-tab--active' : ''}`}
                style={{ '--tab-accent': tab.accent } as CSSProperties}
                onClick={() => handleTab(tab.id)}
              >
                <span className="bs-tab-dot" />
                {tab.label}
              </button>
            ))}
          </div>
          {/* Sliding underline indicator */}
          <div
            className="bs-tab-indicator"
            style={
              {
                '--ind-accent': TABS[tabIndex]?.accent ?? '#b30e1c',
                '--ind-offset': `${tabIndex * 100}%`,
                '--ind-width': `${100 / TABS.length}%`,
              } as CSSProperties
            }
          />
        </div>

        {/* ── 3D column grid ── */}
        <div
          key={animKey}
          ref={gridRef}
          className={`bs-grid bs-grid--${visibleColumns.length === 4 ? '4col' : '2col'}`}
        >
          {visibleColumns.map((col, i) => (
            <Column
              key={col.id}
              index={i}
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
  );
};

export default BestSelling;
