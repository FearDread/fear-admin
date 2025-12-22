

export const ProductCard = ( product ) => {

  const detailsLink = "/" + product._id;

  const handleWishlist = () => {

  }
  const handleAddToCart = () => {

  }

  return (
    <>
    <div className="col">
      <div className="card rounded-0 product-card">
        <div className="card-header bg-transparent border-bottom-0">
          <div className="d-flex align-items-center justify-content-end gap-3">
            <a href={detailsLink}>
              <div className="product-compare"><span><i className='bx bx-git-compare'></i> Compare</span>
            </div>
          </a>
          <a href="#" onClick={handleWishlist}>
            <div className="product-wishlist"> <i className='bx bx-heart'></i>
          </div>
        </a>
      </div>
    </div>
    <a href={detailsLink}>
      <img src={(product.images[0]) ? product.images[0].url : null} className="card-img-top" alt="..." />
    </a>
    <div className="card-body">
      <div className="product-info">
        <a href="javascript:;">
          <p className="product-catergory font-13 mb-1">{product.category}</p>
        </a>
        <a href="javascript:;">
          <h6 className="product-name mb-2">{product.title}</h6>
        </a>
        <div className="d-flex align-items-center">
          <div className="mb-1 product-price"> <span className="me-1 text-decoration-line-through">${product.price}</span>
          <span className="text-white fs-5">${product.price}</span>
        </div>
        <div className="cursor-pointer ms-auto"> <i className="bx bxs-star text-white"></i>
        <i className="bx bxs-star text-white"></i>
        <i className="bx bxs-star text-white"></i>
        <i className="bx bxs-star text-white"></i>
        <i className="bx bxs-star text-light-4"></i>
      </div>
    </div>
    <div className="product-action mt-2">
      <div className="d-grid gap-2">
        <a href="javascript:;" className="btn btn-light btn-ecomm"> <i className='bx bxs-cart-add'></i>Add to Cart</a> <a href="javascript:;" className="btn btn-link btn-ecomm" data-bs-toggle="modal" data-bs-target="#QuickViewProduct"><i className='bx bx-zoom-in'></i>Quick View</a>
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </>
  );
};

export default ProductCard;