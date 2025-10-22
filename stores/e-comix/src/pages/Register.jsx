import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BannerSub from "../components/Banner/BannerSub";
import BreadCrumbs from "../components/Common/BreadCrumbs";
import { User } from "../features/user/slice";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false
    });

    // Loading state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redux selectors
    const { success: loginSuccess, data: userData, loading, error } = useSelector(
        (state) => state.user
    );

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Form validation
    const validateForm = () => {
        const { name, email, mobile, password, confirmPassword, agreeToTerms } = formData;

        if (!name.trim()) {
            toast.error("Full name is required");
            return false;
        }

        if (!email.trim()) {
            toast.error("Email is required");
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        if (!password) {
            toast.error("Password is required");
            return false;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return false;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return false;
        }

        if (!agreeToTerms) {
            toast.error("You must agree to the Terms of Use");
            return false;
        }

        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const formdata = new FormData();
            formdata.set("name", formData.name);
            formdata.set("username", formData.email)
            formdata.set("email", formData.email);
            formdata.set("mobile", formData.mobile);
            formdata.set("password", formData.password);

            await dispatch(User.register(formdata));
        } catch (err) {
            console.error("Registration error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle successful registration
    useEffect(() => {
        if (loginSuccess && userData) {
            // Store auth data (assuming you have a proper storage utility)
            try {
                localStorage.setItem("auth", JSON.stringify(userData));
            } catch (err) {
                console.error("Failed to save auth data:", err);
            }

            toast.success("Registration successful!");
            navigate('/cart');
        }
    }, [loginSuccess, userData, navigate]);

    // Handle registration errors
    useEffect(() => {
        if (error) {
            toast.error(error.message || "Registration failed. Please try again.");
        }
    }, [error]);

    const breadcrumbData = {
        link: "/",
        crumb: "Register"
    };

    return (
        <>
            <BannerSub />
            <main className="float-start w-100 total-body home-body mt-0">
                <BreadCrumbs breadcrumbs={breadcrumbData} />

                <section className="register-page-div pt-5 d-inline-block w-100">
                    <div className="container">
                        <div className="row gx-lg-5 justify-content-center">
                            <div className="col-lg-6 col-md-8">
                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="com-div-md">
                                        <h5 className="text-center mb-3">Free Register</h5>

                                        <div className="login-modal-pn">
                                            <div className="cm-select-login mt-0">

                                                {/* Full Name Input */}
                                                <div className="country-dp mb-3">
                                                    <label htmlFor="name" className="form-label">
                                                        First Name*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        placeholder="Full Name"
                                                        required
                                                        disabled={isSubmitting}
                                                    />
                                                </div>

                                                {/* Email Input */}
                                                <div className="phone-div mb-3">
                                                    <label htmlFor="email" className="form-label">
                                                        Email Address *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        placeholder="Email Address"
                                                        required
                                                        disabled={isSubmitting}
                                                    />
                                                </div>

                                                {/* Mobile Input */}
                                                <div className="phone-div mb-3">
                                                    <label htmlFor="mobile" className="form-label">
                                                        Mobile Number
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="mobile"
                                                        value={formData.mobile}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        placeholder="Mobile Number"
                                                        disabled={isSubmitting}
                                                    />
                                                </div>

                                                {/* Password Input */}
                                                <div className="phone-div mb-3">
                                                    <label htmlFor="password" className="form-label">
                                                        Password *
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        placeholder="Create Password"
                                                        required
                                                        disabled={isSubmitting}
                                                        minLength="6"
                                                    />
                                                </div>

                                                {/* Confirm Password Input */}
                                                <div className="phone-div mb-3">
                                                    <label htmlFor="confirmPassw" className="form-label">
                                                        Confirm Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        placeholder="Confirm Password"
                                                        required
                                                        disabled={isSubmitting}
                                                        minLength="6"
                                                    />
                                                </div>

                                                {/* Terms Agreement */}
                                                <div className="forget2 mt-3 mb-3 d-flex align-items-start">
                                                    <input
                                                        type="checkbox"
                                                        name="agreeToTerms"
                                                        checked={formData.agreeToTerms}
                                                        onChange={handleInputChange}
                                                        className="form-check-input me-2 mt-1"
                                                        id="agreeToTerms"
                                                        required
                                                        disabled={isSubmitting}
                                                    />
                                                    <label className="form-check-label" htmlFor="agreeToTerms">
                                                        By clicking Register, you agree to our{" "}
                                                        <a href="/terms" target="_blank" rel="noopener noreferrer">
                                                            Terms of Use
                                                        </a>{" "}
                                                        and{" "}
                                                        <a href="/privacy" target="_blank" rel="noopener noreferrer">
                                                            Cookie Policy
                                                        </a>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                className="btn continue-bn w-100"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? "Registering..." : "Register"}
                                            </button>
                                        </div>

                                        {/* Login Link */}
                                        <p className="text-center mt-3">
                                            Already have an account?{" "}
                                            <button
                                                type="button"
                                                className="btn-link regster-bn"
                                                onClick={() => navigate('/login')}
                                                disabled={isSubmitting}
                                            >
                                                Login
                                            </button>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Register;