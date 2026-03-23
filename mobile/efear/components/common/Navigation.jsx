const Navigation = () => {
  const { currentRoute, navigate } = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gray-950 text-white border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <h1 
            className="text-2xl font-bold cursor-pointer"
            onClick={() => navigate('/')}
          >
            eTrans
          </h1>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate('/')}
              className={`hover:text-purple-400 ${currentRoute === '/' ? 'text-purple-400' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => navigate('/shop')}
              className={`hover:text-purple-400 ${currentRoute === '/shop' ? 'text-purple-400' : ''}`}
            >
              Shop
            </button>
            {isAuthenticated && (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`hover:text-purple-400 ${currentRoute === '/dashboard' ? 'text-purple-400' : ''}`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/orders')}
                  className={`hover:text-purple-400 ${currentRoute === '/orders' ? 'text-purple-400' : ''}`}
                >
                  Orders
                </button>
              </>
            )}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            <Heart size={24} className="cursor-pointer hover:text-purple-400" />
            <div className="relative cursor-pointer hover:text-purple-400">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </div>
            
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
              >
                <User size={18} />
                Login
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-3">
            <button onClick={() => { navigate('/'); setMobileMenuOpen(false); }} className="text-left py-2">Home</button>
            <button onClick={() => { navigate('/shop'); setMobileMenuOpen(false); }} className="text-left py-2">Shop</button>
            {isAuthenticated && (
              <>
                <button onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }} className="text-left py-2">Dashboard</button>
                <button onClick={() => { navigate('/orders'); setMobileMenuOpen(false); }} className="text-left py-2">Orders</button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};