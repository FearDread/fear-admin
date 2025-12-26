import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchOrders,
  fetchOrdersWithFilters,
  cancelOrder,
  setCurrentOrder,
  setOrderFilters,
  clearOrderFilters,
  selectAllOrders,
  selectOrdersLoading,
  selectOrdersError,
  selectOrderFilters,
  selectOrdersByStatus,
  selectTotalOrderValue,
  clearError,
} from '../../features/orders/slice';
import {
  selectIsAuthenticated,
  logoutUser,
} from '../../features/user/slice';

function AccountOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux selectors
  const orders = useSelector(selectAllOrders);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const filters = useSelector(selectOrderFilters);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const totalOrderValue = useSelector(selectTotalOrderValue);
  
  // Local state
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/account/orders');
    }
  }, [isAuthenticated, navigate]);
  
  // Fetch orders on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchOrders({ sort: '-orderDate' }));
    }
  }, [dispatch, isAuthenticated]);
  
  // Apply status filter
  useEffect(() => {
    if (statusFilter !== 'all') {
      dispatch(setOrderFilters({ status: statusFilter }));
      dispatch(fetchOrdersWithFilters());
    } else {
      dispatch(clearOrderFilters());
      dispatch(fetchOrders({ sort: '-orderDate' }));
    }
  }, [statusFilter, dispatch]);
  
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };
  
  const handleViewOrder = (order) => {
    dispatch(setCurrentOrder(order));
    navigate(`/account/orders/${order.id}`);
  };
  
  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setCancellingOrderId(orderId);
      const result = await dispatch(cancelOrder(orderId, 'Customer requested cancellation'));
      
      if (result.success) {
        // Refresh orders
        dispatch(fetchOrders({ sort: '-orderDate' }));
      } else {
        alert(result.error || 'Failed to cancel order');
      }
      setCancellingOrderId(null);
    }
  };
  
  const handlePayOrder = (order) => {
    dispatch(setCurrentOrder(order));
    navigate('/checkout/payment', { state: { orderId: order.id } });
  };
  
  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      completed: 'bg-success',
      delivered: 'bg-success',
      shipped: 'bg-info',
      processing: 'bg-warning',
      pending: 'bg-secondary',
      failed: 'bg-danger',
      cancelled: 'bg-dark',
    };
    return statusClasses[status?.toLowerCase()] || 'bg-light';
  };
  
  const canCancel = (order) => {
    return ['pending', 'processing'].includes(order.status?.toLowerCase());
  };
  
  const canPay = (order) => {
    return ['failed', 'pending'].includes(order.status?.toLowerCase());
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const getItemCount = (order) => {
    if (!order.items || order.items.length === 0) return 0;
    return order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  };
  
  // Filter orders by status for display
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status?.toLowerCase() === statusFilter.toLowerCase());
  
  // Sort orders by date (newest first)
  const sortedOrders = [...filteredOrders].sort((a, b) => 
    new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt)
  );
  
  return (
    <>
      <section className="py-3 border-bottom d-none d-md-flex">
        <div className="container">
          <div className="page-breadcrumb d-flex align-items-center">
            <h3 className="breadcrumb-title pe-3">My Orders</h3>
            <div className="ms-auto">
              <button 
                className="btn btn-sm btn-light rounded-0"
                onClick={() => setShowFilters(!showFilters)}
              >
                <i className='bx bx-filter'></i> Filter
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-4">
        <div className="container">
          <h3 className="d-none">Account</h3>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-4">
                  <div className="card shadow-none mb-3 mb-lg-0">
                    <div className="card-body">
                      <div className="list-group list-group-flush">
                        <a 
                          href="/account/dashboard" 
                          className="list-group-item d-flex justify-content-between align-items-center bg-transparent"
                        >
                          Dashboard <i className='bx bx-tachometer fs-5'></i>
                        </a>
                        <a 
                          href="/account/orders" 
                          className="list-group-item active d-flex justify-content-between align-items-center"
                        >
                          Orders <i className='bx bx-cart-alt fs-5'></i>
                        </a>
                        <a 
                          href="/account/downloads" 
                          className="list-group-item d-flex justify-content-between align-items-center bg-transparent"
                        >
                          Downloads <i className='bx bx-download fs-5'></i>
                        </a>
                        <a 
                          href="/account/addresses" 
                          className="list-group-item d-flex justify-content-between align-items-center bg-transparent"
                        >
                          Addresses <i className='bx bx-home-smile fs-5'></i>
                        </a>
                        <a 
                          href="/account/payment-methods" 
                          className="list-group-item d-flex justify-content-between align-items-center bg-transparent"
                        >
                          Payment Methods <i className='bx bx-credit-card fs-5'></i>
                        </a>
                        <a 
                          href="/account/details" 
                          className="list-group-item d-flex justify-content-between align-items-center bg-transparent"
                        >
                          Account Details <i className='bx bx-user-circle fs-5'></i>
                        </a>
                        <button 
                          onClick={handleLogout}
                          className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 text-start"
                        >
                          Logout <i className='bx bx-log-out fs-5'></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-8">
                  <div className="card shadow-none mb-0">
                    <div className="card-body">
                      {/* Filter Section */}
                      {showFilters && (
                        <div className="mb-3 p-3 border rounded">
                          <h6 className="mb-3">Filter Orders</h6>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label">Status</label>
                              <select 
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                              >
                                <option value="all">All Orders</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="failed">Failed</option>
                              </select>
                            </div>
                            <div className="col-md-6 d-flex align-items-end">
                              <button 
                                className="btn btn-light rounded-0"
                                onClick={() => {
                                  setStatusFilter('all');
                                  dispatch(clearOrderFilters());
                                }}
                              >
                                Clear Filters
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Order Summary Stats */}
                      <div className="row g-3 mb-4">
                        <div className="col-md-4">
                          <div className="border p-3 rounded">
                            <div className="d-flex align-items-center">
                              <i className='bx bx-shopping-bag fs-3 text-primary'></i>
                              <div className="ms-2">
                                <h6 className="mb-0">{orders.length}</h6>
                                <small className="text-muted">Total Orders</small>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="border p-3 rounded">
                            <div className="d-flex align-items-center">
                              <i className='bx bx-dollar fs-3 text-success'></i>
                              <div className="ms-2">
                                <h6 className="mb-0">${totalOrderValue.toFixed(2)}</h6>
                                <small className="text-muted">Total Spent</small>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="border p-3 rounded">
                            <div className="d-flex align-items-center">
                              <i className='bx bx-time fs-3 text-warning'></i>
                              <div className="ms-2">
                                <h6 className="mb-0">
                                  {orders.filter(o => ['pending', 'processing'].includes(o.status?.toLowerCase())).length}
                                </h6>
                                <small className="text-muted">Active Orders</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {error && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                          {error}
                          <button 
                            type="button" 
                            className="btn-close" 
                            onClick={() => dispatch(clearError())}
                          ></button>
                        </div>
                      )}
                      
                      {loading ? (
                        <div className="text-center py-5">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : sortedOrders.length === 0 ? (
                        <div className="text-center py-5">
                          <i className='bx bx-cart fs-1 text-muted'></i>
                          <p className="mt-3">
                            {statusFilter !== 'all' 
                              ? `No ${statusFilter} orders found.` 
                              : 'No orders yet. Start shopping!'}
                          </p>
                          {statusFilter === 'all' && (
                            <button 
                              onClick={() => navigate('/shop')}
                              className="btn btn-primary rounded-0"
                            >
                              Browse Products
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table">
                            <thead className="table-light">
                              <tr>
                                <th>Order</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sortedOrders.map((order) => (
                                <tr key={order.id}>
                                  <td>
                                    <strong>#{order.orderNumber || order.id}</strong>
                                  </td>
                                  <td>
                                    {formatDate(order.orderDate || order.createdAt)}
                                  </td>
                                  <td>
                                    <div className={`badge rounded-pill ${getStatusBadgeClass(order.status)} w-100 text-white`}>
                                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                                    </div>
                                  </td>
                                  <td>
                                    ${(order.total || 0).toFixed(2)} for {getItemCount(order)} item{getItemCount(order) !== 1 ? 's' : ''}
                                  </td>
                                  <td>
                                    <div className="d-flex gap-2 flex-wrap">
                                      <button 
                                        onClick={() => handleViewOrder(order)}
                                        className="btn btn-light btn-sm rounded-0"
                                      >
                                        View
                                      </button>
                                      
                                      {canPay(order) && (
                                        <button 
                                          onClick={() => handlePayOrder(order)}
                                          className="btn btn-primary btn-sm rounded-0"
                                        >
                                          Pay
                                        </button>
                                      )}
                                      
                                      {canCancel(order) && (
                                        <button 
                                          onClick={() => handleCancelOrder(order.id)}
                                          className="btn btn-danger btn-sm rounded-0"
                                          disabled={cancellingOrderId === order.id}
                                        >
                                          {cancellingOrderId === order.id ? (
                                            <span className="spinner-border spinner-border-sm"></span>
                                          ) : (
                                            'Cancel'
                                          )}
                                        </button>
                                      )}
                                      
                                      {order.trackingNumber && (
                                        <button 
                                          onClick={() => window.open(`/track/${order.trackingNumber}`, '_blank')}
                                          className="btn btn-info btn-sm rounded-0"
                                        >
                                          <i className='bx bx-package'></i> Track
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AccountOrders;