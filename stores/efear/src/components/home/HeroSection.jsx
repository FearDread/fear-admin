import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      id: 1,
      title: "New Arrivals!",
      heading: "Huge Comic Collection",
      description: "Marvel, DC, Dark Horse & much more...",
      image: "assets/images/comics/marvel_banner_1.jpg",
      buttonText: "Shop Now",
      buttonStyle: "btn-light",
      link: "/shop/comics",
      category: "comics"
    },
    {
      id: 2,
      title: "Hurry up! Available on Amazon.",
      heading: "FEAR Series Collection",
      description: "Cookbooks, Manifestos, & much more...",
      image: "assets/images/ebooks/03.jpg",
      buttonText: "Shop Now",
      buttonStyle: "btn-white",
      link: "/shop/books",
      category: "books",
      customClass: "fear-banner"
    },
    {
      id: 3,
      title: "Trading Cards!",
      heading: "New Trading Card Collections",
      description: "NFL & NBA Cards, Pokemon, Baseball & much more...",
      image: "assets/images/comics/banner-img-1.jpg",
      buttonText: "Shop Now",
      buttonStyle: "btn-dark",
      link: "/shop/cards",
      category: "cards"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, slides.length]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, slides.length]);

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handleShopNow = (link) => {
    navigate(link);
  };

  // Pause autoplay on hover
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  return (
    <section className="slider-section">
      <div className="first-slider">
        <div 
          className="carousel slide" 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Indicators */}
          <ol className="carousel-indicators">
            {slides.map((slide, index) => (
              <li
                key={slide.id}
                className={index === currentSlide ? 'active' : ''}
                onClick={() => goToSlide(index)}
                style={{ cursor: 'pointer' }}
                aria-label={`Slide ${index + 1}`}
              ></li>
            ))}
          </ol>

          {/* Slides */}
          <div className="carousel-inner">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
              >
                <div className="row d-flex align-items-center">
                  {/* Text Content */}
                  <div className="col d-none d-lg-flex justify-content-center">
                    <div className="slide-content animate__animated animate__fadeInLeft">
                      <h3 className="h3 fw-light mb-2">{slide.title}</h3>
                      <h1 className="h1 fw-bold mb-3">{slide.heading}</h1>
                      <p className="pb-3 text-muted">{slide.description}</p>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => handleShopNow(slide.link)}
                          className={`btn ${slide.buttonStyle} btn-ecomm`}
                        >
                          {slide.buttonText} <i className='bx bx-chevron-right'></i>
                        </button>
                        <Link
                          to="/products"
                          className="btn btn-outline-secondary btn-ecomm"
                        >
                          View All
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="col">
                    <img
                      src={slide.image}
                      className={`img-fluid ${slide.customClass || ''} animate__animated animate__fadeInRight`}
                      alt={slide.heading}
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                </div>

                {/* Mobile Content (visible on small screens) */}
                <div className="d-lg-none text-center p-4 mobile-slide-content">
                  <h3 className="h5 fw-light">{slide.title}</h3>
                  <h2 className="h3 fw-bold">{slide.heading}</h2>
                  <p className="small">{slide.description}</p>
                  <button
                    onClick={() => handleShopNow(slide.link)}
                    className={`btn btn-sm ${slide.buttonStyle} btn-ecomm`}
                  >
                    {slide.buttonText} <i className='bx bx-chevron-right'></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            onClick={handlePrev}
            disabled={isTransitioning}
            aria-label="Previous slide"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          
          <button
            className="carousel-control-next"
            type="button"
            onClick={handleNext}
            disabled={isTransitioning}
            aria-label="Next slide"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>

          {/* Progress Bar */}
          {isAutoPlaying && (
            <div className="carousel-progress">
              <div 
                className="carousel-progress-bar"
                style={{
                  animation: 'progress 5s linear',
                  animationPlayState: isAutoPlaying ? 'running' : 'paused'
                }}
              ></div>
            </div>
          )}

          {/* Slide Counter */}
          <div className="carousel-counter">
            <span>{currentSlide + 1}</span> / <span>{slides.length}</span>
          </div>
        </div>
      </div>

      {/* Additional CSS for enhanced features */}
      <style jsx>{`
        .carousel-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: rgba(255, 255, 255, 0.3);
          z-index: 10;
        }

        .carousel-progress-bar {
          height: 100%;
          background: var(--bs-primary, #0d6efd);
          width: 0;
        }

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .carousel-counter {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 14px;
          z-index: 10;
        }

        .carousel-control-prev,
        .carousel-control-next {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.7;
          transition: all 0.3s ease;
        }

        .carousel-control-prev:hover,
        .carousel-control-next:hover {
          opacity: 1;
          transform: translateY(-50%) scale(1.1);
        }

        .carousel-control-prev:disabled,
        .carousel-control-next:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .carousel-control-prev {
          left: 20px;
        }

        .carousel-control-next {
          right: 20px;
        }

        .carousel-indicators li {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .carousel-indicators li.active {
          width: 30px;
          border-radius: 6px;
        }

        .slide-content {
          padding: 0 50px;
        }

        .mobile-slide-content {
          background: rgba(255, 255, 255, 0.95);
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
        }

        .animate__animated {
          animation-duration: 0.6s;
        }

        @media (max-width: 991px) {
          .carousel-control-prev,
          .carousel-control-next {
            width: 40px;
            height: 40px;
          }

          .carousel-counter {
            bottom: 10px;
            right: 10px;
            font-size: 12px;
            padding: 3px 10px;
          }
        }

        .fear-banner {
          max-height: 500px;
          object-fit: contain;
        }

        .btn-ecomm {
          padding: 12px 30px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-ecomm:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </section>
  );
};

export default HeroSection;