import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import ProductItem from "../Product/ProductItem";

const Recommended = ({ data }) => {
  const stateData = useSelector(state => state.product.data);
  
  // Memoize the product data to avoid unnecessary recalculations
  const productData = useMemo(() => {
    return data || stateData;
  }, [data, stateData]);

  // Memoize the recommended products slice
  const recommendedProducts = useMemo(() => {
    return productData?.slice(6, 12) || [];
  }, [productData]);

  // Early return if no products
  if (!recommendedProducts.length) {
    return (
      <div className="reconded-procuts d-inline-block w-100 py-5">
        <h2>Recommended</h2>
        <p>No recommended products available.</p>
      </div>
    );
  }

  // Carousel configuration
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
    <section className="reconded-procuts d-inline-block w-100 py-5">
      <h2>Recommended</h2>
      
      <OwlCarousel 
        className="like-slide owl-carousel owl-theme mt-4" 
        {...carouselOptions}
      >
        {recommendedProducts.map((item) => (
          <ProductItem key={item._id} item={item} />
        ))}
      </OwlCarousel>
    </section>
  );
};

export default Recommended;