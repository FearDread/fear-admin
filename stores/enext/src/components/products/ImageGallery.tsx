'use client';

// components/common/ImageGallery.tsx
//
// RECONSTRUCTION — no original ImageGallery.jsx source was available, so
// this was built to match how it's consumed in ProductDetailsClient.tsx:
//   <ImageGallery images={product.images} productTitle={product.title} />
// If you have the real CRA source, merge against it rather than replacing
// it wholesale — this is a best-guess implementation, not a diff.
//
// Conversion notes vs a typical CRA version:
//   • <img> -> next/image's <Image>, which requires width/height (or `fill`)
//     and needs the image host allow-listed in next.config.js under
//     images.remotePatterns if product images are served from a CDN/S3
//     rather than your own domain.
//   • 'use client' is required — this has interactive state (active index,
//     keyboard nav) that can't run in a server component.

import { useEffect, useState } from 'react';
import Image from 'next/image';

export interface GalleryImage {
  url: string;
  alt?: string;
}

interface ImageGalleryProps {
  images?: GalleryImage[];
  productTitle: string;
}

const FALLBACK_IMAGE: GalleryImage = { url: '/images/product-placeholder.png' };

export default function ImageGallery({ images, productTitle }: ImageGalleryProps) {
  const gallery = images && images.length > 0 ? images : [FALLBACK_IMAGE];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset back to the first image if the product changes underneath us
  // (e.g. navigating from one product page to another client-side).
  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const activeImage = gallery[activeIndex] ?? gallery[0];

  const goTo = (index: number) => {
    setActiveIndex(((index % gallery.length) + gallery.length) % gallery.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') goTo(activeIndex + 1);
    if (e.key === 'ArrowLeft') goTo(activeIndex - 1);
  };

  return (
    <div className="pd-gallery">
      {/* Main image */}
      <div
        className={`pd-gallery-main${isZoomed ? ' zoomed' : ''}`}
        role="group"
        aria-label={`${productTitle} images`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={() => setIsZoomed((z) => !z)}
      >
        <Image
          src={activeImage.url}
          alt={activeImage.alt || productTitle}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="pd-gallery-main-img"
          priority
        />

        {gallery.length > 1 && (
          <>
            <button
              type="button"
              className="pd-gallery-nav pd-gallery-nav-prev"
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex - 1);
              }}
            >
              ‹
            </button>
            <button
              type="button"
              className="pd-gallery-nav pd-gallery-nav-next"
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex + 1);
              }}
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {gallery.length > 1 && (
        <div className="pd-gallery-thumbs" role="tablist" aria-label="Product image thumbnails">
          {gallery.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              className={`pd-gallery-thumb${i === activeIndex ? ' active' : ''}`}
              onClick={() => goTo(i)}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productTitle} thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className="pd-gallery-thumb-img"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}