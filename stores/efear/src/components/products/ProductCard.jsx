

const ProductCard = ({ product }) => {
  return (
    <>
    <div className="col">
      <div className="card rounded-0 product-card">
        <div className="card-header bg-transparent border-bottom-0">
          <div className="d-flex align-items-center justify-content-end gap-3">
            <a href="javascript:;">
              <div className="product-compare"><span><i className='bx bx-git-compare'></i> Compare</span>
            </div>
          </a>
          <a href="javascript:;">
            <div className="product-wishlist"> <i className='bx bx-heart'></i>
          </div>
        </a>
      </div>
    </div>
    <a href="product-details.html">
      <img src="assets/images/products/03.png" className="card-img-top" alt="..." />
    </a>
    <div className="card-body">
      <div className="product-info">
        <a href="javascript:;">
          <p className="product-catergory font-13 mb-1">Catergory Name</p>
        </a>
        <a href="javascript:;">
          <h6 className="product-name mb-2">Product Short Name</h6>
        </a>
        <div className="d-flex align-items-center">
          <div className="mb-1 product-price"> <span className="me-1 text-decoration-line-through">$99.00</span>
          <span className="text-white fs-5">$49.00</span>
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