import React, { useState  } from "react";
import { useDispatch } from "react-redux";
import { FiHeart } from "react-icons/fi";
import { FaStar, FaCartPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import defaultProdImg from "../../../assets/images/abstract_banner_1.jpg";
import { cruds, cart, auth } from "@feardread/crud-service";
import "./ProductCard.css";


const ProductCard = ( props ) => {
  const dispatch = useDispatch();
  const { grid, data, key } = props;
  const [ wishList, setWishList ] = useState({});
  const cartItems = 0;
  const sortByPrice = (a, b) => a.productPrice - b.productPrice;

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
      dispatch(cart.add(product));
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

    return (
        <>
        <div className={`gr-${grid}` + " col-3 trendy-card"} key={key}>
        <div className="trendyProductContainer" key={data._id}>
        <div className="trendyProductImages">
        <Link to={`/product/${data._id}`} onClick={scrollToTop}>
          <img src={data.images ? data.images[0].url : defaultProdImg} alt=""
            className="trendyProduct_front"
            />
          <img src={data.images[1] ? data.images[1].url : defaultProdImg} alt=""
            className="trendyProduct_back"
          />
          </Link>
         <h4 onClick={() => handleAddToCart(data)}>
            Add to Cart
         </h4>
        </div>
        <div
          className="sdProductImagesCart"
          onClick={() => handleAddToCart(data)}
        >
          <FaCartPlus />
        </div>
        <div className="sdProductInfo">
          <div className="sdProductCategoryWishlist">
            <p>{data.category}</p>
            <FiHeart
              onClick={() => handleWishlistClick(data._id)}
              style={{
                color: wishList[data._id]
                  ? "red"
                  : "#767676",
                cursor: "pointer",
              }}
            />
          </div>
          <div className="sdProductNameInfo">
            <Link to="/product" onClick={scrollToTop}>
              <h5>{data.title}</h5>
            </Link>

            <p>${data.price}</p>
            <div className="sdProductRatingReviews">
              <div className="sdProductRatingStar">
                <FaStar color="#FEC78A" size={10} />
                <FaStar color="#FEC78A" size={10} />
                <FaStar color="#FEC78A" size={10} />
                <FaStar color="#FEC78A" size={10} />
                <FaStar color="#FEC78A" size={10} />
              </div>
              <span>{data.reviews}</span>
            </div>
          </div>
        </div>
      </div>
      </div>
      </>
    )
}

export default ProductCard;