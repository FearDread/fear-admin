"use client"

import { useState, useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";


export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [textKey, setTextKey] = useState(0);

  const slides = [
    {
      id: 1,
      eyebrow: "New Arrivals Every Week",
      heading: "Comics",
      sub: "Marvel · DC · Dark Horse · Indie",
      body: "Thousands of titles. Every one bagged, boarded, and mint. Your pull list just got dangerous.",
      cta: "Browse Comics",
      ctaLink: "/shop?cat=comics",
      accent: "#c40717",
      image: "assets/images/comics/home04.png",
    },
    {
      id: 2,
      eyebrow: "Also on Amazon",
      heading: "E-Books",
      sub: "Cookbooks · Manifestos · Biographies",
      body: "Words that hit harder than a Mjolnir swing. Available instantly — no shipping required.",
      cta: "Explore E-Books",
      ctaLink: "/shop?cat=books",
      accent: "#6f11e1",
      image: "assets/images/ebooks/01.jpg",
    },
    {
      id: 3,
      eyebrow: "Limited Stock",
      heading: "Collectibles",
      sub: "Pokémon · NFL · NBA · Baseball Cards",
      body: "Rare cards. Graded slabs. Pack pulls that will either make your day or haunt your dreams.",
      cta: "Shop Collectibles",
      ctaLink: "/shop?cat=cards",
      accent: "#1081a7",
      image: "assets/images/comics/banner/05.svg",
    },
  ];

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => (prev + 1) % slides.length);
    setTextKey(prev => prev + 1);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, slides.length]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    setTextKey(prev => prev + 1);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, slides.length]);

  const goToSlide = useCallback((index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTextKey(prev => prev + 1);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, currentSlide]);

  // Single auto-play effect
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, handleNext]);

  const s = slides[currentSlide];

  return (
    <section
      className="hero-section"
      style={{ '--accent': s.accent }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* halftone texture overlay */}
      <div className="hero-halftone" />

      <div className="hero-inner container" key={`inner-${textKey}`}>
        {/* ── Text ── */}
        <div className="hero-text">
          <span className="hero-eyebrow">{s.eyebrow}</span>
          <h1 className="hero-heading">{s.heading}</h1>
          <p className="hero-sub">{s.sub}</p>
          <p className="hero-body">{s.body}</p>
          <div className="hero-buttons">
            <Link to={s.ctaLink} className="btn-hero-primary">{s.cta}</Link>
            <Link to="/shop" className="btn-hero-ghost">View All</Link>
          </div>
        </div>

        {/* ── Image ── */}
        <div className="hero-image-wrap">
          <img src={s.image} alt={s.heading} className="hero-img" />
          <div className="hero-img-glow" />
        </div>
      </div>

      {/* nav */}
      <button className="hero-nav prev" onClick={handlePrev} disabled={isTransitioning}>&#8592;</button>
      <button className="hero-nav next" onClick={handleNext} disabled={isTransitioning}>&#8594;</button>

      {/* dots */}
      <div className="hero-dots">
        {slides.map((sl, i) => (
          <button
            key={sl.id}
            className={`hero-dot${i === currentSlide ? ' active' : ''}`}
            onClick={() => goToSlide(i)}
          />
        ))}
      </div>

      {/* progress bar */}
      {isAutoPlaying && <div className="hero-progress" key={`progress-${currentSlide}`} />}
    </section>
  );
};

export default HeroSection;