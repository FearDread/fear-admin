// pages/Shop.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { dispatch } from "../../features/store";
import ProductCard from "../../components/products/ProductCard";
import {
  fetchProducts,
  selectSortedProducts,
  selectProductsLoading,
  selectProductsError,
  selectProductsPagination,
  setFilters,
  clearFilters,
  setSorting,
  setPagination,
  setCurrentPage,
  setPageSize,
  selectProductsFilters,
  selectAllProducts,
  selectProductsSearchTerm,
} from "../../features/products/slice";
import {
  fetchCategories,
  selectAllCategories,
  selectCategoriesLoading,
} from "../../features/categories/slice";
import {
  fetchBrands,
  selectAllBrands,
  selectBrandsLoading,
} from "../../features/brands/slice";

export const Shop = ({ data }) => {
  const navigate = useNavigate();

  // Redux selectors
  const products = useSelector(selectSortedProducts); // This includes filtering and sorting
  const categories = useSelector(selectAllCategories);
  const brands = useSelector(selectAllBrands);
  const productsLoading = useSelector(selectProductsLoading);
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const brandsLoading = useSelector(selectBrandsLoading);
  const error = useSelector(selectProductsError);
  const pagination = useSelector(selectProductsPagination);
  const currentFilters = useSelector(selectProductsFilters);

  // Local filter state
  const [localFilters, setLocalFilters] = useState({
    categoryId: '',
    brandId: '',
    minPrice: 1,
    maxPrice: 200,
  });
  const productData = useMemo(() => {
    return data || products;
  }, [data, products]);
  // View state
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortByLocal] = useState('menu_order');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);


  // Handle category filter
  const handleCategoryChange = (category) => {
    console.log('handle cat change ', category);
    const categoryId = category._id;
    const catTitle = category.title;
    const newFilters = { ...currentFilters, category : catTitle || undefined };

    console.log('new filters = ', newFilters);
    setLocalFilters(prev => ({ ...prev, catTitle }));
    dispatch(setFilters(newFilters));
  };

  // Handle brand filter
  const handleBrandChange = (brandId, checked) => {
    const newFilters = { ...currentFilters };
    if (checked) {
      newFilters.brandId = brandId;
    } else {
      delete newFilters.brandId;
    }
    setLocalFilters(prev => ({ ...prev, brandId }));
    dispatch(setFilters(newFilters));
  };

  // Handle price filter
  const handlePriceFilter = () => {
    dispatch(setFilters({
      ...currentFilters,
      minPrice: localFilters.minPrice,
      maxPrice: localFilters.maxPrice,
    }));
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setLocalFilters({
      category: '',
      brand: '',
      minPrice: 1,
      maxPrice: 200,
    });
    dispatch(clearFilters());
  };

  // Handle sorting
  const handleSortChange = (value) => {
    setSortByLocal(value);
    
    const sortConfig = {
      'menu_order': { sortBy: null, sortOrder: 'desc' },
      'popularity': { sortBy: 'popularity', sortOrder: 'desc' },
      'rating': { sortBy: 'rating', sortOrder: 'desc' },
      'date': { sortBy: 'createdAt', sortOrder: 'desc' },
      'price': { sortBy: 'price', sortOrder: 'asc' },
      'price-desc': { sortBy: 'price', sortOrder: 'desc' },
    };

    const config = sortConfig[value] || sortConfig['menu_order'];
    dispatch(setSorting(config));
  };

  // Handle page size change
  const handlePageSizeChange = (size) => {
    dispatch(setPageSize(parseInt(size)));
  };

  // Handle page change
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate pagination
  const pageSize = pagination?.pageSize || 8;
  const currentPage = pagination?.currentPage || 1;
  const totalProducts = products?.length || 0;
  const totalPages = Math.ceil(totalProducts / pageSize);
  
  // Paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return products?.slice(startIndex, endIndex - 1) || [];
  }, [products, currentPage, pageSize]);

  // Count products by category
  const getCategoryCount = (category) => {
    return products?.filter(p => p.category === category.title).length || 0;
  };

  // Count products by brand
  const getBrandCount = (brand) => {
    return products?.filter(p => p.brand === (brand.name || brand.title)).length || 0;
  };

  // Toggle mobile filter
  const toggleMobileFilter = () => {
    setMobileFilterOpen(!mobileFilterOpen);
  };
  // Fetch data on mount
  useEffect(() => {
        dispatch(fetchBrands());
        dispatch(fetchCategories());
    
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch]);

  useEffect(() => {
    setSorting({'menu_order': { sortBy: 'newest', sortOrder: 'asc' }})
  }, [dispatch]);
  // Loading state
  const isLoading = productsLoading || categoriesLoading || brandsLoading;

  if (isLoading && products.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading products...</p>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Products</h4>
          <p>{error.message || error}</p>
          <button className="btn btn-primary" onClick={() => dispatch(fetchProducts())}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb Section */}
      <section className="py-3 border-bottom d-none d-md-flex">
        <div className="container">
          <div className="page-breadcrumb d-flex align-items-center">
            <h3 className="breadcrumb-title pe-3">Filters</h3>
            <div className="ms-auto">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                      <i className="bx bx-home-alt"></i> Home
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="/shop" onClick={(e) => e.preventDefault()}>Shop</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Shop List Left Sidebar
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* Main Shop Section */}
      <section className="py-4">
        <div className="container">
          <div className="row">
            {/* Sidebar Filters */}
            <div className="col-12 col-xl-3">
              <div className="btn-mobile-filter d-xl-none" onClick={toggleMobileFilter}>
                <i className='bx bx-slider-alt'></i>
              </div>
              <div className={`filter-sidebar ${mobileFilterOpen ? 'd-flex' : 'd-none d-xl-flex'}`}>
                <div className="card rounded-0 w-100">
                  <div className="card-body">
                    <div className="align-items-center d-flex d-xl-none">
                      <h6 className="text-uppercase mb-0">Filter</h6>
                      <div 
                        className="btn-mobile-filter-close btn-close ms-auto cursor-pointer"
                        onClick={toggleMobileFilter}
                      ></div>
                    </div>
                    <hr className="d-flex d-xl-none" />
                    
                    {/* Categories Filter */}
                    <div className="product-categories">
                      <h6 className="text-uppercase mb-3">Categories</h6>
                      <ul className="list-unstyled mb-0 categories-list">
                        <li>
                          <a 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); handleCategoryChange(''); }}
                            className={!localFilters.categoryId ? 'active' : ''}
                          >
                            All Categories
                            <span className="float-end badge rounded-pill bg-light">
                              {totalProducts}
                            </span>
                          </a>
                        </li>
                        {categories.map((category) => (
                          <li key={category._id}>
                            <a 
                              href="#" 
                              onClick={(e) => { 
                                e.preventDefault(); 
                                handleCategoryChange(category); 
                              }}
                              className={localFilters.categoryId === category._id ? 'active' : ''}
                            >
                              {category.title}
                              <span className="float-end badge rounded-pill bg-light">
                                {getCategoryCount(category)}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <hr />
                    
                    {/* Price Filter */}
                    <div className="price-range">
                      <h6 className="text-uppercase mb-3">Price</h6>
                      <div className="my-4">
                        <div className="mb-2">
                          <label className="form-label">Min: ${localFilters.minPrice}</label>
                          <input
                            type="range"
                            className="form-range"
                            min="0"
                            max="200"
                            step="1"
                            value={localFilters.minPrice}
                            onChange={(e) => setLocalFilters(prev => ({ 
                              ...prev, 
                              minPrice: parseInt(e.target.value) 
                            }))}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Max: ${localFilters.maxPrice}</label>
                          <input
                            type="range"
                            className="form-range"
                            min="0"
                            max="200"
                            step="1"
                            value={localFilters.maxPrice}
                            onChange={(e) => setLocalFilters(prev => ({ 
                              ...prev, 
                              maxPrice: parseInt(e.target.value) 
                            }))}
                          />
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <button 
                          type="button" 
                          className="btn btn-white btn-sm text-uppercase rounded-0 font-13 fw-500"
                          onClick={handlePriceFilter}
                        >
                          Filter
                        </button>
                        <div className="ms-auto">
                          <p className="mb-0">
                            Price: ${localFilters.minPrice} - ${localFilters.maxPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                    <hr />
                   
                    {/* Brands Filter */}
                    <div className="product-brands">
                      <h6 className="text-uppercase mb-3">Brands</h6>
                      <ul className="list-unstyled mb-0 categories-list">
                        {brands.map((brand) => (
                          <li key={brand._id}>
                            <div className="form-check">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                value={brand._id}
                                id={`brand-${brand._id}`}
                                checked={localFilters.brandId === brand._id}
                                onChange={(e) => handleBrandChange(brand._id, e.target.checked)}
                              />
                              <label 
                                className="form-check-label" 
                                htmlFor={`brand-${brand._id}`}
                              >
                                {brand.name || brand.title} ({getBrandCount(brand)})
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <hr />
                    
                    <hr />
                    
                    {/* Clear Filters Button */}
                    <div className="d-grid">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary rounded-0"
                        onClick={handleClearFilters}
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="col-12 col-xl-9">
              <div className="product-wrapper">
                {/* Toolbar */}
                <div className="toolbox d-flex align-items-center mb-3 gap-2">
                  <div className="d-flex flex-wrap flex-grow-1 gap-1">
                    <div className="d-flex align-items-center flex-nowrap">
                      <p className="mb-0 font-13 text-nowrap text-white">Sort By:</p>
                      <select 
                        className="form-select ms-3 rounded-0"
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                      >
                        <option value="menu_order">Default sorting</option>
                        <option value="popularity">Sort by popularity</option>
                        <option value="rating">Sort by average rating</option>
                        <option value="date">Sort by newness</option>
                        <option value="price">Sort by price: low to high</option>
                        <option value="price-desc">Sort by price: high to low</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap">
                    <div className="d-flex align-items-center flex-nowrap">
                      <p className="mb-0 font-13 text-nowrap text-white">Show:</p>
                      <select 
                        className="form-select ms-3 rounded-0"
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(e.target.value)}
                      >
                        <option value="9">9</option>
                        <option value="12">12</option>
                        <option value="16">16</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <button 
                      className={`btn ${viewMode === 'grid' ? 'btn-white' : 'btn-light'} rounded-0`}
                      onClick={() => setViewMode('grid')}
                    >
                      <i className='bx bxs-grid me-0'></i>
                    </button>
                  </div>
                  <div>
                    <button 
                      className={`btn ${viewMode === 'list' ? 'btn-white' : 'btn-light'} rounded-0`}
                      onClick={() => setViewMode('list')}
                    >
                      <i className='bx bx-list-ul me-0'></i>
                    </button>
                  </div>
                </div>

                {/* Products Display */}
                {paginatedProducts.length === 0 ? (
                  <div className="text-center py-5">
                    <i className='bx bx-search-alt display-1 text-muted'></i>
                    <h4 className="mt-3">No Products Found</h4>
                    <p>Try adjusting your filters</p>
                    <button 
                      className="btn btn-primary"
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="product-grid">
                    <div className={`row ${viewMode === 'grid' ? 'row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-3' : 'row-cols-1'}`}>
                      {paginatedProducts.map((product) => (
                        <div className="col" key={product.id || product._id}>
                          <ProductCard {...product} viewMode={viewMode} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <hr />

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav className="d-flex justify-content-between" aria-label="Page navigation">
                    <ul className="pagination">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <a 
                          className="page-link" 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) handlePageChange(currentPage - 1);
                          }}
                        >
                          <i className='bx bx-chevron-left'></i> Prev
                        </a>
                      </li>
                    </ul>
                    <ul className="pagination">
                      {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                        const pageNum = index + 1;
                        return (
                          <li 
                            key={pageNum}
                            className={`page-item d-none d-sm-block ${currentPage === pageNum ? 'active' : ''}`}
                            aria-current={currentPage === pageNum ? 'page' : undefined}
                          >
                            {currentPage === pageNum ? (
                              <span className="page-link">
                                {pageNum}
                                <span className="visually-hidden">(current)</span>
                              </span>
                            ) : (
                              <a 
                                className="page-link" 
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(pageNum);
                                }}
                              >
                                {pageNum}
                              </a>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    <ul className="pagination">
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <a 
                          className="page-link" 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) handlePageChange(currentPage + 1);
                          }}
                          aria-label="Next"
                        >
                          Next <i className='bx bx-chevron-right'></i>
                        </a>
                      </li>
                    </ul>
                  </nav>
                )}

                {/* Results Summary */}
                <div className="text-center mt-3">
                  <p className="text-muted">
                    Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalProducts)} of {totalProducts} products
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Shop;