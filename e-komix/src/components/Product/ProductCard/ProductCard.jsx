import React, { useState  } from "react";

const ProductCard = ({ data }) => {
  const product = data;
  console.log('product = ', product);

    return (
        <>
        <div className="sdProductContainer">
        <div className="sdProductImages">
          <Link to="/Product" onClick={scrollToTop}>
            <img
              src={product.frontImg}
              alt=""
              className="sdProduct_front"
            />
            <img
              src={product.backImg}
              alt=""
              className="sdProduct_back"
            />
          </Link>
          <h4 onClick={() => handleAddToCart(product)}>
            Add to Cart
          </h4>
        </div>
        <div
          className="sdProductImagesCart"
          onClick={() => handleAddToCart(product)}
        >
          <FaCartPlus />
        </div>
        <div className="sdProductInfo">
          <div className="sdProductCategoryWishlist">
            <p>Dresses</p>
            <FiHeart
              onClick={() => handleWishlistClick(product.productID)}
              style={{
                color: wishList[product.productID]
                  ? "red"
                  : "#767676",
                cursor: "pointer",
              }}
            />
          </div>
          <div className="sdProductNameInfo">
            <Link to="/product" onClick={scrollToTop}>
              <h5>{product.productName}</h5>
            </Link>

            <p>${product.productPrice}</p>
            <div className="sdProductRatingReviews">
              <div className="sdProductRatingStar">
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
      </>
    )
}

export default ProductCard;