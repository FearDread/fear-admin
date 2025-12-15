import React, { useState } from 'react';
import { ShoppingCart, Heart, User, Search, Menu, X, Phone, Facebook, Twitter, Linkedin, ChevronRight, Star } from 'lucide-react';

// Header Component
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount] = useState(8);

  return (
    <header className="bg-gray-900 text-white">
      {/* Top Discount Alert */}
      <div className="bg-gray-950 py-3 px-4 hidden lg:block">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
          <p className="text-sm">Get Up to <strong>40% OFF</strong> New-Season Styles</p>
          <a href="#" className="bg-gray-800 px-2 py-1 text-xs hover:bg-gray-700">Men</a>
          <a href="#" className="bg-gray-800 px-2 py-1 text-xs hover:bg-gray-700">Women</a>
          <p className="text-xs text-gray-400">*Limited time only</p>
        </div>
      </div>

      {/* Top Menu */}
      <div className="border-b border-gray-800 py-2 px-4 hidden lg:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-sm">Welcome to our eTrans store!</span>
          <nav className="flex gap-6">
            <a href="#" className="text-sm hover:text-gray-300">Track Order</a>
            <a href="#" className="text-sm hover:text-gray-300">About</a>
            <a href="#" className="text-sm hover:text-gray-300">Blog</a>
            <a href="#" className="text-sm hover:text-gray-300">Contact</a>
          </nav>
          <div className="flex gap-4 items-center">
            <select className="bg-transparent text-sm">
              <option>USD</option>
              <option>EUR</option>
            </select>
            <div className="flex gap-3">
              <Facebook size={16} className="cursor-pointer hover:text-gray-300" />
              <Twitter size={16} className="cursor-pointer hover:text-gray-300" />
              <Linkedin size={16} className="cursor-pointer hover:text-gray-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold">eTrans</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              placeholder="Search for Products"
              className="flex-1 px-4 py-2 bg-gray-800 rounded text-white placeholder-gray-400"
            />
            <select className="px-3 py-2 bg-gray-800 rounded">
              <option>All Categories</option>
              <option>Fashion</option>
              <option>Electronics</option>
            </select>
            <button className="p-2 bg-gray-800 rounded hover:bg-gray-700">
              <Search size={20} />
            </button>
          </div>

          {/* Contact Info */}
          <div className="hidden xl:flex items-center gap-3">
            <Phone size={32} />
            <div>
              <p className="text-xs">CALL US NOW</p>
              <p className="font-semibold">+011 5827918</p>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <User size={24} className="cursor-pointer hover:text-gray-300" />
            <Heart size={24} className="cursor-pointer hover:text-gray-300" />
            <div className="relative cursor-pointer hover:text-gray-300">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-gray-800 py-3 px-4 hidden lg:block">
        <div className="max-w-7xl mx-auto">
          <ul className="flex gap-8">
            <li><a href="#" className="hover:text-gray-300">Home</a></li>
            <li><a href="#" className="hover:text-gray-300">Categories</a></li>
            <li><a href="#" className="hover:text-gray-300">Shop</a></li>
            <li><a href="#" className="hover:text-gray-300">Blog</a></li>
            <li><a href="#" className="hover:text-gray-300">About Us</a></li>
            <li><a href="#" className="hover:text-gray-300">Contact Us</a></li>
          </ul>
        </div>
      </nav>
    </header>
  );
};