import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from "../components/products/ProductCard";
import SpecialOfferCard from '../components/products/SpecialOfferCard';



export default function Shop () {
  const [sortBy, setSortBy] = useState('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Sample product data
  const products = [
    {
      id: 1,
      name: 'Menthol E-Cigarette Kit',
      originalPrice: 74.50,
      salePrice: 49.50,
      rating: 5,
      image1: '/assets/images/product/product-image1.png',
      image2: '/assets/images/product/product-image3.png',
      category: 'e-cigarette'
    },
    {
      id: 2,
      name: 'Disposable Sub-Ohm Tank',
      originalPrice: 74.50,
      salePrice: 49.50,
      rating: 5,
      image1: '/assets/images/product/product-image2.png',
      image2: '/assets/images/product/product-image4.png',
      category: 'disposable'
    },
    {
      id: 3,
      name: 'POP Extra Strawberry',
      originalPrice: 74.50,
      salePrice: 49.50,
      rating: 5,
      image1: '/assets/images/product/product-image3.png',
      image2: '/assets/images/product/product-image5.png',
      category: 'pop-extra'
    },
    {
      id: 4,
      name: 'Battery And Charger Kit',
      originalPrice: 74.50,
      salePrice: 49.50,
      rating: 5,
      image1: '/assets/images/product/product-image4.png',
      image2: '/assets/images/product/product-image6.png',
      category: 'charger-kit'
    },
    {
      id: 5,
      name: 'Pods Sold Separately',
      originalPrice: 74.50,
      salePrice: 49.50,
      rating: 5,
      image1: '/assets/images/product/product-image5.png',
      image2: '/assets/images/product/product-image3.png',
      category: 'pods'
    },
    {
      id: 6,
      name: '100ml Nic Salt Juice',
      originalPrice: 74.50,
      salePrice: 49.50,
      rating: 5,
      image1: '/assets/images/product/product-image6.png',
      image2: '/assets/images/product/product-image4.png',
      category: 'nic-salt'
    },
    {
      id: 7,
      name: 'Disposable Sub-Ohm Tank',
      originalPrice: 74.50,
      salePrice: 49.50,
      rating: 5,
      image1: '/assets/images/product/product-image7.png',
      image2: '/assets/images/product/product-image8.png',
      category: 'disposable'
    },
    {
      id: 8,
      name: 'Battery And Charger Kit',
      originalPrice: 74.50,
      salePrice: 49.50,
      rating: 5,
      image1: '/assets/images/product/product-image8.png',
      image2: '/assets/images/product/product-image1.png',
      category: 'charger-kit'
    },
    {
      id: 9,
      name: 'POP Extra Strawberry',
      originalPrice: 74.50,
      salePrice: 49.50,
      rating: 5,
      image1: '/assets/images/product/product-image4.png',
      image2: '/assets/images/product/product-image3.png',
      category: 'pop-extra'
    }
  ];

  // Special offer products
  const specialOffers = [
    {
      id: 'special1',
      name: 'Mango Nic Salt E-Liquid',
      originalPrice: 74.50,
      salePrice: 49.50,
      rating: 5,
      image: '/assets/images/coundown/coundown-image1.png'
    },
    {
      id: 'special2',
      name: 'Watermelon Nic Salt',
      originalPrice: 74.50,
      salePrice: 49.50,
      rating: 5,
      image: '/assets/images/coundown/coundown-image2.png'
    }
  ];

  const productsPerPage = 9;
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Countdown timer effect
  useEffect(() => {
    const targetDate = new Date().getTime() + (7 * 24 * 60 * 60 * 1000); // 7 days from now
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const getCurrentProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return products.slice(startIndex, endIndex);
  };

  const StarRating = ({ rating }) => (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${
            index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );




  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-6 border-b border-gray-200">
          <p className="text-gray-600 font-semibold mb-4 md:mb-0">
            Showing {((currentPage - 1) * productsPerPage) + 1}–{Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} results
          </p>
          
          <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="popularity">Sort by popularity</option>
              <option value="e-cigarette">E-Cigarette</option>
              <option value="pop-extra">POP Extra</option>
              <option value="charger-kit">Charger Kit</option>
              <option value="nic-salt">100ml Nic Salt</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Special Offers */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Special Offer</h3>
              
              {specialOffers.map((product) => (
                <SpecialOfferCard key={product.id} product={product} />
              ))}

              {/* Countdown Timer */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-xl font-bold text-gray-800 mb-2">Hurry Up!</h4>
                <p className="text-gray-600 mb-4">Offer ends in</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="bg-blue-600 text-white rounded-lg p-3 mb-1">
                      <span className="text-2xl font-bold">{countdown.days.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-sm text-gray-600">Days</span>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-600 text-white rounded-lg p-3 mb-1">
                      <span className="text-2xl font-bold">{countdown.hours.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-sm text-gray-600">Hours</span>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-600 text-white rounded-lg p-3 mb-1">
                      <span className="text-2xl font-bold">{countdown.minutes.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-sm text-gray-600">Min</span>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-600 text-white rounded-lg p-3 mb-1">
                      <span className="text-2xl font-bold">{countdown.seconds.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-sm text-gray-600">Sec</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Products Grid */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {getCurrentProducts().map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-colors ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600'
                    }`}
                  >
                    {pageNumber.toString().padStart(2, '0')}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <div className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-semibold">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} items in cart
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}