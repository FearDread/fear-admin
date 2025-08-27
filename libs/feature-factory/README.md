# Redux Factory Suite

A comprehensive collection of factory utilities for Redux applications, providing standardized patterns for creating slices, async thunks, state management, and caching. This suite eliminates boilerplate code and enforces consistent patterns across your Redux application.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Core Components](#core-components)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [Contributing](#contributing)

## Overview

The Redux Factory Suite consists of five main components:

1. **FeatureFactory** - Creates complete Redux features with slices, async actions, and reducers
2. **ThunkFactory** - Generates standardized async thunks for API operations
3. **StateFactory** - Creates comprehensive initial state structures
4. **CacheFactory** - Provides browser storage utilities with fallback support
5. **ApiFactory** - Creates RTK Query APIs with standardized CRUD operations and caching

## Installation

```bash
npm install @feardread/feature-factory
# The factory utilities are included in your project source
```

dependencies:
```bash
npm install @reduxjs/toolkit react-redux
```

## Core Components

### FeatureFactory

Creates complete Redux features with standardized structure including slices, async actions, and reducers.

```javascript
import { FeatureFactory } from './FeatureFactory';

const userFeature = FeatureFactory('users', {
  setCurrentUser: (state, action) => {
    state.currentUser = action.payload;
  }
});

const { slice, asyncActions } = userFeature.create();
```

### ThunkFactory

Factory for creating Redux async thunks with standardized patterns for HTTP operations.

```javascript
import ThunkFactory from './ThunkFactory';

// Create individual thunks
const fetchUsers = ThunkFactory.create('users', 'all');
const createUser = ThunkFactory.post('users', 'create');

// Create full CRUD suite
const userThunks = ThunkFactory.createCrud('users');
```

### StateFactory

Creates comprehensive initial state structures with optional features like pagination, filtering, and validation.

```javascript
import StateFactory from './StateFactory';

// Full-featured state
const initialState = StateFactory('users');

// Minimal state
const minimalState = StateFactory.minimal('users');

// List-optimized state
const listState = StateFactory.forList('users');
```

### CacheFactory

Browser storage utilities with automatic fallback to memory storage.

```javascript
import CacheFactory from './CacheFactory';

const cache = CacheFactory({ type: 'local', prefix: 'myapp_' });

await cache.set('user', userData);
const user = await cache.get('user');
```

### ApiFactory

Creates RTK Query APIs with standardized CRUD operations, caching, and tag invalidation.

```javascript
import ApiFactory from './ApiFactory';

// Create complete API with standard CRUD endpoints
const usersApi = ApiFactory.createComplete('users');

// Create custom API
const customApi = ApiFactory('products')
  .inject('getFeatured', {
    method: 'GET',
    url: 'products/featured',
    providesTags: ['Product']
  })
  .create();
```

## Quick Start

Here's how to create a complete feature using all components:

```javascript
import { FeatureFactory } from './FeatureFactory';
import StateFactory from './StateFactory';
import ThunkFactory from './ThunkFactory';
import ApiFactory from './ApiFactory';

// 1. Create RTK Query API (recommended for new projects)
const productsApi = ApiFactory.createComplete('products', {
  tagTypes: ['Product', 'Category']
});

// OR use traditional async thunks
// 1. Create initial state
const initialState = StateFactory.forList('products');

// 2. Create custom async actions
const customActions = {
  searchProducts: ThunkFactory.create('products', 'search'),
  getPopularProducts: ThunkFactory.custom('products', 'popular', {
    method: 'GET',
    customUrl: 'products/popular'
  })
};

// 3. Create the feature
const productFeature = FeatureFactory('products', {
  toggleFavorite: (state, action) => {
    const product = state.products.find(p => p.id === action.payload);
    if (product) {
      product.isFavorite = !product.isFavorite;
    }
  }
});

// 4. Generate slice and actions
const { slice, asyncActions } = productFeature.create({
  service: customActions,
  initialState
});

export const productReducer = slice.reducer;
export const productActions = { ...slice.actions, ...asyncActions };

// For RTK Query approach, use generated hooks:
// const { data, error, isLoading } = productsApi.useGetAllQuery();
```

## API Reference

### FeatureFactory API

#### `FeatureFactory(entity, reducers, endpoints)`

Creates a feature factory instance.

**Parameters:**
- `entity` (string): Entity name for the feature
- `reducers` (Object): Custom reducers to include in the slice
- `endpoints` (Object|null): API endpoints (currently unused)

**Returns:** Feature factory instance

#### Methods

- `create(options)`: Creates slice and async actions
- `manager(initialReducers)`: Creates dynamic reducer manager
- `inject(source, destination)`: Merges objects
- `getEntityName()`: Returns entity name
- `getAdapter()`: Returns RTK entity adapter

### ThunkFactory API

#### Static Methods

- `create(entity, prefix)`: Creates GET request thunk
- `post(entity, prefix)`: Creates POST request thunk  
- `put(entity, prefix)`: Creates PUT request thunk
- `patch(entity, prefix)`: Creates PATCH request thunk
- `delete(entity, prefix)`: Creates DELETE request thunk
- `custom(entity, prefix, options)`: Creates custom configured thunk
- `createCrud(entity)`: Creates complete CRUD thunk suite

#### Standard Operations

- `all`: GET /entity/all
- `one`: GET /entity/:id  
- `search`: GET /entity/search?params
- `create`: POST /entity/create
- `update`: PUT /entity/:id
- `patch`: PATCH /entity/:id
- `delete`: DELETE /entity/:id

### StateFactory API

#### `StateFactory(namespace, options)`

Creates comprehensive initial state.

**Parameters:**
- `namespace` (string): Entity namespace
- `options` (Object): Configuration options

**Options:**
- `includeEntityState` (boolean): Include entity-specific state
- `includePagination` (boolean): Include pagination state
- `includeFiltering` (boolean): Include filtering state  
- `includeSorting` (boolean): Include sorting state
- `includeSelection` (boolean): Include selection state
- `includeValidation` (boolean): Include validation state
- `includeMetadata` (boolean): Include metadata state
- `customFields` (Object): Custom fields to add

#### Preset Methods

- `StateFactory.minimal(namespace)`: Minimal state structure
- `StateFactory.forList(namespace)`: List/table optimized state
- `StateFactory.forForm(namespace)`: Form optimized state
- `StateFactory.forRealTime(namespace)`: Real-time data state
- `StateFactory.normalized(namespace)`: Normalized entities state
- `StateFactory.withOperations(namespace, operations)`: Custom operations tracking

### CacheFactory API

#### `CacheFactory(options)`

Creates cache instance.

**Options:**
- `type` (string): 'local' or 'session'
- `prefix` (string): Key prefix for namespacing
- `enableLogging` (boolean): Enable debug logging
- `fallbackToMemory` (boolean): Use memory storage fallback
- `maxRetries` (number): Maximum retry attempts

#### Methods

- `set(key, value)`: Store value
- `get(key, defaultValue)`: Retrieve value
- `remove(key)`: Remove value
- `clear()`: Clear all values
- `keys()`: Get all keys
- `has(key)`: Check if key exists
- `getStats()`: Get storage statistics
- `bulk.set(items)`: Set multiple items
- `bulk.get(keys)`: Get multiple items
- `bulk.remove(keys)`: Remove multiple items

### ApiFactory API

#### `ApiFactory(sliceName, options)`

Creates an RTK Query API factory instance.

**Parameters:**
- `sliceName` (string): Entity/slice name
- `options` (Object): Configuration options

**Options:**
- `tagTypes` (string[]): Cache tag types for invalidation
- `baseQuery` (Object): Custom base query configuration  
- `includeStandardEndpoints` (boolean): Include CRUD endpoints

#### Static Methods

- `createComplete(sliceName, options)`: Creates API with all standard endpoints
- `createCustom(sliceName, endpoints, options)`: Creates API with only custom endpoints
- `getStandardEndpoints()`: Returns standard endpoint configurations
- `getHttpMethods()`: Returns HTTP methods constants

#### Instance Methods

- `inject(name, config)`: Inject single endpoint
- `injectMany(endpoints)`: Inject multiple endpoints  
- `create()`: Create the final API
- `createStandard()`: Add standard CRUD endpoints
- `createBulk()`: Add bulk operation endpoints
- `createCustom(name, config)`: Add custom endpoint
- `withAuth(token)`: Create API with authentication
- `withBaseUrl(url)`: Create API with custom base URL

#### Standard Endpoints Generated

- `getAll`: GET /entity/all
- `getById`: GET /entity/:id
- `create`: POST /entity
- `update`: PUT /entity/:id  
- `patch`: PATCH /entity/:id
- `delete`: DELETE /entity/:id
- `search`: GET /entity/search

## Examples

### Complete User Management Feature

```javascript
// userFeature.js
import { FeatureFactory } from './FeatureFactory';
import StateFactory from './StateFactory';
import ThunkFactory from './ThunkFactory';

// Create state optimized for user lists
const initialState = StateFactory.forList('users');

// Create custom service actions
const userService = {
  fetchProfile: ThunkFactory.custom('users', 'profile', {
    method: 'GET',
    customUrl: 'auth/profile'
  }),
  updateProfile: ThunkFactory.put('users', 'profile'),
  changePassword: ThunkFactory.post('users', 'change-password')
};

// Create feature factory
const userFeature = FeatureFactory('users', {
  setActiveUser: (state, action) => {
    state.activeUser = action.payload;
  },
  clearUsers: (state) => {
    state.data = [];
    state.usersList = [];
  }
});

// Generate the complete feature
const { slice, asyncActions } = userFeature.create({
  service: userService,
  initialState
});

export const userReducer = slice.reducer;
export const userActions = { ...slice.actions, ...asyncActions };
```

### Using the Cache System

```javascript
// cacheService.js
import CacheFactory from './CacheFactory';

// Create application cache
const appCache = CacheFactory({
  type: 'local',
  prefix: 'myapp_',
  enableLogging: process.env.NODE_ENV === 'development'
});

// Cache service
export const cacheService = {
  async cacheUserData(userId, userData) {
    await appCache.set(`user_${userId}`, userData);
  },

  async getUserData(userId) {
    return await appCache.get(`user_${userId}`);
  },

  async clearUserCache(userId) {
    await appCache.remove(`user_${userId}`);
  },

  async cacheUserPreferences(preferences) {
    await appCache.set('user_preferences', preferences);
  }
};
```

### RTK Query API with ApiFactory

```javascript
// productsApi.js
import ApiFactory from './ApiFactory';

// Create complete API with all CRUD operations
export const productsApi = ApiFactory.createComplete('products', {
  tagTypes: ['Product', 'Category', 'Review'],
  baseQuery: {
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }
});

// Add custom endpoints
const enhancedApi = productsApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeaturedProducts: builder.query({
      query: () => 'products/featured',
      providesTags: ['Product'],
    }),
    getProductsByCategory: builder.query({
      query: (categoryId) => `products/category/${categoryId}`,
      providesTags: (result, error, categoryId) => [
        { type: 'Product', id: `CATEGORY_${categoryId}` },
      ],
    }),
    toggleProductFavorite: builder.mutation({
      query: ({ id, isFavorite }) => ({
        url: `products/${id}/favorite`,
        method: 'PATCH',
        body: { isFavorite },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
      ],
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetAllQuery,
  useGetByIdQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useGetFeaturedProductsQuery,
  useGetProductsByCategoryQuery,
  useToggleProductFavoriteMutation,
} = enhancedApi;
```

### Using ApiFactory in Components

```javascript
// ProductList.jsx
import React from 'react';
import { 
  useGetAllQuery, 
  useDeleteMutation,
  useGetFeaturedProductsQuery 
} from '../api/productsApi';

const ProductList = () => {
  const { 
    data: products = [], 
    error, 
    isLoading 
  } = useGetAllQuery();
  
  const { 
    data: featuredProducts = [] 
  } = useGetFeaturedProductsQuery();
  
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteMutation();

  const handleDelete = async (productId) => {
    try {
      await deleteProduct({ id: productId }).unwrap();
      // Success - cache automatically invalidated
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <section>
        <h2>Featured Products</h2>
        {featuredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
      
      <section>
        <h2>All Products</h2>
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product}
            onDelete={() => handleDelete(product.id)}
            isDeleting={isDeleting}
          />
        ))}
      </section>
    </div>
  );
};
```

### Advanced State Management

```javascript
// advancedState.js
import StateFactory from './StateFactory';

// Create state for a complex dashboard
const dashboardState = StateFactory('dashboard', {
  includeMetadata: true,
  includePagination: true,
  customFields: {
    widgets: [],
    layout: 'grid',
    theme: 'light',
    notifications: [],
    isFullscreen: false,
    lastRefresh: null
  }
});

// Create form state with validation
const userFormState = StateFactory.forForm('userForm');

// Create real-time chat state
const chatState = StateFactory.forRealTime('chat');
```

## Best Practices

### 1. Entity Naming
Use consistent, descriptive entity names:
```javascript
// Good
const userFeature = FeatureFactory('users');
const productFeature = FeatureFactory('products');

// Avoid
const feature1 = FeatureFactory('u');
const myFeature = FeatureFactory('thing');
```

### 2. State Organization
Choose appropriate state factories for your use case:
```javascript
// For data tables/lists
const listState = StateFactory.forList('products');

// For forms
const formState = StateFactory.forForm('userForm');

// For simple data
const minimalState = StateFactory.minimal('settings');
```

### 3. Async Actions
Use descriptive prefixes for custom actions:
```javascript
const customActions = {
  fetchUserProfile: ThunkFactory.create('users', 'profile'),
  searchActiveUsers: ThunkFactory.create('users', 'active-search'),
  bulkUpdateUsers: ThunkFactory.post('users', 'bulk-update')
};
```

### 4. Error Handling
Always handle async action states in components:
```javascript
const { data, loading, error } = useSelector(state => state.users);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

### 5. Caching Strategy
Use appropriate cache types and prefixes:
```javascript
// Session data (cleared on browser close)
const sessionCache = CacheFactory({ type: 'session' });

// Persistent data
const persistentCache = CacheFactory({ 
  type: 'local', 
  prefix: 'app_v1_' 
});
```

### 6. RTK Query vs Async Thunks
Choose the appropriate data fetching approach:

```javascript
// RTK Query - Recommended for new projects (automatic caching, background refetching)
const usersApi = ApiFactory.createComplete('users');

// Async Thunks - Better for complex business logic or existing codebases
const userFeature = FeatureFactory('users').create({
  service: ThunkFactory.createCrud('users')
});
```

### 7. API Configuration
Configure APIs with proper error handling and authentication:
```javascript
const api = ApiFactory('products', {
  baseQuery: {
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  },
  tagTypes: ['Product', 'Category']
});
```

## TypeScript Support

The factories can be used with TypeScript by defining interfaces:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

// Use with proper typing
const userFeature = FeatureFactory<UserState>('users', reducers);
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Dependencies

- `@reduxjs/toolkit` - Required for Redux functionality
- Modern browser with ES6+ support
- Node.js 14+ for development

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

For older browsers, the CacheFactory will automatically fallback to memory storage if localStorage/sessionStorage is unavailable.