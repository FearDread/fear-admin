import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./contexts/routes/PrivateRoute";
import PublicRoute from "./contexts/routes/PublicRoute";

import Layout from "./pages/Layout";
import Dashboard from "./pages/account/Dashboard"

import Home from './pages/Home';
import Home2 from "./pages/Home2";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import LandingPage from "./pages/LandingPage";

import CheckoutShipping from "./pages/checkout/CheckoutShipping";
import CheckoutPayment from "./pages/checkout/CheckoutPayment";
import CheckoutDetails from "./pages/checkout/CheckoutDetails";
import CheckoutReview from "./pages/checkout/CheckoutReview";
import CheckoutComplete from "./pages/checkout/CheckoutComplete";

const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const About = lazy(() => import("./pages/About"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Contact = lazy(() => import("./pages/Contact"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const FAQ = lazy(() => import("./pages/Faq"));
const Shop = lazy(() => import("./pages/shop/Shop"));
const Shop2 = lazy(() => import("./pages/shop/Shop2"));
const ShopCart = lazy(() => import("./pages/shop/ShopCart"));
const ShopCategories = lazy(() => import("./pages/shop/ShopCategories"));
const ProductComparison = lazy(() => import("./pages/products/ProductComparison"));
const ProductDetails = lazy(() => import("./pages/products/ProductDetails"));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Orders = lazy(() => import("./pages/account/Orders"));
const UserDetails = lazy(() => import("./pages/account/UserDetails"));
const AccountPayment = lazy(() => import("./pages/account/PaymentMethods"));
const Addresses = lazy(() => import("./pages/account/Addresses"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const TermsOfService = lazy(() => import("./pages/policies/Terms"));
const PrivacyPolicy = lazy(() => import("./pages/policies/Privacy"));
const ReturnPolicy = lazy(() => import("./pages/policies/Returns"));

const APP_ROUTES = {
  landing: { path: "/landing", element: <LandingPage />},
  public: [
    { path: "/", element: <Home2 />, exact: true },
    { path: "/about", element: <AboutUs /> },
    { path: "/contact", element: <ContactUs /> },
    { path: "/blog", element: <Blog /> },
    { path: "/blog/:id", element:<BlogPost />},
    { path: "/shop", element: <Shop2 /> },
    { path: "/faq", element: <FAQ /> },
    { path: "/cart", element: <ShopCart /> },
    { path: "/shop-categories", element: <ShopCategories /> },
    { path: "/product/:id", element: <ProductDetails /> },
    { path: "/product-comparison", element: <ProductComparison /> },
    { path: "/wishlist", element: <Wishlist />},
  ],
  policy: [
    { path: "/terms", element: <TermsOfService /> },
    { path: "/privacy", element: <PrivacyPolicy /> },
    { path: "returns", element: <ReturnPolicy /> },
  ],
  auth: [
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/reset-password/:token", element: <ResetPassword /> },
  ],
  protected: [
    { path: "/account/dashboard", element: <Dashboard /> },
    { path: "/account/orders", element: <Orders /> },
    { path: "/account/details", element: <UserDetails /> },
    { path: "/account/payment-methods", element: <AccountPayment /> },
    { path: "/account/addresses", element: <Addresses /> },

    { path: "/checkout", element: <CheckoutDetails />},
    { path: "/checkout/review", element: <CheckoutReview />},
    { path: "/checkout/shipping", element: <CheckoutShipping />},
    { path: "/checkout/payment", element: <CheckoutPayment />},
    { path: "/checkout/details", element: <CheckoutDetails />},
    { path: "/checkout/complete", element: <CheckoutComplete />},

  ],
};

const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center min-vh-100">
    <div className="text-center">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted">Loading...</p>
    </div>
  </div>
);

const NotFound = () => (
  <div className="container">
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3">
          <span className="text-danger">Oops!</span> Page not found.
        </p>
        <p className="lead">
          The page you're looking for doesn't exist.
        </p>
        <a href="/" className="btn btn-primary">Go Home</a>
      </div>
    </div>
  </div>
);

export const App = () => {
  return (
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" exact element={<Layout />}>
            {APP_ROUTES.public.map((route) => (
              <Route key={route.path} path={route.path} element={<PublicRoute>{route.element}</PublicRoute>} />
            ))}
            {APP_ROUTES.policy.map((route) => (
              <Route key={route.path} path={route.path} element={<PublicRoute>{route.element}</PublicRoute>} />
            ))}

            {APP_ROUTES.auth.map((route) => (
              <Route key={route.path} path={route.path} element={<PublicRoute restricted>{route.element}</PublicRoute>} />
            ))}
            
            {APP_ROUTES.protected.map((route) => (
              <Route key={route.path} path={route.path} element={<PrivateRoute>{route.element}</PrivateRoute>} />
            ))}

            <Route path="/unauthorized" element={<NotFound />} />
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path={APP_ROUTES.landing.path} element={APP_ROUTES.landing.element} />
        </Routes>
      </Suspense>
  );
};

export default App;