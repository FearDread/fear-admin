import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  logoutUser,
  selectCurrentUser,
  selectUserFullName,
  selectIsAuthenticated,
  selectUserLoading,
  selectLastLoginAt,
  selectUserError,
} from '../../features/user/slice';
import {
  addAddress,
  updateAddress,
  removeAddress,
  createAddress,
  createNewAddress,
  setDefaultAddress,
  fetchAddresses,
  validateAddress,
  clearValidation,
  selectAllAddresses,
  selectDefaultAddress,
  selectAddressesByType,
  selectAddressValidation,
} from "../../features/address/slice";

import AccountSidebar from './components/AccountSidebar';

export const AccountAddresses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // User selectors
  const currentUser = useSelector(selectCurrentUser);
  const userFullName = useSelector(selectUserFullName);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userLoading = useSelector(selectUserLoading);
  const lastLoginAt = useSelector(selectLastLoginAt);
  const userError = useSelector(selectUserError);

  // Address selectors
  const allAddresses = useSelector(selectAllAddresses);
  const defaultAddress = useSelector(selectDefaultAddress);
  const billingAddresses = useSelector(state => {
    const addresses = selectAddressesByType(state, 'billing')
    return addresses;
  })
  const shippingAddresses = useSelector(state => selectAddressesByType(state, 'shipping'));
  const validation = useSelector(selectAddressValidation);

  // Local state
  const [loggingOut, setLoggingOut] = useState(false);
  const [editMode, setEditMode] = useState({ billing: false, shipping: false });
  const [editingAddressId, setEditingAddressId] = useState({ billing: null, shipping: null });
  const [formData, setFormData] = useState({
    billing: {
      fullName: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      phone: '',
      type: 'billing',
      isDefault: false,
    },
    shipping: {
      fullName: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      phone: '',
      type: 'shipping',
      isDefault: false,
    },
  });
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!currentUser || !isAuthenticated) {
      navigate("/login");
    }
  }, [currentUser, isAuthenticated, navigate]);

  // Load addresses on mount
  useEffect(() => {


    if (currentUser && isAuthenticated) {
      dispatch(fetchAddresses());
          console.log('current user addresses = ', allAddresses);
      // Populate form with existing addresses
      const primaryBilling = allAddresses.find(addr => addr.isDefault) || allAddresses[0];
      const primaryShipping = allAddresses.find(addr => addr.isDefault) || shippingAddresses[0];

      if (primaryBilling) {
        setFormData(prev => ({
          ...prev,
          billing: {
            fullName: primaryBilling.fullName || '',
            line1: primaryBilling.line1 || '',
            line2: primaryBilling.line2 || '',
            city: primaryBilling.city || '',
            state: primaryBilling.state || '',
            zipCode: primaryBilling.zipCode || '',
            country: primaryBilling.country || 'United States',
            phone: primaryBilling.phone || '',
            type: 'billing',
            isDefault: primaryBilling.isDefault || false,
          },
        }));
        setEditingAddressId(prev => ({ ...prev, billing: primaryBilling.id }));
      }

      if (primaryShipping) {
        setFormData(prev => ({
          ...prev,
          shipping: {
            fullName: primaryShipping.fullName || '',
            line1: primaryShipping.line1 || '',
            line2: primaryShipping.line2 || '',
            city: primaryShipping.city || '',
            state: primaryShipping.state || '',
            zipCode: primaryShipping.zipCode || '',
            country: primaryShipping.country || 'United States',
            phone: primaryShipping.phone || '',
            type: 'shipping',
            isDefault: primaryShipping.isDefault || false,
          },
        }));
        setEditingAddressId(prev => ({ ...prev, shipping: primaryShipping.id }));
      }
    }
  }, [currentUser, isAuthenticated, allAddresses.length, shippingAddresses.length]);

  // Handle input change
  const handleInputChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  // Handle same as billing checkbox
  const handleSameAsBillingChange = (checked) => {
    setSameAsBilling(checked);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        shipping: { 
          ...prev.billing,
          type: 'shipping',
        },
      }));
    }
  };

  // Handle edit mode toggle
  const toggleEditMode = (type) => {
    setEditMode(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
    
    // Clear validation when entering edit mode
    if (!editMode[type]) {
      dispatch(clearValidation());
    }
  };

  // Handle save address
  const handleSaveAddress = async (type) => {
    setLoading(true);
    
    try {
      const addressData = {
        ...formData[type],
        type,
        userId: currentUser._id,
      };

      // Validate address first
      dispatch(validateAddress(addressData));

      // Wait a bit for validation to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check if validation passed
      const currentValidation = selectAddressValidation({ 
        address: { validation } 
      });

      if (!currentValidation.isValid) {
        setLoading(false);
        return;
      }

      // Update or create address
      let result;
      if (editingAddressId[type]) {
        // Update existing address
        result = await dispatch(updateAddress({
          id: editingAddressId[type],
          updates: addressData,
        }));
        
        console.log('Address updated:', result);
      } else {
        // Add new address
        result = await dispatch(createAddress(addressData));
        console.log('Address added:', result);
        
        // Store the new address ID for future updates
        setEditingAddressId(prev => ({
          ...prev,
          [type]: result.id || Date.now().toString(),
        }));
      }

      // Exit edit mode
      setEditMode(prev => ({ ...prev, [type]: false }));
      dispatch(clearValidation());

      // Show success message
      alert(`${type === 'billing' ? 'Billing' : 'Shipping'} address saved successfully!`);
    } catch (error) {
      console.error('Failed to save address:', error);
      alert(`Failed to save address: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = (type) => {
    const addresses = type === 'billing' ? billingAddresses : shippingAddresses;
    const existingAddress = addresses.find(addr => addr.id === editingAddressId[type]) || addresses[0];

    if (existingAddress) {
      setFormData(prev => ({
        ...prev,
        [type]: {
          fullName: existingAddress.fullName || '',
          line1: existingAddress.line1 || '',
          line2: existingAddress.line2 || '',
          city: existingAddress.city || '',
          state: existingAddress.state || '',
          zipCode: existingAddress.zipCode || '',
          country: existingAddress.country || 'United States',
          phone: existingAddress.phone || '',
          type,
          isDefault: existingAddress.isDefault || false,
        },
      }));
    } else {
      // Reset to empty if no existing address
      setFormData(prev => ({
        ...prev,
        [type]: {
          fullName: '',
          line1: '',
          line2: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States',
          phone: '',
          type,
          isDefault: false,
        },
      }));
    }

    setEditMode(prev => ({ ...prev, [type]: false }));
    dispatch(clearValidation());
  };

  // Handle delete address
  const handleDeleteAddress = async (type) => {
    if (!editingAddressId[type]) return;

    if (window.confirm(`Are you sure you want to delete this ${type} address?`)) {
      try {
        await dispatch(removeAddress(editingAddressId[type])).unwrap();
        
        // Reset form
        setFormData(prev => ({
          ...prev,
          [type]: {
            fullName: '',
            line1: '',
            line2: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'United States',
            phone: '',
            type,
            isDefault: false,
          },
        }));
        setEditingAddressId(prev => ({ ...prev, [type]: null }));
        setEditMode(prev => ({ ...prev, [type]: false }));

        alert(`${type === 'billing' ? 'Billing' : 'Shipping'} address deleted successfully!`);
      } catch (error) {
        console.error('Failed to delete address:', error);
        alert('Failed to delete address. Please try again.');
      }
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login', { 
        state: { message: 'You have been logged out successfully' } 
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  const sidebarProps = {
    handleLogout,
    currentUser,
    userFullName,
    lastLoginAt,
  };

  // Render address form
  const renderAddressForm = (type) => {
    const address = formData[type];
    const isEditing = editMode[type];
    const hasAddress = address.fullName || address.line1;

    if (!isEditing) {
      // Display mode
      return (
        <div>
          {hasAddress ? (
            <address className="mb-3">
              {address.fullName && <strong>{address.fullName}</strong>}
              {address.fullName && <br />}
              {address.line1 && <>{address.line1}<br /></>}
              {address.line2 && <>{address.line2}<br /></>}
              {address.city && <>{address.city}</>}
              {address.state && <>, {address.state}</>}
              {address.zipCode && <> {address.zipCode}</>}
              {(address.city || address.state || address.zipCode) && <br />}
              {address.country && <>{address.country}</>}
              {address.phone && (
                <>
                  <br />
                  <i className="bx bx-phone me-1"></i>
                  {address.phone}
                </>
              )}
            </address>
          ) : (
            <p className="text-muted mb-3">No address added yet.</p>
          )}
          
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => toggleEditMode(type)}
            >
              <i className="bx bx-edit me-1"></i>
              {hasAddress ? 'Edit Address' : 'Add Address'}
            </button>
            
            {hasAddress && editingAddressId[type] && (
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDeleteAddress(type)}
              >
                <i className="bx bx-trash me-1"></i>
                Delete
              </button>
            )}
          </div>
        </div>
      );
    }

    // Edit mode
    return (
      <div className="address-form">
        <div className="mb-3">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            className={`form-control ${validation.errors.fullName ? 'is-invalid' : ''}`}
            value={address.fullName}
            onChange={(e) => handleInputChange(type, 'fullName', e.target.value)}
            placeholder="John Doe"
          />
          {validation.errors.fullName && (
            <div className="invalid-feedback d-block">
              {validation.errors.fullName}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Address Line 1 *</label>
          <input
            type="text"
            className={`form-control ${validation.errors.line1 ? 'is-invalid' : ''}`}
            value={address.line1}
            onChange={(e) => handleInputChange(type, 'line1', e.target.value)}
            placeholder="123 Main Street"
          />
          {validation.errors.line1 && (
            <div className="invalid-feedback d-block">
              {validation.errors.line1}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Address Line 2 (Optional)</label>
          <input
            type="text"
            className="form-control"
            value={address.line2}
            onChange={(e) => handleInputChange(type, 'line2', e.target.value)}
            placeholder="Apt 4B"
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">City *</label>
            <input
              type="text"
              className={`form-control ${validation.errors.city ? 'is-invalid' : ''}`}
              value={address.city}
              onChange={(e) => handleInputChange(type, 'city', e.target.value)}
              placeholder="New York"
            />
            {validation.errors.city && (
              <div className="invalid-feedback d-block">
                {validation.errors.city}
              </div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">State/Province *</label>
            <input
              type="text"
              className={`form-control ${validation.errors.state ? 'is-invalid' : ''}`}
              value={address.state}
              onChange={(e) => handleInputChange(type, 'state', e.target.value)}
              placeholder="NY"
            />
            {validation.errors.state && (
              <div className="invalid-feedback d-block">
                {validation.errors.state}
              </div>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">ZIP/Postal Code *</label>
            <input
              type="text"
              className={`form-control ${validation.errors.zipCode ? 'is-invalid' : ''}`}
              value={address.zipCode}
              onChange={(e) => handleInputChange(type, 'zipCode', e.target.value)}
              placeholder="10001"
            />
            {validation.errors.zipCode && (
              <div className="invalid-feedback d-block">
                {validation.errors.zipCode}
              </div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Country *</label>
            <select
              className={`form-select ${validation.errors.country ? 'is-invalid' : ''}`}
              value={address.country}
              onChange={(e) => handleInputChange(type, 'country', e.target.value)}
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="South Africa">South Africa</option>
              <option value="Other">Other</option>
            </select>
            {validation.errors.country && (
              <div className="invalid-feedback d-block">
                {validation.errors.country}
              </div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number (Optional)</label>
          <input
            type="tel"
            className={`form-control ${validation.errors.phone ? 'is-invalid' : ''}`}
            value={address.phone}
            onChange={(e) => handleInputChange(type, 'phone', e.target.value)}
            placeholder="(123) 456-7890"
          />
          {validation.errors.phone && (
            <div className="invalid-feedback d-block">
              {validation.errors.phone}
            </div>
          )}
        </div>

        {type === 'shipping' && (
          <div className="mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="sameAsBilling"
                checked={sameAsBilling}
                onChange={(e) => handleSameAsBillingChange(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="sameAsBilling">
                Same as billing address
              </label>
            </div>
          </div>
        )}

        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => handleSaveAddress(type)}
            disabled={loading || userLoading}
          >
            <i className="bx bx-save me-1"></i>
            {loading ? 'Saving...' : 'Save Address'}
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => handleCancelEdit(type)}
            disabled={loading || userLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="py-3 border-bottom d-none d-md-flex">
        <div className="container">
          <div className="page-breadcrumb d-flex align-items-center">
            <h3 className="breadcrumb-title pe-3">Account Addresses</h3>
            <div className="ms-auto">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <Link to="/">
                      <i className="bx bx-home-alt"></i> Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/account">
                      <i className="bx bx-user"></i> Dashboard
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Addresses
                  </li>
                </ol>
              </nav>
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
                {/* Sidebar Navigation */}
                <AccountSidebar {...sidebarProps} />

                {/* Main Content */}
                <div className="col-lg-8">
                  <div className="card shadow-none mb-0">
                    <div className="card-body">
                      {userLoading && !currentUser ? (
                        <div className="text-center py-5">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p className="mt-3">Loading addresses...</p>
                        </div>
                      ) : userError ? (
                        <div className="alert alert-danger">
                          <i className="bx bx-error-circle me-2"></i>
                          {userError.message || 'Failed to load addresses'}
                        </div>
                      ) : (
                        <>
                          <h6 className="mb-4">
                            The following addresses will be used on the checkout page by default.
                          </h6>
                          
                          <div className="row">
                            {/* Billing Address */}
                            <div className="col-12 col-lg-6 mb-4 mb-lg-0">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">
                                  <i className="bx bx-receipt me-2"></i>
                                  Billing Address
                                </h5>
                                {formData.billing.fullName && !editMode.billing && (
                                  <span className="badge bg-success">
                                    <i className="bx bx-check"></i> Set
                                  </span>
                                )}
                              </div>
                              {renderAddressForm('billing')}
                            </div>

                            {/* Shipping Address */}
                            <div className="col-12 col-lg-6">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">
                                  <i className="bx bx-package me-2"></i>
                                  Shipping Address
                                </h5>
                                {formData.shipping.fullName && !editMode.shipping && (
                                  <span className="badge bg-success">
                                    <i className="bx bx-check"></i> Set
                                  </span>
                                )}
                              </div>
                              {renderAddressForm('shipping')}
                            </div>
                          </div>

                          {/* Info Alert */}
                          {(!formData.billing.fullName || !formData.shipping.fullName) && (
                            <div className="alert alert-info mt-4">
                              <i className="bx bx-info-circle me-2"></i>
                              Please add your addresses to speed up the checkout process.
                            </div>
                          )}

                          {/* Address Summary */}
                          {allAddresses.length > 0 && (
                            <div className="mt-4 pt-4 border-top">
                              <h6 className="mb-3">
                                <i className="bx bx-map me-2"></i>
                                All Saved Addresses ({allAddresses.length})
                              </h6>
                              <div className="text-muted small">
                                You have {billingAddresses.length} billing address(es) and{' '}
                                {shippingAddresses.length} shipping address(es) saved.
                              </div>
                            </div>
                          )}
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

      <style>{`
        .address-form .form-label {
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        
        .address-form .is-invalid {
          border-color: #dc3545;
        }
        
        .address-form .invalid-feedback {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        
        address {
          font-style: normal;
          line-height: 1.6;
        }
        
        .badge {
          font-weight: 500;
        }
      `}</style>
    </>
  );
};

export default AccountAddresses;