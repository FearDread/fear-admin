// features/Payments/slice.js
import { FeatureFactory } from '@feardread/feature-factory';
//import Paymentservice from './service';


const PaymentsFactory = FeatureFactory('payment', {
      // Set default payment method
  setDefaultPayments: (state, action) => {
    const PaymentsId = action.payload;

    Object.values(state.entities || {}).forEach(method => {
      method.isDefault = false;
    });
    // Set new default
    const method = state.entities[PaymentsId];
    if (method) {
      method.isDefault = true;
    }
  },
  addPaymentsToState: (state, action) => {
    const method = action.payload;
    state.entities[method.id] = method;
    state.ids.push(method.id);
  },
  removePaymentsFromState: (state, action) => {
    const methodId = action.payload;
    delete state.entities[methodId];
    state.ids = state.ids.filter(id => id !== methodId);
  },
  updatePaymentsExpiry: (state, action) => {
    const { methodId, expiryMonth, expiryYear } = action.payload;
    const method = state.entities[methodId];
    
    if (method) {
      method.expiryMonth = expiryMonth;
      method.expiryYear = expiryYear;
      method.updatedAt = new Date().toISOString();
    }
  },
  setVerificationStatus: (state, action) => {
    const { methodId, verified } = action.payload;
    const method = state.entities[methodId];
    
    if (method) {
      method.verified = verified;
      method.verifiedAt = verified ? new Date().toISOString() : null;
    }
  }
});

export const { slice, asyncActions: Payments } = PaymentsFactory.create({
  stateOptions: {
    includeEntityState: true,
    includeMetadata: true,
    customFields: {
      defaultMethodId: null,
    },
  },
  includeCommonReducers: true,
});

// Export all actions
export const {
  // Common reducers
  setData,
  setLoading,
  setSuccess,
  setError,
  clearError,
  resetState,
  updateMetadata,
  // Custom payment method reducers
  setDefaultPayments,
  addPaymentsToState,
  removePaymentsFromState,
  updatePaymentsExpiry,
  setVerificationStatus,
} = slice.actions;

// Export async actions from factory
export const {
  fetch: fetchPayments,
  fetchOne: fetchPayment,
  create: createPayments,
  update: updatePayments,
  patch: patchPayments,
  delete: deletePayments,
} = Payments;

// Enhanced thunk to add payment method
export const addPayments = (paymentData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const result = await dispatch(createPayments(paymentData));
    
    if (createPayments.fulfilled.match(result)) {
      const method = result.payload.data;
      
      // If this is the first payment method, make it default
      const state = result.payload.state;
      const methodCount = Object.keys(state?.Payments?.entities || {}).length;
      
      if (methodCount === 1 || paymentData.makeDefault) {
        await dispatch(setDefaultMethod(method.id));
      }
      
      return { success: true, method };
    } else {
      throw new Error(result.error?.message || 'Failed to add payment method');
    }
  } catch (error) {
    dispatch(setError(error.message));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

// Enhanced thunk to delete payment method
export const removePayments = (methodId) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const state = getState();
    const method = state.Payments.entities[methodId];
    
    // Prevent deletion of default method if other methods exist
    if (method?.isDefault) {
      const otherMethods = Object.values(state.Payments.entities).filter(
        m => m.id !== methodId
      );
      
      if (otherMethods.length > 0) {
        const error = 'Cannot delete default payment method. Please set another method as default first.';
        dispatch(setError(error));
        return { success: false, error };
      }
    }
    
    const result = await dispatch(deletePayments(methodId));
    
    if (deletePayments.fulfilled.match(result)) {
      dispatch(removePaymentsFromState(methodId));
      return { success: true };
    } else {
      throw new Error(result.error?.message || 'Failed to delete payment method');
    }
  } catch (error) {
    dispatch(setError(error.message));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

// Set default payment method
export const setDefaultMethod = (methodId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const result = await dispatch(patchPayments({
      id: methodId,
      isDefault: true,
    }));
    
    if (patchPayments.fulfilled.match(result)) {
      dispatch(setDefaultPayments(methodId));
      return { success: true };
    } else {
      throw new Error(result.error?.message || 'Failed to set default method');
    }
  } catch (error) {
    dispatch(setError(error.message));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

// Update payment method details
export const updatePaymentsDetails = (methodId, updates) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const result = await dispatch(patchPayments({
      id: methodId,
      ...updates,
    }));
    
    if (patchPayments.fulfilled.match(result)) {
      if (updates.expiryMonth && updates.expiryYear) {
        dispatch(updatePaymentsExpiry({
          methodId,
          expiryMonth: updates.expiryMonth,
          expiryYear: updates.expiryYear,
        }));
      }
      return { success: true };
    } else {
      throw new Error(result.error?.message || 'Failed to update payment method');
    }
  } catch (error) {
    dispatch(setError(error.message));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

// Verify payment method
export const verifyPayments = (methodId, verificationData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    // Call verification endpoint
    const result = await dispatch(patchPayments({
      id: methodId,
      action: 'verify',
      ...verificationData,
    }));
    
    if (patchPayments.fulfilled.match(result)) {
      dispatch(setVerificationStatus({ methodId, verified: true }));
      return { success: true };
    } else {
      throw new Error(result.error?.message || 'Verification failed');
    }
  } catch (error) {
    dispatch(setError(error.message));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

// Export selectors
export const selectAllPayments = (state) => 
  Object.values(state.Payments.entities || {});

export const selectPaymentsById = (state, methodId) => 
  state.Payments.entities?.[methodId];

export const selectDefaultPayments = (state) => {
  const methods = Object.values(state.Payments.entities || {});
  return methods.find(method => method.isDefault);
};

export const selectPaymentsLoading = (state) => 
  state.Payments.loading;

export const selectPaymentsError = (state) => 
  state.Payments.error;

export const selectPaymentsSuccess = (state) => 
  state.Payments.success;

export const selectPaymentsByType = (state, type) => {
  const methods = Object.values(state.Payments.entities || {});
  return methods.filter(method => method.type === type);
};

export const selectVerifiedPayments = (state) => {
  const methods = Object.values(state.Payments.entities || {});
  return methods.filter(method => method.verified);
};

export const selectExpiredPayments = (state) => {
  const methods = Object.values(state.Payments.entities || {});
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  return methods.filter(method => {
    if (!method.expiryYear || !method.expiryMonth) return false;
    
    const expYear = parseInt(method.expiryYear);
    const expMonth = parseInt(method.expiryMonth);
    
    return expYear < currentYear || 
           (expYear === currentYear && expMonth < currentMonth);
  });
};

export const selectPaymentsCount = (state) => 
  Object.keys(state.Payments.entities || {}).length;

export default slice;