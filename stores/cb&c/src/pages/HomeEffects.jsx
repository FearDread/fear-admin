import React, { useState, useEffect, useRef } from 'react';
import { Search, User, ShoppingCart, Heart, ChevronDown, ChevronLeft, ChevronRight, Star, Flame, PlaneTakeoff, Menu, X, Plus, Minus } from 'lucide-react';

// Custom Cursor Component
const CustomCursor = () => {
  const cursorRef = useRef();
  const cursorOuterRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current && cursorOuterRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursorOuterRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const handleMouseEnter = () => {
      if (cursorRef.current && cursorOuterRef.current) {
        cursorRef.current.classList.add('scale-150');
        cursorOuterRef.current.classList.add('scale-150');
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current && cursorOuterRef.current) {
        cursorRef.current.classList.remove('scale-150');
        cursorOuterRef.current.classList.remove('scale-150');
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.querySelectorAll('a, button').forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef}
        className="fixed w-2 h-2 bg-orange-500 rounded-full pointer-events-none z-50 transition-transform duration-100"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div 
        ref={cursorOuterRef}
        className="fixed w-8 h-8 border border-orange-500 rounded-full pointer-events-none z-40 transition-transform duration-200"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
};

// Preloader Component
const Preloader = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        <p className="text-white mt-4">Loading...</p>
      </div>
    </div>
  );
};

// Header Component with Mobile Menu
const Header = () => {
  const [selectedCountry, setSelectedCountry] = useState('usa');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 220);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
              <img src="/api/placeholder/120/40" alt="Odor Logo" className="h-10" />
            </div>
            
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search for..." 
                  className="w-full px-4 py-2 rounded-md text-gray-900"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span className="hidden sm:block">My Account</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:block">$0.00</span>
                <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">0</span>
              </div>
              
              <select 
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-transparent border border-gray-600 rounded px-2 py-1"
              >
                <option value="usa">USA</option>
                <option value="canada">Canada</option>
                <option value="australia">Australia</option>
                <option value="germany">Germany</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <header className={`bg-gray-800 text-white transition-all duration-300 ${isScrolled ? 'fixed top-0 left-0 right-0 z-40 shadow-lg animate-fadeInDown' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <button 
              className="lg:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:flex space-x-8 absolute lg:relative top-full lg:top-auto left-0 lg:left-auto w-full lg:w-auto bg-gray-800 lg:bg-transparent p-4 lg:p-0`}>
              <div className="relative group">
                <button className="flex items-center space-x-1 hover:text-orange-500 py-2 lg:py-0">
                  <span>Home</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <a href="#" className="hover:text-orange-500 block py-2 lg:py-0">About Us</a>
              <div className="relative group">
                <button className="flex items-center space-x-1 hover:text-orange-500 py-2 lg:py-0">
                  <span>Pages</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-1 hover:text-orange-500 py-2 lg:py-0">
                  <span>Blog</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <a href="#" className="hover:text-orange-500 block py-2 lg:py-0">Contact Us</a>
            </nav>
            
            <div className="hidden sm:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <img src="/api/placeholder/24/24" alt="pickup" />
                <div>
                  <p className="text-sm">Picking up?</p>
                  <select className="bg-transparent text-xs">
                    <option>Select Store</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <img src="/api/placeholder/24/24" alt="shipping" />
                <div>
                  <p className="text-sm">Free Shipping</p>
                  <p className="text-xs">on order <strong>over $100</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

// Enhanced Banner Component with animations
const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const slides = [
    { image: '/api/placeholder/1200/600', title: 'Find everything for vaping' },
    { image: '/api/placeholder/1200/600', title: 'Find everything for vaping' },
    { image: '/api/placeholder/1200/600', title: 'Find everything for vaping' }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setAnimationKey(prev => prev + 1);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setAnimationKey(prev => prev + 1);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-gray-900 text-white overflow-hidden">
      <div className="absolute left-10 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block animate-bounce">
        <img src="/api/placeholder/100/300" alt="vape decoration" />
      </div>
      
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block animate-pulse">
        <img src="/api/placeholder/100/300" alt="vape decoration" />
      </div>

      <div className="relative">
        <div className="h-screen bg-cover bg-center flex items-center transition-all duration-1000"
             style={{ backgroundImage: `url(${slides[currentSlide].image})` }}>
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <div key={`fire-${animationKey}`} className="flex items-center space-x-2 mb-4 animate-fadeInUp">
                <Flame className="w-6 h-6 text-orange-500" />
                <h4 className="text-xl">GET <span className="text-orange-500">25% OFF</span> NOW</h4>
              </div>
              
              <h1 key={`title-${animationKey}`} className="text-6xl font-bold mb-8 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                Find everything<br />
                for <span className="text-orange-500">vaping</span>
              </h1>
              
              <p key={`desc-${animationKey}`} className="text-xl mb-8 opacity-90 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                Sell globally in minutes with localized currencies languages, and<br />
                experience in every market. only a variety of vaping products
              </p>
              
              <div key={`price-${animationKey}`} className="mb-8 animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
                <span className="text-sm opacity-75">Starting Price</span>
                <h3 className="text-4xl font-bold">$99.00</h3>
              </div>
              
              <div key={`buttons-${animationKey}`} className="flex space-x-4 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
                <button className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-md font-semibold transition-colors">
                  Shop Now
                </button>
                <button className="border border-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-md font-semibold transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
        <button onClick={prevSlide} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="bg-orange-500 hover:bg-orange-600 p-2 rounded-full transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};

// Enhanced Categories Component with slider
const Categories = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const categories = [
    { name: 'best e-juice', image: '/api/placeholder/200/200', icon: '/api/placeholder/40/40' },
    { name: 'best mod', image: '/api/placeholder/200/200', icon: '/api/placeholder/40/40' },
    { name: 'best pan', image: '/api/placeholder/200/200', icon: '/api/placeholder/40/40' },
    { name: 'best pod', image: '/api/placeholder/200/200', icon: '/api/placeholder/40/40' },
    { name: 'best tank', image: '/api/placeholder/200/200', icon: '/api/placeholder/40/40' },
    { name: 'Best vapes', image: '/api/placeholder/200/200', icon: '/api/placeholder/40/40' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, categories.length - 5));
    }, 3000);
    return () => clearInterval(interval);
  }, [categories.length]);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-800">
            <span className="text-orange-500">★</span> our top categories <span className="text-orange-500">★</span>
          </h3>
        </div>
        
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / 6)}%)` }}
          >
            {categories.map((category, index) => (
              <div key={index} className="flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/6 px-3">
                <div className="text-center group cursor-pointer">
                  <div className="relative mb-6 transform group-hover:scale-105 transition-transform">
                    <img src={category.image} alt={category.name} className="w-full rounded-lg" />
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-white rounded-full p-3 shadow-lg">
                        <img src={category.icon} alt="icon" className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold capitalize group-hover:text-orange-500 transition-colors">
                    {category.name}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Product Card with quantity controls
const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <button 
          className={`absolute top-4 right-4 z-10 p-2 rounded-full shadow-md transition-colors ${
            isWishlisted ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-50'
          }`}
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart className="w-4 h-4" fill={isWishlisted ? 'white' : 'none'} />
        </button>
        
        <div className="aspect-square p-4 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
      
      <div className="p-4">
        <h4 className="font-semibold mb-2 hover:text-orange-500 cursor-pointer transition-colors">
          {product.name}
        </h4>
        
        <div className="flex items-center space-x-2 mb-3">
          <span className="line-through text-gray-400">${product.originalPrice}</span>
          <span className="text-orange-500 font-semibold">${product.salePrice}</span>
        </div>
        
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center border rounded-md">
            <button 
              onClick={decrementQuantity}
              className="p-1 hover:bg-gray-100 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 border-x">{quantity}</span>
            <button 
              onClick={incrementQuantity}
              className="p-1 hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <button className="w-full border-t border-gray-200 py-3 flex items-center justify-center space-x-2 hover:bg-orange-50 transition-colors group">
        <ShoppingCart className="w-4 h-4 text-orange-500" />
        <span className="group-hover:text-orange-600 transition-colors">Add to cart</span>
      </button>
    </div>
  );
};

// Enhanced Products Section with filtering
const ProductsSection = () => {
  const [activeTab, setActiveTab] = useState('latest');
  
  const products = [
    { id: 1, name: 'Menthol E-Cigarette Kit', originalPrice: '74.50', salePrice: '49.50', image: '/api/placeholder/200/200' },
    { id: 2, name: 'Disposable Sub-Ohm Tank', originalPrice: '74.50', salePrice: '49.50', image: '/api/placeholder/200/200' },
    { id: 3, name: 'POP Extra Strawberry', originalPrice: '74.50', salePrice: '49.50', image: '/api/placeholder/200/200' },
    { id: 4, name: 'Battery And Charger Kit', originalPrice: '74.50', salePrice: '49.50', image: '/api/placeholder/200/200' },
    { id: 5, name: 'Pods Sold Separately', originalPrice: '74.50', salePrice: '49.50', image: '/api/placeholder/200/200' },
    { id: 6, name: 'GeekVape Obelisk Pod', originalPrice: '74.50', salePrice: '49.50', image: '/api/placeholder/200/200' },
    { id: 7, name: 'POP Extra Strawberry', originalPrice: '74.50', salePrice: '49.50', image: '/api/placeholder/200/200' },
    { id: 8, name: '100ml Nic Salt Juice', originalPrice: '74.50', salePrice: '49.50', image: '/api/placeholder/200/200' },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-16 pb-8 border-b border-gray-200">
          <div className="flex items-center mb-4 lg:mb-0">
            <span className="w-8 h-0.5 bg-orange-500 mr-4"></span>
            <h2 className="text-3xl font-bold">latest arrival products</h2>
          </div>
          
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'latest', label: 'latest item' },
              { id: 'rating', label: 'top rating' },
              { id: 'featured', label: 'featured products' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-md transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-white text-orange-500 shadow-md transform scale-105' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced Countdown Timer
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 8,
    minutes: 24,
    seconds: 30
  });

  useEffect(() => {
    const targetDate = new Date('2024-12-01 00:00:00').getTime();
    
    const timer = setInterval(() => {
      const currentDate = new Date().getTime();
      const remainingTime = targetDate - currentDate;

      if (remainingTime > 0) {
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center space-x-4">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="bg-orange-500 text-white rounded-lg px-3 py-2 min-w-[50px] transform hover:scale-105 transition-transform">
            <div className="text-2xl font-bold">{value.toString().padStart(2, '0')}</div>
          </div>
          <div className="text-sm mt-1 capitalize">{unit === 'days' ? 'Day' : unit === 'hours' ? 'Hr' : unit === 'minutes' ? 'Min' : 'Sec'}</div>
        </div>
      ))}
    </div>
  );
};

// Back to Top Component
const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      
      setScrollProgress(scrollPercent);
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors z-40 animate-fadeInUp"
    >
      <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${scrollProgress * 63} 63`}
          className="transition-all duration-100"
        />
      </svg>
      <ChevronLeft className="w-4 h-4 absolute transform rotate-90" />
    </button>
  );
};

// Footer Component
const Footer = () => (
  <footer className="bg-gray-900 text-white">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <h4 className="text-xl font-semibold mb-6">Customer Service</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-orange-500 transition-colors">Help Portal</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Delivery Information</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Click and Collect</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Refunds and Returns</a></li>
          </ul>
        </div>
        
        <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <h4 className="text-xl font-semibold mb-6">Get to Know Us</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-orange-500 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">News & Blog</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Investors</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Contact Us</a></li>
          </ul>
        </div>
        
        <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <h4 className="text-xl font-semibold mb-6">vapes new collections</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-orange-500 transition-colors">E-Cigarettes</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Vape Pens</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Pod Systems</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Disposable Vapes</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Nicotine Salt Devices</a></li>
          </ul>
        </div>
        
        <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <h4 className="text-xl font-semibold mb-6">get newsletter</h4>
          <div className="flex mb-6">
            <input 
              type="email" 
              placeholder="Your Email" 
              className="flex-1 px-4 py-2 rounded-l-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-r-md transition-colors">
              <PlaneTakeoff className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex space-x-4">
            {['f', 't', 'in', 'yt'].map((social, index) => (