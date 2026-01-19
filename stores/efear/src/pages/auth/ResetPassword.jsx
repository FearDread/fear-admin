import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    // Verify token on component mount
    useEffect(() => {
        axios.get(`/api/users/verify-reset-token/${token}`)
            .then(() => setTokenValid(true))
            .catch(() => {
                setError('Invalid or expired reset link');
                setTimeout(() => navigate('/forgot-password'), 3000);
            });
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`/api/users/reset-password/${token}`, {
                password
            });

            if (response.data.success) {
                // Optionally auto-login or redirect to login
                navigate('/login', {
                    state: { message: 'Password reset successfully. Please login.' }
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (!tokenValid && !error) {
        return <div>Verifying reset link...</div>;
    }

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
                                                <h2>Reset Password</h2>

                                                {error && <div className="alert alert-danger">{error}</div>}

                                                <input
                                                    type="password"
                                                    placeholder="New Password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />

                                                <input
                                                    type="password"
                                                    placeholder="Confirm Password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                />

                                                <button type="submit" disabled={loading}>
                                                    {loading ? 'Resetting...' : 'Reset Password'}
                                                </button>
                                            </form>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <div className="alert alert-success mt-4" role="alert">
                                                <i className='bx bx-check-circle fs-1'></i>
                                                <h5 className="mt-3">Email Sent Successfully!</h5>
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

export default ResetPassword;