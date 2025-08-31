import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import BannerSub from "../components/Banner/BannerSub";
import Loader from "../components/Loader/Loader";

import CategoryFilter from "../components/Filters/Category";
import PriceFilter from "../components/Filters/Price";
import RatingFilter from "../components/Filters/Rating";
import BrandFilter from "../components/Filters/Brand";
import SortDropdown from "../components/Filters/Sort";
import ProductGrid from "../components/Product/Grid";

import { Product } from "../features/products/slice";
import { Category } from "../features/categories/slice";
import { Brand } from "../features/brands/slice";

// Constants
const INITIAL_FILTER_STATE = {
  tag: null,
  keyword: null,
  currentCategory: null,
  brand: null,
  minPrice: null,
  maxPrice: null,
  sort: null,
};

const GRID_SIZE = 4;
const PRODUCTS_PER_PAGE = 9;
const MAX_BRANDS_DISPLAY = 6;

// Custom hook for filter management
const useFilters = () => {
  const [filters, setFilters] = useState(INITIAL_FILTER_STATE);
  
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTER_STATE);
  }, []);

  return { filters, updateFilter, resetFilters };
};

// Custom hook for data fetching
const useShopData = (searchParams) => {
  const dispatch = useDispatch();
  
  const fetchProducts = useCallback(() => {

    const params = Object.fromEntries(searchParams.entries());
    console.log('params = ', params);
    if (Object.keys(params).length > 0) {
      dispatch(Product.search(params));
    } else {
      dispatch(Product.fetch());
    }
  }, [dispatch, searchParams]);

  const fetchCategories = useCallback(() => {
    dispatch(Category.fetch());
  }, [dispatch]);

  const fetchBrands = useCallback(() => {
    dispatch(Brand.fetch());
  }, [dispatch]);

  return { fetchProducts, fetchCategories, fetchBrands };
};

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, updateFilter, resetFilters } = useFilters();
  
  // Redux selectors
  const { data: productData, loading } = useSelector(state => state.product);
  const { data: brandData } = useSelector(state => state.brand);
  const { data: categoryData } = useSelector(state => state.category);

  // Data fetching hooks
  const { fetchProducts, fetchCategories, fetchBrands } = useShopData(searchParams);

  // Memoized computed values
  const products = useMemo(() => {
    return productData?.result || [];
  }, [productData]);

  const displayedProducts = useMemo(() => {
    return products.slice(0, PRODUCTS_PER_PAGE);
  }, [products]);

  const displayedBrands = useMemo(() => {
    return brandData?.slice(0, MAX_BRANDS_DISPLAY) || [];
  }, [brandData]);

  const totalResults = useMemo(() => {
    return products.length;
  }, [products]);

  // Event handlers
  const handleFilterSubmit = useCallback((e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        params.set(key, value);
      }
    });
    
    setSearchParams(params);
    toast.success('Filters applied successfully!');
  }, [filters, setSearchParams]);

  const handleSortChange = useCallback((sortValue) => {
    updateFilter('sort', sortValue);
  }, [updateFilter]);

  const handlePriceRangeChange = useCallback((min, max) => {
    updateFilter('minPrice', min);
    updateFilter('maxPrice', max);
  }, [updateFilter]);

  // Effects
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, [fetchProducts, fetchCategories, fetchBrands]);

  useEffect(() => {
    fetchProducts();
  }, [searchParams, fetchProducts]);

  if (loading) {
    return (
      <main className="float-start w-100 total-body home-body mt-0">
        <section className="float-start w-100">
          <Loader />
        </section>
      </main>
    );
  }

  return (
    <>
      <BannerSub />
      <main className="float-start w-100 total-body home-body mt-0">
        <section className="shop-page float-start w-100">
          <div className="listing-page-div">
            <div className="container">
              <div className="row gx-lg-5">
                {/* Filters Sidebar */}
                <div className="col-lg-3">
                  <form onSubmit={handleFilterSubmit}>
                    <div className="accordion mt-4 list-serach-acd" id="accordionPanelsStayOpenExample">
                      <CategoryFilter
                        categories={categoryData}
                        selectedCategory={filters.currentCategory}
                        onCategoryChange={(category) => updateFilter('currentCategory', category)}
                      />
                      
                      <PriceFilter
                        minPrice={filters.minPrice}
                        maxPrice={filters.maxPrice}
                        onPriceChange={handlePriceRangeChange}
                      />
                      
                      <RatingFilter
                        selectedRating={filters.rating}
                        onRatingChange={(rating) => updateFilter('rating', rating)}
                      />
                      
                      <BrandFilter
                        brands={displayedBrands}
                        selectedBrand={filters.brand}
                        onBrandChange={(brand) => updateFilter('brand', brand)}
                      />
                    </div>
                    
                    <div className="mt-3 d-flex gap-2">
                      <button type="submit" className="btn submit-btn flex-grow-1">
                        Apply Filters
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={resetFilters}
                      >
                        Reset
                      </button>
                    </div>
                  </form>
                </div>

                {/* Products Section */}
                <div className="col-lg-9 mt-5 mt-lg-0">
                  <div className="d-flex justify-content-between align-items-center righty">
                    <h6 className="ashow">
                      Showing <b>1–{Math.min(PRODUCTS_PER_PAGE, totalResults)}</b> of <b>{totalResults}</b> Results
                    </h6>
                    <SortDropdown
                      currentSort={filters.sort}
                      onSortChange={handleSortChange}
                    />
                  </div>
                  
                  <ProductGrid
                    products={displayedProducts}
                    gridSize={GRID_SIZE}
                    className="mt-4 righty"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Shop;