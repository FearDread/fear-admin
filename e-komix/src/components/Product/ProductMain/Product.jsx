import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../Features/Cart/cartSlice";
import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { FaStar } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { PiShareNetworkLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import defaultProdImg from "../../../Assets/Images/abstract_banner_1.jpg";

import "./Product.css";

const Product = ( product ) => {
  const dispatch = useDispatch();
  const [ currentImg, setCurrentImg ] = useState(0);
  const [ quantity, setQuantity ] = useState(1);
  const [ clicked, setClicked ] = useState(false);
  const productImg = product.images ? product.images[0].url : defaultProdImg;
  //const cartItems = useSelector((state) => state.cart.items);
  const cartItems = 0;
  
  const prevImg = () => {
    setCurrentImg(currentImg === 0 ? productImg.length - 1 : currentImg - 1);
  };

  const nextImg = () => {
    setCurrentImg(currentImg === productImg.length - 1 ? 0 : currentImg + 1);
  };

  const increment = () => {
    setQuantity(quantity + 1);
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleInputChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleWishClick = () => {
    setClicked(!clicked);
  };

  const handleAddToCart = (e) => {
    const productDetails = {
      _id: 14,
      title: "Lightweight Puffer Jacket",
      price: 90,
      images: defaultProdImg,
      reviews: 100,
    };

    const productInCart = cartItems.find(
      (item) => item.productID === productDetails.productID
    );

    if (productInCart && productInCart.quantity >= 20) {
      toast.error("Product limit reached", );
    } else {
      dispatch(addToCart(productDetails));
      toast.success(`Added to cart!`);
    }
  };

  return (
    <>
      <div className="productSection">
        <div className="productShowCase">
          <div className="productGallery">
            <div className="productThumb">
              {product && product.images && product.images.map((img, key) => {
                <img src={img.url} onClick={() => setCurrentImg(key)} alt="product" />
              })}
            </div>
            <div className="productFullImg">
              <img src={product.images[currentImg].url} alt="" />
              <div className="buttonsGroup">
                <button onClick={prevImg} className="directionBtn">
                  <GoChevronLeft size={18} />
                </button>
                <button onClick={nextImg} className="directionBtn">
                  <GoChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
          <div className="productDetails">
            <div className="productBreadcrumb">
              <div className="breadcrumbLink">
                <Link to="/">Home</Link>&nbsp;/&nbsp;
                <Link to="/shop">The Shop</Link>
              </div>
              <div className="prevNextLink">
                <Link to="/product">
                  <GoChevronLeft />
                  <p>Prev</p>
                </Link>
                <Link to="/product">
                  <p>Next</p>
                  <GoChevronRight />
                </Link>
              </div>
            </div>
            <div className="productName">
              <h1>{product.title}</h1>
            </div>
            <div className="productRating">
              <FaStar color="#FEC78A" size={10} />
              <FaStar color="#FEC78A" size={10} />
              <FaStar color="#FEC78A" size={10} />
              <FaStar color="#FEC78A" size={10} />
              <FaStar color="#FEC78A" size={10} />
              <p>{product.reviews}</p>
            </div>
            <div className="productPrice">
              <h3>{product.price}</h3>
            </div>
            <div className="productDescription">
              <p>
                {product.description}
              </p>
            </div>
            <div className="productCartQuantity">
              <div className="productQuantity">
                <button onClick={decrement}>-</button>
                <input
                  type="text"
                  value={quantity}
                  onChange={handleInputChange}
                />
                <button onClick={increment}>+</button>
              </div>
              <div className="productCartBtn">
                <button onClick={handleAddToCart}>Add to Cart</button>
              </div>
            </div>
            <div className="productWishShare">
              <div className="productWishList">
                <button onClick={handleWishClick}>
                  <FiHeart color={clicked ? "red" : ""} size={17} />
                  <p>Add to Wishlist</p>
                </button>
              </div>
              <div className="productShare">
                <PiShareNetworkLight size={22} />
                <p>Share</p>
              </div>
            </div>
            <div className="productTags">
              <p>
                <span>SKU: </span>{product._id}
              </p>
              <p>
                <span>CATEGORIE: </span> {product.category}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
