import { useState, useEffect, useMemo, useRef } from 'react';
import {
  View, Text, FlatList, Pressable, StyleSheet,
  Modal, ScrollView, TextInput, ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts, selectSortedProducts, selectProductsLoading,
  selectProductsError, selectProductsPagination,
  setFilters, clearFilters, setSorting, setCurrentPage, setPageSize,
  selectProductsFilters,
} from '../../features/products/slice';
import {
  fetchCategories, selectAllCategories, selectCategoriesLoading,
} from '../../features/categories/slice';
import {
  fetchBrands, selectAllBrands, selectBrandsLoading,
} from '../../features/brands/slice';
import type { AppDispatch, RootState } from '../../features/store';
import ProductCard from '../../components/products/ProductCard';
import { Colors, Fonts } from '../../constants/theme';

const SORT_OPTIONS = [
  { value: 'menu_order',  label: 'Default'          },
  { value: 'popularity',  label: 'Popularity'       },
  { value: 'rating',      label: 'Avg. Rating'      },
  { value: 'date',        label: 'Newest First'     },
  { value: 'price',       label: 'Price: Low → High'},
  { value: 'price-desc',  label: 'Price: High → Low'},
];

const PAGE_SIZES = [9, 12, 16, 20, 50];

// ── Mini picker (replaces <select>) ────────────────────────────────────────
function Picker({
  label, options, value, onChange,
}: {
  label?: string;
  options: { value: string; label: string }[];
  value: string | number;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => o.value === String(value))?.label ?? String(value);
  return (
    <View>
      {label && <Text style={pk.label}>{label}</Text>}
      <Pressable style={pk.btn} onPress={() => setOpen(true)}>
        <Text style={pk.btnText}>{current}</Text>
        <Text style={pk.arrow}>▾</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={pk.overlay} onPress={() => setOpen(false)} />
        <View style={pk.sheet}>
          {options.map(o => (
            <Pressable key={o.value} style={pk.option} onPress={() => { onChange(o.value); setOpen(false); }}>
              <Text style={[pk.optionText, o.value === String(value) && pk.optionActive]}>
                {o.value === String(value) ? '▸  ' : '   '}{o.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Modal>
    </View>
  );
}

const pk = StyleSheet.create({
  label:      { fontFamily: Fonts.mono, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.textDim, marginBottom: 4 },
  btn:        { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: Colors.dark3, borderWidth: 1, borderColor: Colors.border },
  btnText:    { fontFamily: Fonts.mono, fontSize: 11, color: Colors.textHi, flex: 1 },
  arrow:      { color: Colors.textDim, fontSize: 10 },
  overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet:      { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.dark1, borderTopWidth: 2, borderTopColor: Colors.red, paddingBottom: 24 },
  option:     { paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
  optionText: { fontFamily: Fonts.mono, fontSize: 13, color: Colors.textMid },
  optionActive: { color: Colors.red },
});

// ── Filter sidebar panel ────────────────────────────────────────────────────
function FilterPanel({
  categories, brands, localFilters, setLocalFilters,
  currentFilters, getCategoryCount, getBrandCount,
  handleCategoryChange, handleBrandChange, handlePriceFilter, handleClearFilters,
}: any) {
  return (
    <ScrollView style={fp.scroll} showsVerticalScrollIndicator={false}>
      {/* Categories  →  .cat-filter-link */}
      <View style={fp.section}>
        <Text style={fp.heading}>CATEGORIES</Text>
        {categories.map((cat: any) => {
          const active = currentFilters.category === cat.title;
          return (
            <Pressable
              key={cat._id}
              style={[fp.catLink, active && fp.catLinkActive]}
              onPress={() => handleCategoryChange(active ? { _id: null } : cat)}
            >
              <Text style={[fp.catLinkText, active && fp.catLinkTextActive]}>
                {cat.title}
              </Text>
              <View style={[fp.catCount, active && fp.catCountActive]}>
                <Text style={[fp.catCountText, active && fp.catCountTextActive]}>
                  {getCategoryCount(cat)}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Brands  →  .brand-check-row */}
      <View style={fp.section}>
        <Text style={fp.heading}>BRANDS</Text>
        {brands.map((brand: any) => {
          const checked = currentFilters.brandId === (brand._id ?? brand.id);
          return (
            <Pressable
              key={brand._id ?? brand.id}
              style={fp.brandRow}
              onPress={() => handleBrandChange(brand._id ?? brand.id, !checked)}
            >
              <View style={[fp.checkbox, checked && fp.checkboxChecked]}>
                {checked && <Text style={fp.checkmark}>✓</Text>}
              </View>
              <Text style={[fp.brandLabel, checked && fp.brandLabelActive]}>
                {brand.name ?? brand.title}
              </Text>
              <Text style={fp.brandCount}>{getBrandCount(brand)}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Price range  →  .price-input */}
      <View style={fp.section}>
        <Text style={fp.heading}>PRICE RANGE</Text>
        <View style={fp.priceRow}>
          <View style={fp.priceField}>
            <Text style={fp.priceLabel}>MIN</Text>
            <TextInput
              style={fp.priceInput}
              value={String(localFilters.minPrice ?? 1)}
              onChangeText={v => setLocalFilters((p: any) => ({ ...p, minPrice: parseInt(v) || 1 }))}
              keyboardType="numeric"
              placeholderTextColor={Colors.textDim}
            />
          </View>
          <View style={fp.priceField}>
            <Text style={fp.priceLabel}>MAX</Text>
            <TextInput
              style={fp.priceInput}
              value={String(localFilters.maxPrice ?? 200)}
              onChangeText={v => setLocalFilters((p: any) => ({ ...p, maxPrice: parseInt(v) || 200 }))}
              keyboardType="numeric"
              placeholderTextColor={Colors.textDim}
            />
          </View>
        </View>
        <Pressable style={fp.applyBtn} onPress={handlePriceFilter}>
          <Text style={fp.applyBtnText}>APPLY PRICE</Text>
        </Pressable>
      </View>

      {/* Clear  →  .btn-clear */}
      <View style={fp.section}>
        <Pressable style={fp.clearBtn} onPress={handleClearFilters}>
          <Text style={fp.clearBtnText}>CLEAR ALL FILTERS</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const fp = StyleSheet.create({
  scroll:            { flex: 1, backgroundColor: Colors.dark1 },
  section:           { padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  heading:           { fontFamily: Fonts.display, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: Colors.textHi, marginBottom: 10 },
  catLink:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 10, marginBottom: 3, borderWidth: 1, borderColor: 'transparent' },
  catLinkActive:     { borderColor: Colors.red, backgroundColor: Colors.redFaded },
  catLinkText:       { fontFamily: Fonts.mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textMid },
  catLinkTextActive: { color: Colors.red },
  catCount:          { paddingHorizontal: 6, paddingVertical: 2, backgroundColor: Colors.dark3, borderWidth: 1, borderColor: Colors.border },
  catCountActive:    { backgroundColor: Colors.redFaded, borderColor: Colors.red },
  catCountText:      { fontFamily: Fonts.mono, fontSize: 9, color: Colors.textDim },
  catCountTextActive:{ color: Colors.red },
  brandRow:          { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  checkbox:          { width: 16, height: 16, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.dark3, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked:   { backgroundColor: Colors.red, borderColor: Colors.red },
  checkmark:         { color: Colors.white, fontSize: 10, fontWeight: '700' },
  brandLabel:        { fontFamily: Fonts.mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textMid, flex: 1 },
  brandLabelActive:  { color: Colors.white },
  brandCount:        { fontFamily: Fonts.mono, fontSize: 10, color: Colors.textDim },
  priceRow:          { flexDirection: 'row', gap: 10, marginBottom: 10 },
  priceField:        { flex: 1 },
  priceLabel:        { fontFamily: Fonts.mono, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.textDim, marginBottom: 4 },
  priceInput:        { backgroundColor: Colors.dark3, borderWidth: 1, borderColor: Colors.border, color: Colors.textHi, paddingHorizontal: 10, paddingVertical: 8, fontFamily: Fonts.mono, fontSize: 12 },
  applyBtn:          { backgroundColor: Colors.red, padding: 10, alignItems: 'center' },
  applyBtnText:      { fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: Colors.white },
  clearBtn:          { borderWidth: 1, borderColor: Colors.border, padding: 10, alignItems: 'center' },
  clearBtnText:      { fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.textDim },
});

// ══════════════════════════════════════════════════════════════════════════
export const Shop = () => {
  const router   = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const products        = useSelector(selectSortedProducts);
  const categories      = useSelector(selectAllCategories);
  const brands          = useSelector(selectAllBrands);
  const productsLoading = useSelector(selectProductsLoading);
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const brandsLoading   = useSelector(selectBrandsLoading);
  const error           = useSelector(selectProductsError);
  const pagination      = useSelector(selectProductsPagination);
  const currentFilters  = useSelector(selectProductsFilters);

  const [localFilters, setLocalFilters] = useState({ categoryId: '', brandId: '', minPrice: 1, maxPrice: 200 });
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');
  const [sortBy, setSortByLocal] = useState('date');
  const [filterDrawer, setFilterDrawer] = useState(false);

  const isLoading = productsLoading || categoriesLoading || brandsLoading;

  useEffect(() => {
    dispatch(fetchBrands() as any);
    dispatch(fetchCategories() as any);
    if (!products?.length) dispatch(fetchProducts() as any);
    dispatch(setSorting({ sortBy: 'createdAt', sortOrder: 'desc' }) as any);
  }, []);

  const pageSize   = (pagination?.pageSize ?? 10) - 1 || 9;
  const currentPage = pagination?.currentPage ?? 1;
  const total       = products?.length ?? 0;
  const totalPages  = Math.ceil(total / pageSize);
  const showStart   = (currentPage - 1) * pageSize + 1;
  const showEnd     = Math.min(currentPage * pageSize, total);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products?.slice(start, start + pageSize) ?? [];
  }, [products, currentPage, pageSize]);

  const getCatCount   = (cat: any) => products?.filter(p => p.category === cat.title).length ?? 0;
  const getBrandCount = (b: any)   => products?.filter(p => p.brand === (b.name ?? b.title)).length ?? 0;

  function handleCategoryChange(cat: any) {
    const title = cat?._id ? cat.title : '';
    setLocalFilters(p => ({ ...p, categoryId: title }));
    dispatch(setFilters({ ...currentFilters, category: title || undefined }) as any);
  }

  function handleBrandChange(brandId: string, checked: boolean) {
    const f = { ...currentFilters };
    if (checked) f.brandId = brandId; else delete f.brandId;
    setLocalFilters(p => ({ ...p, brandId: checked ? brandId : '' }));
    dispatch(setFilters(f) as any);
  }

  function handleSortChange(v: string) {
    setSortByLocal(v);
    const map: Record<string, any> = {
      menu_order:  { sortBy: null,        sortOrder: 'desc' },
      popularity:  { sortBy: 'popularity', sortOrder: 'desc' },
      rating:      { sortBy: 'rating',     sortOrder: 'desc' },
      date:        { sortBy: 'createdAt',  sortOrder: 'desc' },
      price:       { sortBy: 'price',      sortOrder: 'asc'  },
      'price-desc':{ sortBy: 'price',      sortOrder: 'desc' },
    };
    dispatch(setSorting(map[v] ?? map.date) as any);
  }

  function handleClearFilters() {
    setLocalFilters({ categoryId: '', brandId: '', minPrice: 1, maxPrice: 200 });
    dispatch(clearFilters() as any);
  }

  const filterProps = {
    categories, brands, localFilters, setLocalFilters,
    currentFilters, getCategoryCount: getCatCount, getBrandCount,
    handleCategoryChange, handleBrandChange,
    handlePriceFilter: () => dispatch(setFilters({ ...currentFilters, minPrice: localFilters.minPrice, maxPrice: localFilters.maxPrice }) as any),
    handleClearFilters,
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading && !products?.length) {
    return (
      <View style={s.stateScreen}>
        <ActivityIndicator color={Colors.red} size="large" />
        <Text style={s.stateText}>LOADING PRODUCTS...</Text>
      </View>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error && !products?.length) {
    return (
      <View style={s.stateScreen}>
        <Text style={s.stateIcon}>!</Text>
        <Text style={s.stateTitle}>FAILED TO LOAD</Text>
        <Text style={s.stateBody}>{String(error)}</Text>
        <Pressable style={s.stateBtn} onPress={() => dispatch(fetchProducts() as any)}>
          <Text style={s.stateBtnText}>TRY AGAIN</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={s.page}>
      {/* ── Page hero ── */}
      <View style={s.hero}>
        <View style={s.heroStripe} />
        <Text style={s.heroEyebrow}>BROWSE THE COLLECTION</Text>
        <Text style={s.heroTitle}>THE <Text style={s.heroTitleAccent}>SHOP</Text></Text>
        <View style={s.statRow}>
          {[
            { v: total,             l: 'Products'   },
            { v: categories.length, l: 'Categories' },
            { v: brands.length,     l: 'Brands'     },
          ].map(stat => (
            <View key={stat.l} style={s.statItem}>
              <Text style={s.statVal}>{stat.v}</Text>
              <Text style={s.statLbl}>{stat.l}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Toolbar  →  .shop-toolbar */}
      <View style={s.toolbar}>
        {/* Filter trigger */}
        <Pressable style={s.filterTrigger} onPress={() => setFilterDrawer(true)}>
          <Text style={s.filterTriggerText}>
            ⚙  FILTERS
            {(currentFilters.category || currentFilters.brandId) && (
              <Text style={{ color: Colors.red }}> !</Text>
            )}
          </Text>
        </Pressable>

        {/* Sort picker */}
        <Picker
          options={SORT_OPTIONS}
          value={sortBy}
          onChange={handleSortChange}
        />

        {/* Results count  →  .toolbar-results */}
        <Text style={s.results}>
          <Text style={s.resultsAccent}>{showStart}–{showEnd}</Text>
          {' '}of{' '}
          <Text style={s.resultsAccent}>{total}</Text>
        </Text>

        {/* View toggle  →  .view-toggle-btn */}
        <View style={s.viewToggle}>
          {(['grid', 'list'] as const).map(mode => (
            <Pressable
              key={mode}
              style={[s.viewBtn, viewMode === mode && s.viewBtnActive]}
              onPress={() => setViewMode(mode)}
            >
              <Text style={[s.viewBtnText, viewMode === mode && s.viewBtnTextActive]}>
                {mode === 'grid' ? '⊞' : '☰'}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── Active filter chips  →  .filter-chip */}
      {(currentFilters.category || currentFilters.brandId) && (
        <View style={s.chips}>
          {currentFilters.category && (
            <View style={s.chip}>
              <Text style={s.chipText}>CAT: {currentFilters.category}</Text>
              <Pressable onPress={() => handleCategoryChange('')}>
                <Text style={s.chipX}> ✕</Text>
              </Pressable>
            </View>
          )}
          {currentFilters.brandId && (
            <View style={s.chip}>
              <Text style={s.chipText}>BRAND FILTER</Text>
              <Pressable onPress={() => handleBrandChange(currentFilters.brandId, false)}>
                <Text style={s.chipX}> ✕</Text>
              </Pressable>
            </View>
          )}
          <Pressable onPress={handleClearFilters}>
            <Text style={s.chipClear}>CLEAR ALL</Text>
          </Pressable>
        </View>
      )}

      {/* ── Product grid / empty state ── */}
      {paginated.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>?</Text>
          <Text style={s.emptyTitle}>NO PRODUCTS FOUND</Text>
          <Text style={s.emptyBody}>Try loosening your filters.</Text>
          <Pressable style={s.emptyBtn} onPress={handleClearFilters}>
            <Text style={s.emptyBtnText}>CLEAR ALL FILTERS</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          key={viewMode}
          data={paginated}
          keyExtractor={i => String(i.id ?? i._id)}
          numColumns={viewMode === 'grid' ? 2 : 1}
          contentContainerStyle={s.grid}
          columnWrapperStyle={viewMode === 'grid' ? { gap: 8 } : undefined}
          renderItem={({ item }) => (
            <View style={viewMode === 'grid' ? s.gridItem : s.listItem}>
              <ProductCard {...item} viewMode={viewMode} />
            </View>
          )}
          ListFooterComponent={
            <>
              {/* Pagination  →  .shop-pagination / .page-btn */}
              {totalPages > 1 && (
                <View style={s.pagination}>
                  <Pressable
                    style={[s.pageBtn, currentPage === 1 && s.pageBtnDisabled]}
                    disabled={currentPage === 1}
                    onPress={() => dispatch(setCurrentPage(currentPage - 1) as any)}
                  >
                    <Text style={s.pageBtnText}>‹</Text>
                  </Pressable>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                    .map(pg => (
                      <Pressable
                        key={pg}
                        style={[s.pageBtn, pg === currentPage && s.pageBtnActive]}
                        onPress={() => dispatch(setCurrentPage(pg) as any)}
                      >
                        <Text style={[s.pageBtnText, pg === currentPage && s.pageBtnTextActive]}>
                          {pg}
                        </Text>
                      </Pressable>
                    ))
                  }
                  <Pressable
                    style={[s.pageBtn, currentPage >= totalPages && s.pageBtnDisabled]}
                    disabled={currentPage >= totalPages}
                    onPress={() => dispatch(setCurrentPage(currentPage + 1) as any)}
                  >
                    <Text style={s.pageBtnText}>›</Text>
                  </Pressable>
                </View>
              )}
              {total > 0 && (
                <Text style={s.resultsFooter}>
                  Showing {showStart}–{showEnd} of {total} products
                </Text>
              )}
            </>
          }
        />
      )}

      {/* ── Filter drawer  →  .mobile-filter-drawer */}
      <Modal visible={filterDrawer} animationType="slide" transparent onRequestClose={() => setFilterDrawer(false)}>
        <Pressable style={s.drawerOverlay} onPress={() => setFilterDrawer(false)} />
        <View style={s.drawer}>
          <View style={s.drawerHead}>
            <Text style={s.drawerTitle}>FILTERS</Text>
            <Pressable style={s.drawerClose} onPress={() => setFilterDrawer(false)}>
              <Text style={s.drawerCloseText}>✕</Text>
            </Pressable>
          </View>
          <View style={{ flex: 1 }}>
            <FilterPanel {...filterProps} />
          </View>
          <View style={s.drawerFoot}>
            <Pressable style={s.drawerApplyBtn} onPress={() => setFilterDrawer(false)}>
              <Text style={s.drawerApplyText}>VIEW {total} PRODUCTS</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Shop;

// ── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: Colors.dark0 },

  // ── Hero
  hero: {
    backgroundColor: Colors.dark1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    padding: 24,
    paddingBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  heroStripe:      { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: Colors.red },
  heroEyebrow:     { fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: Colors.red, marginBottom: 8 },
  heroTitle:       { fontFamily: Fonts.display, fontSize: 40, textTransform: 'uppercase', color: Colors.white, lineHeight: 40, marginBottom: 16 },
  heroTitleAccent: { color: Colors.red },
  statRow:         { flexDirection: 'row', gap: 24 },
  statItem:        { alignItems: 'center' },
  statVal:         { fontFamily: Fonts.display, fontSize: 22, color: Colors.red, lineHeight: 24 },
  statLbl:         { fontFamily: Fonts.mono, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: Colors.textDim },

  // ── Toolbar  →  .shop-toolbar
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
    backgroundColor: Colors.dark1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterTrigger:     { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.dark2 },
  filterTriggerText: { fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.textMid },
  results:           { fontFamily: Fonts.mono, fontSize: 10, color: Colors.textDim, marginLeft: 'auto' },
  resultsAccent:     { color: Colors.red },
  viewToggle:        { flexDirection: 'row', gap: 4 },
  viewBtn:           { width: 34, height: 34, backgroundColor: Colors.dark3, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  viewBtnActive:     { borderColor: Colors.red, backgroundColor: Colors.redFaded },
  viewBtnText:       { fontSize: 16, color: Colors.textDim },
  viewBtnTextActive: { color: Colors.red },

  // ── Filter chips  →  .filter-chip
  chips:     { flexDirection: 'row', flexWrap: 'wrap', gap: 6, padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  chip:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, backgroundColor: Colors.redFaded, borderWidth: 1, borderColor: Colors.redBorder },
  chipText:  { fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.red },
  chipX:     { fontFamily: Fonts.mono, fontSize: 11, color: Colors.red },
  chipClear: { fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: Colors.textDim, paddingVertical: 4, paddingHorizontal: 6 },

  // ── Grid
  grid:     { padding: 12, paddingBottom: 40, gap: 8 },
  gridItem: { flex: 1 },
  listItem: { flex: 1, marginBottom: 8 },

  // ── Pagination  →  .shop-pagination / .page-btn
  pagination:       { flexDirection: 'row', justifyContent: 'center', gap: 4, marginTop: 20, marginBottom: 8 },
  pageBtn:          { width: 38, height: 38, backgroundColor: Colors.dark2, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  pageBtnActive:    { backgroundColor: Colors.red, borderColor: Colors.red },
  pageBtnDisabled:  { opacity: 0.3 },
  pageBtnText:      { fontFamily: Fonts.mono, fontSize: 13, color: Colors.textMid },
  pageBtnTextActive:{ color: Colors.white },
  resultsFooter:    { fontFamily: Fonts.mono, fontSize: 10, color: Colors.textDim, textAlign: 'center', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 20 },

  // ── Empty  →  .empty-state
  empty:      { alignItems: 'center', padding: 48, borderWidth: 1, borderStyle: 'dashed', borderColor: Colors.border, margin: 16, backgroundColor: Colors.dark1 },
  emptyIcon:  { fontFamily: Fonts.display, fontSize: 60, color: Colors.border, lineHeight: 64, marginBottom: 12 },
  emptyTitle: { fontFamily: Fonts.display, fontSize: 20, textTransform: 'uppercase', color: Colors.textHi, marginBottom: 8 },
  emptyBody:  { fontFamily: Fonts.mono, fontSize: 12, color: Colors.textDim, textAlign: 'center', marginBottom: 20 },
  emptyBtn:   { backgroundColor: Colors.red, paddingHorizontal: 24, paddingVertical: 12 },
  emptyBtnText:{ fontFamily: Fonts.mono, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: Colors.white },

  // ── State screens
  stateScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.dark0, gap: 12, padding: 32 },
  stateIcon:   { fontFamily: Fonts.display, fontSize: 64, color: Colors.red, lineHeight: 68 },
  stateTitle:  { fontFamily: Fonts.display, fontSize: 20, textTransform: 'uppercase', color: Colors.white },
  stateText:   { fontFamily: Fonts.mono, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: Colors.textDim },
  stateBody:   { fontFamily: Fonts.mono, fontSize: 11, color: Colors.textDim, textAlign: 'center', marginBottom: 8 },
  stateBtn:    { backgroundColor: Colors.red, paddingHorizontal: 24, paddingVertical: 12 },
  stateBtnText:{ fontFamily: Fonts.mono, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: Colors.white },

  // ── Filter drawer  →  .mobile-filter-drawer
  drawerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' },
  drawer:        { position: 'absolute', left: 0, top: 0, bottom: 0, width: '80%', maxWidth: 320, backgroundColor: Colors.dark1, borderRightWidth: 1, borderRightColor: Colors.border, borderTopWidth: 2, borderTopColor: Colors.red },
  drawerHead:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.dark0 },
  drawerTitle:   { fontFamily: Fonts.display, fontSize: 16, textTransform: 'uppercase', color: Colors.white, letterSpacing: 1 },
  drawerClose:   { width: 34, height: 34, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.dark2, alignItems: 'center', justifyContent: 'center' },
  drawerCloseText: { color: Colors.textMid, fontSize: 14 },
  drawerFoot:    { padding: 16, borderTopWidth: 1, borderTopColor: Colors.border },
  drawerApplyBtn:  { backgroundColor: Colors.red, padding: 14, alignItems: 'center' },
  drawerApplyText: { fontFamily: Fonts.mono, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: Colors.white },
});