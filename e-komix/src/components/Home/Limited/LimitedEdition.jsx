import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../Features/Cart/cartSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
import defaultProdImg from "../../../Assets/Images/abstract_banner_1.jpg";
import toast from "react-hot-toast";
import "swiper/css";
import "swiper/css/navigation";
import "./LimitedEdition.css";

const LimitedEdition = ( products ) => {
  const dispatch = useDispatch();
  const { loading, result } = useSelector((state) => state.crud.list);
  const [ wishList, setWishList ] = useState({});

  const handleWishlistClick = (productID) => {
    setWishList((prevWishlist) => ({
      ...prevWishlist,
      [productID]: !prevWishlist[productID],
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

//  const cartItems = useSelector((state) => state.cart.items);
  const cartItems = 0;

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

  return (
    <>
      <div className="limitedProductSection">
        <h2>
          Limited <span>Edition</span>
        </h2>
        <div className="limitedProductSlider">
          <div className="swiper-button image-swiper-button-next">
            <IoIosArrowForward />
          </div>
          <div className="swiper-button image-swiper-button-prev">
            <IoIosArrowBack />
          </div>
          <Swiper
            slidesPerView={4}
            slidesPerGroup={4}
            spaceBetween={30}
            loop={true}
            navigation={{
              nextEl: ".image-swiper-button-next",
              prevEl: ".image-swiper-button-prev",
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            modules={[Navigation, Autoplay]}
            breakpoints={{
              320: {
                slidesPerView: 2,
                slidesPerGroup: 1,
                spaceBetween: 14,
              },
              768: {
                slidesPerView: 3,
                slidesPerGroup: 1,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                slidesPerGroup: 1,
                spaceBetween: 30,
              },
            }}
          >
            {result && result.slice(0, 13).map((product) => {
              return (
                <SwiperSlide key={product._id}>
                  <div className="lpContainer">
                    <div className="lpImageContainer">
                      <Link to="/Product" onClick={scrollToTop}>
                        <img
                          src={product.images ? product.images[0].url : defaultProdImg}
                          alt={product.images ? product.images[1].url : defaultProdImg}
                          className="lpImage"
                        />
                      </Link>
                      <h4 onClick={() => handleAddToCart(product)}>
                        Add to Cart
                      </h4>
                    </div>
                    <div
                      className="lpProductImagesCart"
                      onClick={() => handleAddToCart(product)}
                    >
                      <FaCartPlus />
                    </div>
                    <div className="limitedProductInfo">
                      <div className="lpCategoryWishlist">
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
                      <div className="productNameInfo">
                        <Link to="/Product" onClick={scrollToTop}>
                          <h5>{product.title}</h5>
                        </Link>
                        <p>${product.price}</p>
                        <div className="productRatingReviews">
                          <div className="productRatingStar">
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
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default LimitedEdition;
