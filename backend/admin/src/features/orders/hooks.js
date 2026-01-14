// features/orders/orderHooks.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';
import {
  fetchOrders,
  fetchOrder,
  createOrder,
  updateOrder,
  patchOrder,
  cancelOrder,
  updateOrderTracking,
  fetchRecentOrders,
  fetchOrdersWithFilters,
  createOrderFromCart,
  setCurrentOrder,
  clearCurrentOrder,
  updateOrderStatus,
  addTrackingInfo,
  setOrderFilters,
  clearOrderFilters,
  setOrderStats,
  addOrderNote,
  clearError,
  resetState,
  selectAllOrders,
  selectCurrentOrder,
  selectRecentOrders,
  selectOrderById,
  selectOrdersLoading,
  selectOrdersError,
  selectOrdersSuccess,
  selectOrderFilters,
  selectOrderStatistics,
  selectOrdersByStatus,
  selectPendingOrders,
  selectShippedOrders,
  selectDeliveredOrders,
  selectTotalOrderValue,
} from './slice';

/**
 * Main Order Feature Hook
 * Provides all order-related state and actions
 */
export const useOrderFeature = () => {
  const dispatch = useDispatch();

  // Selectors
  const orders = useSelector(selectAllOrders);
  const currentOrder = useSelector(selectCurrentOrder);
  const recentOrders = useSelector(selectRecentOrders);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const success = useSelector(selectOrdersSuccess);
  const filters = useSelector(selectOrderFilters);
  const statistics = useSelector(selectOrderStatistics);
  const pendingOrders = useSelector(selectPendingOrders);
  const shippedOrders = useSelector(selectShippedOrders);
  const deliveredOrders = useSelector(selectDeliveredOrders);
  const totalOrderValue = useSelector(selectTotalOrderValue);

  // Actions
  const actions = useMemo(() => ({
    // Fetch operations
    fetchOrders: () => dispatch(fetchOrders()),
    fetchOrder: (id) => dispatch(fetchOrder(id)),
    fetchOrdersWithFilters: () => dispatch(fetchOrdersWithFilters()),
    fetchRecentOrders: (limit) => dispatch(fetchRecentOrders(limit)),

    // CRUD operations
    createOrder: (data) => dispatch(createOrder(data)),
    updateOrder: (id, data) => dispatch(updateOrder({ id, data })),
    patchOrder: (data) => dispatch(patchOrder(data)),
    
    // Specialized operations
    cancelOrder: (orderId, reason) => dispatch(cancelOrder(orderId, reason)),
    updateOrderTracking: (orderId, trackingInfo) => 
      dispatch(updateOrderTracking(orderId, trackingInfo)),
    createOrderFromCart: (orderData) => dispatch(createOrderFromCart(orderData)),

    // Order management
    setCurrentOrder: (order) => dispatch(setCurrentOrder(order)),
    clearCurrentOrder: () => dispatch(clearCurrentOrder()),
    updateOrderStatus: (orderId, status) => 
      dispatch(updateOrderStatus({ orderId, status })),
    addTrackingInfo: (orderId, trackingNumber, carrier) => 
      dispatch(addTrackingInfo({ orderId, trackingNumber, carrier })),
    addOrderNote: (orderId, note) => dispatch(addOrderNote({ orderId, note })),

    // Filter operations
    setOrderFilters: (filters) => dispatch(setOrderFilters(filters)),
    clearOrderFilters: () => dispatch(clearOrderFilters()),

    // Statistics
    setOrderStats: (stats) => dispatch(setOrderStats(stats)),

    // Utility operations
    clearError: () => dispatch(clearError()),
    resetState: () => dispatch(resetState()),
  }), [dispatch]);

  return {
    // State
    orders,
    currentOrder,
    recentOrders,
    loading,
    error,
    success,
    filters,
    statistics,
    pendingOrders,
    shippedOrders,
    deliveredOrders,
    totalOrderValue,
    // Actions
    ...actions
  };
};

/**
 * Hook for a single order by ID
 * Automatically fetches if not in store
 */
export const useOrder = (orderId) => {
  const dispatch = useDispatch();
  const order = useSelector(state => selectOrderById(state, orderId));
  const currentOrder = useSelector(selectCurrentOrder);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  // Use current order if it matches the orderId
  const activeOrder = useMemo(() => {
    if (currentOrder?._id === orderId || currentOrder?.id === orderId) {
      return currentOrder;
    }
    return order;
  }, [order, currentOrder, orderId]);

  useEffect(() => {
    if (orderId && !activeOrder && !loading) {
      dispatch(fetchOrder(orderId));
    }
  }, [orderId, activeOrder, loading, dispatch]);

  const updateOrder = useCallback(
    (data) => dispatch(updateOrder({ id: orderId, data })),
    [orderId, dispatch]
  );

  const cancelOrder = useCallback(
    (reason) => dispatch(cancelOrder(orderId, reason)),
    [orderId, dispatch]
  );

  const addTracking = useCallback(
    (trackingInfo) => dispatch(updateOrderTracking(orderId, trackingInfo)),
    [orderId, dispatch]
  );

  const addNote = useCallback(
    (note) => dispatch(addOrderNote({ orderId, note })),
    [orderId, dispatch]
  );

  return {
    order: activeOrder,
    loading,
    error,
    updateOrder,
    cancelOrder,
    addTracking,
    addNote
  };
};

/**
 * Hook for filtered orders
 */
export const useFilteredOrders = () => {
  const orders = useSelector(selectAllOrders);
  const filters = useSelector(selectOrderFilters);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  const filteredOrders = useMemo(() => {
    if (!orders || !filters) return orders;

    return orders.filter(order => {
      // Status filter
      if (filters.status && order.orderStatus !== filters.status) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom) {
        const orderDate = new Date(order.orderDate);
        const fromDate = new Date(filters.dateFrom);
        if (orderDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const orderDate = new Date(order.orderDate);
        const toDate = new Date(filters.dateTo);
        if (orderDate > toDate) return false;
      }

      // Amount range filter
      if (filters.minAmount && order.total < filters.minAmount) {
        return false;
      }

      if (filters.maxAmount && order.total > filters.maxAmount) {
        return false;
      }

      return true;
    });
  }, [orders, filters]);

  return {
    orders: filteredOrders,
    loading,
    error
  };
};

/**
 * Hook for orders by status
 */
export const useOrdersByStatus = (status) => {
  const orders = useSelector(state => selectOrdersByStatus(state, status));
  const loading = useSelector(selectOrdersLoading);

  return { orders, loading };
};

/**
 * Hook for order statistics
 */
export const useOrderStatistics = () => {
  const dispatch = useDispatch();
  const statistics = useSelector(selectOrderStatistics);
  const totalValue = useSelector(selectTotalOrderValue);
  const pendingCount = useSelector(selectPendingOrders).length;
  const shippedCount = useSelector(selectShippedOrders).length;
  const deliveredCount = useSelector(selectDeliveredOrders).length;

  const updateStatistics = useCallback(() => {
    dispatch(setOrderStats({
      ...statistics,
      totalRevenue: totalValue,
      pendingCount,
      shippedCount,
      deliveredCount
    }));
  }, [dispatch, statistics, totalValue, pendingCount, shippedCount, deliveredCount]);

  return {
    statistics,
    totalValue,
    updateStatistics
  };
};

/**
 * Hook for recent orders
 */
export const useRecentOrders = (limit = 5) => {
  const dispatch = useDispatch();
  const recentOrders = useSelector(selectRecentOrders);
  const loading = useSelector(selectOrdersLoading);

  useEffect(() => {
    if (!recentOrders || recentOrders.length === 0) {
      dispatch(fetchRecentOrders(limit));
    }
  }, [dispatch, limit, recentOrders]);

  const refresh = useCallback(() => {
    dispatch(fetchRecentOrders(limit));
  }, [dispatch, limit]);

  return {
    orders: recentOrders,
    loading,
    refresh
  };
};

/**
 * Hook for creating orders from cart
 */
export const useCartOrderCreation = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const currentOrder = useSelector(selectCurrentOrder);

  const createFromCart = useCallback(
    async (orderData) => {
      const result = await dispatch(createOrderFromCart(orderData));
      return result;
    },
    [dispatch]
  );

  return {
    createFromCart,
    loading,
    error,
    createdOrder: currentOrder
  };
};

/**
 * Hook for order tracking
 */
export const useOrderTracking = (orderId) => {
  const dispatch = useDispatch();
  const order = useSelector(state => selectOrderById(state, orderId));

  const updateTracking = useCallback(
    async (trackingNumber, carrier) => {
      const result = await dispatch(updateOrderTracking(orderId, {
        trackingNumber,
        carrier
      }));
      return result;
    },
    [dispatch, orderId]
  );

  const trackingInfo = useMemo(() => {
    if (!order) return null;
    
    return {
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
      shippedAt: order.shippedAt,
      hasTracking: !!(order.trackingNumber && order.carrier)
    };
  }, [order]);

  return {
    trackingInfo,
    updateTracking
  };
};

/**
 * Hook for order notes
 */
export const useOrderNotes = (orderId) => {
  const dispatch = useDispatch();
  const order = useSelector(state => selectOrderById(state, orderId));

  const notes = useMemo(() => {
    return order?.notes || [];
  }, [order]);

  const addNote = useCallback(
    (noteText) => {
      dispatch(addOrderNote({ orderId, note: noteText }));
    },
    [dispatch, orderId]
  );

  return {
    notes,
    addNote
  };
};

/**
 * Hook for order search
 */
export const useOrderSearch = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const loading = useSelector(selectOrdersLoading);

  const searchOrders = useCallback((searchTerm) => {
    if (!searchTerm || !orders) return orders;

    const searchLower = searchTerm.toLowerCase();
    return orders.filter(order => 
      order.orderNumber?.toLowerCase().includes(searchLower) ||
      order.customerName?.toLowerCase().includes(searchLower) ||
      order.customerEmail?.toLowerCase().includes(searchLower) ||
      order._id?.toLowerCase().includes(searchLower)
    );
  }, [orders]);

  return {
    searchOrders,
    loading
  };
};

/**
 * Hook for order date range filtering
 */
export const useOrderDateRange = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectOrderFilters);

  const setDateRange = useCallback((dateFrom, dateTo) => {
    dispatch(setOrderFilters({
      ...filters,
      dateFrom,
      dateTo
    }));
    dispatch(fetchOrdersWithFilters());
  }, [dispatch, filters]);

  const clearDateRange = useCallback(() => {
    const { dateFrom, dateTo, ...rest } = filters;
    dispatch(setOrderFilters(rest));
    dispatch(fetchOrdersWithFilters());
  }, [dispatch, filters]);

  return {
    dateFrom: filters?.dateFrom,
    dateTo: filters?.dateTo,
    setDateRange,
    clearDateRange
  };
};

/**
 * Hook for order status management
 */
export const useOrderStatusManagement = () => {
  const dispatch = useDispatch();

  const changeStatus = useCallback(
    (orderId, newStatus) => {
      dispatch(updateOrderStatus({ orderId, status: newStatus }));
      dispatch(patchOrder({ id: orderId, status: newStatus }));
    },
    [dispatch]
  );

  const bulkStatusChange = useCallback(
    (orderIds, newStatus) => {
      orderIds.forEach(orderId => {
        dispatch(updateOrderStatus({ orderId, status: newStatus }));
      });
      // Could be optimized with a bulk API call
    },
    [dispatch]
  );

  return {
    changeStatus,
    bulkStatusChange
  };
};