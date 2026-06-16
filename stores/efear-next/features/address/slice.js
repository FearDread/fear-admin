import { FeatureFactory } from '@feardread/feature-factory';

// Create Address Feature with FeatureFactory
const addressFactory = FeatureFactory('address', {
  addAddress: (state, action) => {
    const newAddress = {
      id: Date.now().toString(),
      ...action.payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    state.data.push(newAddress);
    
    // If this is the first address or marked as default, set it as default
    if (state.data.length === 1 || newAddress.isDefault) {
      state.defaultAddressId = newAddress.id;
      // Unset other defaults
      state.data.forEach(addr => {
        if (addr.id !== newAddress.id) {
          addr.isDefault = false;
        }
      });
    }
    
    state.success = true;
    state.error = null;
  },
  updateAddress: (state, action) => {
    const { id, updates } = action.payload;
    const addressIndex = state.data.findIndex(addr => addr.id === id);
    
    if (addressIndex !== -1) {
      state.data[addressIndex] = {
        ...state.data[addressIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      // Handle default address change
      if (updates.isDefault) {
        state.defaultAddressId = id;
        state.data.forEach((addr, idx) => {
          if (idx !== addressIndex) {
            addr.isDefault = false;
          }
        });
      }
      
      state.success = true;
      state.error = null;
    } else {
      state.error = 'Address not found';
    }
  },
  removeAddress: (state, action) => {
    const id = action.payload;
    const addressIndex = state.data.findIndex(addr => addr.id === id);
    
    if (addressIndex !== -1) {
      const wasDefault = state.data[addressIndex].isDefault;
      state.data.splice(addressIndex, 1);
      
      // If removed address was default, set first remaining as default
      if (wasDefault && state.data.length > 0) {
        state.data[0].isDefault = true;
        state.defaultAddressId = state.data[0].id;
      } else if (state.data.length === 0) {
        state.defaultAddressId = null;
      }
      
      state.success = true;
      state.error = null;
    }
  },
  setDefaultAddress: (state, action) => {
    const id = action.payload;
    let found = false;
    
    state.data.forEach(addr => {
      if (addr.id === id) {
        addr.isDefault = true;
        found = true;
      } else {
        addr.isDefault = false;
      }
    });
    
    if (found) {
      state.defaultAddressId = id;
      state.success = true;
      state.error = null;
    } else {
      state.error = 'Address not found';
    }
  },
  validateAddress: (state, action) => {
    state.validation = {
      isValid: true,
      errors: {}
    };
    
    const address = action.payload;
    const errors = {};
    
    if (!address.fullName || address.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
      state.validation.isValid = false;
    }
    
    if (!address.addressLine1 || address.addressLine1.trim().length < 5) {
      errors.addressLine1 = 'Address must be at least 5 characters';
      state.validation.isValid = false;
    }
    
    if (!address.city || address.city.trim().length < 2) {
      errors.city = 'City is required';
      state.validation.isValid = false;
    }
    
    if (!address.state || address.state.trim().length < 2) {
      errors.state = 'State is required';
      state.validation.isValid = false;
    }
    
    if (!address.zipCode || !/^\d{5}(-\d{4})?$/.test(address.zipCode)) {
      errors.zipCode = 'Invalid ZIP code format';
      state.validation.isValid = false;
    }
    
    if (!address.country || address.country.trim().length < 2) {
      errors.country = 'Country is required';
      state.validation.isValid = false;
    }
    
    if (address.phone && !/^[\d\s\-\+\(\)]{10,}$/.test(address.phone)) {
      errors.phone = 'Invalid phone number format';
      state.validation.isValid = false;
    }
    
    state.validation.errors = errors;
  },
  clearValidation: (state) => {
    state.validation = {
      isValid: true,
      errors: {}
    };
  }
}, {
  includeEntityState: true,
  includePagination: false,
  includeFiltering: true,
  includeSorting: true,
  includeSelection: false,
  includeValidation: true,
  includeMetadata: true,
  customFields: {
    defaultAddressId: null,
    searchResults: [],
    addressTypes: ['home', 'work', 'billing', 'shipping', 'other']
  }
});

// Create the slice
const { slice, asyncActions: Address } = addressFactory.create();

// Export actions and reducer
export const {
  addAddress,
  removeAddress,
  setDefaultAddress,
  validateAddress,
  clearValidation,
  setData,
  setError,
  setLoading
} = slice.actions;

// Export async actions
export const {
  fetch: fetchAddresses,
  fetchOne: fetchAddress,
  new: createNewAddress,
  create: createAddress,
  update: updateAddress,
  patch: patchAddress,
} = Address;

// Selectors
export const selectAllAddresses = (state) => state.addresses?.data || [];
export const selectDefaultAddress = (state) => {
  let addresses = state.addresses?.data || [];
  return addresses.find(addr => addr.id === state.address?.defaultAddressId);
};
export const selectAddressById = (state, id) => {
  let addresses = state.addresses?.data || [];
  return addresses.find(addr => addr.id === id);
};
export const selectAddressesByType = (state, type) => {
  let addresses = state.addresses?.data || [];
  addresses = addresses.filter(addr => addr.type === type);
  return addresses;
};
export const selectSearchResults = (state) => state.addresses?.searchResults || [];
export const selectAddressValidation = (state) => state.addresses?.validation || { isValid: true, errors: {} };


export default slice;