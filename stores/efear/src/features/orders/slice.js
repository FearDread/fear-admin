// features/orders/orderSlice.js
import { FeatureFactory } from '@feardread/feature-factory';
import OrderService from './service';

const orderReducers = {
  // Set current order being viewed/edited
  setCurrentOrder: (state, action) => {
    state.currentOrder = action.payload;
  },
  
  // Clear current order
  clearCurrentOrder: (state) => {
    state.currentOrder = null;
  },
  
  // Update order status
  updateOrderStatus: (state, action) => {
    const { orderId, status } = action.payload;
    const order = state.entities[orderId];
    
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
    }
    
    if (state.currentOrder?.id === orderId) {
      state.currentOrder.status = status;
      state.currentOrder.updatedAt = new Date().toISOString();
    }
  },
  
  // Add tracking info
  addTrackingInfo: (state, action) => {
    const { orderId, trackingNumber, carrier } = action.payload;
    const order = state.entities[orderId];
    
    if (order) {
      order.trackingNumber = trackingNumber;
      order.carrier = carrier;
      order.shippedAt = new Date().toISOString();
    }
    
    if (state.currentOrder?.id === orderId) {
      state.currentOrder.trackingNumber = trackingNumber;
      state.currentOrder.carrier = carrier;
      state.currentOrder.shippedAt = new Date().toISOString();
    }
  },
  
  // Set filter criteria
  setOrderFilters: (state, action) => {
    state.filters = { ...state.filters, ...action.payload };
  },
  
  // Clear filters
  clearOrderFilters: (state) => {
    state.filters = {
      status: null,
      dateFrom: null,
      dateTo: null,
      minAmount: null,
      maxAmount: null,
    };
  },
  
  // Set order statistics
  setOrderStats: (state, action) => {
    state.statistics = action.payload;
  },
  
  // Add order note
  addOrderNote: (state, action) => {
    const { orderId, note } = action.payload;
    const order = state.entities[orderId];
    
    if (order) {
      if (!order.notes) {
        order.notes = [];
      }
      order.notes.push({
        id: Date.now().toString(),
        text: note,
        createdAt: new Date().toISOString(),
      });
    }
    
    if (state.currentOrder?.id === orderId) {
      if (!state.currentOrder.notes) {
        state.currentOrder.notes = [];
      }
      state.currentOrder.notes.push({
        id: Date.now().toString(),
        text: note,
        createdAt: new Date().toISOString(),
      });
    }
  },
  
  // Set recent orders
  setRecentOrders: (state, action) => {
    state.recentOrders = action.payload;
  },
};


const orderFactory = FeatureFactory('order', orderReducers);

export const { slice, asyncActions: Order } = orderFactory.create({
  service: OrderService,
  stateOptions: {
    includeEntityState: true,
    includeMetadata: true,
    customFields: {
      currentOrder: null,
      recentOrders: [],
      filters: {
        status: null,
        dateFrom: null,
        dateTo: null,
        minAmount: null,
        maxAmount: null,
      },
      statistics: {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingCount: 0,
        shippedCount: 0,
        deliveredCount: 0,
        cancelledCount: 0,
      },
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
  // Custom order reducers
  setCurrentOrder,
  clearCurrentOrder,
  updateOrderStatus,
  addTrackingInfo,
  setOrderFilters,
  clearOrderFilters,
  setOrderStats,
  addOrderNote,
  setRecentOrders,
} = slice.actions;

// Export async actions from factory
export const {
  fetch: fetchOrders,
  fetchOne: fetchOrder,
  search: searchOrders,
  create: createOrder,
  update: updateOrder,
  patch: patchOrder,
} = Order;

// Enhanced thunk to create order from cart
export const createOrderFromCart = (orderData) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const state = getState();
    const cartItems = state.cart?.items || [];
    const cartTotal = state.cart?.total || 0;
    
    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }
    
    // Prepare order payload
    const payload = {
      ...orderData,
      items: cartItems,
      subtotal: state.cart.subtotal,
      shipping: state.cart.shipping,
      discount: state.cart.discount,
      total: cartTotal,
      status: 'pending',
      orderDate: new Date().toISOString(),
    };
    
    const result = await dispatch(createOrder(payload));
    
    if (createOrder.fulfilled.match(result)) {
      const order = result.payload.data;
      
      // Set as current order
      dispatch(setCurrentOrder(order));
      
      // Clear the cart (assuming you have this action)
      // dispatch(clearCart());
      
      return { success: true, order };
    } else {
      throw new Error(result.error?.message || 'Order creation failed');
    }
  } catch (error) {
    dispatch(setError(error.message));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

// Fetch orders with filters
export const fetchOrdersWithFilters = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const state = getState();
    const filters = state.orders.filters;
    
    // Build query params from filters
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;
    if (filters.minAmount) params.minAmount = filters.minAmount;
    if (filters.maxAmount) params.maxAmount = filters.maxAmount;
    
    const result = await dispatch(fetchOrders(params));
    
    if (fetchOrders.fulfilled.match(result)) {
      return { success: true, orders: result.payload.data };
    } else {
      throw new Error(result.error?.message || 'Failed to fetch orders');
    }
  } catch (error) {
    dispatch(setError(error.message));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

// Cancel order
export const cancelOrder = (orderId, reason) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const result = await dispatch(patchOrder({
      id: orderId,
      status: 'cancelled',
      cancellationReason: reason,
      cancelledAt: new Date().toISOString(),
    }));
    
    if (patchOrder.fulfilled.match(result)) {
      dispatch(updateOrderStatus({ orderId, status: 'cancelled' }));
      return { success: true };
    } else {
      throw new Error(result.error?.message || 'Failed to cancel order');
    }
  } catch (error) {
    dispatch(setError(error.message));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

// Update order with tracking
export const updateOrderTracking = (orderId, trackingInfo) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    const result = await dispatch(patchOrder({
      id: orderId,
      ...trackingInfo,
      status: 'shipped',
    }));
    
    if (patchOrder.fulfilled.match(result)) {
      dispatch(addTrackingInfo({ orderId, ...trackingInfo }));
      dispatch(updateOrderStatus({ orderId, status: 'shipped' }));
      return { success: true };
    } else {
      throw new Error(result.error?.message || 'Failed to update tracking');
    }
  } catch (error) {
    dispatch(setError(error.message));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

// Fetch recent orders for current user
export const fetchRecentOrders = (limit = 5) => async (dispatch) => {
  try {
    const result = await dispatch(fetchOrders({ limit, sort: '-orderDate' }));
    
    if (fetchOrders.fulfilled.match(result)) {
      dispatch(setRecentOrders(result.payload.data));
      return { success: true, orders: result.payload.data };
    } else {
      throw new Error(result.error?.message || 'Failed to fetch recent orders');
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Export selectors
export const selectAllOrders = (state) => Object.values(state.orders.entities || {});
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectRecentOrders = (state) => state.orders.recentOrders;
export const selectOrderById = (state, orderId) => state.orders.entities?.[orderId];
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;
export const selectOrdersSuccess = (state) => state.orders.success;
export const selectOrderFilters = (state) => state.orders.filters;
export const selectOrderStatistics = (state) => state.orders.statistics;

export const selectOrdersByStatus = (state, status) => {
  return Object.values(state.orders.entities || {}).filter(
    order => order.status === status
  );
};

export const selectPendingOrders = (state) => selectOrdersByStatus(state, 'pending');
export const selectShippedOrders = (state) => selectOrdersByStatus(state, 'shipped');
export const selectDeliveredOrders = (state) => selectOrdersByStatus(state, 'delivered');

export const selectTotalOrderValue = (state) => {
  return Object.values(state.orders.entities || {}).reduce(
    (sum, order) => sum + (order.total || 0),
    0
  );
};

export default slice;