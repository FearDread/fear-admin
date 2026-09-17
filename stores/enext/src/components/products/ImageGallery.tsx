'use client';

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

function toPublicSrc(url: string): string {
    if (!url) return FALLBACK_IMAGE.url;
    if (/^https?:\/\//i.test(url)) return url;
    // Already relative to the app root.
    if (url.startsWith('/')) return url;
    // Bare relative path ("assets/images/x.png") — anchor it to /public.
    return `/${url}`;
}

export default function ImageGallery({ images, productTitle }: ImageGalleryProps) {
    const gallery = images && images.length > 0 ? images : [FALLBACK_IMAGE];
    const [activeIndex, setActiveIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        setActiveIndex(0);
    }, [images]);

    const activeImage = gallery[activeIndex] ?? gallery[0] ?? FALLBACK_IMAGE;

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
                    src={toPublicSrc(activeImage.url)}
                    alt={activeImage.alt || productTitle}
                    width={800}
                    height={800}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="pd-gallery-main-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                                src={toPublicSrc(img.url)}
                                alt={img.alt || `${productTitle} thumbnail ${i + 1}`}
                                width={80}
                                height={80}
                                sizes="80px"
                                className="pd-gallery-thumb-img"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}