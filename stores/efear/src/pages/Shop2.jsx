// pages/Shop.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from 'react-router-dom';
import { dispatch } from "../features/store";
import ProductCard from "../components/products/ProductCard";
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
} from "../features/products/slice";
import {
  fetchCategories,
  selectAllCategories,
  selectCategoriesLoading,
} from "../features/categories/slice";
import {
  fetchBrands,
  selectAllBrands,
  selectBrandsLoading,
} from "../features/brands/slice";
import { T, shopStyles } from "../components/styles";

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

export const Shop2 = ({ data }) => {
  const navigate = useNavigate();

  const products       = useSelector(selectSortedProducts);
  const categories     = useSelector(selectAllCategories);
  const brands         = useSelector(selectAllBrands);
  const productsLoading  = useSelector(selectProductsLoading);
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const brandsLoading    = useSelector(selectBrandsLoading);
  const error          = useSelector(selectProductsError);
  const pagination     = useSelector(selectProductsPagination);
  const currentFilters = useSelector(selectProductsFilters);
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
  const pageSize       = pagination?.pageSize - 1 || 9;
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