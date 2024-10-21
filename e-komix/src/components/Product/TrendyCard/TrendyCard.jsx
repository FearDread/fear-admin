import React, { useState  } from "react";
import { useDispatch } from "react-redux";
import { FiHeart } from "react-icons/fi";
import { FaStar, FaCartPlus } from "react-icons/fa";
import { addToCart } from "../../../Features/Cart/cartSlice";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import defaultProdImg from "../../../Assets/Images/abstract_banner_1.jpg";

const TrendyCard = ( product ) => {
  const dispatch = useDispatch();
  const sortByPrice = (a, b) => a.productPrice - b.productPrice;
  const [ wishList, setWishList ] = useState({});
  const cartItems = 0;

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

    return (
        <div className="trendyProductContainer" key={product._id}>
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
    )
}

export default TrendyCard;