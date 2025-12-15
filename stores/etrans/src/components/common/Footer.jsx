import React, { useState } from 'react';


// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h6 className="font-semibold mb-4">CONTACT INFO</h6>
            <div className="space-y-3 text-sm text-gray-400">
              <div>
                <p className="text-white font-semibold">ADDRESS</p>
                <p>123 Street Name, City, Australia</p>
              </div>
              <div>
                <p className="text-white font-semibold">PHONE</p>
                <p>Toll Free (123) 472-796</p>
              </div>
              <div>
                <p className="text-white font-semibold">EMAIL</p>
                <p>mail@example.com</p>
              </div>
            </div>
          </div>
          
          <div>
            <h6 className="font-semibold mb-4">SHOP CATEGORIES</h6>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Jeans</a></li>
              <li><a href="#" className="hover:text-white">T-Shirts</a></li>
              <li><a href="#" className="hover:text-white">Sports</a></li>
              <li><a href="#" className="hover:text-white">Shoes</a></li>
              <li><a href="#" className="hover:text-white">Electronics</a></li>
            </ul>
          </div>
          
          <div>
            <h6 className="font-semibold mb-4">POPULAR TAGS</h6>
            <div className="flex flex-wrap gap-2">
              {['Cloths', 'Electronics', 'Furniture', 'Sports', 'Men Wear', 'Women Wear'].map(tag => (
                <a key={tag} href="#" className="bg-gray-800 px-3 py-1 text-xs rounded hover:bg-gray-700">
                  {tag}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h6 className="font-semibold mb-4">STAY INFORMED</h6>
            <input
              type="email"
              placeholder="Enter Your Email"
              className="w-full px-4 py-2 bg-gray-800 rounded mb-3"
            />
            <button className="w-full bg-white text-gray-900 py-2 rounded hover:bg-gray-100">
              Subscribe
            </button>
            <p className="text-xs text-gray-400 mt-3">
              Subscribe to our newsletter to receive early discount offers
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">Copyright © 2025. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="text-2xl">💳</span>
            <span className="text-2xl">💰</span>
            <span className="text-2xl">🏦</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
