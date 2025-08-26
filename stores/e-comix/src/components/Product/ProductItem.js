

export const ProductItem = ({ item }) => {
  const discountPrice = item.discount || 0;
  const imageUrl = item?.images?.[0]?.url;
  const productUrl = `/product/${item._id}`;

  return (
    <a 
      href={productUrl} 
      className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" 
      data-aos="fade-left"
      aria-label={`View ${item.title} product`}
    >
      <div className="img-box-div position-relative">
        <img 
          alt={item.title || 'Product image'} 
          src={imageUrl} 
          loading="lazy"
        />
        <span className="off">{item._id}</span>
      </div>
      
      <div className="details-shopi">
        <div className="row align-items-center">
          <div className="col-8">
            <h5 className="text-white">
              {item.title}
              <span className="d-block">{item.category}</span>
            </h5>
          </div>
          <div className="col-4">
            <h3 className="text-center">
              ${item.price}
              {discountPrice > 0 && (
                <span className="d-block">${discountPrice}</span>
              )}
            </h3>
          </div>
        </div>
      </div>
    </a>
  );
};

export default ProductItem;