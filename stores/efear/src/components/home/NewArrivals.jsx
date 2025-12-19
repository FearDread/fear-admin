import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import OwlCarousel from 'react-owl-carousel';
import ProductCard from "../products/ProductCard";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

export const NewArrivals = ( {data} ) => {
  const stateData = useSelector(state => state.products.data);
  // Memoize the product data to avoid unnecessary recalculations
  const productData = useMemo(() => {
    return data || stateData;
  }, [data, stateData]);

  // Memoize the recommended products slice
  const recommendedProducts = useMemo(() => {
    return productData?.slice(6, 12) || [];
  }, [productData]);

  const carouselOptions = {
    loop: true,
    margin: 10,
    nav: true,
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      992: { items: 3 },
      1200: { items: 4 }
    }
  };

  return (
    <section className="py-4">
      <div className="container">
        <div className="d-flex align-items-center">
          <h5 className="text-uppercase mb-0">New Arrivals</h5>
          <a href="javascript:;" className="btn btn-light ms-auto rounded-0">View All<i className='bx bx-chevron-right'></i></a>
        </div>
        <hr />
        <div className="product-grid">
          <OwlCarousel
            className="new-arrivals owl-carousel owl-theme"
            {...carouselOptions}
          >
            {recommendedProducts.map((product) => (
              <div className="item" key={product._id}>
                <ProductCard {...product} />
              </div>
            ))}
          </OwlCarousel>
        </div>
      </div>
    </section>
  );
}

export default NewArrivals;
