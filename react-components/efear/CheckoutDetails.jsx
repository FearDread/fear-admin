import React from 'react';
import Navigation1 from './Navigation1';
import Navigation2 from './Navigation2';
import Navigation3 from './Navigation3';
import Navigation4 from './Navigation4';
import Footer from './Footer';

function CheckoutDetails() {
  return (
    <b className="screen-overlay"></b>
    <div className="wrapper">
      <div className="header-wrapper bg-dark-1">
        <div className="top-menu border-bottom">
          <div className="container">
            <Navigation1 />
          </div>
        </div>
        <div className="header-content pb-3 pb-md-0">
          <div className="container">
            <div className="row align-items-center">
              <div className="col col-md-auto">
                <div className="d-flex align-items-center">
                  <div className="mobile-toggle-menu d-lg-none px-lg-2" data-trigger="#navbar_main"><i className='bx bx-menu'></i>
                </div>
                <div className="logo d-none d-lg-flex">
                  <a href="index.html">
                    <img src="assets/images/logo-icon.png" className="logo-icon" alt="" / />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-12 col-md order-4 order-md-2">
              <div className="input-group flex-nowrap px-xl-4">
                <input type="text" className="form-control w-100" placeholder="Search for Products" />
                <select className="form-select flex-shrink-0" aria-label="Default select example" style={{'width':'10.5rem'}}>
                  <option selected={true}>All Categories</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select> <span className="input-group-text cursor-pointer"><i className='bx bx-search'></i></span>
              </div>
            </div>
            <div className="col col-md-auto order-3 d-none d-xl-flex align-items-center">
              <div className="fs-1 text-white"><i className='bx bx-headphone'></i>
            </div>
            <div className="ms-2">
              <p className="mb-0 font-13">CALL US NOW</p>
              <h5 className="mb-0">+011 5827918</h5>
            </div>
          </div>
          <div className="col col-md-auto order-2 order-md-4">
            <div className="top-cart-icons">
              <Navigation2 />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="primary-menu border-top">
      <div className="container">
        <Navigation3 />
      </div>
    </div>
    </div>
    <div className="page-wrapper">
      <div className="page-content">
        <section className="py-3 border-bottom d-none d-md-flex">
          <div className="container">
            <div className="page-breadcrumb d-flex align-items-center">
              <h3 className="breadcrumb-title pe-3">Checkout</h3>
              <div className="ms-auto">
                <Navigation4 />
              </div>
            </div>
          </div>
        </section>
        <section className="py-4">
          <div className="container">
            <div className="shop-cart">
              <div className="row">
                <div className="col-12 col-xl-8">
                  <div className="checkout-details">
                    <div className="card bg-transparent rounded-0 shadow-none">
                      <div className="card-body">
                        <div className="steps steps-light">
                          <a className="step-item active" href="shop-cart.html">
                            <div className="step-progress"><span className="step-count">1</span>
                          </div>
                          <div className="step-label"><i className='bx bx-cart'></i>Cart</div>
                        </a>
                        <a className="step-item active current" href="checkout-details.html">
                          <div className="step-progress"><span className="step-count">2</span>
                        </div>
                        <div className="step-label"><i className='bx bx-user-circle'></i>Details</div>
                      </a>
                      <a className="step-item" href="checkout-shipping.html">
                        <div className="step-progress"><span className="step-count">3</span>
                      </div>
                      <div className="step-label"><i className='bx bx-cube'></i>Shipping</div>
                    </a>
                    <a className="step-item" href="checkout-payment.html">
                      <div className="step-progress"><span className="step-count">4</span>
                    </div>
                    <div className="step-label"><i className='bx bx-credit-card'></i>Payment</div>
                  </a>
                  <a className="step-item" href="checkout-review.html">
                    <div className="step-progress"><span className="step-count">5</span>
                  </div>
                  <div className="step-label"><i className='bx bx-check-circle'></i>Review</div>
                </a>
              </div>
            </div>
          </div>
          <div className="card rounded-0">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div>
                  <img src="assets/images/avatars/avatar-1.png" width="90" alt="" className="rounded-circle p-1 border" />
                </div>
                <div className="ms-2">
                  <h6 className="mb-0">Jhon Michle</h6>
                  <p className="mb-0">michle@example.com</p>
                </div>
                <div className="ms-auto">	<a href="javascript:;" className="btn btn-light btn-ecomm"><i className='bx bx-edit'></i> Edit Profile</a>
              </div>
            </div>
          </div>
        </div>
        <div className="card rounded-0">
          <div className="card-body">
            <div className="border p-3">
              <h2 className="h5 mb-0">Shipping Address</h2>
              <div className="my-3 border-bottom"></div>
              <div className="form-body">
                <form className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-control rounded-0" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-control rounded-0" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">E-mail id</label>
                    <input type="text" className="form-control rounded-0" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number</label>
                    <input type="text" className="form-control rounded-0" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Company</label>
                    <input type="text" className="form-control rounded-0" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">State/Province</label>
                    <select className="form-select rounded-0">
                      <option>United Kingdom</option>
                      <option>California</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Zip/Postal Code</label>
                    <input type="text" className="form-control rounded-0" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Country</label>
                    <select className="form-select rounded-0">
                      <option>United States</option>
                      <option>India</option>
                      <option>China</option>
                      <option>Turkey</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Address 1</label>
                    <textarea className="form-control rounded-0"></textarea>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Address 2</label>
                    <textarea className="form-control rounded-0"></textarea>
                  </div>
                  <div className="col-md-12">
                    <h6 className="mb-0 h5">Billing Address</h6>
                    <div className="my-3 border-bottom"></div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="gridCheck" checked={true} />
                      <label className="form-check-label" htmlFor="gridCheck">Same as shipping address</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-grid">	<a href="javascript:;" className="btn btn-light btn-ecomm"><i className='bx bx-chevron-left'></i>Back to Cart</a>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-grid">	<a href="javascript:;" className="btn btn-white btn-ecomm">Proceed to Checkout<i className='bx bx-chevron-right'></i></a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    <div className="col-12 col-xl-4">
      <div className="order-summary">
        <div className="card rounded-0">
          <div className="card-body">
            <div className="card rounded-0 border bg-transparent shadow-none">
              <div className="card-body">
                <p className="fs-5 text-white">Apply Discount Code</p>
                <div className="input-group">
                  <input type="text" className="form-control rounded-0" placeholder="Enter discount code" />
                  <button className="btn btn-light btn-ecomm" type="button">Apply Discount</button>
                </div>
              </div>
            </div>
            <div className="card rounded-0 border bg-transparent shadow-none">
              <div className="card-body">
                <p className="fs-5 text-white">Order summary</p>
                <div className="my-3 border-top"></div>
                <div className="d-flex align-items-center">
                  <a className="d-block flex-shrink-0" href="javascript:;">
                    <img src="assets/images/products/01.png" width="75" alt="Product" />
                  </a>
                  <div className="ps-2">
                    <h6 className="mb-1"><a href="javascript:;">White Polo T-Shirt</a></h6>
                    <div className="widget-product-meta"><span className="me-2">$19.<small>00</small></span><span>x 1</span>
                  </div>
                </div>
              </div>
              <div className="my-3 border-top"></div>
              <div className="d-flex align-items-center">
                <a className="d-block flex-shrink-0" href="javascript:;">
                  <img src="assets/images/products/17.png" width="75" alt="Product" />
                </a>
                <div className="ps-2">
                  <h6 className="mb-1"><a href="javascript:;">Fancy Red Sneakers</a></h6>
                  <div className="widget-product-meta"><span className="me-2">$16.<small>00</small></span><span>x 2</span>
                </div>
              </div>
            </div>
            <div className="my-3 border-top"></div>
            <div className="d-flex align-items-center">
              <a className="d-block flex-shrink-0" href="javascript:;">
                <img src="assets/images/products/04.png" width="75" alt="Product" />
              </a>
              <div className="ps-2">
                <h6 className="mb-1"><a href="javascript:;">Yellow Shine Blazer</a></h6>
                <div className="widget-product-meta"><span className="me-2">$22.<small>00</small></span><span>x 1</span>
              </div>
            </div>
          </div>
          <div className="my-3 border-top"></div>
          <div className="d-flex align-items-center">
            <a className="d-block flex-shrink-0" href="javascript:;">
              <img src="assets/images/products/09.png" width="75" alt="Product" />
            </a>
            <div className="ps-2">
              <h6 className="mb-1"><a href="javascript:;">Men Black Hat Cap</a></h6>
              <div className="widget-product-meta"><span className="me-2">$14.<small>00</small></span><span>x 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="card rounded-0 border bg-transparent mb-0 shadow-none">
      <div className="card-body">
        <p className="mb-2">Subtotal: <span className="float-end">$198.00</span>
      </p>
      <p className="mb-2">Shipping: <span className="float-end">--</span>
    </p>
    <p className="mb-2">Taxes: <span className="float-end">$14.00</span>
    </p>
    <p className="mb-0">Discount: <span className="float-end">--</span>
    </p>
    <div className="my-3 border-top"></div>
    <h5 className="mb-0">Order Total: <span className="float-end">212.00</span></h5>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </section>
    </div>
    </div>
    <Footer />
    <div className="modal fade" id="QuickViewProduct">
      <div className="modal-dialog modal-dialog-centered modal-xl modal-fullscreen-xl-down">
        <div className="modal-content bg-dark-4 rounded-0 border-0">
          <div className="modal-body">
            <button type="button" className="btn-close float-end" data-bs-dismiss="modal"></button>
            <div className="row g-0">
              <div className="col-12 col-lg-6">
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
              <div className="col-12 col-lg-6">
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
                <a href="javascript:;" className="btn btn-white btn-ecomm">	<i className="bx bxs-cart-add"></i>Add to Cart</a>	<a href="javascript:;" className="btn btn-light btn-ecomm"><i className="bx bx-heart"></i>Add to Wishlist</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    <a href="javaScript:;" className="back-to-top"><i className='bx bxs-up-arrow-alt'></i></a>
    </div>
    <div className="switcher-wrapper">
      <div className="switcher-btn"> <i className='bx bx-cog bx-spin'></i>
    </div>
    <div className="switcher-body">
      <div className="d-flex align-items-center">
        <h5 className="mb-0 text-uppercase">Theme Customizer</h5>
        <button type="button" className="btn-close ms-auto close-switcher" aria-label="Close"></button>
      </div>
      <hr/ />
      <p className="mb-0">Gaussian Texture</p>
      <hr />
      <ul className="switcher">
        <li id="theme1"></li>
        <li id="theme2"></li>
        <li id="theme3"></li>
        <li id="theme4"></li>
        <li id="theme5"></li>
        <li id="theme6"></li>
      </ul>
      <hr />
      <p className="mb-0">Gradient Background</p>
      <hr />
      <ul className="switcher">
        <li id="theme7"></li>
        <li id="theme8"></li>
        <li id="theme9"></li>
        <li id="theme10"></li>
        <li id="theme11"></li>
        <li id="theme12"></li>
        <li id="theme13"></li>
        <li id="theme14"></li>
        <li id="theme15"></li>
      </ul>
    </div>
    </div>
    <script src="assets/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/plugins/simplebar/js/simplebar.min.js"></script>
    <script src="assets/plugins/OwlCarousel/js/owl.carousel.min.js"></script>
    <script src="assets/plugins/OwlCarousel/js/owl.carousel2.thumbs.min.js"></script>
    <script src="assets/plugins/metismenu/js/metisMenu.min.js"></script>
    <script src="assets/plugins/perfect-scrollbar/js/perfect-scrollbar.js"></script>
    <script src="assets/js/app.js"></script>
    <script src='../../../img1.wsimg.com/signals/js/clients/scc-c2/scc-c2.min.js'></script>
  );
}

export default CheckoutDetails;
