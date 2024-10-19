import React, { useState, useEffect } from "react";
import "./Trendy.css";
import defaultProdImg from "../../../Assets/Images/abstract_banner_1.jpg";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../Features/Cart/cartSlice";
import { Link } from "react-router-dom";
import StoreData from "../../../Data/StoreData";
import ProductCard from "../../Product/ProductCard/ProductCard";
import TrendyCard from "../../Product/TrendyCard/TrendyCard";
import { FiHeart } from "react-icons/fi";
import { FaStar, FaCartPlus } from "react-icons/fa";
import toast from "react-hot-toast";

const Trendy = ( data ) => {
  const dispatch = useDispatch();
  const [ activeTab, setActiveTab ] = useState("tab1");
  const [ wishList, setWishList ] = useState({});
  const { result } = useSelector((state) => state.crud.list);
  //const cartItems = useSelector((state) => state.cart.items);
  const sortByPrice = (a, b) => a.productPrice - b.productPrice;
  const products = data.products || [];
  const cartItems = 0;

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
      toast.error("Product limit reached", {
        duration: 2000,
        style: {
          backgroundColor: "#ff4b4b",
          color: "white",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#ff4b4b",
        },
      });
    } else {
      dispatch(addToCart(product));
      toast.success(`Added to cart!`, {
        duration: 2000,
        style: {
          backgroundColor: "#07bc0c",
          color: "white",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#07bc0c",
        },
      });
    }
  };

  useEffect(() => {

    //console.log('trendy = ', products);
    //console.log('trendy selector = ', result);

  }, []);

  return (
    <>
      <div className="trendyProducts">
        <h2>
          Our Trendy <span>Products</span>
        </h2>
        <div className="trendyTabs">
          <div className="tabs">
            <p
              onClick={() => handleTabClick("tab1")}
              className={activeTab === "tab1" ? "active" : ""}
            >
              All
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
            {/* Tab 1 */}
            {activeTab === "tab1" && (
              <div className="trendyMainContainer">
                {result.map && result.slice(0, 8).map((product) => (
                  <div className="trendyProductContainer" key={product.id}>
                    <div className="trendyProductImages">
                      <Link to="/Product" onClick={scrollToTop}>
                        <img
                          src={product.images ? product.images[0].url : defaultProdImg}
                          alt=""
                          className="trendyProduct_front"
                        />
                        <img
                          src={product.images[1] ? product.images[1].url : defaultProdImg}
                          alt=""
                          className="trendyProduct_back"
                        />
                      </Link>
                      <h4 onClick={() => handleAddToCart(product)}>
                        Add to Cart
                      </h4>
                    </div>
                    <div
                      className="trendyProductImagesCart"
                      onClick={() => handleAddToCart(product)}
                    >
                      <FaCartPlus />
                    </div>
                    <div className="trendyProductInfo">
                      <div className="trendyProductCategoryWishlist">
                        <p>{product.category}</p>
                        <FiHeart
                          onClick={() => handleWishlistClick(product._id)}
                          style={{
                            color: wishList[product._id]
                              ? "red"
                              : "#767676",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                      <div className="trendyProductNameInfo">
                        <Link to="product" onClick={scrollToTop}>
                          <h5>{product.title}</h5>
                        </Link>

                        <p>${product.price}</p>
                        <div className="trendyProductRatingReviews">
                          <div className="trendyProductRatingStar">
                            <FaStar color="#FEC78A" size={10} />
                            <FaStar color="#FEC78A" size={10} />
                            <FaStar color="#FEC78A" size={10} />
                            <FaStar color="#FEC78A" size={10} />
                            <FaStar color="#FEC78A" size={10} />
                          </div>
                          <span>{product.reviews}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2 */}
            {activeTab === "tab2" && (
              <div className="trendyMainContainer">
                {StoreData.slice(0, 8).reverse().map((product) => (
                  <TrendyCard {...product} />
                ))}
              </div>
            )}

            {/* Tab 3 */}
            {activeTab === "tab3" && (
              <div className="trendyMainContainer">
                {StoreData.slice(0, 8)
                  .sort(sortByReviews)
                  .map((product) => (
                    <div className="trendyProductContainer" key={product.id}>
                      <div className="trendyProductImages">
                        <Link to="/Product" onClick={scrollToTop}>
                          <img
                            src={product.frontImg}
                            alt=""
                            className="trendyProduct_front"
                          />
                          <img
                            src={product.backImg}
                            alt=""
                            className="trendyProduct_back"
                          />
                        </Link>
                        <h4 onClick={() => handleAddToCart(product)}>
                          Add to Cart
                        </h4>
                      </div>
                      <div
                        className="trendyProductImagesCart"
                        onClick={() => handleAddToCart(product)}
                      >
                        <FaCartPlus />
                      </div>
                      <div className="trendyProductInfo">
                        <div className="trendyProductCategoryWishlist">
                          <p>Dresses</p>
                          <FiHeart
                            onClick={() =>
                              handleWishlistClick(product.productID)
                            }
                            style={{
                              color: wishList[product.productID]
                                ? "red"
                                : "#767676",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                        <div className="trendyProductNameInfo">
                          <Link to="product" onClick={scrollToTop}>
                            <h5>{product.productName}</h5>
                          </Link>

                          <p>${product.productPrice}</p>
                          <div className="trendyProductRatingReviews">
                            <div className="trendyProductRatingStar">
                              <FaStar color="#FEC78A" size={10} />
                              <FaStar color="#FEC78A" size={10} />
                              <FaStar color="#FEC78A" size={10} />
                              <FaStar color="#FEC78A" size={10} />
                              <FaStar color="#FEC78A" size={10} />
                            </div>
                            <span>{product.productReviews}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Tab 4 */}
            {activeTab === "tab4" && (
              <div className="trendyMainContainer">
                {StoreData.slice(0, 8)
                  .sort(sortByPrice)
                  .map((product) => (
                    <div className="trendyProductContainer" key={product.id}>
                      <div className="trendyProductImages">
                        <Link to="/Product">
                          <img
                            src={product.frontImg}
                            alt=""
                            className="trendyProduct_front"
                          />
                          <img
                            src={product.backImg}
                            alt=""
                            className="trendyProduct_back"
                          />
                        </Link>
                        <h4 onClick={() => handleAddToCart(product)}>
                          Add to Cart
                        </h4>
                      </div>
                      <div
                        className="trendyProductImagesCart"
                        onClick={() => handleAddToCart(product)}
                      >
                        <FaCartPlus />
                      </div>
                      <div className="trendyProductInfo">
                        <div className="trendyProductCategoryWishlist">
                          <p>Dresses</p>
                          <FiHeart
                            onClick={() =>
                              handleWishlistClick(product.productID)
                            }
                            style={{
                              color: wishList[product.productID]
                                ? "red"
                                : "#767676",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                        <div className="trendyProductNameInfo">
                          <Link to="/product" onClick={scrollToTop}>
                            <h5>{product.productName}</h5>
                          </Link>

                          <p>${product.productPrice}</p>
                          <div className="trendyProductRatingReviews">
                            <div className="trendyProductRatingStar">
                              <FaStar color="#FEC78A" size={10} />
                              <FaStar color="#FEC78A" size={10} />
                              <FaStar color="#FEC78A" size={10} />
                              <FaStar color="#FEC78A" size={10} />
                              <FaStar color="#FEC78A" size={10} />
                            </div>
                            <span>{product.productReviews}</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
