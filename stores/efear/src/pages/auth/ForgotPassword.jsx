import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  forgotPassword, 
  selectUserLoading, 
  selectUserError, 
  selectUserSuccess,
  clearError 
} from '../../features/user/slice';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const success = useSelector(selectUserSuccess);
  
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    dispatch(clearError());
    const result = await dispatch(forgotPassword({ email }));
    
    if (forgotPassword.fulfilled.match(result)) {
      setSubmitted(true);
      // Optionally redirect after a delay
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      dispatch(clearError());
    }
  };

  useEffect(() => {
    if ( success ) {
      dispatch(clearError());
    }
  }, [dispatch]);

  return (
    <>
      <section className="py-3 border-bottom d-none d-md-flex">
        <div className="container">
          <div className="page-breadcrumb d-flex align-items-center">
            <h3 className="breadcrumb-title pe-3">Forgot Password</h3>
            <div className="ms-auto">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <Link to="/">
                      <i className="bx bx-home-alt"></i> Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Reset Password
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="authentication-forgot d-flex align-items-center justify-content-center">
            <div className="card forgot-box">
              <div className="card-body">
                <div className="p-4 rounded border">
                  <div className="text-center">
                    <img 
                      src="assets/images/icons/forgot-2.png" 
                      width="120" 
                      alt="Forgot Password" 
                    />
                  </div>
                  
                  {!submitted ? (
                    <>
                      <h4 className="mt-5 font-weight-bold">Forgot Password?</h4>
                      <p>Enter your registered email ID to reset the password</p>
                      
                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}
                      
                      <form onSubmit={handleSubmit}>
                        <div className="my-4">
                          <label className="form-label">Email id</label>
                          <input 
                            type="email" 
                            className="form-control form-control-lg" 
                            placeholder="example@user.com"
                            value={email}
                            onChange={handleEmailChange}
                            disabled={loading}
                            required
                          />
                        </div>
                        
                        <div className="d-grid gap-2">
                          <button 
                            type="submit" 
                            className="btn btn-dark btn-ecomm"
                            disabled={loading || !email}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Sending...
                              </>
                            ) : (
                              'Send'
                            )}
                          </button>
                          
                          <Link to="/login" className="btn btn-light btn-ecomm">
                            <i className='bx bx-arrow-back me-1'></i>Back to Login
                          </Link>
                        </div>
                      </form>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="alert alert-success mt-4" role="alert">
                        <i className='bx bx-check-circle fs-1'></i>
                        <h5 className="mt-3">Email Sent Successfully!</h5>
                        <p>
                          We've sent password reset instructions to <strong>{email}</strong>.
                          Please check your inbox and follow the link to reset your password.
                        </p>
                        <p className="text-muted small">
                          Redirecting to login in 5 seconds...
                        </p>
                      </div>
                      
                      <Link to="/login" className="btn btn-light btn-ecomm mt-3">
                        <i className='bx bx-arrow-back me-1'></i>Back to Login
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;