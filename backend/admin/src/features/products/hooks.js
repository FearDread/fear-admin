import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';
import {
  selectProducts,
  selectCurrentProduct,
  selectLoading,
  selectError,
  selectSuccess,
  selectFilters,
  selectPagination,
  selectFilteredProducts,
  selectProductById,
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  setFilters,
  clearFilters,
  setSearchTerm,
  setPagination,
  setCurrentPage,
  clearError,
  resetState,
  markAsFresh,
  setData
} from './slice';

/**
 * Main Product Feature Hook
 * Provides all product-related state and actions
 */
export const useProductFeature = () => {
  const dispatch = useDispatch();

  // Selectors
  const products = useSelector(selectProducts);
  const currentProduct = useSelector(selectCurrentProduct);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const filters = useSelector(selectFilters);
  const pagination = useSelector(selectPagination);

  // Actions
  const actions = useMemo(() => ({
    // Fetch operations
    fetchProducts: () => dispatch(fetchProducts()),
    fetchProduct: (id) => dispatch(fetchProduct(id)),
    searchProducts: (query) => dispatch(searchProducts(query)),

    // CRUD operations
    createProduct: (data) => dispatch(createProduct(data)),
    updateProduct: (id, data) => dispatch(updateProduct({ id, data })),
    deleteProduct: (id) => dispatch(deleteProduct(id)),

    // Filter operations
    setFilters: (filters) => dispatch(setFilters(filters)),
    clearFilters: () => dispatch(clearFilters()),
    setSearchTerm: (term) => dispatch(setSearchTerm(term)),

    // Pagination operations
    setPagination: (pagination) => dispatch(setPagination(pagination)),
    setCurrentPage: (page) => dispatch(setCurrentPage(page)),

    // Utility operations
    clearError: () => dispatch(clearError()),
    resetState: () => dispatch(resetState()),
    markAsFresh: () => dispatch(markAsFresh()),
    setProducts: (products) => dispatch(setData(products))
  }), [dispatch]);

  return {
    // State
    products,
    currentProduct,
    loading,
    error,
    success,
    filters,
    pagination,
    // Actions
    ...actions
  };
};

/**
 * Hook for filtered products
 * Returns products based on current filters
 */
export const useFilteredProducts = () => {
  const filteredProducts = useSelector(selectFilteredProducts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  return { products: filteredProducts, loading, error };
};

/**
 * Hook for a single product by ID
 * Automatically fetches if not in store
 */
export const useProduct = (productId) => {
  const dispatch = useDispatch();
  const product = useSelector(state => selectProductById(state, productId));
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    if (productId && !product && !loading) {
      dispatch(fetchProduct(productId));
    }
  }, [productId, product, loading, dispatch]);

  const updateProduct = useCallback(
    (data) => dispatch(updateProduct({ id: productId, data })),
    [productId, dispatch]
  );

  const deleteProduct = useCallback(
    () => dispatch(deleteProduct(productId)),
    [productId, dispatch]
  );

  return {
    product,
    loading,
    error,
    updateProduct,
    deleteProduct
  };
};

/**
 * Hook for product categories
 */
export const useProductCategories = () => {
 // const categories = useSelector(selectCategories);
  const loading = useSelector(selectLoading);

  return { categories, loading };
};

/**
 * Hook for product search
 */
export const useProductSearch = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const filteredProducts = useSelector(selectFilteredProducts);
  const loading = useSelector(selectLoading);

  const setSearch = useCallback(
    (searchTerm) => {
      dispatch(setFilters({ ...filters, searchTerm }));
    },
    [filters, dispatch]
  );

  const clearSearch = useCallback(
    () => {
      dispatch(setFilters({ ...filters, searchTerm: '' }));
    },
    [filters, dispatch]
  );

  return {
    searchTerm: filters?.searchTerm || '',
    results: filteredProducts,
    loading,
    setSearch,
    clearSearch
  };
};

/**
 * Hook for product pagination
 */
export const useProductPagination = () => {
  const dispatch = useDispatch();
  const pagination = useSelector(selectPagination);
  const products = useSelector(selectFilteredProducts);

  const paginatedProducts = useMemo(() => {
    if (!pagination || !products) return products;

    const { currentPage, pageSize } = pagination;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return products.slice(startIndex, endIndex);
  }, [products, pagination]);

  const goToPage = useCallback(
    (page) => {
      dispatch(setCurrentPage(page));
    },
    [dispatch]
  );

  const nextPage = useCallback(() => {
    if (pagination && pagination.currentPage < pagination.totalPages) {
      dispatch(setCurrentPage(pagination.currentPage + 1));
    }
  }, [pagination, dispatch]);

  const previousPage = useCallback(() => {
    if (pagination && pagination.currentPage > 1) {
      dispatch(setCurrentPage(pagination.currentPage - 1));
    }
  }, [pagination, dispatch]);

  return {
    products: paginatedProducts,
    pagination,
    goToPage,
    nextPage,
    previousPage
  };
};

/**
 * Hook for product cache management
 * Automatically refetches stale data
 */
export const useProductCache = (options = {}) => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectLoading);

  const { autoRefresh = true, refetchInterval = null } = options;

  useEffect(() => {
    if (autoRefresh && !loading) {
      dispatch(fetchProducts());
    }
  }, [autoRefresh, loading, dispatch]);

  useEffect(() => {
    if (refetchInterval) {
      const interval = setInterval(() => {
        dispatch(fetchProducts());
      }, refetchInterval);

      return () => clearInterval(interval);
    }
  }, [refetchInterval, dispatch]);

  const refresh = useCallback(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const markFresh = useCallback(() => {
    dispatch(markAsFresh());
  }, [dispatch]);

  return {
    products,
    loading,
    refresh,
    markFresh
  };
};

export const useOptimisticProduct = (productId) => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const [optimisticProducts, setOptimisticProducts] = useState(products);

  useEffect(() => {
    setOptimisticProducts(products);
  }, [products]);

  const updateOptimistic = useCallback(
    async (updates) => {
      // Optimistically update UI
      const updatedProducts = optimisticProducts.map(p =>
        p._id === productId ? { ...p, ...updates } : p
      );
      setOptimisticProducts(updatedProducts);

      try {
        // Perform actual update
        await dispatch(updateProduct({ id: productId, data: updates })).unwrap();
      } catch (error) {
        // Revert on error
        setOptimisticProducts(products);
        throw error;
      }
    },
    [productId, optimisticProducts, products, dispatch]
  );

  return {
    products: optimisticProducts,
    updateOptimistic
  };
};