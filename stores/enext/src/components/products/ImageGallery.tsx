'use client';

// components/products/ImageGallery.tsx
//
// Thumbnails + main image + hover zoom + swipe + keyboard nav + fullscreen lightbox.
//
// Uses plain <img> (not next/image) on purpose: remotePatterns for the product
// CDN aren't confirmed in next.config.js yet, and next/image with `fill` renders
// nothing useful if the parent has no dimensions or the host isn't allow-listed
// — a common reason a "gallery doesn't work". Explicit aspect-ratio boxes in
// productStyles.ts prevent layout shift. Swap to next/image once the host is
// configured (keep `priority` on the first image for LCP).
//
// SSR note: this is a client component but still server-rendered on first
// request, so the first image is in the HTML Google crawls.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface GalleryImage {
  url: string;
  alt?: string;
}

interface ImageGalleryProps {
  /** Accepts strings, { url }, { secure_url } or { src } — whatever the API returns. */
  images?: unknown;
  productTitle: string;
  discountPercent?: number;
  outOfStock?: boolean;
}

// Inline SVG so the fallback can never 404 (a missing placeholder file is what
// makes a gallery look "blank").
const FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="#141414"/>' +
      '<rect x="20" y="20" width="360" height="460" fill="none" stroke="#2a2a2a" stroke-width="2" stroke-dasharray="8 8"/>' +
      '<text x="200" y="260" text-anchor="middle" font-family="monospace" font-size="16" fill="#555" letter-spacing="3">NO IMAGE</text></svg>',
  );
const SWIPE_THRESHOLD = 45;

type RawImage = string | { url?: string; secure_url?: string; src?: string; alt?: string } | null | undefined;

function normalize(images: unknown): GalleryImage[] {
  const arr: RawImage[] = Array.isArray(images) ? images : images ? [images as RawImage] : [];
  const list = arr
    .map((i): GalleryImage | null => {
      if (!i) return null;
      if (typeof i === 'string') return i ? { url: i } : null;
      const url = i.url || i.secure_url || i.src;
      return url ? { url, alt: i.alt } : null;
    })
    .filter((i): i is GalleryImage => i !== null);

  if (!list.length && process.env.NODE_ENV !== 'production') {
    console.warn('[ImageGallery] no usable image URLs in:', images);
  }
  return list.length ? list : [{ url: FALLBACK }];
}

export default function ImageGallery({
  images,
  productTitle,
  discountPercent = 0,
  outOfStock = false,
}: ImageGalleryProps) {
  const gallery = useMemo(() => normalize(images), [images]);
  // Stable key so a background refetch returning the same images doesn't reset the view.
  const galleryKey = gallery.map((g) => g.url).join('|');

  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const [broken, setBroken] = useState<Record<string, boolean>>({});

  const touchStart = useRef<number | null>(null);
  const swiped = useRef(false);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const count = gallery.length;
  const src = (g: GalleryImage) => (broken[g.url] ? FALLBACK : g.url);
  const current = gallery[active] ?? gallery[0];

  useEffect(() => {
    setActive(0);
    setZoom(null);
  }, [galleryKey]);

  const goTo = useCallback(
    (i: number) => {
      setActive(((i % count) + count) % count);
      setZoom(null);
    },
    [count],
  );
  const next = useCallback(() => goTo(active + 1), [goTo, active]);
  const prev = useCallback(() => goTo(active - 1), [goTo, active]);

  // Keep the active thumbnail in view.
  useEffect(() => {
    const el = thumbsRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [active]);

  // Lightbox: Esc / arrows + body scroll lock.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox, next, prev]);

  // ── Main image handlers ──
  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !zoom) return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  const handleClick = () => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    // Mouse: click toggles hover-zoom; touch / zoom-off: open lightbox.
    setLightbox(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    swiped.current = false;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null || count < 2) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      swiped.current = true;
      dx < 0 ? next() : prev();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setLightbox(true);
    }
  };

  const zoomStyle: React.CSSProperties | undefined = zoom
    ? { transformOrigin: `${zoom.x}% ${zoom.y}%` }
    : undefined;

  return (
    <>
      <div className={`pd-gallery${count === 1 ? ' is-single' : ''}`}>
        {count > 1 && (
          <div className="pd-gallery-thumbs" ref={thumbsRef} role="tablist" aria-label="Product images">
            {gallery.map((g, i) => (
              <button
                key={g.url + i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show image ${i + 1} of ${count}`}
                data-active={i === active}
                className={`pd-gallery-thumb${i === active ? ' active' : ''}`}
                onClick={() => goTo(i)}
                onMouseEnter={() => goTo(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src(g)} alt="" loading="lazy" decoding="async" onError={() => setBroken((b) => ({ ...b, [g.url]: true }))} />
              </button>
            ))}
          </div>
        )}

        <div
          className={`pd-gallery-main${zoom ? ' is-zooming' : ''}`}
          role="group"
          aria-roledescription="carousel"
          aria-label={`${productTitle} images`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onClick={handleClick}
          onPointerEnter={(e) => e.pointerType === 'mouse' && setZoom({ x: 50, y: 50 })}
          onPointerMove={handleMove}
          onPointerLeave={() => setZoom(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {(discountPercent > 0 || outOfStock) && (
            <div className="pd-gallery-badges">
              {discountPercent > 0 && <span className="pd-gallery-badge">-{discountPercent}%</span>}
              {outOfStock && <span className="pd-gallery-badge dark">Sold Out</span>}
            </div>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={current.url}
            src={src(current)}
            alt={current.alt || `${productTitle} — image ${active + 1} of ${count}`}
            width={800}
            height={1000}
            style={zoomStyle}
            fetchPriority={active === 0 ? 'high' : 'auto'}
            decoding="async"
            draggable={false}
            onError={() => setBroken((b) => ({ ...b, [current.url]: true }))}
          />

          {count > 1 && (
            <>
              <button type="button" className="pd-gallery-nav prev" aria-label="Previous image"
                onClick={(e) => { e.stopPropagation(); prev(); }}>‹</button>
              <button type="button" className="pd-gallery-nav next" aria-label="Next image"
                onClick={(e) => { e.stopPropagation(); next(); }}>›</button>
              <span className="pd-gallery-counter" aria-live="polite">{active + 1} / {count}</span>
            </>
          )}
          <span className="pd-gallery-hint">⤢ Click to expand</span>
        </div>
      </div>

      {lightbox && (
        <div className="pd-lightbox" role="dialog" aria-modal="true" aria-label={`${productTitle} image viewer`}>
          <div className="pd-lightbox-bar">
            <h2 className="pd-lightbox-title">{productTitle}</h2>
            <span className="pd-lightbox-count">{active + 1} / {count}</span>
            <button type="button" className="pd-lightbox-close" aria-label="Close viewer" onClick={() => setLightbox(false)}>✕</button>
          </div>

          <div
            className="pd-lightbox-stage"
            onClick={(e) => e.target === e.currentTarget && setLightbox(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {count > 1 && (
              <button type="button" className="pd-lightbox-nav prev" aria-label="Previous image" onClick={prev}>‹</button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src(current)} alt={current.alt || `${productTitle} — image ${active + 1}`} draggable={false} />
            {count > 1 && (
              <button type="button" className="pd-lightbox-nav next" aria-label="Next image" onClick={next}>›</button>
            )}
          </div>

          {count > 1 && (
            <div className="pd-lightbox-strip">
              {gallery.map((g, i) => (
                <button key={g.url + i} type="button" className={i === active ? 'active' : ''} aria-label={`Show image ${i + 1}`} onClick={() => goTo(i)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src(g)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
