import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingCart, Heart, ChevronDown, ChevronLeft, ChevronRight, Star, Flame, PlaneTakeoff } from 'lucide-react';

// Header Component
const Header = () => {
  const [selectedCountry, setSelectedCountry] = useState('usa');
  
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
                <span>My Account</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>$0.00</span>
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
      
      <header className="bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <nav className="flex space-x-8">
              <div className="relative group">
                <button className="flex items-center space-x-1 hover:text-orange-500">
                  <span>Home</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <a href="#" className="hover:text-orange-500">About Us</a>
              <div className="relative group">
                <button className="flex items-center space-x-1 hover:text-orange-500">
                  <span>Pages</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-1 hover:text-orange-500">
                  <span>Blog</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <a href="#" className="hover:text-orange-500">Contact Us</a>
            </nav>
            
            <div className="flex items-center space-x-6">
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

// Banner Component
const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { image: '/api/placeholder/1200/600', title: 'Find everything for vaping' },
    { image: '/api/placeholder/1200/600', title: 'Find everything for vaping' },
    { image: '/api/placeholder/1200/600', title: 'Find everything for vaping' }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative bg-gray-900 text-white overflow-hidden">
      <div className="absolute left-10 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
        <img src="/api/placeholder/100/300" alt="vape decoration" className="animate-bounce" />
      </div>
      
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
        <img src="/api/placeholder/100/300" alt="vape decoration" className="animate-pulse" />
      </div>

      <div className="relative">
        <div className="h-screen bg-cover bg-center flex items-center"
             style={{ backgroundImage: `url(${slides[currentSlide].image})` }}>
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-2 mb-4">
                <Flame className="w-6 h-6 text-orange-500" />
                <h4 className="text-xl">GET <span className="text-orange-500">25% OFF</span> NOW</h4>
              </div>
              
              <h1 className="text-6xl font-bold mb-8">
                Find everything<br />
                for <span className="text-orange-500">vaping</span>
              </h1>
              
              <p className="text-xl mb-8 opacity-90">
                Sell globally in minutes with localized currencies languages, and<br />
                experience in every market. only a variety of vaping products
              </p>
              
              <div className="mb-8">
                <span className="text-sm opacity-75">Starting Price</span>
                <h3 className="text-4xl font-bold">$99.00</h3>
              </div>
              
              <div className="flex space-x-4">
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
        <button onClick={prevSlide} className="bg-white/20 hover:bg-white/30 p-2 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="bg-orange-500 hover:bg-orange-600 p-2 rounded-full">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};

// Categories Component
const Categories = () => {
  const categories = [
    { name: 'best e-juice', image: '/api/placeholder/200/200', icon: '/api/placeholder/40/40' },
    { name: 'best mod', image: '/api/placeholder/200/200', icon: '/api/placeholder/40/40' },
    { name: 'best pan', image: '/api/placeholder/200/200', icon: '/api/placeholder/40/40' },
    { name: 'best pod', image: '/api/placeholder/200/200', icon: '/api/placeholder/40/40' },
    { name: 'best tank', image: '/api/placeholder/200/200', icon: '/api/placeholder/40/40' },
    { name: 'Best vapes', image: '/api/placeholder/200/200', icon: '/api/placeholder/40/40' },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-800">
            <span className="text-orange-500">★</span> our top categories <span className="text-orange-500">★</span>
          </h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="text-center group cursor-pointer">
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
          ))}
        </div>
      </div>
    </section>
  );
};

// Product Card Component
const ProductCard = ({ product }) => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden group hover:shadow-lg transition-shadow">
    <div className="relative">
      <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-red-50">
        <Heart className="w-4 h-4" />
      </button>
      
      <div className="aspect-square p-4">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
        />
      </div>
    </div>
    
    <div className="p-4">
      <h4 className="font-semibold mb-2 hover:text-orange-500 cursor-pointer">
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
    </div>
    
    <button className="w-full border-t border-gray-200 py-3 flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
      <ShoppingCart className="w-4 h-4 text-orange-500" />
      <span>Add to cart</span>
    </button>
  </div>
);

// Products Section Component
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
            <button
              onClick={() => setActiveTab('latest')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'latest' ? 'bg-white text-orange-500 shadow-md' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              latest item
            </button>
            <button
              onClick={() => setActiveTab('rating')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'rating' ? 'bg-white text-orange-500 shadow-md' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              top rating
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'featured' ? 'bg-white text-orange-500 shadow-md' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              featured products
            </button>
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

// Countdown Timer Component
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 8,
    minutes: 24,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center space-x-4">
      <div className="text-center">
        <div className="bg-orange-500 text-white rounded-lg px-3 py-2 min-w-[50px]">
          <div className="text-2xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
        </div>
        <div className="text-sm mt-1">Day</div>
      </div>
      <div className="text-center">
        <div className="bg-orange-500 text-white rounded-lg px-3 py-2 min-w-[50px]">
          <div className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
        </div>
        <div className="text-sm mt-1">Hr</div>
      </div>
      <div className="text-center">
        <div className="bg-orange-500 text-white rounded-lg px-3 py-2 min-w-[50px]">
          <div className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
        </div>
        <div className="text-sm mt-1">Min</div>
      </div>
      <div className="text-center">
        <div className="bg-orange-500 text-white rounded-lg px-3 py-2 min-w-[50px]">
          <div className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
        </div>
        <div className="text-sm mt-1">Sec</div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => (
  <footer className="bg-gray-900 text-white">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h4 className="text-xl font-semibold mb-6">Customer Service</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-orange-500 transition-colors">Help Portal</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Delivery Information</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Click and Collect</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Refunds and Returns</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-xl font-semibold mb-6">Get to Know Us</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-orange-500 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">News & Blog</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Investors</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Contact Us</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-xl font-semibold mb-6">vapes new collections</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-orange-500 transition-colors">E-Cigarettes</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Vape Pens</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Pod Systems</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Disposable Vapes</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Nicotine Salt Devices</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-xl font-semibold mb-6">get newsletter</h4>
          <div className="flex mb-6">
            <input 
              type="email" 
              placeholder="Your Email" 
              className="flex-1 px-4 py-2 rounded-l-md text-gray-900"
            />
            <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-r-md transition-colors">
              <PlaneTakeoff className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
              f
            </a>
            <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
              t
            </a>
            <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
              in
            </a>
            <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
              yt
            </a>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col lg:flex-row items-center justify-between">
        <img src="/api/placeholder/120/40" alt="Odor Logo" className="h-10 mb-4 lg:mb-0" />
        
        <p className="text-center mb-4 lg:mb-0">
          © Copyright 2023 <a href="#" className="text-orange-500 hover:text-orange-400">odor</a> All Rights Reserved
        </p>
        
        <img src="/api/placeholder/200/30" alt="Payment methods" className="h-8" />
      </div>
    </div>
  </footer>
);

// Special Offer Section
const SpecialOfferSection = () => (
  <section className="py-20 bg-gray-900 text-white">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <Flame className="w-6 h-6 text-orange-500" />
            <h4 className="text-xl">GET <span className="text-orange-500">25% OFF</span> NOW</h4>
          </div>
          
          <div className="flex items-center mb-8">
            <span className="w-8 h-0.5 bg-orange-500 mr-4"></span>
            <h2 className="text-4xl font-bold">latest arrival products</h2>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <span className="line-through text-gray-400 text-2xl">$99.00</span>
              <span className="text-orange-500 text-3xl font-bold">$49.00</span>
            </div>
            
            <p className="text-lg mb-6">
              There are many variations of passages of Lorem Ipsum available, but<br/>
              the majority have suffered alteration in some form, by injected humour, 
              or randomised words which
            </p>
            
            <ul className="space-y-2 mb-8 pb-8 border-b border-gray-700">
              <li>✓ 100% Natural</li>
              <li>✓ Coupon $61.99, Code: W2</li>
              <li>✓ 30 Day Refund</li>
            </ul>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div>
                <h4 className="text-xl font-bold mb-1">HUNGRY UP !</h4>
                <span className="text-sm text-gray-400">Offer end in :</span>
              </div>
              <CountdownTimer />
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="relative bg-gradient-to-r from-orange-500 to-red-500 rounded-full w-96 h-96 mx-auto">
            <img 
              src="/api/placeholder/300/400" 
              alt="Featured Product"
              className="absolute inset-0 w-full h-full object-contain z-10"
            />
          </div>
          
          <div className="absolute top-4 right-4 flex space-x-2">
            <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 p-2 rounded-full">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Main App Component
const VapeStoreHomepage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Banner />
      <Categories />
      <ProductsSection />
      <SpecialOfferSection />
      <Footer />
    </div>
  );
};

export default VapeStoreHomepage;