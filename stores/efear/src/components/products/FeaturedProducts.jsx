import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import OwlCarousel from 'react-owl-carousel';
import ProductCard from "./ProductCard";

// Featured Products Section
export const FeaturedProducts = ({ data }) => {
  const prodState = useSelector((state) => state.products.data);
  const productData = useMemo(() => {
    return data || prodState;
  }, [data, prodState]);

  // Memoize the recommended products slice
  const featuredProducts = useMemo(() => {
    return productData?.slice(13, 19) || [];
  }, [productData]);

  const carouselOptions = {
    loop: true,
    margin: 10,
    responsiveClass: true,
    nav: false,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      576: {
        items: 2
      },
      768: {
        items: 3
      },
      1366: {
        items: 4
      },
      1400: {
        items: 5
      }
    }
  };

  return (
    <section className="py-4">
      <div className="container">
        <div className="d-flex align-items-center">
          <h5 className="text-uppercase mb-0">FEATURED PRODUCTS</h5>
          <a href="/shop" className="btn btn-light ms-auto rounded-0">More Products<i className='bx bx-chevron-right'></i></a>
        </div>
        <hr />
        <div className="product-grid">
          <OwlCarousel
            className="new-arrivals owl-carousel owl-theme"
            {...carouselOptions}
          >
            {featuredProducts.map((product) => (
              <div className="item" key={product._id}>
                <ProductCard {...product} />
              </div>
            ))}
          </OwlCarousel>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;