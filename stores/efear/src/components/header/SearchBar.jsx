// components/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  setSearchTerm,
  setFilters,
  selectAllProducts 
} from '../../features/products/slice';
import { 
  fetchCategories,
  selectAllCategories 
} from '../../features/categories/slice';

/**
 * SearchBar Component
 * Enhanced search bar with Redux integration, autocomplete, and category filtering
 * 
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.placeholder - Input placeholder text
 */
export const SearchBar = ({ 
  className = '', 
  placeholder = 'Search for Products'
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Redux selectors
  const categories = useSelector(selectAllCategories);
  const products = useSelector(selectAllProducts);
  const categoriesLoading = useSelector(state => state.categories?.loading);

  // Local state
  const [searchTerm, setSearchTermLocal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Fetch categories on mount
  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length, categoriesLoading]);

  // Generate search suggestions with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        generateSuggestions(searchTerm);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, products, selectedCategory]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Generate search suggestions based on search term and selected category
   */
  const generateSuggestions = (term) => {
    const lowerTerm = term.toLowerCase();
    let filtered = products.filter(product => {
      const name = (product.title || product.name || '').toLowerCase();
      const description = (product.description || '').toLowerCase();
      const matchesSearch = name.includes(lowerTerm) || description.includes(lowerTerm);
      
      // Filter by category if selected
      if (selectedCategory && selectedCategory !== 'All Categories') {
        const categoryMatch = product.categoryId === selectedCategory ||
                            (product.category || '').toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && categoryMatch;
      }
      
      return matchesSearch;
    });

    // Limit to 8 suggestions
    const newSuggestions = filtered.slice(0, 8).map(product => ({
      type: 'product',
      id: product._id || product.id,
      text: product.title || product.name,
      category: product.category,
      price: product.salePrice || product.price,
      image: product.images?.[0]?.url || product.image,
      data: product
    }));

    setSuggestions(newSuggestions);
  };

  /**
   * Handle search submission
   */
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;

    // Dispatch search term to Redux
    dispatch(setSearchTerm(searchTerm.trim()));

    // Apply category filter if selected
    if (selectedCategory && selectedCategory !== 'All Categories') {
      const category = categories.find(
        cat => cat.name === selectedCategory || cat.id === selectedCategory
      );
      
      if (category) {
        dispatch(setFilters({ categoryId: category.id }));
        navigate(`/shop?search=${encodeURIComponent(searchTerm)}&category=${category.id}`);
      } else {
        navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
      }
    } else {
      // Clear category filter
      dispatch(setFilters({ categoryId: undefined }));
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    }

    // Close suggestions and clear local state
    setShowSuggestions(false);
    setSearchTermLocal('');
  };

  /**
   * Handle category change
   */
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);

    // Regenerate suggestions with new category
    if (searchTerm.length >= 2) {
      generateSuggestions(searchTerm);
    }
  };

  /**
   * Handle suggestion click
   */
  const handleSuggestionClick = (suggestion) => {
    setShowSuggestions(false);
    setSearchTermLocal('');
    navigate(`/product/${suggestion.id}`);
  };

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          e.preventDefault();
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  /**
   * Handle input change
   */
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTermLocal(value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  /**
   * Handle input focus
   */
  const handleInputFocus = () => {
    if (searchTerm.length >= 2) {
      setShowSuggestions(true);
    }
  };

  /**
   * Clear search
   */
  const handleClear = () => {
    setSearchTermLocal('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  return (
    <div className={`search-bar-container position-relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSearch} className="input-group flex-nowrap px-xl-4">
        <input
          type="text"
          className="form-control w-100"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          autoComplete="off"
        />
        
        {/* Category Select */}
        <select
          className="form-select flex-shrink-0"
          style={{ width: '10.5rem' }}
          value={selectedCategory}
          onChange={handleCategoryChange}
          disabled={categoriesLoading}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.title}
            </option>
          ))}
        </select>

        {/* Clear Button */}
        {searchTerm && (
          <button 
            type="button"
            className="btn btn-link text-muted"
            onClick={handleClear}
            style={{ 
              position: 'absolute', 
              right: '11.5rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              zIndex: 5,
              padding: '0.25rem 0.5rem'
            }}
          >
            <i className='bx bx-x'></i>
          </button>
        )}

        {/* Search Button */}
        <button 
          type="submit" 
          className="input-group-text cursor-pointer"
          disabled={!searchTerm.trim()}
          style={{ cursor: searchTerm.trim() ? 'pointer' : 'not-allowed' }}
        >
          <i className='bx bx-search'></i>
        </button>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          className="search-suggestions position-absolute w-100 bg-dark border shadow-lg mt-1 rounded"
          style={{ 
            zIndex: 9999, 
            maxHeight: '400px', 
            overflowY: 'auto',
            left: 0,
            right: 0
          }}
        >
          <div className="p-2 border-bottom bg-dark">
            <small className="text-muted px-2 fw-500">
              Suggestions {selectedCategory && `in ${selectedCategory}`}
            </small>
          </div>
          <ul className="list-unstyled mb-0">
            {suggestions.map((suggestion, index) => (
              <li
                key={`${suggestion.id}-${index}`}
                className={`suggestion-item px-3 py-2 cursor-pointer ${
                  index === selectedIndex ? 'bg-light' : ''
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
                style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
              >
                <div className="d-flex align-items-center">
                  {/* Product Image */}
                  {suggestion.image ? (
                    <img 
                      src={suggestion.image}
                      alt={suggestion.text}
                      className="me-3 rounded"
                      style={{ 
                        width: '50px', 
                        height: '50px', 
                        objectFit: 'cover' 
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div 
                      className="me-3 d-flex align-items-center justify-content-center bg-dark rounded" 
                      style={{ width: '50px', height: '50px' }}
                    >
                      <i className='bx bx-package text-primary fs-4'></i>
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="text-light fw-500">{suggestion.text}</span>
                      {suggestion.price && (
                        <span className="text-primary fw-bold ms-2">
                          ${suggestion.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {suggestion.category && (
                      <small className="text-muted d-block">
                        {suggestion.category}
                      </small>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* View All Results */}
          {searchTerm && (
            <div className="border-top p-2 bg-dark">
              <button
                type="button"
                className="btn btn-link text-decoration-none w-100 text-start text-primary"
                onClick={handleSearch}
              >
                <i className='bx bx-search me-2'></i>
                View all results for "{searchTerm}"
                {selectedCategory && selectedCategory !== 'All Categories' && 
                  ` in ${selectedCategory}`
                }
              </button>
            </div>
          )}
        </div>
      )}

      {/* No Results Message */}
      {showSuggestions && searchTerm.length >= 2 && suggestions.length === 0 && (
        <div 
          className="search-suggestions position-absolute w-100 bg-dark border shadow-lg mt-1 rounded"
          style={{ zIndex: 9999, left: 0, right: 0 }}
        >
          <div className="p-4 text-center text-muted">
            <i className='bx bx-search-alt display-4 d-block mb-2'></i>
            <p className="mb-0">No products found for "{searchTerm}"</p>
            {selectedCategory && selectedCategory !== 'All Categories' && (
              <small className="d-block mt-1">
                in {selectedCategory}
              </small>
            )}
            <small className="d-block mt-2">Try different keywords or browse all categories</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;