'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useGetAllQuery } from '@/lib/redux/api/productsApi';
import ProductCard from './ProductCard';
import type { Product } from './ProductCard';

interface FeaturedProductsProps {
  data?: Product[];
}

// Featured Products Section
export const FeaturedProducts = ({ data }: FeaturedProductsProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: allProducts = [] } = useGetAllQuery();
  const productData = useMemo(() => data || allProducts, [data, allProducts]);

  // Memoize the recommended products slice
  const featuredProducts = useMemo(() => {
    return productData?.slice(13, 19) || [];
  }, [productData]);

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;

    const container = carouselRef.current;
    const scrollAmount = container.offsetWidth * 0.8;
    const maxScroll = container.scrollWidth - container.offsetWidth;

    let newPosition: number;
    if (direction === 'left') {
      newPosition = Math.max(0, scrollPosition - scrollAmount);
    } else {
      newPosition = scrollPosition + scrollAmount;
      // Loop back to start if at the end
      if (newPosition >= maxScroll) {
        newPosition = 0;
      }
    }

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });

    setScrollPosition(newPosition);
  };

  // Auto scroll functionality
  useEffect(() => {
    autoScrollRef.current = setInterval(() => {
      scroll('right');
    }, 3000);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition]);

  const resetAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
    autoScrollRef.current = setInterval(() => {
      scroll('right');
    }, 3000);
  };

  // Touch/Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
    resetAutoScroll();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
    resetAutoScroll();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (carouselRef.current) setScrollPosition(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="py-4">
      <div className="container">
        <div className="d-flex align-items-center">
          <h5 className="text-uppercase mb-0">FEATURED PRODUCTS</h5>
          <Link href="/shop" className="btn btn-light ms-auto rounded-0">
            More Products
            <i className="bx bx-chevron-right" />
          </Link>
        </div>
        <hr />
        <div className="product-grid position-relative">
          <button
            className="carousel-nav-btn carousel-nav-prev"
            onClick={() => {
              scroll('left');
              resetAutoScroll();
            }}
            aria-label="Previous products"
          >
            <i className="bx bx-chevron-left" />
          </button>

          <div
            ref={carouselRef}
            className="carousel-container"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            style={{
              display: 'flex',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              gap: '10px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            {featuredProducts.map((product: Product) => (
              <div
                key={product._id ?? product.id}
                className="carousel-item-wrapper"
                style={{
                  flex: '0 0 auto',
                  width: 'calc(100% - 10px)',
                  minWidth: '200px',
                }}
              >
                <ProductCard {...product} product={product} />
              </div>
            ))}
          </div>

          <button
            className="carousel-nav-btn carousel-nav-next"
            onClick={() => {
              scroll('right');
              resetAutoScroll();
            }}
            aria-label="Next products"
          >
            <i className="bx bx-chevron-right" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;