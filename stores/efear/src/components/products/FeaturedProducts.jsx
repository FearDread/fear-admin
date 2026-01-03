import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import ProductQuickView from "./ProductQuickView";

// Featured Products Section
export const FeaturedProducts = ({ data }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef(null);
  const autoScrollRef = useRef(null);

  const prodState = useSelector((state) => state.products.data);
  const productData = useMemo(() => {
    return data || prodState;
  }, [data, prodState]);

  // Memoize the recommended products slice
  const featuredProducts = useMemo(() => {
    return productData?.slice(13, 19) || [];
  }, [productData]);

  // Auto scroll functionality
  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        scroll('right');
      }, 3000);
    };

    startAutoScroll();

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [scrollPosition]);

  const resetAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
    autoScrollRef.current = setInterval(() => {
      scroll('right');
    }, 3000);
  };

  const scroll = (direction) => {
    if (!carouselRef.current) return;
    
    const container = carouselRef.current;
    const scrollAmount = container.offsetWidth * 0.8;
    const maxScroll = container.scrollWidth - container.offsetWidth;
    
    let newPosition;
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
      behavior: 'smooth'
    });
    
    setScrollPosition(newPosition);
  };

  // Touch/Mouse drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
    resetAutoScroll();
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
    resetAutoScroll();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setScrollPosition(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <>
      <section className="py-4">
        <div className="container">
          <div className="d-flex align-items-center">
            <h5 className="text-uppercase mb-0">FEATURED PRODUCTS</h5>
            <a href="/shop" className="btn btn-light ms-auto rounded-0">
              More Products<i className='bx bx-chevron-right'></i>
            </a>
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
              <i className='bx bx-chevron-left'></i>
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
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
            >
              {featuredProducts.map((product) => (
                <div 
                  key={product._id}
                  className="carousel-item-wrapper"
                  style={{
                    flex: '0 0 auto',
                    width: 'calc(100% - 10px)',
                    minWidth: '200px'
                  }}
                >
                  <ProductCard 
                    {...product}
                    product={product}
                  />
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
              <i className='bx bx-chevron-right'></i>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedProducts;