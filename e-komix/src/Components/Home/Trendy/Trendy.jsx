import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../Features/Cart/cartSlice";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FaStar, FaCartPlus } from "react-icons/fa";
import TrendyCard from "../../Product/TrendyCard/TrendyCard";
import toast from "react-hot-toast";
import defaultProdImg from "../../../Assets/Images/abstract_banner_1.jpg";
import "./Trendy.css";

const Trendy = ( {products} ) => {
  const dispatch = useDispatch();
  const [ activeTab, setActiveTab ] = useState("tab1");
  const [ wishList, setWishList ] = useState({});
  const { result } = useSelector((state) => state.crud.list);
  //const cartItems = useSelector((state) => state.cart.items);
  const sortByPrice = (a, b) => a.productPrice - b.productPrice;
  //const products = data.products || [];
  const cartItems = 0;

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: "smooth" });
  };

  const handleWishlistClick = (productID) => {
    setWishList((prevWishlist) => ({
      ...prevWishlist,
      [productID]: !prevWishlist[productID],
    }));
  };

  const sortByReviews = (a, b) => {
    const reviewsA = parseInt(
      a.productReviews.replace("k+ reviews", "").replace(",", "")
    );
    const reviewsB = parseInt(
      b.productReviews.replace("k+ reviews", "").replace(",", "")
    );
    return reviewsB - reviewsA;
  };

  const handleAddToCart = (product) => {
    const productInCart = cartItems.find(
      (item) => item.productID === product.productID
    );

    if (productInCart && productInCart.quantity >= 20) {
      toast.error("Product limit reached");
    } else {
      dispatch(addToCart(product));
      toast.success(`Added to cart!`);
    }
  };

  useEffect(() => {
    console.log('products = ', products);
  }, [products]);

  return (
    <>
      <div className="trendyProducts">
        <h2>
          Our Trending <span>Products</span>
        </h2>
        <div className="trendyTabs">
          <div className="tabs">
            <p
              onClick={() => handleTabClick("tab1")}
              className={activeTab === "tab1" ? "active" : ""}
            >
              Trending
            </p>
            <p
              onClick={() => handleTabClick("tab2")}
              className={activeTab === "tab2" ? "active" : ""}
            >
              New Arrivals
            </p>
            <p
              onClick={() => handleTabClick("tab3")}
              className={activeTab === "tab3" ? "active" : ""}
            >
              Best Seller
            </p>
            <p
              onClick={() => handleTabClick("tab4")}
              className={activeTab === "tab4" ? "active" : ""}
            >
              Top Rated
            </p>
          </div>
          <div className="trendyTabContent">
            {activeTab === "tab1" && (
              <div className="trendyMainContainer">
              {result && result.slice(0, 8).map((product) => (
                <TrendyCard product={product} />
              ))}
            </div>
            )}
            {activeTab === "tab2" && (
              <div className="trendyMainContainer">
                {result && result.slice(0, 8).reverse().map((product) => (
                  <TrendyCard product={product} />
                ))}
              </div>
            )}
            {activeTab === "tab3" && (
              <div className="trendyMainContainer">
                {result && result.slice(0, 8).map((product) => (
                  <TrendyCard product={product} />
              ))}
              </div>
            )}
            {activeTab === "tab4" && (
              <div className="trendyMainContainer">
                {result && result.slice(0, 8)
                  .sort(sortByPrice)
                  .map((product) => (
                    <TrendyCard product={product} />
                  ))}
              </div>
            )}
          </div>
        </div>
        <div className="discoverMore">
          <Link to="/shop" onClick={scrollToTop}>
            <p>Discover More</p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Trendy;
