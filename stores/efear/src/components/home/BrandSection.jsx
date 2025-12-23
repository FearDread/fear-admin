import React from 'react';

import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const BrandSection = () => {

  const carouselOptions = {
				loop:true,
					margin:0,
					responsiveClass:true,
					nav:false,
					autoplay:true,
					autoplayTimeout:5000,
					dots: false,
					responsive:{
						0:{
							items:1
						},
						600:{
							items:2
						},
						1024:{
							items:3
						 },
						1366:{
							items:5
						 }
					  }
  };

  return (
    <>
    <section className="py-4">
      <div className="container">
        <h3 className="d-none">Brands</h3>
        <div className="brand-grid">
          <OwlCarousel
            className="brands-shops owl-carousel owl-theme border"
            {...carouselOptions}
          >
            <div className="item border-end">
              <div className="p-4">
                <a href="javascript:;">
                  <img src="assets/images/brands/01.png" className="img-fluid" alt="..." />
                </a>
              </div>
            </div>
            <div className="item border-end">
              <div className="p-4">
                <a href="javascript:;">
                  <img src="assets/images/brands/02.png" className="img-fluid" alt="..." />
                </a>
              </div>
            </div>
            <div className="item border-end">
              <div className="p-4">
                <a href="javascript:;">
                  <img src="assets/images/brands/03.png" className="img-fluid" alt="..." />
                </a>
              </div>
            </div>
            <div className="item border-end">
              <div className="p-4">
                <a href="javascript:;">
                  <img src="assets/images/brands/04.png" className="img-fluid" alt="..." />
                </a>
              </div>
            </div>
            <div className="item border-end">
              <div className="p-4">
                <a href="javascript:;">
                  <img src="assets/images/brands/05.png" className="img-fluid" alt="..." />
                </a>
              </div>
            </div>
            <div className="item border-end">
              <div className="p-4">
                <a href="javascript:;">
                  <img src="assets/images/brands/06.png" className="img-fluid" alt="..." />
                </a>
              </div>
            </div>
            <div className="item border-end">
              <div className="p-4">
                <a href="javascript:;">
                  <img src="assets/images/brands/07.png" className="img-fluid" alt="..." />
                </a>
              </div>
            </div>
          </OwlCarousel>
        </div>
      </div>
    </section>
    </>
  );
}

export default BrandSection;
