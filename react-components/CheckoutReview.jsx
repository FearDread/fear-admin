import React from 'react';
import Navigation1 from './Navigation1';
import Navigation2 from './Navigation2';
import Navigation3 from './Navigation3';
import Navigation4 from './Navigation4';
import Footer from './Footer';

function CheckoutReview() {
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
              <h3 className="breadcrumb-title pe-3">Shop Cart</h3>
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
                  <div className="checkout-review">
                    <div className="card bg-transparent rounded-0 shadow-none">
                      <div className="card-body">
                        <div className="steps steps-light">
                          <a className="step-item active" href="shop-cart.html">
                            <div className="step-progress"><span className="step-count">1</span>
                          </div>
                          <div className="step-label"><i className='bx bx-cart'></i>Cart</div>
                        </a>
                        <a className="step-item active" href="checkout-details.html">
                          <div className="step-progress"><span className="step-count">2</span>
                        </div>
                        <div className="step-label"><i className='bx bx-user-circle'></i>Details</div>
                      </a>
                      <a className="step-item active" href="checkout-shipping.html">
                        <div className="step-progress"><span className="step-count">3</span>
                      </div>
                      <div className="step-label"><i className='bx bx-cube'></i>Shipping</div>
                    </a>
                    <a className="step-item active current" href="checkout-payment.html">
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
          <div className="card  rounded-0 shadow-none">
            <div className="card-body">
              <h5 className="mb-0">Review Your Order</h5>
              <div className="my-3 border-bottom"></div>
              <div className="row align-items-center g-3">
                <div className="col-12 col-lg-6">
                  <div className="d-lg-flex align-items-center gap-2">
                    <div className="cart-img text-center text-lg-start">
                      <img src="assets/images/products/01.png" width="130" alt="" />
                    </div>
                    <div className="cart-detail text-center text-lg-start">
                      <h6 className="mb-2">White Regular Fit Polo T-Shirt</h6>
                      <p className="mb-0">Size: <span>Regular</span>
                    </p>
                    <p className="mb-2">Color: <span>White & Blue</span>
                  </p>
                  <h5 className="mb-0">$19.00</h5>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-3">
              <div className="cart-action text-center">
                <input type="number" className="form-control rounded-0" value="2" min="1" />
              </div>
            </div>
            <div className="col-12 col-lg-3">
              <div className="text-center">
                <div className="d-flex gap-2 justify-content-center justify-content-lg-end"> <a href="javascript:;" className="btn btn-light rounded-0 btn-ecomm"><i className='bx bx-x-circle me-0'></i></a>
                <a href="javascript:;" className="btn btn-light rounded-0 btn-ecomm"><i className='bx bx-edit'></i> Edit</a>
              </div>
            </div>
          </div>
        </div>
        <div className="my-4 border-top"></div>
        <div className="row align-items-center g-3">
          <div className="col-12 col-lg-6">
            <div className="d-lg-flex align-items-center gap-2">
              <div className="cart-img text-center text-lg-start">
                <img src="assets/images/products/17.png" width="130" alt="" />
              </div>
              <div className="cart-detail text-center text-lg-start">
                <h6 className="mb-2">Fancy Red Sneakers</h6>
                <p className="mb-0">Size: <span>Small</span>
              </p>
              <p className="mb-2">Color: <span>White & Red</span>
            </p>
            <h5 className="mb-0">$16.00</h5>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-3">
        <div className="cart-action text-center">
          <input type="number" className="form-control rounded-0" value="2" min="1" />
        </div>
      </div>
      <div className="col-12 col-lg-3">
        <div className="text-center">
          <div className="d-flex gap-2 justify-content-center justify-content-lg-end"> <a href="javascript:;" className="btn btn-light rounded-0 btn-ecomm"><i className='bx bx-x-circle me-0'></i></a>
          <a href="javascript:;" className="btn btn-light rounded-0 btn-ecomm"><i className='bx bx-edit'></i> Edit</a>
        </div>
      </div>
    </div>
    </div>
    <div className="my-4 border-top"></div>
    <div className="row align-items-center g-3">
      <div className="col-12 col-lg-6">
        <div className="d-lg-flex align-items-center gap-2">
          <div className="cart-img text-center text-lg-start">
            <img src="assets/images/products/04.png" width="130" alt="" />
          </div>
          <div className="cart-detail text-center text-lg-start">
            <h6 className="mb-2">Yellow Shine Blazer</h6>
            <p className="mb-0">Size: <span>Medium</span>
          </p>
          <p className="mb-2">Color: <span>Yellow & Blue</span>
        </p>
        <h5 className="mb-0">$22.00</h5>
      </div>
    </div>
    </div>
    <div className="col-12 col-lg-3">
      <div className="cart-action text-center">
        <input type="number" className="form-control rounded-0" value="2" min="1" />
      </div>
    </div>
    <div className="col-12 col-lg-3">
      <div className="text-center">
        <div className="d-flex gap-2 justify-content-center justify-content-lg-end"> <a href="javascript:;" className="btn btn-light rounded-0 btn-ecomm"><i className='bx bx-x-circle me-0'></i></a>
        <a href="javascript:;" className="btn btn-light rounded-0 btn-ecomm"><i className='bx bx-edit'></i> Edit</a>
      </div>
    </div>
    </div>
    </div>
    <div className="my-4 border-top"></div>
    <div className="row align-items-center g-3">
      <div className="col-12 col-lg-6">
        <div className="d-lg-flex align-items-center gap-2">
          <div className="cart-img text-center text-lg-start">
            <img src="assets/images/products/09.png" width="130" alt="" />
          </div>
          <div className="cart-detail text-center text-lg-start">
            <h6 className="mb-2">Men Black Hat Cap</h6>
            <p className="mb-0">Size: <span>Medium</span>
          </p>
          <p className="mb-2">Color: <span>Black</span>
        </p>
        <h5 className="mb-0">$14.00</h5>
      </div>
    </div>
    </div>
    <div className="col-12 col-lg-3">
      <div className="cart-action text-center">
        <input type="number" className="form-control rounded-0" value="1" min="1" />
      </div>
    </div>
    <div className="col-12 col-lg-3">
      <div className="text-center">
        <div className="d-flex gap-2 justify-content-center justify-content-lg-end"> <a href="javascript:;" className="btn btn-light rounded-0 btn-ecomm"><i className='bx bx-x-circle me-0'></i></a>
        <a href="javascript:;" className="btn btn-light rounded-0 btn-ecomm"><i className='bx bx-edit'></i> Edit</a>
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    <div className="card rounded-0 shadow-none">
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <div className="shipping-aadress">
              <h5 className="mb-3">Shipping to:</h5>
              <p className="mb-1"><span className="text-light">Customer:</span> Jhon Michle</p>
              <p className="mb-1"><span className="text-light">Address:</span> 47-A, Street Name, City, Australia</p>
              <p className="mb-1"><span className="text-light">Phone:</span> (123) 472-796</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="payment-mode">
              <h5 className="mb-3">Payment Mode:</h5>
              <img src="assets/images/icons/visa.png" width="150" className="p-2 border bg-light rounded" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="card rounded-0 shadow-none">
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <div className="d-grid">	<a href="javascript:;" className="btn btn-light btn-ecomm"><i className="bx bx-chevron-left"></i>Back to Payment</a>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-grid">	<a href="checkout-complete.html" className="btn btn-white btn-ecomm">Complete Order<i className="bx bx-chevron-right"></i></a>
        </div>
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    <div className="col-12 col-xl-4">
      <div className="checkout-form p-3 bg-dark-1">
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
            <p className="fs-5 text-white">Estimate Shipping and Tax</p>
            <div className="my-3 border-top"></div>
            <div className="mb-3">
              <label className="form-label">Country Name</label>
              <select className="form-select rounded-0">
                <option selected={true}>United States</option>
                <option value="1">Australia</option>
                <option value="2">India</option>
                <option value="3">Canada</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">State/Province</label>
              <select className="form-select rounded-0">
                <option selected={true}>California</option>
                <option value="1">Texas</option>
                <option value="2">Canada</option>
              </select>
            </div>
            <div className="mb-0">
              <label className="form-label">Zip/Postal Code</label>
              <input type="email" className="form-control rounded-0" />
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
    <div className="my-4"></div>
    <div className="d-grid"> <a href="javascript:;" className="btn btn-white btn-ecomm">Proceed to Checkout</a>
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

export default CheckoutReview;
