import React, { useState } from 'react';

import HeroSlider from "../components/home/Hero";
import FeaturedProducts from "../components/products/Featured";

const Home = () => {
  return (
    <>
      <section className="slider-section">
        <div className="first-slider">
          <div id="carouselExampleDark" className="carousel slide" data-bs-ride="carousel">
            <ol className="carousel-indicators">
              <li data-bs-target="#carouselExampleDark" data-bs-slide-to="0" className="active"></li>
              <li data-bs-target="#carouselExampleDark" data-bs-slide-to="1"></li>
              <li data-bs-target="#carouselExampleDark" data-bs-slide-to="2"></li>
            </ol>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="row d-flex align-items-center">
                  <div className="col d-none d-lg-flex justify-content-center">
                    <div>
                      <h3 className="h3 fw-light">Has just arrived!</h3>
                      <h1 className="h1">Huge Summer Collection</h1>
                      <p className="pb-3">Swimwear, Tops, Shorts, Sunglasses {"&"} much more...</p>
                      <div> <a className="btn btn-light btn-ecomm" href="javascript:;">Shop Now <i className='bx bx-chevron-right'></i></a>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <img src="assets/images/slider/04.png" className="img-fluid" alt="..." />
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="row d-flex align-items-center">
                  <div className="col d-none d-lg-flex justify-content-center">
                    <div>
                      <h3 className="h3 fw-light">Hurry up! Limited time offer.</h3>
                      <h1 className="h1">Women Sportswear Sale</h1>
                      <p className="pb-3">Sneakers, Keds, Sweatshirts, Hoodies {"&"} much more...</p>
                      <div> <a className="btn btn-white btn-ecomm" href="javascript:;">Shop Now <i className='bx bx-chevron-right'></i></a>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <img src="assets/images/slider/05.png" className="img-fluid" alt="..." />
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="row d-flex align-items-center">
                  <div className="col d-none d-lg-flex justify-content-center">
                    <div>
                      <h3 className="h3 fw-light">Complete your look with</h3>
                      <h1 className="h1">New Men's Accessories</h1>
                      <p className="pb-3">Hats {"&"} Caps, Sunglasses, Bags {"&"} much more...</p>
                      <div> <a className="btn btn-dark btn-ecomm" href="javascript:;">Shop Now <i className='bx bx-chevron-right'></i></a>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <img src="assets/images/slider/03.png" className="img-fluid" alt="..." />
                  </div>
                </div>
              </div>
            </div>
            <a className="carousel-control-prev" href="#carouselExampleDark" role="button" data-bs-slide="prev">	<span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleDark" role="button" data-bs-slide="next">	<span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </a>
          </div>
        </div>
      </section>

      <section className="py-4 bg-dark-1">
        <div className="container">
          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 row-group">
            <div className="col">
              <div className="text-center">
                <div className="font-50 text-white">	<i className='bx bx-cart'></i>
                </div>
                <h2 className="fs-5 text-uppercase mb-0">Free delivery</h2>
                <p className="text-capitalize">Free delivery over $199</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec vestibulum magna, et dapib.</p>
              </div>
            </div>
            <div className="col">
              <div className="text-center">
                <div className="font-50 text-white">	<i className='bx bx-credit-card'></i>
                </div>
                <h2 className="fs-5 text-uppercase mb-0">Secure payment</h2>
                <p className="text-capitalize">We possess SSL / Secure сertificate</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec vestibulum magna, et dapib.</p>
              </div>
            </div>
            <div className="col">
              <div className="text-center">
                <div className="font-50 text-white">	<i className='bx bx-dollar-circle'></i>
                </div>
                <h2 className="fs-5 text-uppercase mb-0">Free returns</h2>
                <p className="text-capitalize">We return money within 30 days</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec vestibulum magna, et dapib.</p>
              </div>
            </div>
            <div className="col">
              <div className="text-center">
                <div className="font-50 text-white">	<i className='bx bx-support'></i>
                </div>
                <h2 className="fs-5 text-uppercase mb-0">Customer Support</h2>
                <p className="text-capitalize">Friendly 24/7 customer support</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec vestibulum magna, et dapib.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProducts />

      <section className="py-4">
        <div className="container">
          <div className="add-banner">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-4">
              <div className="col d-flex">
                <div className="card rounded-0 w-100">
                  <img src="assets/images/promo/04.png" className="card-img-top" alt="..." />
                  <div className="position-absolute top-0 end-0 m-3 product-discount"><span>-10%</span>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">Sunglasses Sale</h5>
                    <p className="card-text">See all Sunglasses and get 10% off at all Sunglasses</p> <a href="javascript:;" className="btn btn-light btn-ecomm">SHOP BY GLASSES</a>
                  </div>
                </div>
              </div>
              <div className="col d-flex">
                <div className="card rounded-0 w-100">
                  <div className="position-absolute top-0 end-0 m-3 product-discount"><span>-80%</span>
                  </div>
                  <div className="card-body text-center mt-5">
                    <h5 className="card-title">Cosmetics Sales</h5>
                    <p className="card-text">Buy Cosmetics products and get 30% off at all Cosmetics</p> <a href="javascript:;" className="btn btn-light btn-ecomm">SHOP BY COSMETICS</a>
                  </div>
                  <img src="assets/images/promo/08.png" className="card-img-top" alt="..." />
                </div>
              </div>
              <div className="col d-flex">
                <div className="card rounded-0 w-100">
                  <img src="assets/images/promo/06.png" className="card-img h-100" alt="..." />
                  <div className="card-img-overlay text-center top-20">
                    <div className="border border-white border-3 py-3 bg-dark-3">
                      <h5 className="card-title">Fashion Summer Sale</h5>
                      <p className="card-text text-uppercase fs-1 text-white lh-1 mt-3 mb-2">Up to 80% off</p>
                      <p className="card-text fs-5">On top Fashion Brands</p>	<a href="javascript:;" className="btn btn-white btn-ecomm">SHOP BY FASHION</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col d-flex">
                <div className="card rounded-0 w-100">
                  <div className="position-absolute top-0 end-0 m-3 product-discount"><span>-50%</span>
                  </div>
                  <div className="card-body text-center">
                    <img src="assets/images/promo/07.png" className="card-img-top" alt="..." />
                    <h5 className="card-title fs-1 text-uppercase">Super Sale</h5>
                    <p className="card-text text-uppercase fs-4 text-white lh-1 mb-2">Up to 50% off</p>
                    <p className="card-text">On All Electronic</p> <a href="javascript:;" className="btn btn-light btn-ecomm">HURRY UP!</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    
    </>
  );
};

export default Home;