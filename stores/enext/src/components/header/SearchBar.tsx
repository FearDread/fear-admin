'use client';

import { useState, useEffect, useRef, type SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useGetAllQuery as useGetAllProductsQuery } from '@/lib/redux/api/productsApi';
import { useGetAllQuery as useGetAllCategoriesQuery } from '@/lib/redux/api/categoriesApi';

interface Product {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  categoryId?: string;
  category?: string;
  salePrice?: number;
  price?: number;
  images?: { url: string }[];
  image?: string;
  [key: string]: unknown;
}

interface Category {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  [key: string]: unknown;
}

interface Suggestion {
  type: 'product';
  id: string | undefined;
  text: string | undefined;
  category: string | undefined;
  price: number | undefined;
  image: string | undefined;
  data: Product;
}

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export const SearchBar = ({
  className = '',
  placeholder = 'Search for Products',
}: SearchBarProps) => {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: categories = [], isLoading: categoriesLoading } = useGetAllCategoriesQuery();
  const { data: products = [] } = useGetAllProductsQuery();

  // Local state
  const [searchTerm, setSearchTermLocal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  /**
   * Generate search suggestions based on search term and selected category
   */
  const generateSuggestions = (term: string) => {
    const lowerTerm = term.toLowerCase();
    const filtered = (products as Product[]).filter((product) => {
      const name = (product.title || product.name || '').toLowerCase();
      const description = (product.description || '').toLowerCase();
      const matchesSearch = name.includes(lowerTerm) || description.includes(lowerTerm);

      // Filter by category if selected
      if (selectedCategory && selectedCategory !== 'All Categories') {
        const categoryMatch =
          product.categoryId === selectedCategory ||
          (product.category || '').toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && categoryMatch;
      }

      return matchesSearch;
    });

    // Limit to 8 suggestions
    const newSuggestions: Suggestion[] = filtered.slice(0, 8).map((product) => ({
      type: 'product',
      id: product._id || product.id,
      text: product.title || product.name,
      category: product.category,
      price: product.salePrice || product.price,
      image: product.images?.[0]?.url || product.image,
      data: product,
    }));

    setSuggestions(newSuggestions);
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, products, selectedCategory]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Handle search submission
   */
  const handleSearch = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();

    if (!searchTerm.trim()) return;

    // Apply category filter if selected — the shop page reads these
    // straight from the URL, so there's no need to also mirror them into
    // Redux the way the old thunk-based search state did.
    if (selectedCategory && selectedCategory !== 'All Categories') {
      const category = (categories as Category[]).find(
        (cat) => cat.name === selectedCategory || cat.id === selectedCategory,
      );

      if (category) {
        router.push(`/shop?search=${encodeURIComponent(searchTerm)}&category=${category.id}`);
      } else {
        router.push(`/shop?search=${encodeURIComponent(searchTerm)}`);
      }
    } else {
      router.push(`/shop?search=${encodeURIComponent(searchTerm)}`);
    }

    setShowSuggestions(false);
    setSearchTermLocal('');
  };

  /**
   * Handle category change
   */
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);

    if (searchTerm.length >= 2) {
      generateSuggestions(searchTerm);
    }
  };

  /**
   * Handle suggestion click
   */
  const handleSuggestionClick = (suggestion: Suggestion) => {
    setShowSuggestions(false);
    setSearchTermLocal('');
    router.push(`/product/${suggestion.id}`);
  };

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermLocal(e.target.value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    if (searchTerm.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleClear = () => {
    setSearchTermLocal('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleImageError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
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
          {(categories as Category[]).map((cat) => (
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
              padding: '0.25rem 0.5rem',
            }}
          >
            <i className="bx bx-x" />
          </button>
        )}

        {/* Search Button */}
        <button
          type="submit"
          className="input-group-text cursor-pointer"
          disabled={!searchTerm.trim()}
          style={{ cursor: searchTerm.trim() ? 'pointer' : 'not-allowed' }}
        >
          <i className="bx bx-search" />
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
            right: 0,
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
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={suggestion.image}
                      alt={suggestion.text}
                      className="me-3 rounded"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      onError={handleImageError}
                    />
                  ) : (
                    <div
                      className="me-3 d-flex align-items-center justify-content-center bg-dark rounded"
                      style={{ width: '50px', height: '50px' }}
                    >
                      <i className="bx bx-package text-primary fs-4" />
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
                      <small className="text-muted d-block">{suggestion.category}</small>
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
                <i className="bx bx-search me-2" />
                View all results for &quot;{searchTerm}&quot;
                {selectedCategory &&
                  selectedCategory !== 'All Categories' &&
                  ` in ${selectedCategory}`}
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
            <i className="bx bx-search-alt display-4 d-block mb-2" />
            <p className="mb-0">No products found for &quot;{searchTerm}&quot;</p>
            {selectedCategory && selectedCategory !== 'All Categories' && (
              <small className="d-block mt-1">in {selectedCategory}</small>
            )}
            <small className="d-block mt-2">Try different keywords or browse all categories</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
