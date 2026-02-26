// pages/Shop.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from 'react-router-dom';
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

/* ─────────────────────────────────────────────
   DESIGN TOKENS  (mirrors Home + About)
───────────────────────────────────────────────*/
const T = {
  red:     '#e63946',
  orange:  '#f4a261',
  teal:    '#2a9d8f',
  dark0:   '#0d0d0d',
  dark1:   '#111111',
  dark2:   '#141414',
  dark3:   '#1a1a1a',
  border:  '#222222',
  borderHi:'#333333',
  textDim: 'rgba(255,255,255,0.35)',
  textMid: 'rgba(255,255,255,0.60)',
  textHi:  'rgba(255,255,255,0.92)',
};

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────*/
const shopStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  body { background: ${T.dark0}; color: ${T.textMid}; }

  /* ── Sidebar ── */
  .shop-sidebar {
    background: ${T.dark1};
    border: 1px solid ${T.border};
    position: sticky; top: 1.5rem;
  }
  .sidebar-section {
    padding: 1.5rem;
    border-bottom: 1px solid ${T.border};
  }
  .sidebar-section:last-child { border-bottom: none; }
  .sidebar-heading {
    font-family: 'Anton', 'Impact', sans-serif;
    font-size: .85rem; letter-spacing: .15em; text-transform: uppercase;
    color: ${T.textHi}; margin: 0 0 1.1rem;
    display: flex; align-items: center; gap: .6rem;
  }
  .sidebar-heading::after {
    content: ''; flex: 1; height: 1px; background: ${T.border};
  }

  /* category links */
  .cat-filter-link {
    display: flex; align-items: center; justify-content: space-between;
    padding: .5rem .75rem; margin-bottom: .25rem;
    font-family: 'Space Mono', monospace; font-size: .73rem;
    letter-spacing: .06em; text-transform: uppercase;
    color: ${T.textMid}; text-decoration: none;
    border: 1px solid transparent;
    transition: color .2s, border-color .2s, background .2s;
  }
  .cat-filter-link:hover { color: #fff; border-color: ${T.border}; }
  .cat-filter-link.active {
    color: ${T.red}; border-color: ${T.red};
    background: rgba(230,57,70,.07);
  }
  .cat-count {
    font-family: 'Space Mono', monospace; font-size: .65rem;
    color: ${T.textDim}; background: ${T.dark3};
    padding: .1rem .45rem; border: 1px solid ${T.border};
  }
  .cat-filter-link.active .cat-count {
    color: ${T.red}; border-color: ${T.red}; background: rgba(230,57,70,.12);
  }

  /* brand checkboxes */
  .brand-check-row {
    display: flex; align-items: center; gap: .65rem;
    padding: .45rem 0; cursor: pointer;
  }
  .brand-check-box {
    width: 16px; height: 16px; flex-shrink: 0;
    border: 1px solid ${T.border}; background: ${T.dark3};
    display: flex; align-items: center; justify-content: center;
    transition: border-color .2s, background .2s;
  }
  .brand-check-box.checked {
    border-color: ${T.red}; background: ${T.red};
  }
  .brand-check-box.checked::after {
    content: '✓'; font-size: .65rem; color: #fff; font-weight: bold;
  }
  .brand-check-label {
    font-family: 'Space Mono', monospace; font-size: .72rem;
    text-transform: uppercase; letter-spacing: .05em;
    color: ${T.textMid}; flex: 1;
    transition: color .2s;
  }
  .brand-check-row:hover .brand-check-label { color: #fff; }
  .brand-check-row:hover .brand-check-box { border-color: ${T.textDim}; }

  /* price range */
  .price-range-inputs { display: flex; gap: .75rem; margin-bottom: 1rem; }
  .price-input-wrap { flex: 1; }
  .price-input-label {
    font-family: 'Space Mono', monospace; font-size: .6rem;
    letter-spacing: .12em; text-transform: uppercase;
    color: ${T.textDim}; display: block; margin-bottom: .4rem;
  }
  .price-input {
    width: 100%; background: ${T.dark3}; border: 1px solid ${T.border};
    color: ${T.textHi}; padding: .5rem .65rem;
    font-family: 'Space Mono', monospace; font-size: .78rem;
    outline: none; transition: border-color .2s;
  }
  .price-input:focus { border-color: ${T.red}; }

  /* custom range slider */
  .shop-range {
    -webkit-appearance: none; appearance: none;
    width: 100%; height: 3px;
    background: linear-gradient(to right, ${T.red} var(--pct,50%), ${T.border} var(--pct,50%));
    outline: none; margin: .75rem 0;
  }
  .shop-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px; height: 14px;
    background: ${T.red}; border: 2px solid ${T.dark0};
    cursor: pointer;
  }
  .shop-range::-moz-range-thumb {
    width: 14px; height: 14px;
    background: ${T.red}; border: 2px solid ${T.dark0};
    cursor: pointer; border-radius: 0;
  }

  /* clear btn */
  .btn-clear {
    width: 100%; padding: .65rem;
    background: transparent; border: 1px solid ${T.border};
    color: ${T.textMid};
    font-family: 'Space Mono', monospace; font-size: .7rem;
    letter-spacing: .1em; text-transform: uppercase;
    cursor: pointer; transition: border-color .2s, color .2s;
  }
  .btn-clear:hover { border-color: ${T.red}; color: ${T.red}; }

  /* ── Toolbar ── */
  .shop-toolbar {
    display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
    padding: 1rem 1.25rem;
    background: ${T.dark1}; border: 1px solid ${T.border};
    margin-bottom: 1.5rem;
  }
  .toolbar-label {
    font-family: 'Space Mono', monospace; font-size: .68rem;
    letter-spacing: .12em; text-transform: uppercase;
    color: ${T.textDim}; white-space: nowrap;
  }
  .shop-select {
    background: ${T.dark3}; border: 1px solid ${T.border};
    color: ${T.textHi}; padding: .45rem .75rem;
    font-family: 'Space Mono', monospace; font-size: .72rem;
    letter-spacing: .05em; outline: none;
    cursor: pointer; transition: border-color .2s;
    -webkit-appearance: none; appearance: none;
    padding-right: 1.75rem;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right .6rem center;
  }
  .shop-select:focus { border-color: ${T.red}; }
  .toolbar-results {
    font-family: 'Space Mono', monospace; font-size: .68rem;
    color: ${T.textDim}; margin-left: auto;
  }
  .toolbar-results span { color: ${T.red}; }

  /* view toggle */
  .view-toggle-btn {
    width: 36px; height: 36px;
    background: ${T.dark3}; border: 1px solid ${T.border};
    color: ${T.textDim}; font-size: 1rem;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: border-color .2s, color .2s;
  }
  .view-toggle-btn.active { border-color: ${T.red}; color: ${T.red}; background: rgba(230,57,70,.08); }
  .view-toggle-btn:hover { border-color: ${T.borderHi}; color: #fff; }

  /* ── Active filter chips ── */
  .filter-chips { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1.25rem; }
  .filter-chip {
    display: inline-flex; align-items: center; gap: .4rem;
    padding: .3rem .7rem;
    background: rgba(230,57,70,.1); border: 1px solid rgba(230,57,70,.4);
    font-family: 'Space Mono', monospace; font-size: .65rem;
    letter-spacing: .08em; text-transform: uppercase; color: ${T.red};
  }
  .filter-chip-x {
    cursor: pointer; opacity: .7; font-size: .8rem; line-height: 1;
    transition: opacity .2s;
  }
  .filter-chip-x:hover { opacity: 1; }

  /* ── Empty state ── */
  .empty-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 6rem 2rem; text-align: center;
    border: 1px dashed ${T.border};
    background: ${T.dark1};
  }
  .empty-icon {
    font-family: 'Anton', 'Impact', sans-serif;
    font-size: 5rem; color: ${T.border}; line-height: 1; margin-bottom: 1.5rem;
  }
  .empty-title {
    font-family: 'Anton', 'Impact', sans-serif;
    font-size: 1.75rem; text-transform: uppercase; color: ${T.textHi};
    margin: 0 0 .75rem;
  }
  .empty-body { font-size: .88rem; color: ${T.textDim}; margin-bottom: 2rem; }

  /* ── Pagination ── */
  .shop-pagination { display: flex; align-items: center; justify-content: center; gap: .4rem; margin-top: 2.5rem; }
  .page-btn {
    width: 40px; height: 40px;
    background: ${T.dark2}; border: 1px solid ${T.border};
    color: ${T.textMid};
    font-family: 'Space Mono', monospace; font-size: .8rem;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: border-color .2s, color .2s, background .2s;
    text-decoration: none;
  }
  .page-btn:hover { border-color: ${T.borderHi}; color: #fff; }
  .page-btn.active { border-color: ${T.red}; background: ${T.red}; color: #fff; cursor: default; }
  .page-btn.disabled { opacity: .3; pointer-events: none; }

  /* ── Mobile filter drawer ── */
  .mobile-filter-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(0,0,0,.75);
    animation: fadeIn .2s ease;
  }
  .mobile-filter-drawer {
    position: fixed; left: 0; top: 0; bottom: 0; width: 320px; max-width: 90vw;
    background: ${T.dark1}; border-right: 1px solid ${T.border};
    z-index: 1001; overflow-y: auto;
    animation: slideInLeft .25s ease;
  }
  .mobile-drawer-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid ${T.border};
    position: sticky; top: 0; background: ${T.dark1}; z-index: 1;
  }
  .mobile-drawer-title {
    font-family: 'Anton', 'Impact', sans-serif;
    font-size: 1.25rem; text-transform: uppercase; color: #fff; margin: 0;
  }
  .mobile-drawer-close {
    width: 36px; height: 36px;
    background: transparent; border: 1px solid ${T.border};
    color: ${T.textMid}; font-size: 1.1rem;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: border-color .2s, color .2s;
  }
  .mobile-drawer-close:hover { border-color: ${T.red}; color: ${T.red}; }

  /* ── Loading skeleton ── */
  .skeleton-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.25rem; }
  .skeleton-card {
    background: ${T.dark2}; border: 1px solid ${T.border};
    aspect-ratio: 3/4;
    animation: skeletonPulse 1.6s ease-in-out infinite;
  }
  @keyframes skeletonPulse {
    0%,100% { opacity: 1; }
    50% { opacity: .4; }
  }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }

  /* ── Loading / Error screens ── */
  .shop-loading-screen, .shop-error-screen {
    min-height: 60vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: ${T.dark0};
  }
  .loading-spinner {
    width: 48px; height: 48px;
    border: 3px solid ${T.border};
    border-top-color: ${T.red};
    border-radius: 50%;
    animation: spin .7s linear infinite;
    margin-bottom: 1.5rem;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Misc ── */
  .price-display {
    display: flex; justify-content: space-between;
    font-family: 'Space Mono', monospace; font-size: .7rem;
    color: ${T.textDim}; margin-top: .25rem;
  }
  .price-display span { color: ${T.textHi}; }

  /* Filter btn (mobile trigger) */
  .btn-filter-trigger {
    display: flex; align-items: center; gap: .6rem;
    padding: .65rem 1.25rem;
    background: ${T.dark2}; border: 1px solid ${T.border};
    color: ${T.textMid};
    font-family: 'Space Mono', monospace; font-size: .72rem;
    letter-spacing: .08em; text-transform: uppercase;
    cursor: pointer; transition: border-color .2s, color .2s;
  }
  .btn-filter-trigger:hover { border-color: ${T.red}; color: ${T.red}; }
  .btn-apply-price {
    padding: .5rem 1rem;
    background: ${T.red}; border: none; color: #fff;
    font-family: 'Space Mono', monospace; font-size: .7rem;
    letter-spacing: .1em; text-transform: uppercase;
    cursor: pointer; transition: opacity .2s;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  }
  .btn-apply-price:hover { opacity: .85; }

  @media(max-width:768px) {
    .skeleton-grid { grid-template-columns: repeat(2,1fr); }
    .shop-toolbar { gap: .6rem; }
  }
`;

/* ─────────────────────────────────────────────
   SIDEBAR FILTER PANEL  (shared between desktop + drawer)
───────────────────────────────────────────────*/
const FilterPanel = ({
  categories, brands,
  localFilters, setLocalFilters,
  currentFilters,
  totalProducts,
  getCategoryCount, getBrandCount,
  handleCategoryChange, handleBrandChange,
  handlePriceFilter, handleClearFilters,
}) => {
  const minPct = (localFilters.minPrice / 200) * 100;
  const maxPct = (localFilters.maxPrice / 200) * 100;

  const hasActiveFilters = currentFilters.category || currentFilters.brandId ||
    currentFilters.minPrice > 1 || currentFilters.maxPrice < 200;

  return (
    <div className="shop-sidebar">

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="sidebar-section">
          <div className="sidebar-heading">Active</div>
          <div className="filter-chips">
            {currentFilters.category && (
              <span className="filter-chip">
                {currentFilters.category}
                <span className="filter-chip-x" onClick={() => handleCategoryChange('')}>✕</span>
              </span>
            )}
            {currentFilters.brandId && (
              <span className="filter-chip">
                Brand
                <span className="filter-chip-x" onClick={() => handleBrandChange(currentFilters.brandId, false)}>✕</span>
              </span>
            )}
            {(currentFilters.minPrice > 1 || currentFilters.maxPrice < 200) && (
              <span className="filter-chip">
                ${currentFilters.minPrice}–${currentFilters.maxPrice}
                <span className="filter-chip-x" onClick={() => { setLocalFilters(p => ({...p, minPrice:1, maxPrice:200})); handlePriceFilter(); }}>✕</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="sidebar-section">
        <div className="sidebar-heading">Category</div>
        <a
          href="#"
          className={`cat-filter-link${!currentFilters.category ? ' active' : ''}`}
          onClick={e => { e.preventDefault(); handleCategoryChange(''); }}
        >
          All Products <span className="cat-count">{totalProducts}</span>
        </a>
        {categories.map(cat => (
          <a
            key={cat._id}
            href="#"
            className={`cat-filter-link${currentFilters.category === cat.title ? ' active' : ''}`}
            onClick={e => { e.preventDefault(); handleCategoryChange(cat); }}
          >
            {cat.title} <span className="cat-count">{getCategoryCount(cat)}</span>
          </a>
        ))}
      </div>

      {/* Price */}
      <div className="sidebar-section">
        <div className="sidebar-heading">Price</div>
        <input
          type="range" className="shop-range"
          min="0" max="200" step="1"
          value={localFilters.minPrice}
          style={{ '--pct': `${minPct}%` }}
          onChange={e => setLocalFilters(p => ({ ...p, minPrice: parseInt(e.target.value) }))}
        />
        <input
          type="range" className="shop-range"
          min="0" max="200" step="1"
          value={localFilters.maxPrice}
          style={{ '--pct': `${maxPct}%` }}
          onChange={e => setLocalFilters(p => ({ ...p, maxPrice: parseInt(e.target.value) }))}
        />
        <div className="price-display">
          <span>Min: <span>${localFilters.minPrice}</span></span>
          <span>Max: <span>${localFilters.maxPrice}</span></span>
        </div>
        <button className="btn-apply-price" style={{ marginTop: '1rem' }} onClick={handlePriceFilter}>
          Apply Price
        </button>
      </div>

      {/* Brands */}
      <div className="sidebar-section">
        <div className="sidebar-heading">Brand</div>
        {brands.map(brand => {
          const isChecked = localFilters.brandId === brand._id;
          return (
            <div
              key={brand._id}
              className="brand-check-row"
              onClick={() => handleBrandChange(brand._id, !isChecked)}
            >
              <div className={`brand-check-box${isChecked ? ' checked' : ''}`} />
              <span className="brand-check-label">{brand.name || brand.title}</span>
              <span className="cat-count">{getBrandCount(brand)}</span>
            </div>
          );
        })}
      </div>

      {/* Clear */}
      <div className="sidebar-section">
        <button className="btn-clear" onClick={handleClearFilters}>
          ✕ &nbsp; Clear All Filters
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   PAGINATION
───────────────────────────────────────────────*/
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="shop-pagination">
      <button
        className={`page-btn${currentPage === 1 ? ' disabled' : ''}`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
      >←</button>

      {start > 1 && (
        <>
          <button className="page-btn" onClick={() => onPageChange(1)}>1</button>
          {start > 2 && <span style={{ color: T.textDim, padding: '0 .25rem' }}>…</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          className={`page-btn${p === currentPage ? ' active' : ''}`}
          onClick={() => onPageChange(p)}
        >{p}</button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span style={{ color: T.textDim, padding: '0 .25rem' }}>…</span>}
          <button className="page-btn" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}

      <button
        className={`page-btn${currentPage === totalPages ? ' disabled' : ''}`}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
      >→</button>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN SHOP COMPONENT
───────────────────────────────────────────────*/
export const Shop2 = ({ data }) => {
  const navigate = useNavigate();

  // Redux selectors
  const products       = useSelector(selectSortedProducts);
  const categories     = useSelector(selectAllCategories);
  const brands         = useSelector(selectAllBrands);
  const productsLoading  = useSelector(selectProductsLoading);
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const brandsLoading    = useSelector(selectBrandsLoading);
  const error          = useSelector(selectProductsError);
  const pagination     = useSelector(selectProductsPagination);
  const currentFilters = useSelector(selectProductsFilters);

  // Local state
  const [localFilters, setLocalFilters] = useState({
    categoryId: '', brandId: '', minPrice: 1, maxPrice: 200,
  });
  const [viewMode, setViewMode]         = useState('grid');
  const [sortBy, setSortByLocal]        = useState('menu_order');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const productData = useMemo(() => data || products, [data, products]);

  // Handlers
  const handleCategoryChange = (category) => {
    const catTitle = category?._id ? category.title : '';
    const newFilters = { ...currentFilters, category: catTitle || undefined };
    setLocalFilters(prev => ({ ...prev, catTitle }));
    dispatch(setFilters(newFilters));
  };

  const handleBrandChange = (brandId, checked) => {
    const newFilters = { ...currentFilters };
    if (checked) { newFilters.brandId = brandId; }
    else { delete newFilters.brandId; }
    setLocalFilters(prev => ({ ...prev, brandId: checked ? brandId : '' }));
    dispatch(setFilters(newFilters));
  };

  const handlePriceFilter = () => {
    dispatch(setFilters({ ...currentFilters, minPrice: localFilters.minPrice, maxPrice: localFilters.maxPrice }));
  };

  const handleClearFilters = () => {
    setLocalFilters({ category: '', brand: '', minPrice: 1, maxPrice: 200 });
    dispatch(clearFilters());
  };

  const handleSortChange = (value) => {
    setSortByLocal(value);
    const sortConfig = {
      'menu_order':  { sortBy: null, sortOrder: 'desc' },
      'popularity':  { sortBy: 'popularity', sortOrder: 'desc' },
      'rating':      { sortBy: 'rating', sortOrder: 'desc' },
      'date':        { sortBy: 'createdAt', sortOrder: 'desc' },
      'price':       { sortBy: 'price', sortOrder: 'asc' },
      'price-desc':  { sortBy: 'price', sortOrder: 'desc' },
    };
    dispatch(setSorting(sortConfig[value] || sortConfig['menu_order']));
  };

  const handlePageSizeChange = (size) => dispatch(setPageSize(parseInt(size)));

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pagination
  const pageSize       = pagination?.pageSize || 12;
  const currentPage    = pagination?.currentPage || 1;
  const totalProducts  = products?.length || 0;
  const totalPages     = Math.ceil(totalProducts / pageSize);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products?.slice(start, start + pageSize) || [];
  }, [products, currentPage, pageSize]);

  const getCategoryCount = cat => products?.filter(p => p.category === cat.title).length || 0;
  const getBrandCount    = brand => products?.filter(p => p.brand === (brand.name || brand.title)).length || 0;

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchCategories());
    if (products.length === 0) dispatch(fetchProducts());
  }, []);

  useEffect(() => {
    setSorting({ 'menu_order': { sortBy: 'newest', sortOrder: 'asc' } });
  }, []);

  const isLoading = productsLoading || categoriesLoading || brandsLoading;

  const filterPanelProps = {
    categories, brands, localFilters, setLocalFilters,
    currentFilters, totalProducts,
    getCategoryCount, getBrandCount,
    handleCategoryChange, handleBrandChange,
    handlePriceFilter, handleClearFilters,
  };

  // ── Loading state ──
  if (isLoading && products.length === 0) {
    return (
      <>
        <style>{shopStyles}</style>
        <div className="shop-loading-screen">
          <div className="loading-spinner" />
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '.72rem', letterSpacing: '.2em', textTransform: 'uppercase', color: T.textDim }}>Loading Products...</span>
        </div>
      </>
    );
  }

  // ── Error state ──
  if (error && products.length === 0) {
    return (
      <>
        <style>{shopStyles}</style>
        <div className="shop-error-screen">
          <div style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: '5rem', color: T.red, lineHeight: 1, marginBottom: '1rem' }}>!</div>
          <h4 style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: '1.5rem', textTransform: 'uppercase', color: '#fff', margin: '0 0 .75rem' }}>
            Failed to Load Products
          </h4>
          <p style={{ fontFamily: "'Space Mono',monospace", fontSize: '.78rem', color: T.textDim, marginBottom: '2rem' }}>
            {error.message || error}
          </p>
          <button
            onClick={() => dispatch(fetchProducts())}
            style={{
              padding: '.85rem 2.25rem', background: T.red, border: 'none', color: '#fff',
              fontFamily: "'Space Mono',monospace", fontSize: '.78rem',
              letterSpacing: '.12em', textTransform: 'uppercase', cursor: 'pointer',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
            }}
          >Try Again</button>
        </div>
      </>
    );
  }

  const showStart = ((currentPage - 1) * pageSize) + 1;
  const showEnd   = Math.min(currentPage * pageSize, totalProducts);

  return (
    <>
      <style>{shopStyles}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap" rel="stylesheet" />

      {/* ── PAGE HERO ── */}
      <section style={{
        position: 'relative', background: T.dark0, overflow: 'hidden',
        padding: '4.5rem 0 3.5rem', borderBottom: `1px solid ${T.border}`,
      }}>
        {/* halftone */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.055) 1px, transparent 1px)',
          backgroundSize: '22px 22px', pointerEvents: 'none',
        }} />
        {/* ghost text */}
        <span style={{
          position: 'absolute', right: '-1rem', top: '50%', transform: 'translateY(-50%)',
          fontFamily: "'Anton','Impact',sans-serif", fontSize: 'clamp(6rem,16vw,13rem)',
          textTransform: 'uppercase', color: 'rgba(255,255,255,.03)',
          lineHeight: 1, userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>THE SHOP</span>
        {/* red left stripe */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: '4px', height: '100%', background: T.red }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
          {/* breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '1.5rem' }}>
            <Link to="/" style={{ fontFamily: "'Space Mono',monospace", fontSize: '.68rem', letterSpacing: '.15em', textTransform: 'uppercase', color: T.textDim, textDecoration: 'none' }}>Home</Link>
            <span style={{ color: T.red, fontSize: '.7rem' }}>✦</span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '.68rem', letterSpacing: '.15em', textTransform: 'uppercase', color: T.red }}>Shop</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '.72rem', letterSpacing: '.2em', textTransform: 'uppercase', color: T.red, display: 'block', marginBottom: '.6rem' }}>
                Browse the collection
              </span>
              <h1 style={{
                fontFamily: "'Anton','Impact',sans-serif",
                fontSize: 'clamp(2.5rem, 7vw, 5rem)', textTransform: 'uppercase',
                lineHeight: .92, color: '#fff', margin: 0,
                WebkitTextStroke: `1.5px ${T.red}`,
              }}>The Shop</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              {/* stat pills */}
              {[
                { v: totalProducts, l: 'Products' },
                { v: categories.length, l: 'Categories' },
                { v: brands.length, l: 'Brands' },
              ].map(s => (
                <div key={s.l} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: '1.75rem', color: T.red, lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '.6rem', letterSpacing: '.15em', textTransform: 'uppercase', color: T.textDim, marginTop: '.2rem' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN LAYOUT ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>

          {/* ── DESKTOP SIDEBAR ── */}
          <aside style={{ display: 'block' }} className="d-none d-xl-block">
            <FilterPanel {...filterPanelProps} />
          </aside>

          {/* ── PRODUCT AREA ── */}
          <div>
            {/* Toolbar */}
            <div className="shop-toolbar">
              {/* Mobile filter trigger */}
              <button className="btn-filter-trigger d-xl-none" onClick={() => setMobileFilterOpen(true)}>
                ⚙ &nbsp;Filters
                {(currentFilters.category || currentFilters.brandId) && (
                  <span style={{ background: T.red, color: '#fff', padding: '.1rem .35rem', fontSize: '.6rem' }}>!</span>
                )}
              </button>

              <span className="toolbar-label">Sort:</span>
              <select className="shop-select" value={sortBy} onChange={e => handleSortChange(e.target.value)}>
                <option value="menu_order">Default</option>
                <option value="popularity">Popularity</option>
                <option value="rating">Avg. Rating</option>
                <option value="date">Newest First</option>
                <option value="price">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>

              <span className="toolbar-label" style={{ marginLeft: '.5rem' }}>Show:</span>
              <select className="shop-select" value={pageSize} onChange={e => handlePageSizeChange(e.target.value)}>
                {[9,12,16,20,50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>

              <span className="toolbar-results">
                <span>{showStart}–{showEnd}</span> of <span>{totalProducts}</span>
              </span>

              {/* view toggle */}
              <div style={{ display: 'flex', gap: '.3rem', marginLeft: 'auto' }}>
                <button className={`view-toggle-btn${viewMode === 'grid' ? ' active' : ''}`} onClick={() => setViewMode('grid')} title="Grid view">
                  ⊞
                </button>
                <button className={`view-toggle-btn${viewMode === 'list' ? ' active' : ''}`} onClick={() => setViewMode('list')} title="List view">
                  ☰
                </button>
              </div>
            </div>

            {/* Active filter chips row (above grid) */}
            {(currentFilters.category || currentFilters.brandId) && (
              <div className="filter-chips" style={{ marginBottom: '1.25rem' }}>
                {currentFilters.category && (
                  <span className="filter-chip">
                    Category: {currentFilters.category}
                    <span className="filter-chip-x" onClick={() => handleCategoryChange('')}>✕</span>
                  </span>
                )}
                {currentFilters.brandId && (
                  <span className="filter-chip">
                    Brand filtered
                    <span className="filter-chip-x" onClick={() => handleBrandChange(currentFilters.brandId, false)}>✕</span>
                  </span>
                )}
                <button onClick={handleClearFilters} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: "'Space Mono',monospace", fontSize: '.65rem',
                  letterSpacing: '.1em', textTransform: 'uppercase', color: T.textDim,
                  padding: '.3rem .5rem', transition: 'color .2s',
                }}>Clear all</button>
              </div>
            )}

            {/* Products */}
            {paginatedProducts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">?</div>
                <h3 className="empty-title">No Products Found</h3>
                <p className="empty-body">Your filters are too picky. Even Batman would be impressed.<br />Try loosening them up a bit.</p>
                <button onClick={handleClearFilters} style={{
                  padding: '.85rem 2.25rem', background: T.red, border: 'none', color: '#fff',
                  fontFamily: "'Space Mono',monospace", fontSize: '.78rem',
                  letterSpacing: '.12em', textTransform: 'uppercase', cursor: 'pointer',
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                }}>Clear All Filters</button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(220px, 1fr))' : '1fr',
                gap: '1.25rem',
              }}>
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id || product._id} {...product} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />

            {/* Results summary */}
            {totalProducts > 0 && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '.68rem', letterSpacing: '.1em', textTransform: 'uppercase', color: T.textDim }}>
                  Showing {showStart}–{showEnd} of {totalProducts} products
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER ── */}
      {mobileFilterOpen && (
        <>
          <div className="mobile-filter-overlay" onClick={() => setMobileFilterOpen(false)} />
          <div className="mobile-filter-drawer">
            <div className="mobile-drawer-header">
              <h2 className="mobile-drawer-title">Filters</h2>
              <button className="mobile-drawer-close" onClick={() => setMobileFilterOpen(false)}>✕</button>
            </div>
            <div style={{ padding: '1rem' }}>
              <FilterPanel {...filterPanelProps} />
            </div>
            <div style={{ padding: '1.5rem', borderTop: `1px solid ${T.border}` }}>
              <button
                style={{
                  width: '100%', padding: '.9rem',
                  background: T.red, border: 'none', color: '#fff',
                  fontFamily: "'Space Mono',monospace", fontSize: '.78rem',
                  letterSpacing: '.12em', textTransform: 'uppercase', cursor: 'pointer',
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                }}
                onClick={() => setMobileFilterOpen(false)}
              >
                View {totalProducts} Products
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Shop2;