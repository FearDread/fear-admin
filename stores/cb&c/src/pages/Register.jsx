import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react';

export default function LoginSection() {
  const [activeTab, setActiveTab] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
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
    
    if (activeTab === 'signup') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
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
      
      if (activeTab === 'signin') {
        setMessage('Successfully signed in!');
      } else {
        setMessage('Account created successfully!');
      }
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
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

  return (
    <>
    <section className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-5 min-h-[600px]">
            {/* Left Side - Image and Tab Switcher */}
            <div className="lg:col-span-3 relative">
              {/* Background Image */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              
              {/* Content Overlay */}
              <div className="relative z-10 h-full flex flex-col justify-between p-8 lg:p-12">
                <div className="space-y-6">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white">
                    Welcome to Our Platform
                  </h1>
                  <p className="text-xl text-gray-200 max-w-md">
                    Join thousands of users who trust us with their digital experience.
                  </p>
                </div>
                
                {/* Tab Switcher */}
                <div className="flex bg-black/20 backdrop-blur-sm rounded-2xl p-2">
                  <button
                    onClick={() => setActiveTab('signin')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-xl transition-all duration-300 ${
                      activeTab === 'signin'
                        ? 'bg-white text-purple-700 shadow-lg'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-semibold">Sign In</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('signup')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-xl transition-all duration-300 ${
                      activeTab === 'signup'
                        ? 'bg-white text-purple-700 shadow-lg'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span className="font-semibold">Create Account</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-2 p-8 lg:p-12 bg-white">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <p className="text-gray-600">
                    {activeTab === 'signin' 
                      ? 'Sign in to your account' 
                      : 'Join our community today'
                    }
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  {activeTab === 'signup' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                            errors.name 
                              ? 'border-red-300 focus:ring-red-500' 
                              : 'border-gray-300 focus:ring-purple-500'
                          }`}
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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

                  {activeTab === 'signup' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your password"
                          className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                            errors.confirmPassword 
                              ? 'border-red-300 focus:ring-red-500' 
                              : 'border-gray-300 focus:ring-purple-500'
                          }`}
                        />
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
                      <a href="#" className="text-purple-600 hover:text-purple-800">
                        terms & conditions
                      </a>
                    </label>
                  </div>
                  {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      activeTab === 'signin' ? 'Sign In' : 'Create Account'
                    )}
                  </button>

                  {message && (
                    <div className={`p-3 rounded-lg text-center ${
                      message.includes('Successfully') 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
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
                      <span className="px-4 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  {/* Social Login */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleSocialLogin('Google')}
                      className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <span className="text-gray-700">Continue with Google</span>
                    </button>
                    
                    <button
                      onClick={() => handleSocialLogin('Facebook')}
                      className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">f</span>
                      </div>
                      <span className="text-gray-700">Continue with Facebook</span>          </button>
                    </div>
          
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

    </section>
    </>
  );
}