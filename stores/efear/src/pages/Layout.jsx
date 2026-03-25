import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import Header2 from "../components/header/Header2";
import Footer2 from "../components/common/Footer2";
import BestSelling from "../components/products/BestSelling";

import { dispatch } from "../features/store";
import { selectProductsSuccess } from "../features/products/slice";
import {
  fetchProducts,
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
} from '../features/products/slice';
import { fetchCategories, selectAllCategories } from '../features/categories/slice';
import ProductQuickView from "../components/products/ProductQuickView";
import CookieBanner from "../components/common/CookieBanner";
import ProductCarousel from "../components/products/ProductCarousel";


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);
const currentEnv = process.env.NODE_ENV;

const Layout = () => {
  const products = useSelector(selectAllProducts);
  const categories = useSelector(selectAllCategories);
  const loading = useSelector(selectProductsLoading);
  const success = useSelector(selectProductsSuccess);
  const error = useSelector(selectProductsError);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [status, setStatus] = useState(null); // null | 'visible' | 'accepted' | 'rejected'
  const [acceptedPrefs, setAcceptedPrefs] = useState(null);

  const handleAccept = (prefs) => {
    localStorage.setItem("cookie-consent", JSON.stringify(prefs));
    setAcceptedPrefs(prefs);
    setStatus("accepted");
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({ essential: true }));
    setAcceptedPrefs({ essential: true });
    setStatus("rejected");
  };

  const reset = () => {
    localStorage.removeItem("cookie-consent");
    setStatus("visible");
    setAcceptedPrefs(null);
  };

  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  }

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("cookie-consent");
    if (!saved) {
      setTimeout(() => setStatus("visible"), 600);
    } else {
      setStatus("accepted");
      setAcceptedPrefs(JSON.parse(saved));
    }
  }, []);

  const stripeOptions = useMemo(() => ({
    // Stripe Elements appearance customization
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'Ideal Sans, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '4px',
      },
    },
  }), []);

  return (
    <>
      <div className="separator-animated-border animated-true"></div>
      <Elements stripe={stripePromise} options={stripeOptions}>

        <b className="screen-overlay"></b>
        <div className="wrapper">
          <Header2 />
        </div>
        <div className="page-wrapper">
          <div className="page-content">
            {(!loading && products.length > 0) && (
              <>
                <Outlet {...products} />
              </>
            )}

            <BestSelling />

          </div>
        </div>
        <Footer2 categories={(!loading) ? categories : []} products={products} />

        {status === "visible" && (
          <CookieBanner onAccept={handleAccept} onReject={handleReject} />
        )}

        {selectedProduct && (
          <ProductQuickView
            product={selectedProduct}
            isOpen={showQuickView}
            onClose={() => {
              setShowQuickView(false);
              setSelectedProduct(null);
            }}
          />
        )}
      </Elements>
      <ScrollToTop />
    </>
  );
};

export default Layout;