import { useState } from 'react';
import { Search, User, ShoppingCart, Menu, ChevronDown } from 'lucide-react';

export default function Header() {
  const [selectedFlag, setSelectedFlag] = useState("0");
  const [selectedStore, setSelectedStore] = useState("1");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Top Header */}
      <div className="bg-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <a href="#" className="flex-shrink-0">
              <img src="/api/placeholder/120/40" alt="logo" className="h-10" />
            </a>
            
            <div className="flex items-center bg-gray-700 rounded-md px-4 py-2 flex-1 max-w-md mx-4">
              <input 
                type="text" 
                placeholder="Search for" 
                className="bg-transparent text-white placeholder-gray-300 border-none outline-none flex-1"
              />
              <button className="text-orange-500 ml-2">
                <Search size={16} />
              </button>
            </div>
            
            <div className="flex items-center gap-6 text-white">
              <div className="flex items-center gap-2">
                <User className="text-orange-500" size={16} />
                <span>My Account</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="text-orange-500" size={16} />
                <span>$0.00</span>
                <span className="bg-orange-500 text-white rounded-full px-2 py-1 text-xs">0</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/api/placeholder/24/16" alt="flag" className="w-6 h-4" />
                <select 
                  value={selectedFlag}
                  onChange={(e) => setSelectedFlag(e.target.value)}
                  className="bg-transparent border-none text-white outline-none"
                >
                  <option value="0">USA</option>
                  <option value="1">Canada</option>
                  <option value="2">Australia</option>
                  <option value="3">Germany</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <button 
                onClick={toggleSidebar}
                className="text-white mr-4 lg:block hidden"
              >
                <Menu size={20} />
              </button>
              
              <nav className="hidden lg:flex items-center space-x-8 text-white">
                <div className="relative group">
                  <a href="#" className="text-white hover:text-orange-500 flex items-center">
                    Home <ChevronDown size={14} className="ml-1" />
                  </a>
                  <div className="absolute top-full left-0 bg-gray-800 shadow-lg rounded-md py-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                    <a href="#" className="block px-4 py-2 hover:bg-gray-700 text-white">Home One</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-700 text-white">Home One Light</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-700 text-white">Home Two</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-700 text-white">Home Two Light</a>
                  </div>
                </div>
                <a href="#" className="text-white hover:text-orange-500">About Us</a>
                <div className="relative group">
                  <a href="#" className="text-white hover:text-orange-500 flex items-center">
                    Pages <ChevronDown size={14} className="ml-1" />
                  </a>
                  <div className="absolute top-full left-0 bg-gray-800 shadow-lg rounded-md py-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                    <a href="#" className="block px-4 py-2 hover:bg-gray-700 text-white">Shop Leftbar</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-700 text-white">Shop Rightbar</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-700 text-white">Shop Single</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-700 text-white">Cart Page</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-700 text-white">Checkout Page</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-700 text-white">Register</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-700 text-white">Login</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-700 text-white">404 Error</a>
                  </div>
                </div>
                <div className="relative group">
                  <a href="#" className="text-white hover:text-orange-500 flex items-center">
                    Blog <ChevronDown size={14} className="ml-1" />
                  </a>
                  <div className="absolute top-full left-0 bg-gray-800 shadow-lg rounded-md py-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                    <a href="#" className="block px-4 py-2 hover:bg-gray-700 text-white">Blog Standard</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-700 text-white">Blog Grid</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-700 text-white">Blog List</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-700 text-white">Blog Single</a>
                  </div>
                </div>
                <a href="#" className="text-white hover:text-orange-500">Contact Us</a>
              </nav>
            </div>

            <div className="hidden sm:flex items-center space-x-6 text-white">
              <div className="flex items-center">
                <img src="/api/placeholder/32/32" alt="pickup" className="w-8 h-8 mr-3" />
                <div>
                  <p className="text-sm text-gray-300">Picking up?</p>
                  <select 
                    value={selectedStore}
                    onChange={(e) => setSelectedStore(e.target.value)}
                    className="bg-transparent text-white text-sm border-none outline-none"
                  >
                    <option value="1">Select Store</option>
                    <option value="2">Store One</option>
                    <option value="3">Store Two</option>
                    <option value="4">Store Three</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <img src="/api/placeholder/32/32" alt="shipping" className="w-8 h-8 mr-3" />
                <div>
                  <p className="text-sm text-gray-300">
                    Free Shipping<br />on order <strong>over $100</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
            <div className="fixed left-0 top-0 h-full w-64 bg-gray-800 z-50 p-4">
              <button 
                onClick={toggleSidebar}
                className="text-white mb-4 text-xl"
              >
                ✕
              </button>
              <nav className="flex flex-col space-y-4 text-white">
                <a href="#" className="hover:text-orange-500">Home</a>
                <a href="#" className="hover:text-orange-500">About Us</a>
                <a href="#" className="hover:text-orange-500">Pages</a>
                <a href="#" className="hover:text-orange-500">Blog</a>
                <a href="#" className="hover:text-orange-500">Contact Us</a>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}