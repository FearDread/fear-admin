'use client';

import type { Dispatch, SetStateAction } from 'react';
import type { Brand } from '@/features/brands/api';

// TODO: swap for the shared Category type once categoriesApi exports one —
// kept local/loose here to unblock the conversion, same as Brand in
// ShopClient before brandsApi existed.
export interface Category {
  _id?: string;
  title: string;
}

interface LocalFilters {
  minPrice: number;
  maxPrice: number;
}

interface CurrentFilters extends LocalFilters {
  category: string;
  brandId: string;
}

interface FilterPanelProps {
  categories: Category[];
  brands: Brand[];
  localFilters: LocalFilters;
  setLocalFilters: Dispatch<SetStateAction<LocalFilters>>;
  currentFilters: CurrentFilters;
  totalProducts: number;
  getCategoryCount: (cat: Category) => number;
  getBrandCount: (brand: Brand) => number;
  handleCategoryChange: (cat: Category | null) => void;
  handleBrandChange: (id: string, checked: boolean) => void;
  handlePriceFilter: () => void;
  handleClearFilters: () => void;
}

export const FilterPanel = ({
  categories,
  brands,
  localFilters,
  setLocalFilters,
  currentFilters,
  totalProducts,
  getCategoryCount,
  getBrandCount,
  handleCategoryChange,
  handleBrandChange,
  handlePriceFilter,
  handleClearFilters,
}: FilterPanelProps) => {
  const minPct = (localFilters.minPrice / 200) * 100;
  const maxPct = (localFilters.maxPrice / 200) * 100;

  const hasActiveFilters =
    currentFilters.category ||
    currentFilters.brandId ||
    currentFilters.minPrice > 1 ||
    currentFilters.maxPrice < 200;

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
                <span className="filter-chip-x" onClick={() => handleCategoryChange(null)}>✕</span>
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
                <span
                  className="filter-chip-x"
                  onClick={() => {
                    setLocalFilters(p => ({ ...p, minPrice: 1, maxPrice: 200 }));
                    handlePriceFilter();
                  }}
                >✕</span>
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
          onClick={e => { e.preventDefault(); handleCategoryChange(null); }}
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
          type="range"
          className="shop-range"
          min="0"
          max="200"
          step="1"
          value={localFilters.minPrice}
          style={{ '--pct': `${minPct}%` } as React.CSSProperties}
          onChange={e => setLocalFilters(p => ({ ...p, minPrice: parseInt(e.target.value, 10) }))}
        />
        <input
          type="range"
          className="shop-range"
          min="0"
          max="200"
          step="1"
          value={localFilters.maxPrice}
          style={{ '--pct': `${maxPct}%` } as React.CSSProperties}
          onChange={e => setLocalFilters(p => ({ ...p, maxPrice: parseInt(e.target.value, 10) }))}
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
          const isChecked = currentFilters.brandId === brand._id;
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

export default FilterPanel;