'use client';

import { useMemo, useState, useRef, useEffect, useCallback, type CSSProperties } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import { useGetAllQuery } from '@/lib/redux/api/productsApi';

const AUTO_DELAY = 4000;

interface Product {
  _id?: string;
  id?: string;
  [key: string]: unknown;
}

interface FeaturedProductsProps {
  data?: Product[];
}

export const FeaturedProducts = ({ data }: FeaturedProductsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [progressKey, setProgressKey] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: allProducts = [] } = useGetAllQuery();
  const productData = useMemo(() => data || allProducts, [data, allProducts]);
  const featuredProducts = useMemo(() => productData?.slice(13, 19) || [], [productData]);
  const total = featuredProducts.length;

  /* ── Navigate ── */
  const goTo = useCallback(
    (idx: number) => {
      setActiveIndex((idx + total) % total);
      setProgressKey((k) => k + 1);
    },
    [total],
  );

  const prev = () => goTo(activeIndex - 1);
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  /* ── Auto-advance ── */
  useEffect(() => {
    if (isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(next, AUTO_DELAY);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next, isHovered]);

  /* ── Swipe / drag ── */
  const onDragStart = (x: number) => setDragStart(x);
  const onDragEnd = (x: number) => {
    if (dragStart === null) return;
    const d = dragStart - x;
    if (Math.abs(d) > 50) d > 0 ? next() : prev();
    setDragStart(null);
  };

  /* ── Card transform math ── */
  const cardStyle = (i: number): CSSProperties => {
    let off = i - activeIndex;
    if (off > total / 2) off -= total;
    if (off < -total / 2) off += total;
    const abs = Math.abs(off);
    if (abs > 2) return { display: 'none' };
    return {
      transform: `translateX(${off * 285}px) translateZ(${-abs * 90}px) scale(${1 - abs * 0.14}) rotateY(${off * -6}deg)`,
      opacity: abs === 0 ? 1 : abs === 1 ? 0.52 : 0.18,
      zIndex: 10 - abs,
      pointerEvents: abs === 0 ? 'auto' : 'none',
    };
  };

  const pad = (n: number) => String(n + 1).padStart(2, '0');

  return (
    <section
      className="fp-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="fp-halftone" aria-hidden="true" />
      <div className="fp-scanlines" aria-hidden="true" />

      <div className="container fp-inner">
        {/* ── Header ── */}
        <div className="fp-header">
          <div className="fp-header-left">
            <span className="fp-eyebrow">// Drop Zone</span>
            <h2 className="fp-title">
              Featured <span>Products</span>
            </h2>
          </div>
          <div className="fp-header-right">
            <span className="fp-counter" aria-live="polite">
              <span className="fp-counter-cur">{pad(activeIndex)}</span>
              <span className="fp-counter-sep">/</span>
              <span className="fp-counter-tot">{pad(total - 1)}</span>
            </span>
            <Link href="/shop" className="fp-view-all">
              All Products <i className="bx bx-chevron-right" />
            </Link>
          </div>
        </div>

        {/* ── Stage ── */}
        <div
          className="fp-stage-wrap"
          onMouseDown={(e) => onDragStart(e.clientX)}
          onMouseUp={(e) => onDragEnd(e.clientX)}
          onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
          onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
        >
          <div className="fp-glow-pool" aria-hidden="true" />

          <div className="fp-stage">
            {featuredProducts.map((product: Product, i: number) => (
              <div
                key={product._id ?? product.id ?? i}
                className={`fp-card-wrap${i === activeIndex ? ' fp-card-wrap--active' : ''}`}
                style={cardStyle(i)}
                onClick={() => i !== activeIndex && goTo(i)}
              >
                {i === activeIndex && (
                  <div className="fp-active-badge">
                    <i className="bx bx-bolt-circle" /> Featured
                  </div>
                )}
                <ProductCard {...product} product={product} />
              </div>
            ))}
          </div>

          <button className="fp-nav fp-nav--prev" onClick={prev} aria-label="Previous">
            <i className="bx bx-chevron-left" />
          </button>
          <button className="fp-nav fp-nav--next" onClick={next} aria-label="Next">
            <i className="bx bx-chevron-right" />
          </button>
        </div>

        {/* ── Footer: dots + progress ── */}
        <div className="fp-footer">
          <div className="fp-dots" role="tablist">
            {featuredProducts.map((_: Product, i: number) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Slide ${i + 1}`}
                className={`fp-dot${i === activeIndex ? ' fp-dot--active' : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <div className="fp-progress-track" aria-hidden="true">
            <div
              key={progressKey}
              className={`fp-progress-bar${isHovered ? ' fp-progress-bar--paused' : ''}`}
              style={{ '--dur': `${AUTO_DELAY}ms` } as CSSProperties}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
