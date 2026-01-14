// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import logger from 'redux-logger';
// Import reducers
import user, { restoreUser } from './user/slice';
import product from './products/slice';


export const initializeStore = () => {

  const store = configureStore({
      reducer: {
    users: user.reducer,
    products: product.reducer,
    /* Add other reducers here
      addresses: address.reducer,
      orders: order.reducer,
      payments: payment.reducer,
      products: product.reducer,
      categories: category.reducer,
      brands: brand.reducer,
      users: user.reducer,
      cart: cart.reducer,
      wishlist: wishlist.reducer,
      mail: mail.reducer,
      */
  },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['users/restoreUser'],
        },
      }).concat(logger),
  });

  // Restore user session from storage
  const storedAuth = Storage.load();
  if (storedAuth) {
    store.dispatch(restoreUser(storedAuth));
    console.log('User session restored from storage');
  }

  return store;
};

export const store = initializeStore();

export default store;

// ========================================
// index.js - Store Provider Setup
// ========================================

/*
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './store/store';
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
*/


// ========================================
// Example Usage in Components
// ========================================

/*
// In ProductList.jsx
import { useProductFeature } from 'features/product/productHooks';

function ProductList() {
  const {
    products,
    loading,
    error,
    fetchProducts,
    deleteProduct,
    setFilters,
    clearError
  } = useProductFeature();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    // Your component JSX
  );
}

// In ProductEdit.jsx
import { useProduct } from 'features/product/productHooks';

function ProductEdit({ productId }) {
  const {
    product,
    loading,
    error,
    updateProduct,
    deleteProduct
  } = useProduct(productId);

  const handleSubmit = async (formData) => {
    try {
      await updateProduct(formData);
      // Handle success
    } catch (err) {
      // Handle error
    }
  };

  return (
    // Your component JSX
  );
}

// With search functionality
import { useProductSearch } from 'features/product/productHooks';

function ProductSearch() {
  const {
    searchTerm,
    results,
    loading,
    setSearch,
    clearSearch
  } = useProductSearch();

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
      />
      {results.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

// With pagination
import { useProductPagination } from 'features/product/productHooks';

function ProductListPaginated() {
  const {
    products,
    pagination,
    goToPage,
    nextPage,
    previousPage
  } = useProductPagination();

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
      
      <Pagination
        current={pagination.currentPage}
        total={pagination.totalPages}
        onPageChange={goToPage}
        onNext={nextPage}
        onPrevious={previousPage}
      />
    </div>
  );
}
*/