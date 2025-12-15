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
      
      {/* Slider Indicators */}
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
};

export default HeroSlider;