/**
 * SearchBar.jsx — React Native
 *
 * Web → RN mapping:
 *   <form onSubmit>             → Pressable + returnKeyType="search"
 *   <select>                    → Modal-based category picker (Picker not styled-able)
 *   document.addEventListener   → useEffect with no DOM equivalent needed
 *   useNavigate                 → useNavigation
 *   position: absolute dropdown → View with elevation/zIndex above siblings
 *   onMouseEnter suggestion     → onPressIn
 *   overflow: hidden dropdown   → ScrollView with maxHeight
 *   setFilters / setSearchTerm  → same Redux actions
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation }            from '@react-navigation/native';

import {
  setSearchTerm,
  setFilters,
  selectAllProducts,
} from '../../features/products/slice';
import { fetchCategories, selectAllCategories } from '../../features/categories/slice';

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  red:    '#b30e1c',
  dark1:  '#111111',
  dark2:  '#141414',
  dark3:  '#1a1a1a',
  border: '#222222',
  dim:    'rgba(255,255,255,0.32)',
  mid:    'rgba(255,255,255,0.58)',
  hi:     'rgba(255,255,255,0.92)',
  white:  '#ffffff',
};

const DEBOUNCE_MS = 300;

export const SearchBar = ({ placeholder = 'Search for Products' }) => {
  const dispatch   = useDispatch();
  const navigation = useNavigation();

  const categories        = useSelector(selectAllCategories);
  const products          = useSelector(selectAllProducts);
  const categoriesLoading = useSelector((s) => s.categories?.loading);

  const [term,           setTerm]           = useState('');
  const [selectedCat,    setSelectedCat]    = useState('');
  const [selectedCatId,  setSelectedCatId]  = useState('');
  const [suggestions,    setSuggestions]    = useState([]);
  const [showSugg,       setShowSugg]       = useState(false);
  const [selectedIdx,    setSelectedIdx]    = useState(-1);
  const [catModalOpen,   setCatModalOpen]   = useState(false);
  const [focused,        setFocused]        = useState(false);

  const debounceRef = useRef(null);
  const inputRef    = useRef(null);

  // ── Load categories once ────────────────────────────────────────────────
  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      dispatch(fetchCategories());
    }
  }, []);

  // ── Debounced suggestion generation ───────────────────────────────────
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (term.length >= 2) {
      debounceRef.current = setTimeout(() => generateSuggestions(term), DEBOUNCE_MS);
    } else {
      setSuggestions([]);
    }
    return () => clearTimeout(debounceRef.current);
  }, [term, products, selectedCatId]);

  const generateSuggestions = useCallback((q) => {
    const lower = q.toLowerCase();
    const filtered = products
      .filter((p) => {
        const name  = (p.title || p.name || '').toLowerCase();
        const desc  = (p.description || '').toLowerCase();
        const match = name.includes(lower) || desc.includes(lower);
        if (selectedCatId) {
          return match && (p.categoryId === selectedCatId ||
            (p.category || '').toLowerCase() === selectedCat.toLowerCase());
        }
        return match;
      })
      .slice(0, 8)
      .map((p) => ({
        id:       p._id || p.id,
        text:     p.title || p.name,
        category: p.category,
        price:    p.salePrice || p.price,
        image:    p.images?.[0]?.url || p.image || null,
      }));
    setSuggestions(filtered);
    setShowSugg(filtered.length > 0);
  }, [products, selectedCatId, selectedCat]);

  // ── Search submit ───────────────────────────────────────────────────────
  const handleSearch = useCallback(() => {
    if (!term.trim()) return;
    Keyboard.dismiss();
    dispatch(setSearchTerm(term.trim()));

    let route = `?search=${encodeURIComponent(term)}`;
    if (selectedCatId) {
      dispatch(setFilters({ categoryId: selectedCatId }));
      navigation.navigate('Shop', { search: term, category: selectedCatId });
    } else {
      dispatch(setFilters({ categoryId: undefined }));
      navigation.navigate('Shop', { search: term });
    }
    setShowSugg(false);
    setTerm('');
  }, [term, selectedCatId, dispatch, navigation]);

  // ── Suggestion tap ──────────────────────────────────────────────────────
  const handleSuggestionPress = useCallback((sugg) => {
    Keyboard.dismiss();
    setShowSugg(false);
    setTerm('');
    navigation.navigate('ProductDetails', { id: sugg.id });
  }, [navigation]);

  // ── Category picker ─────────────────────────────────────────────────────
  const selectCategory = (cat) => {
    setSelectedCat(cat ? cat.title : '');
    setSelectedCatId(cat ? (cat._id || cat.id) : '');
    setCatModalOpen(false);
    if (term.length >= 2) generateSuggestions(term);
  };

  // ── Render suggestion row ───────────────────────────────────────────────
  const renderSugg = ({ item, index }) => (
    <Pressable
      key={item.id}
      style={[s.suggRow, index === selectedIdx && s.suggRowSelected]}
      onPress={() => handleSuggestionPress(item)}
    >
      {item.image
        ? <Image source={{ uri: item.image }} style={s.suggImg} />
        : <View style={s.suggImgPlaceholder}><Text style={{ color: T.dim, fontSize: 18 }}>📦</Text></View>
      }
      <View style={s.suggInfo}>
        <Text style={s.suggName} numberOfLines={1}>{item.text}</Text>
        {item.category && <Text style={s.suggCat}>{item.category}</Text>}
      </View>
      {item.price != null && (
        <Text style={s.suggPrice}>${item.price.toFixed(2)}</Text>
      )}
    </Pressable>
  );

  return (
    <View style={s.wrap}>
      {/* ── Search row ── */}
      <View style={[s.form, focused && s.formFocused]}>

        {/* Category button */}
        <Pressable
          style={s.catBtn}
          onPress={() => { Keyboard.dismiss(); setCatModalOpen(true); }}
        >
          {categoriesLoading
            ? <ActivityIndicator size="small" color={T.dim} />
            : <Text style={s.catBtnText} numberOfLines={1}>
                {selectedCat || 'All'}
              </Text>
          }
          <Text style={s.catArrow}>▾</Text>
        </Pressable>

        {/* Text input */}
        <TextInput
          ref={inputRef}
          style={s.input}
          placeholder={placeholder}
          placeholderTextColor={T.dim}
          value={term}
          onChangeText={(v) => { setTerm(v); setShowSugg(true); setSelectedIdx(-1); }}
          onFocus={() => { setFocused(true); if (term.length >= 2) setShowSugg(true); }}
          onBlur={() => setFocused(false)}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {/* Clear */}
        {term.length > 0 && (
          <Pressable style={s.clearBtn} onPress={() => { setTerm(''); setSuggestions([]); setShowSugg(false); }}>
            <Text style={s.clearBtnText}>✕</Text>
          </Pressable>
        )}

        {/* Submit */}
        <Pressable
          style={[s.submitBtn, !term.trim() && s.submitBtnDisabled]}
          onPress={handleSearch}
          disabled={!term.trim()}
        >
          <Text style={s.submitBtnText}>🔍</Text>
        </Pressable>
      </View>

      {/* ── Suggestions dropdown ── */}
      {showSugg && suggestions.length > 0 && (
        <View style={s.dropdown}>
          <View style={s.ddHeader}>
            <Text style={s.ddHeaderText}>
              Suggestions{selectedCat ? ` in ${selectedCat}` : ''}
            </Text>
          </View>
          <ScrollView style={s.ddList} keyboardShouldPersistTaps="handled" nestedScrollEnabled>
            {suggestions.map((item, index) => renderSugg({ item, index }))}
          </ScrollView>
          <Pressable style={s.ddFooter} onPress={handleSearch}>
            <Text style={s.viewAllText}>🔍 View all results for "{term}"</Text>
          </Pressable>
        </View>
      )}

      {/* ── No results ── */}
      {showSugg && term.length >= 2 && suggestions.length === 0 && !categoriesLoading && (
        <View style={s.dropdown}>
          <View style={s.noResults}>
            <Text style={s.noResultsIcon}>🔍</Text>
            <Text style={s.noResultsText}>No products found for "{term}"</Text>
            {selectedCat ? <Text style={s.noResultsSub}>in {selectedCat}</Text> : null}
            <Text style={s.noResultsSub}>Try different keywords</Text>
          </View>
        </View>
      )}

      {/* ── Category picker Modal ── */}
      <Modal
        visible={catModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCatModalOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setCatModalOpen(false)}>
          <View style={s.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={s.modalSheet}>
                <View style={s.modalHeader}>
                  <Text style={s.modalTitle}>Category</Text>
                  <Pressable onPress={() => setCatModalOpen(false)}>
                    <Text style={s.modalClose}>✕</Text>
                  </Pressable>
                </View>
                <ScrollView>
                  <Pressable style={s.catOption} onPress={() => selectCategory(null)}>
                    <Text style={[s.catOptionText, !selectedCatId && { color: T.red }]}>
                      All Categories
                    </Text>
                  </Pressable>
                  {categories.map((cat) => (
                    <Pressable
                      key={cat._id || cat.id}
                      style={s.catOption}
                      onPress={() => selectCategory(cat)}
                    >
                      <Text style={[s.catOptionText, selectedCatId === (cat._id || cat.id) && { color: T.red }]}>
                        {cat.title}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default SearchBar;

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  wrap: { position: 'relative', width: '100%' },

  // Form row
  form: {
    flexDirection:   'row',
    height:           44,
    backgroundColor: T.dark2,
    borderWidth:      1,
    borderColor:     T.border,
    alignItems:      'center',
  },
  formFocused: { borderColor: 'rgba(230,57,70,0.5)' },

  // Category button
  catBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    paddingHorizontal: 10,
    height:           '100%',
    borderRightWidth:  1,
    borderRightColor: T.border,
    backgroundColor: T.dark3,
    maxWidth:         120,
  },
  catBtnText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      1,
    textTransform:     'uppercase',
    color:             T.mid,
    flex:               1,
    includeFontPadding: false,
  },
  catArrow: { color: T.dim, fontSize: 8, marginLeft: 4 },

  // Text input
  input: {
    flex:              1,
    color:             T.hi,
    fontFamily:       'SpaceMono_400Regular',
    fontSize:          12,
    paddingHorizontal: 12,
    height:            '100%',
    includeFontPadding: false,
  },

  // Clear button
  clearBtn: {
    width:           34,
    height:          '100%',
    alignItems:      'center',
    justifyContent:  'center',
    borderLeftWidth:  1,
    borderLeftColor: T.border,
  },
  clearBtnText: { color: T.dim, fontSize: 12 },

  // Submit button
  submitBtn: {
    width:           46,
    height:          '100%',
    backgroundColor: T.red,
    alignItems:      'center',
    justifyContent:  'center',
  },
  submitBtnDisabled: { opacity: 0.35 },
  submitBtnText: { fontSize: 16 },

  // Dropdown
  dropdown: {
    position:        'absolute',
    top:              52,
    left:             0,
    right:            0,
    backgroundColor: T.dark1,
    borderWidth:      1,
    borderColor:     T.border,
    borderTopWidth:   2,
    borderTopColor:  T.red,
    zIndex:           9999,
    elevation:        20,
    maxHeight:        360,
  },
  ddHeader: {
    paddingVertical:   8,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  ddHeaderText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    letterSpacing:      2.2,
    textTransform:     'uppercase',
    color:             T.dim,
    includeFontPadding: false,
  },
  ddList: { maxHeight: 260 },

  // Suggestion row
  suggRow: {
    flexDirection:    'row',
    alignItems:       'center',
    gap:               12,
    paddingVertical:   10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  suggRowSelected: { backgroundColor: T.dark2 },
  suggImg: {
    width:           44,
    height:          44,
    borderWidth:      1,
    borderColor:     T.border,
    backgroundColor: T.dark3,
  },
  suggImgPlaceholder: {
    width:           44,
    height:          44,
    backgroundColor: T.dark3,
    borderWidth:      1,
    borderColor:     T.border,
    alignItems:      'center',
    justifyContent:  'center',
  },
  suggInfo: { flex: 1, minWidth: 0 },
  suggName: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           12,
    color:             T.hi,
    marginBottom:       2,
    includeFontPadding: false,
  },
  suggCat: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           9,
    letterSpacing:      1.3,
    textTransform:     'uppercase',
    color:             T.dim,
    includeFontPadding: false,
  },
  suggPrice: {
    fontFamily:        'Anton_400Regular',
    fontSize:           15,
    color:             T.red,
    includeFontPadding: false,
  },

  // Footer "view all"
  ddFooter: {
    paddingVertical:   10,
    paddingHorizontal: 14,
    borderTopWidth:     1,
    borderTopColor:    T.border,
  },
  viewAllText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           11,
    letterSpacing:      1.3,
    textTransform:     'uppercase',
    color:             T.red,
    includeFontPadding: false,
  },

  // No results
  noResults: {
    paddingVertical:   32,
    paddingHorizontal: 16,
    alignItems:        'center',
  },
  noResultsIcon:  { fontSize: 32, marginBottom: 8 },
  noResultsText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           12,
    color:             T.mid,
    textAlign:         'center',
    marginBottom:       4,
    includeFontPadding: false,
  },
  noResultsSub: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           10,
    color:             T.dim,
    textAlign:         'center',
    marginTop:          4,
    includeFontPadding: false,
  },

  // Category modal
  modalOverlay: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent:  'flex-end',
  },
  modalSheet: {
    backgroundColor: T.dark1,
    borderTopWidth:   1,
    borderTopColor:  T.border,
    maxHeight:        '60%',
  },
  modalHeader: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    paddingHorizontal: 20,
    paddingVertical:   14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  modalTitle: {
    fontFamily:        'Anton_400Regular',
    fontSize:           18,
    textTransform:     'uppercase',
    color:             T.white,
    includeFontPadding: false,
  },
  modalClose: { color: T.mid, fontSize: 18 },
  catOption: {
    paddingHorizontal: 20,
    paddingVertical:   14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  catOptionText: {
    fontFamily:        'SpaceMono_400Regular',
    fontSize:           12,
    letterSpacing:      1.3,
    textTransform:     'uppercase',
    color:             T.mid,
    includeFontPadding: false,
  },
});