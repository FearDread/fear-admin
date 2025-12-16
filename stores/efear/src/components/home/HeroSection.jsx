import React, { useState } from 'react';

// Hero Slider Component
export const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Huge Summer Collection",
      subtitle: "Has just arrived!",
      description: "Swimwear, Tops, Shorts, Sunglasses & much more...",
      image: "🌴",
      bgColor: "from-purple-900 to-blue-900"
    },
  ];
  
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
    </>
  )
};

export default HeroSlider;