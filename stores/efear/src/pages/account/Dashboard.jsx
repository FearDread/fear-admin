// pages/account/AccountDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { dispatch } from "../../features/store";
import {
  logoutUser,
  selectCurrentUser,
  selectUserFullName,
  selectIsAuthenticated,
  selectUserLoading,
  selectLastLoginAt,
} from '../../features/user/slice';
import AccountSidebar from '../../components/common/AccountSidebar';


export const AccountDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Redux selectors
  const currentUser = useSelector(selectCurrentUser);
  const userFullName = useSelector(selectUserFullName);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectUserLoading);
  const lastLoginAt = useSelector(selectLastLoginAt);

  // Local state for logout confirmation
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    console.log('user = ', currentUser);
    if (!isAuthenticated && !loading) {
      navigate('/login', { 
        state: { 
          from: location,
          message: 'Please login to access your account' 
        } 
      });
    }
  }, [isAuthenticated, loading, navigate, location]);
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
      setShowLogoutModal(false);
    }
  };

  const sidebarProps = {
    handleLogout,
    currentUser,
    userFullName,
    lastLoginAt,
  }



  // Show loading state
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!currentUser && !loading)  {
    return null;
  }
  return (
    <>
      {/* Breadcrumb Section */}
      <section className="py-3 border-bottom d-none d-md-flex">
        <div className="container">
          <div className="page-breadcrumb d-flex align-items-center">
            <h3 className="breadcrumb-title pe-3">Account Dashboard</h3>
            <div className="ms-auto">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <Link to="/">
                      <i className="bx bx-home-alt"></i> Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Dashboard
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* Main Account Section */}
      <section className="py-4">
        <div className="container">
          <h3 className="d-none">Account</h3>
          <div className="card">
            <div className="card-body">
              <div className="row">
                {/* Sidebar Menu */}
                <AccountSidebar {...sidebarProps} />


                {/* Main Content */}
                <div className="col-lg-8">
                  <div className="card shadow-none mb-0">
                    <div className="card-body">
                      {/* Welcome Message */}
                      <div className="alert alert-light border" role="alert">
                        <h5 className="alert-heading">
                          <i className='bx bx-smile me-2'></i>
                          Welcome back, {currentUser.firstName || userFullName}!
                        </h5>
                        <p className="mb-0">
                          Good to see you again. Here's what's happening with your account.
                        </p>
                      </div>

                      {/* Account Overview */}
                      <div className="mb-4">
                        <h5 className="mb-3">Account Overview</h5>
                        <p>
                          Hello <strong>{userFullName}</strong> 
                          {' '}(not <strong>{currentUser.name || userFullName}</strong>?{' '}
                          <button 
                            onClick={() => setShowLogoutModal(true)}
                            className="btn btn-link p-0 text-decoration-none"
                          >
                            Logout
                          </button>)
                        </p>
                        <p>
                          From your account dashboard you can view your{' '}
                          <Link to="/account/orders">recent orders</Link>, manage your{' '}
                          <Link to="/account/addresses">shipping and billing addresses</Link>, and{' '}
                          <Link to="/account/details">edit your password and account details</Link>.
                        </p>
                      </div>

                      {/* Quick Stats */}
                      <div className="row g-3">
                        <div className="col-md-4">
                          <div className="card bg-light-primary border-0">
                            <div className="card-body text-center">
                              <i className='bx bx-cart-alt display-4 text-primary'></i>
                              <h3 className="mb-0 mt-2">{currentUser.orderCount || 0}</h3>
                              <p className="mb-0 text-muted">Total Orders</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card bg-light-success border-0">
                            <div className="card-body text-center">
                              <i className='bx bx-heart display-4 text-success'></i>
                              <h3 className="mb-0 mt-2">{currentUser.wishlistCount || 0}</h3>
                              <p className="mb-0 text-muted">Wishlist Items</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card bg-light-warning border-0">
                            <div className="card-body text-center">
                              <i className='bx bx-map display-4 text-warning'></i>
                              <h3 className="mb-0 mt-2">{currentUser.addressCount || 0}</h3>
                              <p className="mb-0 text-muted">Saved Addresses</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="mt-4">
                        <h5 className="mb-3">Quick Actions</h5>
                        <div className="d-flex flex-wrap gap-2">
                          <Link to="/shop" className="btn btn-light">
                            <i className='bx bx-shopping-bag me-2'></i>
                            Continue Shopping
                          </Link>
                          <Link to="/account/orders" className="btn btn-light">
                            <i className='bx bx-receipt me-2'></i>
                            View Orders
                          </Link>
                          <Link to="/account/details" className="btn btn-light">
                            <i className='bx bx-edit me-2'></i>
                            Edit Profile
                          </Link>
                        </div>
                      </div>

                      {/* Account Info */}
                      <div className="mt-4 pt-4 border-top">
                        <h5 className="mb-3">Account Information</h5>
                        <div className="row">
                          <div className="col-md-6">
                            <p className="mb-2">
                              <strong>Email:</strong> {currentUser.email}
                            </p>
                            <p className="mb-2">
                              <strong>Phone:</strong> {currentUser.phone || 'Not provided'}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p className="mb-2">
                              <strong>Country:</strong> {currentUser.country || 'Not specified'}
                            </p>
                            <p className="mb-2">
                              <strong>Member since:</strong>{' '}
                              {currentUser.createdAt 
                                ? new Date(currentUser.createdAt).toLocaleDateString() 
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Logout</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowLogoutModal(false)}
                  disabled={loggingOut}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to logout?</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowLogoutModal(false)}
                  disabled={loggingOut}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Logging out...
                    </>
                  ) : (
                    <>
                      <i className='bx bx-log-out me-2'></i>
                      Logout
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AccountDashboard;