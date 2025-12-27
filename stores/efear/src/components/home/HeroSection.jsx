import React, { useState, useEffect, useCallback } from 'react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [textAnimKey, setTextAnimKey] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Huge Comic Collection!",
      heading: "Comics!",
      description: "Marvel, DC, Dark Horse & much more...",
      image: "assets/images/comics/home04.png",
      buttonText: "Shop Now",
      category: "comics",
      gradient: ""
    },
    {
      id: 2,
      title: "Hurry up! Available on Amazon.",
      heading: "E-Books!",
      description: "Cookbooks, Manifestos, & much more...",
      image: "assets/images/ebooks/01.jpg",
      buttonText: "Shop Now",
      category: "books",
      gradient: "linear-gradient(135deg, #2223293e 0%, #0f07173e 100%"
    },
    {
      id: 3,
      title: "Trading Cards!",
      heading: "Collectables",
      description: "NFL & NBA Cards, Pokemon, Baseball & much more...",
      image: "assets/images/comics/trade01.jpg",
      buttonText: "Shop Now",
      category: "cards",
      gradient: "linear-gradient(135deg, #1a1d2ba8 0%, #160d1e57 100%"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTextAnimKey(prev => prev + 1);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, slides.length]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTextAnimKey(prev => prev + 1);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, slides.length]);

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTextAnimKey(prev => prev + 1);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  return (
    <div className="slider-container">
      <div 
        className="carousel-wrapper"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Indicators */}
        <div className="carousel-indicators">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slides */}
        <div className="carousel-track">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ background: slide.gradient }}
            >
              {/* Animated Background Shapes */}
              <div className="bg-shapes">
                <div className="shape shape-1" />
                <div className="shape shape-2" />
                <div className="shape shape-3" />
              </div>

              <div className="slide-container">
                {/* Text Content */}
                <div className="content-section">
                  <div className="slide-content" key={`${textAnimKey}-${index}`}>
                    <div className="title-wrapper">
                      <h3 className="slide-title">
                        {slide.title.split('').map((char, i) => (
                          <span 
                            key={i} 
                            className="char"
                            style={{ animationDelay: `${i * 0.03}s` }}
                          >
                            {char === ' ' ? '\u00A0' : char}
                          </span>
                        ))}
                      </h3>
                    </div>
                    
                    <h1 className="slide-heading">
                      {slide.heading.split(' ').map((word, i) => (
                        <span 
                          key={i} 
                          className="word"
                          style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                        >
                          {word}{' '}
                        </span>
                      ))}
                    </h1>
                    
                    <p className="slide-description">{slide.description}</p>
                    
                    <div className="button-group">
                      <button className="btn btn-light btn-ecomm">
                        <span>{slide.buttonText}</span>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button className="btn btn-dark btn-ecomm">
                        <span>View All</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="image-section">
                  <div className="image-wrapper">
                    <img
                      src={slide.image}
                      alt={slide.heading}
                      className="slide-image"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Content */}
              <div className="mobile-content">
                <h3 className="mobile-title">{slide.title}</h3>
                <h2 className="mobile-heading">{slide.heading}</h2>
                <p className="mobile-description">{slide.description}</p>
                <button className="btn btn-mobile">
                  {slide.buttonText}
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <button
          className="nav-btn nav-prev"
          onClick={handlePrev}
          disabled={isTransitioning}
          aria-label="Previous"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <button
          className="nav-btn nav-next"
          onClick={handleNext}
          disabled={isTransitioning}
          aria-label="Next"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Progress Bar */}
        {isAutoPlaying && (
          <div className="progress-bar-container">
            <div className="progress-bar" key={currentSlide} />
          </div>
        )}

        {/* Counter */}
        <div className="slide-counter">
          <span className="current">{currentSlide + 1}</span>
          <span className="separator">/</span>
          <span className="total">{slides.length}</span>
        </div>
      </div>

      <style jsx>{`

      `}</style>
    </div>
  );
};

export default HeroSection;