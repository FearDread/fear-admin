import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Check } from 'lucide-react';

export default function RegisterLoginSection() {
  const [activeTab, setActiveTab] = useState('register');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (activeTab === 'register') {
      if (!formData.username) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (activeTab === 'register') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (!acceptTerms) {
      newErrors.terms = 'Please accept terms & conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setMessage('');
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (activeTab === 'register') {
        setMessage('Account created successfully! Please check your email to verify your account.');
      } else {
        setMessage('Successfully signed in!');
      }
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setAcceptTerms(false);
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setMessage(`Redirecting to ${provider}...`);
    // Handle social login logic here
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setMessage('');
    setAcceptTerms(false);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-5 min-h-[700px]">
            {/* Left Side - Image and Tab Switcher */}
            <div className="lg:col-span-3 relative">
              {/* Background with overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-700">
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                {/* Decorative patterns */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 right-20 w-48 h-48 bg-pink-400/20 rounded-full blur-2xl"></div>
              </div>
              
              {/* Content Overlay */}
              <div className="relative z-10 h-full flex flex-col justify-between p-8 lg:p-12">
                <div className="space-y-6">
                  <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                    {activeTab === 'register' ? 'Join Our Community' : 'Welcome Back'}
                  </h1>
                  <p className="text-xl text-gray-200 max-w-lg leading-relaxed">
                    {activeTab === 'register' 
                      ? 'Create your account and discover amazing products with exclusive deals and offers.'
                      : 'Sign in to access your account and continue your shopping experience.'
                    }
                  </p>
                  
                  {/* Features List */}
                  <div className="space-y-3 mt-8">
                    <div className="flex items-center space-x-3 text-gray-200">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>Premium product access</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-200">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>Exclusive member discounts</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-200">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>Fast & secure checkout</span>
                    </div>
                  </div>
                </div>
                
                {/* Tab Switcher */}
                <div className="flex bg-black/20 backdrop-blur-sm rounded-2xl p-2">
                  <button
                    onClick={() => switchTab('signin')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === 'signin'
                        ? 'bg-white text-purple-700 shadow-lg transform scale-105'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => switchTab('register')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === 'register'
                        ? 'bg-white text-purple-700 shadow-lg transform scale-105'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Create Account</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-2 p-8 lg:p-12 bg-white">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {activeTab === 'register' ? 'Create Account' : 'Welcome Back'}
                  </h2>
                  <p className="text-gray-600">
                    {activeTab === 'register' 
                      ? 'Fill in your details to get started' 
                      : 'Sign in to your account'
                    }
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  {activeTab === 'register' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          placeholder="Enter your username"
                          className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                            errors.username 
                              ? 'border-red-300 focus:ring-red-500' 
                              : 'border-gray-300 focus:ring-purple-500'
                          }`}
                        />
                      </div>
                      {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                          errors.email 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-purple-500'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                          errors.password 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-purple-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                  </div>

                  {activeTab === 'register' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your password"
                          className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                            errors.confirmPassword 
                              ? 'border-red-300 focus:ring-red-500' 
                              : 'border-gray-300 focus:ring-purple-500'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                    </div>
                  )}

                  {/* Terms Checkbox */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      I accept the{' '}
                      <a href="#" className="text-purple-600 hover:text-purple-800 underline">
                        terms & conditions
                      </a>
                    </label>
                  </div>
                  {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      activeTab === 'register' ? 'Create Account' : 'Sign In'
                    )}
                  </button>

                  {message && (
                    <div className={`p-4 rounded-lg text-center ${
                      message.includes('Successfully') || message.includes('created')
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {message}
                    </div>
                  )}

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
                    </div>
                  </div>

                  {/* Social Login */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleSocialLogin('Google')}
                      className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <span className="text-gray-700 font-medium">Continue with Google</span>
                    </button>
                    
                    <button
                      onClick={() => handleSocialLogin('Facebook')}
                      className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-white text-xs font-bold">f</span>
                      </div>
                      <span className="text-gray-700 font-medium">Continue with Facebook</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}