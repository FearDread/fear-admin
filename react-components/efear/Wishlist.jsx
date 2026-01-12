import React from 'react';
import Navigation1 from './Navigation1';
import Navigation2 from './Navigation2';
import Navigation3 from './Navigation3';
import Navigation4 from './Navigation4';
import Footer from './Footer';

function Wishlist() {
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
              <h3 className="breadcrumb-title pe-3">Wishlist Grid</h3>
              <div className="ms-auto">
                <Navigation4 />
              </div>
            </div>
          </div>
        </section>
        <section className="py-4">
          <div className="container">
            <div className="product-grid">
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3">
                <div className="col">
                  <div className="card rounded-0 product-card">
                    <a href="product-details.html">
                      <img src="assets/images/products/01.png" className="card-img-top" alt="..." />
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
                          <div className="mb-1 product-price">	<span className="me-1 text-decoration-line-through">$99.00</span>
                          <span className="text-white fs-5">$49.00</span>
                        </div>
                        <div className="cursor-pointer ms-auto">	<i className="bx bxs-star text-white"></i>
                        <i className="bx bxs-star text-white"></i>
                        <i className="bx bxs-star text-white"></i>
                        <i className="bx bxs-star text-white"></i>
                        <i className="bx bxs-star text-white"></i>
                      </div>
                    </div>
                    <div className="product-action mt-2">
                      <div className="d-grid gap-2">
                        <a href="javascript:;" className="btn btn-white btn-ecomm">	<i className='bx bxs-cart-add'></i>Add to Cart</a>
                        <a href="javascript:;" className="btn btn-light btn-ecomm"><i className='bx bx-zoom-in'></i>Remove From List</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card rounded-0 product-card">
                <a href="product-details.html">
                  <img src="assets/images/products/02.png" className="card-img-top" alt="..." />
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
                    <i className="bx bxs-star text-light-4"></i>
                    <i className="bx bxs-star text-light-4"></i>
                  </div>
                </div>
                <div className="product-action mt-2">
                  <div className="d-grid gap-2">
                    <a href="javascript:;" className="btn btn-white btn-ecomm">	<i className='bx bxs-cart-add'></i>Add to Cart</a>
                    <a href="javascript:;" className="btn btn-light btn-ecomm"><i className='bx bx-zoom-in'></i>Remove From List</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card rounded-0 product-card">
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
                <a href="javascript:;" className="btn btn-white btn-ecomm">	<i className='bx bxs-cart-add'></i>Add to Cart</a>
                <a href="javascript:;" className="btn btn-light btn-ecomm"><i className='bx bx-zoom-in'></i>Remove From List</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="col">
      <div className="card rounded-0 product-card">
        <a href="product-details.html">
          <img src="assets/images/products/04.png" className="card-img-top" alt="..." />
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
            <i className="bx bxs-star text-white"></i>
          </div>
        </div>
        <div className="product-action mt-2">
          <div className="d-grid gap-2">
            <a href="javascript:;" className="btn btn-white btn-ecomm">	<i className='bx bxs-cart-add'></i>Add to Cart</a>
            <a href="javascript:;" className="btn btn-light btn-ecomm"><i className='bx bx-zoom-in'></i>Remove From List</a>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    <div className="col">
      <div className="card rounded-0 product-card">
        <a href="product-details.html">
          <img src="assets/images/products/05.png" className="card-img-top" alt="..." />
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
            <i className="bx bxs-star text-light-4"></i>
            <i className="bx bxs-star text-light-4"></i>
          </div>
        </div>
        <div className="product-action mt-2">
          <div className="d-grid gap-2">
            <a href="javascript:;" className="btn btn-white btn-ecomm">	<i className='bx bxs-cart-add'></i>Add to Cart</a>
            <a href="javascript:;" className="btn btn-light btn-ecomm"><i className='bx bx-zoom-in'></i>Remove From List</a>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    <div className="col">
      <div className="card rounded-0 product-card">
        <a href="product-details.html">
          <img src="assets/images/products/06.png" className="card-img-top" alt="..." />
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
            <i className="bx bxs-star text-white"></i>
          </div>
        </div>
        <div className="product-action mt-2">
          <div className="d-grid gap-2">
            <a href="javascript:;" className="btn btn-white btn-ecomm">	<i className='bx bxs-cart-add'></i>Add to Cart</a>
            <a href="javascript:;" className="btn btn-light btn-ecomm"><i className='bx bx-zoom-in'></i>Remove From List</a>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    <div className="col">
      <div className="card rounded-0 product-card">
        <a href="product-details.html">
          <img src="assets/images/products/07.png" className="card-img-top" alt="..." />
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
            <a href="javascript:;" className="btn btn-white btn-ecomm">	<i className='bx bxs-cart-add'></i>Add to Cart</a>
            <a href="javascript:;" className="btn btn-light btn-ecomm"><i className='bx bx-zoom-in'></i>Remove From List</a>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    <div className="col">
      <div className="card rounded-0 product-card">
        <a href="product-details.html">
          <img src="assets/images/products/08.png" className="card-img-top" alt="..." />
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
            <i className="bx bxs-star text-white"></i>
          </div>
        </div>
        <div className="product-action mt-2">
          <div className="d-grid gap-2">
            <a href="javascript:;" className="btn btn-white btn-ecomm">	<i className='bx bxs-cart-add'></i>Add to Cart</a>
            <a href="javascript:;" className="btn btn-light btn-ecomm"><i className='bx bx-zoom-in'></i>Remove From List</a>
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

export default Wishlist;
