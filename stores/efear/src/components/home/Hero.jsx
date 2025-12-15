import React, { useState } from 'react';

// Hero Slider Component
const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Huge Summer Collection",
      subtitle: "Has just arrived!",
      description: "Swimwear, Tops, Shorts, Sunglasses & much more...",
      image: "🌴",
      bgColor: "from-purple-900 to-blue-900"
    },
    {
      title: "Women Sportswear Sale",
      subtitle: "Hurry up! Limited time offer.",
      description: "Sneakers, Keds, Sweatshirts, Hoodies & much more...",
      image: "👟",
      bgColor: "from-pink-900 to-red-900"
    },
    {
      title: "New Men's Accessories",
      subtitle: "Complete your look with",
      description: "Hats & Caps, Sunglasses, Bags & much more...",
      image: "🎒",
      bgColor: "from-green-900 to-teal-900"
    }
  ];

  /*
  return (
    <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center">
          <div className="flex-1">
            <h3 className="text-xl text-gray-300 mb-2">{slides[currentSlide].subtitle}</h3>
            <h1 className="text-5xl font-bold mb-4">{slides[currentSlide].title}</h1>
            <p className="text-gray-300 mb-6">{slides[currentSlide].description}</p>
            <button className="bg-white text-gray-900 px-6 py-3 rounded hover:bg-gray-100 flex items-center gap-2">
              Shop Now <i></i>
            </button>
          </div>
          <div className="flex-1 text-9xl text-center">{slides[currentSlide].image}</div>
        </div>
      </div>
  
      <div className="flex justify-center gap-2 mt-6">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === idx ? 'bg-white' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
  */

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