'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useGetAllProductsQuery } from '@/lib/redux/api/productsApi';
import { useGetAllCategoriesQuery } from '@/lib/redux/api/categoriesApi';


import { T, shopStyles } from '@/components/styles';
import ProductCard from '@/components/products/ProductCard';
import ProductCarousel from '@/components/products/ProductCarousel';
// TODO: not yet converted — bring these over from
// stores/efear/src/pages/shop/components/{FilterPanel,Pagination}.jsx
import FilterPanel from '@/components/shop/FilterPanel';
import { ShopPagination } from '@/components/shop/Pagination';
import { categoriesApi } from '@/lib/redux/api/categoriesApi';
import { useGetAllBrandsQuery } from '@/lib/redux/api/brandsApi';
// Minimal local shapes — replace with the shared Product/Category/Brand
// types once they're exported from features/{products,categories,brands}/api.
interface Product {
  id?: string;
  _id?: string;
  title: string;
  category?: string;
  brand?: string;
  price: number;
  createdAt?: string;
  popularity?: number;
  rating?: number;
  [key: string]: unknown;
}
interface Category {
  _id?: string;
  title: string;
}
interface Brand {
  _id?: string;
  name?: string;
  title?: string;
}

type SortOption = 'menu_order' | 'popularity' | 'rating' | 'date' | 'price' | 'price-desc';

const PAGE_SIZE_OPTIONS = [9, 12, 16, 20, 50];

export const ShopClient = () => {
  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsErrored,
    error: productsErrorObj,
    refetch: refetchProducts,
  } = useGetAllProductsQuery();
  const { data: categories = [], isLoading: categoriesLoading } = useGetAllCategoriesQuery();
  const { data: brands = [], isLoading: brandsLoading } = useGetAllBrandsQuery();

  const typedProducts = products as Product[];
  const typedCategories = categories as Category[];
  const typedBrands = brands as Brand[];

  // Filters — client-side, mirrors the CRA version's local filter state
  const [localFilters, setLocalFilters] = useState({ minPrice: 1, maxPrice: 200 });
  const [category, setCategory] = useState('');
  const [brandId, setBrandId] = useState('');

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  // Handlers
  const handleCategoryChange = (cat: Category | null) => {
    setCategory(cat?._id ? cat.title : '');
    setCurrentPage(1);
  };

  const handleBrandChange = (id: string, checked: boolean) => {
    setBrandId(checked ? id : '');
    setCurrentPage(1);
  };

  const handlePriceFilter = () => setCurrentPage(1);

  const handleClearFilters = () => {
    setLocalFilters({ minPrice: 1, maxPrice: 200 });
    setCategory('');
    setBrandId('');
    setCurrentPage(1);
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: string) => {
    setPageSize(parseInt(size, 10));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtering
  const filteredProducts = useMemo(() => {
    return typedProducts.filter((p) => {
      if (category && p.category !== category) return false;

      if (brandId) {
        const brand = typedBrands.find((b) => b._id === brandId);
        const brandLabel = brand?.name ?? brand?.title;
        if (brandLabel && p.brand !== brandLabel) return false;
      }

      if (typeof p.price === 'number') {
        if (p.price < localFilters.minPrice || p.price > localFilters.maxPrice) return false;
      }

      return true;
    });
  }, [typedProducts, category, brandId, localFilters.minPrice, localFilters.maxPrice, typedBrands]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'popularity':
        return list.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
      case 'rating':
        return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case 'date':
        return list.sort(
          (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        );
      case 'price':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'menu_order':
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);

  // Pagination
  const totalProducts = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize));

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedProducts.slice(start, start + pageSize);
  }, [sortedProducts, currentPage, pageSize]);

  const getCategoryCount = (cat: Category) =>
    typedProducts.filter((p) => p.category === cat.title).length;
  const getBrandCount = (brand: Brand) =>
    typedProducts.filter((p) => p.brand === (brand.name || brand.title)).length;

  const isLoading = productsLoading || categoriesLoading || brandsLoading;

  const filterPanelProps = {
    categories: typedCategories,
    brands: typedBrands,
    localFilters,
    setLocalFilters,
    currentFilters: { category, brandId, ...localFilters },
    totalProducts,
    getCategoryCount,
    getBrandCount,
    handleCategoryChange,
    handleBrandChange,
    handlePriceFilter,
    handleClearFilters,
  };

  if (isLoading && typedProducts.length === 0) {
    return (
      <>
        <style>{shopStyles}</style>
        <div className="shop-loading-screen">
          <div className="loading-spinner" />
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '.72rem', letterSpacing: '.2em', textTransform: 'uppercase', color: T.textDim }}>
            Loading Products...
          </span>
        </div>
      </>
    );
  }

  // ── Error state ──
  if (productsErrored && typedProducts.length === 0) {
    const message =
      productsErrorObj && 'message' in productsErrorObj
        ? String((productsErrorObj as { message?: string }).message)
        : 'Something went wrong loading products.';

    return (
      <>
        <style>{shopStyles}</style>
        <div className="shop-error-screen">
          <div style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: '5rem', color: T.red, lineHeight: 1, marginBottom: '1rem' }}>!</div>
          <h4 style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: '1.5rem', textTransform: 'uppercase', color: '#fff', margin: '0 0 .75rem' }}>
            Failed to Load Products
          </h4>
          <p style={{ fontFamily: "'Space Mono',monospace", fontSize: '.78rem', color: T.textDim, marginBottom: '2rem' }}>
            {message}
          </p>
          <button
            onClick={() => refetchProducts()}
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

  const showStart = totalProducts === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showEnd = Math.min(currentPage * pageSize, totalProducts);

  return (
    <>
      <style>{shopStyles}</style>

      {/* ── PAGE HERO ── */}
      <section style={{
        position: 'relative', background: T.dark0, overflow: 'hidden',
        padding: '4.5rem 0 3.5rem', borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.055) 1px, transparent 1px)',
          backgroundSize: '22px 22px', pointerEvents: 'none',
        }} />
        <span style={{
          position: 'absolute', right: '-1rem', top: '50%', transform: 'translateY(-50%)',
          fontFamily: "'Anton','Impact',sans-serif", fontSize: 'clamp(6rem,16vw,13rem)',
          textTransform: 'uppercase', color: 'rgba(255,255,255,.03)',
          lineHeight: 1, userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>THE SHOP</span>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '4px', height: '100%', background: T.red }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '1.5rem' }}>
            <Link href="/" style={{ fontFamily: "'Space Mono',monospace", fontSize: '.68rem', letterSpacing: '.15em', textTransform: 'uppercase', color: T.textDim, textDecoration: 'none' }}>Home</Link>
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
              {[
                { v: totalProducts, l: 'Products' },
                { v: typedCategories.length, l: 'Categories' },
                { v: typedBrands.length, l: 'Brands' },
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
            <div className="shop-toolbar">
              <button className="btn-filter-trigger d-xl-none" onClick={() => setMobileFilterOpen(true)}>
                ⚙ &nbsp;Filters
                {(category || brandId) && (
                  <span style={{ background: T.red, color: '#fff', padding: '.1rem .35rem', fontSize: '.6rem' }}>!</span>
                )}
              </button>

              <span className="toolbar-label">Sort:</span>
              <select className="shop-select" value={sortBy} onChange={e => handleSortChange(e.target.value as SortOption)}>
                <option value="menu_order">Default</option>
                <option value="popularity">Popularity</option>
                <option value="rating">Avg. Rating</option>
                <option value="date">Newest First</option>
                <option value="price">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>

              <span className="toolbar-label" style={{ marginLeft: '.5rem' }}>Show:</span>
              <select className="shop-select" value={pageSize} onChange={e => handlePageSizeChange(e.target.value)}>
                {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>

              <span className="toolbar-results">
                <span>{showStart}–{showEnd}</span> of <span>{totalProducts}</span>
              </span>

              <div style={{ display: 'flex', gap: '.3rem', marginLeft: 'auto' }}>
                <button className={`view-toggle-btn${viewMode === 'grid' ? ' active' : ''}`} onClick={() => setViewMode('grid')} title="Grid view">
                  ⊞
                </button>
                <button className={`view-toggle-btn${viewMode === 'list' ? ' active' : ''}`} onClick={() => setViewMode('list')} title="List view">
                  ☰
                </button>
              </div>
            </div>

            {(category || brandId) && (
              <div className="filter-chips" style={{ marginBottom: '1.25rem' }}>
                {category && (
                  <span className="filter-chip">
                    Category: {category}
                    <span className="filter-chip-x" onClick={() => setCategory('')}>✕</span>
                  </span>
                )}
                {brandId && (
                  <span className="filter-chip">
                    Brand filtered
                    <span className="filter-chip-x" onClick={() => handleBrandChange(brandId, false)}>✕</span>
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

            <ShopPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />

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
      <ProductCarousel />
    </>
  );
};

export default ShopClient;