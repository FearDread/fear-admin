import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default Brands = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Sample brand data - replace with your actual brand images
  const brands = [
    { id: 1, src: '/assets/images/brand/brand1.png', alt: 'Brand 1', name: 'Nike' },
    { id: 2, src: '/assets/images/brand/brand2.png', alt: 'Brand 2', name: 'Adidas' },
    { id: 3, src: '/assets/images/brand/brand3.png', alt: 'Brand 3', name: 'Puma' },
    { id: 4, src: '/assets/images/brand/brand4.png', alt: 'Brand 4', name: 'Reebok' },
    { id: 5, src: '/assets/images/brand/brand5.png', alt: 'Brand 5', name: 'Under Armour' },
    { id: 6, src: '/assets/images/brand/brand6.png', alt: 'Brand 6', name: 'New Balance' }
  ];

  const slidesToShow = 4; // Number of slides visible at once
  const maxSlide = Math.max(0, brands.length - slidesToShow);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev >= maxSlide ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxSlide]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev >= maxSlide ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev <= 0 ? maxSlide : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(Math.min(index, maxSlide));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-4">
            <span className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></span>
            Our Top Brands
            <span className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></span>
          </h3>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl p-3 rounded-full transition-all duration-300 hover:bg-blue-50 group"
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl p-3 rounded-full transition-all duration-300 hover:bg-blue-50 group"
            disabled={currentSlide === maxSlide}
          >
            <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
          </button>

          {/* Slides Container */}
          <div className="px-12">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)`
              }}
            >
              {brands.map((brand, index) => (
                <div
                  key={brand.id}
                  className="flex-shrink-0 px-4"
                  style={{ width: `${100 / slidesToShow}%` }}
                >
                  <div className="group">
                    <div className="bg-white border border-gray-200 rounded-xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-2">
                      {/* Placeholder for brand image */}
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4 group-hover:from-blue-50 group-hover:to-purple-50 transition-all duration-300">
                        <span className="text-2xl font-bold text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                          {brand.name.charAt(0)}
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                        {brand.name}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: maxSlide + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'bg-blue-500 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Brand Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="group cursor-pointer">
            <div className="text-3xl font-bold text-blue-600 mb-2 group-hover:text-blue-700 transition-colors duration-300">
              {brands.length}+
            </div>
            <div className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
              Premium Brands
            </div>
          </div>
          <div className="group cursor-pointer">
            <div className="text-3xl font-bold text-purple-600 mb-2 group-hover:text-purple-700 transition-colors duration-300">
              100K+
            </div>
            <div className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
              Happy Customers
            </div>
          </div>
          <div className="group cursor-pointer">
            <div className="text-3xl font-bold text-green-600 mb-2 group-hover:text-green-700 transition-colors duration-300">
              5★
            </div>
            <div className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
              Average Rating
            </div>
          </div>
          <div className="group cursor-pointer">
            <div className="text-3xl font-bold text-orange-600 mb-2 group-hover:text-orange-700 transition-colors duration-300">
              24/7
            </div>
            <div className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
              Support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}