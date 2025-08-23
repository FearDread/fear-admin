import React, { useState, useEffect } from 'react';
import { 
    Search,
     User, 
     ShoppingCart,
     ChevronDown, 
     ChevronLeft, 
     ChevronRight, 
     Heart, 
     Star,
     LucideBone 
} from 'lucide-react';
import Header from "../components/header/Header";


const Home = () => {
  const [activeTab, setActiveTab] = useState('latest-item');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('Usa');
  const [selectedStore, setSelectedStore] = useState('Select Store');

  // Countdown timer effect
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30); // 30 days from now

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const bannerSlides = [
    {
      bg: "bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900",
      title: "Find everything for vaping",
      description: "Sell globally in minutes with localized currencies languages, and experie in every market. only a variety of vaping products"
    },
    {
      bg: "bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900",
      title: "Premium Vape Collection",
      description: "Discover our extensive range of high-quality vaping products with the best prices and customer service"
    },
    {
      bg: "bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900",
      title: "Latest Vaping Technology",
      description: "Stay ahead with cutting-edge vape technology and innovative designs for the ultimate vaping experience"
    }
  ];

  const categories = [
    { name: "best e-juice", image: "🧪", icon: "💧" },
    { name: "best mod", image: "📱", icon: "⚡" },
    { name: "best pan", image: "🔥", icon: "🌡️" },
    { name: "best pod", image: "💊", icon: "🎯" },
    { name: "best tank", image: "🏺", icon: "💎" },
    { name: "Best vaps", image: "💨", icon: "🌟" }
  ];

  const products = [
    { id: 1, name: "Menthol E-Cigarette Kit", oldPrice: "$74.50", newPrice: "$49.50", rating: 5, image: "🚬" },
    { id: 2, name: "Disposable Sub-Ohm Tank", oldPrice: "$74.50", newPrice: "$49.50", rating: 5, image: "🔋" },
    { id: 3, name: "POP Extra Strawberry", oldPrice: "$74.50", newPrice: "$49.50", rating: 5, image: "🍓" },
    { id: 4, name: "Battery And Charger Kit", oldPrice: "$74.50", newPrice: "$49.50", rating: 5, image: "🔌" },
    { id: 5, name: "Pods Sold Separately", oldPrice: "$74.50", newPrice: "$49.50", rating: 5, image: "💊" },
    { id: 6, name: "GeekVape Obelisk Pod", oldPrice: "$74.50", newPrice: "$49.50", rating: 5, image: "📱" },
    { id: 7, name: "POP Extra Strawberry", oldPrice: "$74.50", newPrice: "$49.50", rating: 5, image: "🍓" },
    { id: 8, name: "100ml Nic Salt Juice", oldPrice: "$74.50", newPrice: "$49.50", rating: 5, image: "🧪" }
  ];

  const brands = ["🏢", "🏭", "🏪", "🏬", "🏫", "🏗️"];

  const galleryItems = [
    { title: "best e-lequid", description: "Best E liquids from our huge collection", discount: "50%", image: "🧪" },
    { title: "best vape flavours", description: "Best E liquids from our huge collection", discount: "50%", image: "🍇" },
    { title: "Battery And Charger Kit", description: "Best E liquids from our huge collection", discount: "50%", image: "🔋" },
    { title: "best vape tanks", description: "Best E liquids from our huge collection", discount: "50%", image: "🏺" },
    { title: "POP Extra Strawberry", description: "Best E liquids from our huge collection", discount: "50%", image: "🍓" }
  ];

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="flex space-x-1 text-6xl text-white">
            {['L', 'o', 'a', 'd', 'i', 'n', 'g'].map((letter, index) => (
              <span
                key={index}
                className={`animate-bounce`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <main>
        {/* Banner Section */}
        <section className="relative h-screen overflow-hidden">
          <div className="absolute inset-0">
            <div className={`w-full h-full ${bannerSlides[currentSlide].bg} transition-all duration-1000`}></div>
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
          
          <div className="absolute top-10 left-10 text-8xl opacity-20 animate-bounce">💨</div>
          <div className="absolute top-20 right-10 text-6xl opacity-30 animate-pulse">🚬</div>
          
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <h4 className="flex items-center gap-2 text-lg mb-4 animate-fade-in">
                <LucideBone className="w-5 h-5 text-orange-500" />
                GET <span className="text-purple-400">25% OFF</span> NOW
              </h4>
              <h1 className="text-6xl font-bold mb-6 leading-tight animate-slide-up">
                {bannerSlides[currentSlide].title.split('vaping')[0]}
                <span className="text-purple-400">vaping</span>
                {bannerSlides[currentSlide].title.split('vaping')[1]}
              </h1>
              <p className="text-xl mb-8 text-gray-300 animate-slide-up delay-200">
                {bannerSlides[currentSlide].description}
              </p>
              <div className="mb-8 animate-slide-up delay-300">
                <span className="block text-sm text-gray-400 mb-2">Starting Price</span>
                <h3 className="text-4xl font-bold text-white">$99.00</h3>
              </div>
              <div className="flex gap-4 animate-slide-up delay-400">
                <button className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg transition-colors font-semibold">
                  Shop Now
                </button>
                <button className="border border-purple-400 hover:bg-purple-400 hover:text-black px-8 py-3 rounded-lg transition-all font-semibold">
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Banner Navigation */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 space-y-4">
            <button
              onClick={() => setCurrentSlide(currentSlide > 0 ? currentSlide - 1 : bannerSlides.length - 1)}
              className="bg-gray-800 hover:bg-purple-600 p-3 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentSlide(currentSlide < bannerSlides.length - 1 ? currentSlide + 1 : 0)}
              className="bg-purple-600 hover:bg-purple-700 p-3 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 border-b border-gray-700">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold">
                <span className="text-purple-400">★</span> our top categories <span className="text-purple-400">★</span>
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category, index) => (
                <div key={index} className="text-center group cursor-pointer">
                  <div className="relative mb-6 transform group-hover:scale-110 transition-transform">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-4xl shadow-lg">
                      {category.image}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-xl border-4 border-gray-900">
                      {category.icon}
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold group-hover:text-purple-400 transition-colors">
                    {category.name}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* View Section */}
        <section className="py-20 bg-gradient-to-r from-purple-900 to-indigo-900">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="h-64 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-6xl">
                  🧪
                </div>
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4 hover:text-purple-400 transition-colors cursor-pointer">
                    The best e-liqued bundles
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Sell globally in minutes with localized currencies languages, and experie in every market. only a variety of vaping products
                  </p>
                  <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors font-semibold mb-4">
                    Shop Now
                  </button>
                  <div className="flex items-center gap-2 text-orange-400">
                    <LucideBone className="w-5 h-5" />
                    GET <span className="text-purple-400">25% OFF</span> NOW
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-800 rounded-xl p-6 flex items-center gap-6 hover:bg-gray-700 transition-colors">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 hover:text-purple-400 transition-colors cursor-pointer">
                      new to vapeing?
                    </h3>
                    <p className="text-gray-300 mb-4">Whereas recognition of the inherent dignity</p>
                    <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">
                      Shop Now
                    </button>
                  </div>
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-3xl">
                    🚬
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 flex items-center gap-6 hover:bg-gray-700 transition-colors">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 hover:text-purple-400 transition-colors cursor-pointer">
                      Vap mode
                    </h3>
                    <p className="text-gray-300 mb-4">Whereas recognition of the inherent dignity</p>
                    <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">
                      Shop Now
                    </button>
                  </div>
                  <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center text-3xl">
                    💨
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between mb-16 pb-8 border-b border-gray-700">
              <div className="flex items-center gap-4">
                <span className="text-purple-400 text-2xl">★</span>
                <h2 className="text-3xl font-bold">latest arrival products</h2>
              </div>
              <div className="flex bg-gray-800 rounded-lg p-1 mt-4 xl:mt-0">
                {[
                  { id: 'latest-item', label: 'latest item' },
                  { id: 'top-ratting', label: 'top ratting' },
                  { id: 'featured-products', label: 'featured products' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <button className="absolute top-4 right-4 z-10 p-2 bg-gray-700 rounded-full hover:bg-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                  
                  <div className="relative h-48 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-6xl group-hover:from-purple-700 group-hover:to-pink-700 transition-all">
                    {product.image}
                  </div>
                  
                  <div className="p-6">
                    <h4 className="font-semibold mb-3 hover:text-purple-400 transition-colors cursor-pointer">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-gray-400 line-through">{product.oldPrice}</span>
                      <span className="text-purple-400 font-bold">{product.newPrice}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(product.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full bg-gray-700 hover:bg-purple-600 p-4 flex items-center justify-center gap-2 transition-colors border-t border-gray-600">
                    <ShoppingCart className="w-4 h-4" />
                    Add to cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Discount Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-900 to-purple-900">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="text-8xl text-center lg:text-left">
                💨
              </div>
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-purple-400 text-2xl">★</span>
                  <h2 className="text-3xl font-bold">find your best favourite</h2>
                </div>
                <p className="text-xl text-gray-300 mb-8">
                  Sell globally in minutes with localized currencies languages, and experie in every market. only a variety of vaping products
                </p>
                <div className="flex gap-4 mb-6">
                  <button className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg transition-colors font-semibold">
                    Shop Now
                  </button>
                </div>
                <div className="flex items-center gap-2 text-orange-400">
                  <LucideBone className="w-5 h-5" />
                  GET <span className="text-purple-400">25% OFF</span> NOW
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Get Now Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid xl:grid-cols-2 gap-12 items-center">
              <div>
                <h4 className="flex items-center gap-2 text-lg mb-6">
                  <LucideBone className="w-5 h-5 text-orange-500" />
                  GET <span className="text-purple-400">25% OFF</span> NOW
                </h4>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-purple-400 text-2xl">★</span>
                  <h2 className="text-3xl font-bold">latest arrival products</h2>
                </div>
                <div className="bg-gray-800 inline-block px-6 py-3 rounded-lg mb-6">
                  <span className="text-gray-400 line-through mr-4">$99.00</span>
                  <span className="text-2xl font-bold text-purple-400">$49.00</span>
                </div>
                <p className="text-gray-300 mb-6">
                  There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which
                </p>
                <ul className="space-y-2 mb-8 pb-8 border-b border-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    100% Natural
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    Coupon $61.99, Code: W2
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    30 Day Refund
                  </li>
                </ul>
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <h4 className="font-bold">HUNGRY UP !</h4>
                    <span className="text-gray-400">Offer end in :</span>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { label: 'Days', value: timeLeft.days },
                      { label: 'Hr', value: timeLeft.hours },
                      { label: 'Min', value: timeLeft.minutes },
                      { label: 'Sec', value: timeLeft.seconds }
                    ].map((time) => (
                      <div key={time.label} className="bg-gray-800 px-3 py-2 rounded-lg text-center">
                        <div className="text-xl font-bold text-purple-400">
                          {time.value.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xs text-gray-400">{time.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-9xl shadow-2xl">
                  🚬
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  <button className="bg-gray-800 hover:bg-purple-600 p-2 rounded-lg transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Text Slider */}
        <div className="border-t border-gray-700 py-8">
          <div className="overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="text-4xl font-bold text-gray-700 mx-8">E-Cigarettes</span>
              <span className="text-purple-400 mx-4">★</span>
              <span className="text-4xl font-bold text-gray-700 mx-8">Vape Pens</span>
              <span className="text-purple-400 mx-4">★</span>
              <span className="text-4xl font-bold text-gray-700 mx-8">Vape Juice</span>
              <span className="text-purple-400 mx-4">★</span>
              <span className="text-4xl font-bold text-gray-700 mx-8">E-Cigarettes</span>
              <span className="text-purple-400 mx-4">★</span>
              <span className="text-4xl font-bold text-gray-700 mx-8">Vape Pens</span>
              <span className="text-purple-400 mx-4">★</span>
              <span className="text-4xl font-bold text-gray-700 mx-8">Vape Juice</span>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {galleryItems.map((item, index) => (
                <div key={index} className="relative bg-gray-800 rounded-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                    {item.discount} off
                  </div>
                  
                  <div className="h-48 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-6xl group-hover:from-purple-700 group-hover:to-pink-700 transition-all">
                    {item.image}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold mb-2 hover:text-purple-400 transition-colors cursor-pointer">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                    <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors font-semibold w-full">
                      Shop Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Section */}
        <section className="py-20 bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold">
                <span className="text-purple-400">★</span> our top brands <span className="text-purple-400">★</span>
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {brands.map((brand, index) => (
                <div key={index} className="bg-white rounded-xl p-8 flex items-center justify-center hover:shadow-lg transition-shadow group">
                  <span className="text-4xl group-hover:scale-110 transition-transform">{brand}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;