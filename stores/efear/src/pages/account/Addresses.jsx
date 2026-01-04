import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  logoutUser,
  updateUser,
  selectCurrentUser,
  selectUserFullName,
  selectIsAuthenticated,
  selectUserLoading,
  selectLastLoginAt,
  selectUserError,
} from '../../features/user/slice';
import {
  addAddress,
  selectAllAddresses,
} from "../../features/address/slice";

import { dispatch } from "../../features/store";
import AccountSidebar from './components/AccountSidebar';

export const AccountAddresses = () => {
  const navigate = useNavigate();

  const currentUser = useSelector(selectCurrentUser);
  const userFullName = useSelector(selectUserFullName);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectUserLoading);
  const lastLoginAt = useSelector(selectLastLoginAt);
  const error = useSelector(selectUserError);

  // Local state
  const [ loggingOut, setLoggingOut ] = useState(false);
  const [editMode, setEditMode] = useState({ billing: false, shipping: false });
  const [formData, setFormData] = useState({
    billing: {
      name: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    shipping: {
      name: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });
  const [sameAsBilling, setSameAsBilling] = useState(false);

  // Load user data on mount
  useEffect(() => {
    if (!currentUser || !isAuthenticated) {
      navigate("/login");
    }
  }, [currentUser, isAuthenticated]);

  // Populate form with user data
  useEffect(() => {
    if (currentUser) {
      setFormData({
        billing: {
          name: currentUser.billingAddress?.name || currentUser.name || '',
          address1: currentUser.billingAddress?.address1 || '',
          address2: currentUser.billingAddress?.address2 || '',
          city: currentUser.billingAddress?.city || '',
          state: currentUser.billingAddress?.state || '',
          zipCode: currentUser.billingAddress?.zipCode || '',
          country: currentUser.billingAddress?.country || 'United States',
        },
        shipping: {
          name: currentUser.shippingAddress?.name || currentUser.name || '',
          address1: currentUser.shippingAddress?.address1 || '',
          address2: currentUser.shippingAddress?.address2 || '',
          city: currentUser.shippingAddress?.city || '',
          state: currentUser.shippingAddress?.state || '',
          zipCode: currentUser.shippingAddress?.zipCode || '',
          country: currentUser.shippingAddress?.country || 'United States',
        },
      });
    }
  }, [currentUser]);

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
        shipping: { ...prev.billing },
      }));
    }
  };

  // Handle edit mode toggle
  const toggleEditMode = (type) => {
    setEditMode(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // Handle save address
  const handleSaveAddress = async (type) => {
    try {
      const updateData = {
        userId: currentUser._id,
        [`${type}Address`]: formData[type],
      };

      await dispatch(updateUser(updateData)).unwrap();
      let result = await dispatch(addAddress(updateData)).unwrap();
      console.log('address result = ', result);
      setEditMode(prev => ({ ...prev, [type]: false }));
      alert(`${type === 'billing' ? 'Billing' : 'Shipping'} address updated successfully!`);
    } catch (error) {
      console.error('Failed to update address:', error);
      alert('Failed to update address. Please try again.');
    }
  };

  // Handle cancel edit
  const handleCancelEdit = (type) => {
    // Reset to original data
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        [type]: {
          name: currentUser[`${type}Address`]?.name || currentUser.name || '',
          address1: currentUser[`${type}Address`]?.address1 || '',
          address2: currentUser[`${type}Address`]?.address2 || '',
          city: currentUser[`${type}Address`]?.city || '',
          state: currentUser[`${type}Address`]?.state || '',
          zipCode: currentUser[`${type}Address`]?.zipCode || '',
          country: currentUser[`${type}Address`]?.country || 'United States',
        },
      }));
    }
    setEditMode(prev => ({ ...prev, [type]: false }));
  };

  // Handle logout
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await dispatch(logoutUser());
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
  }

  // Render address form
  const renderAddressForm = (type) => {
    const address = formData[type];
    const isEditing = editMode[type];

    if (!isEditing) {
      // Display mode
      return (
        <div>
          {address.name || address.address1 ? (
            <address>
              {address.name && <>{address.name}<br /></>}
              {address.address1 && <>{address.address1}<br /></>}
              {address.address2 && <>{address.address2}<br /></>}
              {address.city && <>{address.city}</>}
              {address.state && <>, {address.state}</>}
              {address.zipCode && <> {address.zipCode}</>}
              {address.city || address.state || address.zipCode ? <br /> : null}
              {address.country && <>{address.country}</>}
            </address>
          ) : (
            <p className="text-muted">No address added yet.</p>
          )}
          <button
            className="btn btn-sm btn-outline-primary mt-2"
            onClick={() => toggleEditMode(type)}
          >
            <i className="bx bx-edit me-1"></i>
            {address.name || address.address1 ? 'Edit Address' : 'Add Address'}
          </button>
        </div>
      );
    }

    // Edit mode
    return (
      
      <div className="address-form">
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            value={address.name}
            onChange={(e) => handleInputChange(type, 'name', e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address Line 1</label>
          <input
            type="text"
            className="form-control"
            value={address.address1}
            onChange={(e) => handleInputChange(type, 'address1', e.target.value)}
            placeholder="123 Main Street"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address Line 2 (Optional)</label>
          <input
            type="text"
            className="form-control"
            value={address.address2}
            onChange={(e) => handleInputChange(type, 'address2', e.target.value)}
            placeholder="Apt 4B"
          />
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-control"
              value={address.city}
              onChange={(e) => handleInputChange(type, 'city', e.target.value)}
              placeholder="New York"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">State/Province</label>
            <input
              type="text"
              className="form-control"
              value={address.state}
              onChange={(e) => handleInputChange(type, 'state', e.target.value)}
              placeholder="NY"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">ZIP/Postal Code</label>
            <input
              type="text"
              className="form-control"
              value={address.zipCode}
              onChange={(e) => handleInputChange(type, 'zipCode', e.target.value)}
              placeholder="10001"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Country</label>
            <select
              className="form-select"
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
          </div>
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
            disabled={loading}
          >
            <i className="bx bx-save me-1"></i>
            {loading ? 'Saving...' : 'Save Address'}
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => handleCancelEdit(type)}
            disabled={loading}
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
                  <li>
                  <Link to="/account">
                    <i className="bx bx-home-alt"></i> Dashboard
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
                      {loading && !currentUser ? (
                        <div className="text-center py-5">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p className="mt-3">Loading addresses...</p>
                        </div>
                      ) : error ? (
                        <div className="alert alert-danger">
                          <i className="bx bx-error-circle me-2"></i>
                          {error.message || 'Failed to load addresses'}
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
                                <h5 className="mb-0">Billing Address</h5>
                                {formData.billing.name && !editMode.billing && (
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
                                <h5 className="mb-0">Shipping Address</h5>
                                {formData.shipping.name && !editMode.shipping && (
                                  <span className="badge bg-success">
                                    <i className="bx bx-check"></i> Set
                                  </span>
                                )}
                              </div>
                              {renderAddressForm('shipping')}
                            </div>
                          </div>

                          {/* Info Alert */}
                          {(!formData.billing.name || !formData.shipping.name) && (
                            <div className="alert alert-info mt-4">
                              <i className="bx bx-info-circle me-2"></i>
                              Please add your addresses to speed up the checkout process.
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
    </>
  );
}

export default AccountAddresses;