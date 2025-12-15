import React from 'react';

function Section2() {
  return (
    <section className="py-4">
      <div className="container">
        <div className="product-detail-card">
          <div className="product-detail-body">
            <div className="row g-0">
              <div className="col-12 col-lg-5">
                <div className="image-zoom-section">
                  <div className="product-gallery owl-carousel owl-theme border mb-3 p-3" data-slider-id="1">
                    <div className="item">
                      <img src="assets/images/product-gallery/01.png" className="img-fluid" alt="" />
                    </div>
                    <div className="item">
                      <img src="assets/images/product-gallery/02.png" className="img-fluid" alt="" />
                    </div>
                    <div className="item">
                      <img src="assets/images/product-gallery/03.png" className="img-fluid" alt="" />
                    </div>
                    <div className="item">
                      <img src="assets/images/product-gallery/04.png" className="img-fluid" alt="" />
                    </div>
                  </div>
                  <div className="owl-thumbs d-flex justify-content-center" data-slider-id="1">
                    <button className="owl-thumb-item">
                      <img src="assets/images/product-gallery/01.png" alt="" />
                    </button>
                    <button className="owl-thumb-item">
                      <img src="assets/images/product-gallery/02.png" alt="" />
                    </button>
                    <button className="owl-thumb-item">
                      <img src="assets/images/product-gallery/03.png" alt="" />
                    </button>
                    <button className="owl-thumb-item">
                      <img src="assets/images/product-gallery/04.png" alt="" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-7">
                <div className="product-info-section p-3">
                  <h3 className="mt-3 mt-lg-0 mb-0">Allen Solly Men's Polo T-Shirt</h3>
                  <div className="product-rating d-flex align-items-center mt-2">
                    <div className="rates cursor-pointer font-13">	<i className="bx bxs-star text-warning"></i>
                    <i className="bx bxs-star text-warning"></i>
                    <i className="bx bxs-star text-warning"></i>
                    <i className="bx bxs-star text-warning"></i>
                    <i className="bx bxs-star text-light-4"></i>
                  </div>
                  <div className="ms-1">
                    <p className="mb-0">(24 Ratings)</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mt-3 gap-2">
                  <h5 className="mb-0 text-decoration-line-through text-light-3">$98.00</h5>
                  <h4 className="mb-0">$49.00</h4>
                </div>
                <div className="mt-3">
                  <h6>Discription :</h6>
                  <p className="mb-0">Virgil Abloh’s Off-White is a streetwear-inspired collection that continues to break away from the conventions of mainstream fashion. Made in Italy, these black and brown Odsy-1000 low-top sneakers.</p>
                </div>
                <dl className="row mt-3">	<dt className="col-sm-3">Product id</dt>
                <dd className="col-sm-9">#BHU5879</dd>	<dt className="col-sm-3">Delivery</dt>
                <dd className="col-sm-9">Russia, USA, and Europe</dd>
              </dl>
              <div className="row row-cols-auto align-items-center mt-3">
                <div className="col">
                  <label className="form-label">Quantity</label>
                  <select className="form-select form-select-sm">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </select>
                </div>
                <div className="col">
                  <label className="form-label">Size</label>
                  <select className="form-select form-select-sm">
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XS</option>
                    <option>XL</option>
                  </select>
                </div>
                <div className="col">
                  <label className="form-label">Colors</label>
                  <div className="color-indigators d-flex align-items-center gap-2">
                    <div className="color-indigator-item bg-primary"></div>
                    <div className="color-indigator-item bg-danger"></div>
                    <div className="color-indigator-item bg-success"></div>
                    <div className="color-indigator-item bg-warning"></div>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <a href="javascript:;" className="btn btn-white btn-ecomm">	<i className="bx bxs-cart-add"></i>Add to Cart</a> <a href="javascript:;" className="btn btn-light btn-ecomm"><i className="bx bx-heart"></i>Add to Wishlist</a>
              </div>
              <hr/ />
              <div className="product-sharing">
                <ul className="list-inline">
                  <li className="list-inline-item"> <a href="javascript:;"><i className='bx bxl-facebook'></i></a>
                </li>
                <li className="list-inline-item">	<a href="javascript:;"><i className='bx bxl-linkedin'></i></a>
              </li>
              <li className="list-inline-item">	<a href="javascript:;"><i className='bx bxl-twitter'></i></a>
            </li>
            <li className="list-inline-item">	<a href="javascript:;"><i className='bx bxl-instagram'></i></a>
          </li>
          <li className="list-inline-item">	<a href="javascript:;"><i className='bx bxl-google'></i></a>
        </li>
      </ul>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </section>
  );
}

export default Section2;
