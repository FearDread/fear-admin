import React from "react";
import defaultProdImg from "../../../assets/images/abstract_banner_1.jpg";


const LimitedCard = ( {product} ) => {

    return (
        <div className="lpContainer">
        <div className="lpImageContainer">
          <Link to={`/product/${product._id}`}>
            <img
              src={product.images && product.images[0] ? product.images[0].url : defaultProdImg}
              alt={product.images && product.images[1] ? product.images[1].url : defaultProdImg}
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
    )
}

export default LimitedCard;