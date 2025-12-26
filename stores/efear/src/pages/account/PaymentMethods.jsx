import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchPayments,
  addPayments,
  removePayments,
  setDefaultMethod,
  selectAllPayments,
  selectDefaultPayments,
  selectPaymentsLoading,
  selectPaymentsError,
  selectExpiredPayments,
  clearError,
} from '../../features/payments/slice';
import {
  selectIsAuthenticated,
  logoutUser,
} from '../../features/user/slice';

function AccountPayments() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux selectors
  const Payments = useSelector(selectAllPayments);
  const defaultMethod = useSelector(selectDefaultPayments);
  const loading = useSelector(selectPaymentsLoading);
  const error = useSelector(selectPaymentsError);
  const expiredMethods = useSelector(selectExpiredPayments);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Local state
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingMethodId, setDeletingMethodId] = useState(null);
  const [newPayments, setNewPayments] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    makeDefault: false,
  });
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/account/payment-methods');
    }
  }, [isAuthenticated, navigate]);
  
  // Fetch payment methods on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPayments());
    }
  }, [dispatch, isAuthenticated]);
  
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };
  
  const handleDeleteMethod = async (methodId) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      setDeletingMethodId(methodId);
      const result = await dispatch(removePayments(methodId));
      
      if (result.success) {
        // Refresh the list
        dispatch(fetchPayments());
      } else {
        alert(result.error || 'Failed to delete payment method');
      }
      setDeletingMethodId(null);
    }
  };
  
  const handleSetDefault = async (methodId) => {
    const result = await dispatch(setDefaultMethod(methodId));
    
    if (!result.success) {
      alert(result.error || 'Failed to set default payment method');
    }
  };
  
  const handleAddPayments = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newPayments.cardNumber || 
        !newPayments.cardholderName || 
        !newPayments.expiryMonth || 
        !newPayments.expiryYear || 
        !newPayments.cvv) {
      alert('Please fill in all fields');
      return;
    }
    
    // Format payment method data
    const paymentData = {
      type: 'card',
      cardType: getCardType(newPayments.cardNumber),
      last4: newPayments.cardNumber.slice(-4),
      cardholderName: newPayments.cardholderName,
      expiryMonth: newPayments.expiryMonth,
      expiryYear: newPayments.expiryYear,
      makeDefault: newPayments.makeDefault,
      // In production, you would tokenize the card details
      // and send the token instead of raw card data
    };
    
    const result = await dispatch(addPayments(paymentData));
    
    if (result.success) {
      setShowAddModal(false);
      setNewPayments({
        cardNumber: '',
        cardholderName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        makeDefault: false,
      });
      dispatch(fetchPayments());
    } else {
      alert(result.error || 'Failed to add payment method');
    }
  };
  
  const getCardType = (cardNumber) => {
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5') return 'Mastercard';
    if (firstDigit === '3') return 'Amex';
    return 'Card';
  };
  
  const isExpired = (methodId) => {
    return expiredMethods.some(method => method.id === methodId);
  };
  
  const formatExpiry = (month, year) => {
    return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
  };
  
  return (
    <>
      <section className="py-3 border-bottom d-none d-md-flex">
        <div className="container">
          <div className="page-breadcrumb d-flex align-items-center">
            <h3 className="breadcrumb-title pe-3">Payment Methods</h3>
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
                          className="list-group-item d-flex justify-content-between align-items-center bg-transparent"
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
                          className="list-group-item active d-flex justify-content-between align-items-center"
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
                      ) : Payments.length === 0 ? (
                        <div className="text-center py-5">
                          <i className='bx bx-credit-card fs-1 text-muted'></i>
                          <p className="mt-3">No payment methods saved yet.</p>
                          <button 
                            onClick={() => setShowAddModal(true)}
                            className="btn btn-primary rounded-0"
                          >
                            Add Your First Payment Method
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="table-responsive">
                            <table className="table">
                              <thead className="table-light">
                                <tr>
                                  <th>Method</th>
                                  <th>Expires</th>
                                  <th>Status</th>
                                  <th></th>
                                </tr>
                              </thead>
                              <tbody>
                                {Payments.map((method) => (
                                  <tr key={method.id}>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <i className={`bx bxl-${method.cardType?.toLowerCase() || 'credit-card'} fs-4 me-2`}></i>
                                        <div>
                                          <div>{method.cardType || 'Card'} ending in {method.last4}</div>
                                          {method.isDefault && (
                                            <span className="badge bg-success">Default</span>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      {formatExpiry(method.expiryMonth, method.expiryYear)}
                                      {isExpired(method.id) && (
                                        <span className="badge bg-danger ms-2">Expired</span>
                                      )}
                                    </td>
                                    <td>
                                      {method.verified ? (
                                        <span className="badge bg-success">Verified</span>
                                      ) : (
                                        <span className="badge bg-warning">Unverified</span>
                                      )}
                                    </td>
                                    <td>
                                      <div className="d-flex gap-2">
                                        <button 
                                          onClick={() => handleDeleteMethod(method.id)}
                                          className="btn btn-light btn-sm rounded-0"
                                          disabled={deletingMethodId === method.id}
                                        >
                                          {deletingMethodId === method.id ? (
                                            <span className="spinner-border spinner-border-sm"></span>
                                          ) : (
                                            'Delete'
                                          )}
                                        </button>
                                        {!method.isDefault && (
                                          <button 
                                            onClick={() => handleSetDefault(method.id)}
                                            className="btn btn-light btn-sm rounded-0"
                                          >
                                            Make Default
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <button 
                            onClick={() => setShowAddModal(true)}
                            className="btn btn-light rounded-0"
                          >
                            <i className='bx bx-plus'></i> Add Payment Method
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Payment Method</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddPayments}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Cardholder Name</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={newPayments.cardholderName}
                      onChange={(e) => setNewPayments({
                        ...newPayments,
                        cardholderName: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Card Number</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="1234 5678 9012 3456"
                      maxLength="16"
                      value={newPayments.cardNumber}
                      onChange={(e) => setNewPayments({
                        ...newPayments,
                        cardNumber: e.target.value.replace(/\D/g, '')
                      })}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Month</label>
                      <select 
                        className="form-select"
                        value={newPayments.expiryMonth}
                        onChange={(e) => setNewPayments({
                          ...newPayments,
                          expiryMonth: e.target.value
                        })}
                        required
                      >
                        <option value="">MM</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <option key={month} value={month}>
                            {String(month).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Year</label>
                      <select 
                        className="form-select"
                        value={newPayments.expiryYear}
                        onChange={(e) => setNewPayments({
                          ...newPayments,
                          expiryYear: e.target.value
                        })}
                        required
                      >
                        <option value="">YYYY</option>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">CVV</label>
                      <input 
                        type="text" 
                        className="form-control"
                        placeholder="123"
                        maxLength="4"
                        value={newPayments.cvv}
                        onChange={(e) => setNewPayments({
                          ...newPayments,
                          cvv: e.target.value.replace(/\D/g, '')
                        })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="makeDefault"
                      checked={newPayments.makeDefault}
                      onChange={(e) => setNewPayments({
                        ...newPayments,
                        makeDefault: e.target.checked
                      })}
                    />
                    <label className="form-check-label" htmlFor="makeDefault">
                      Make this my default payment method
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Payment Method'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AccountPayments;