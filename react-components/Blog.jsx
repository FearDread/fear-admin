import React from 'react';
import Navigation1 from './Navigation1';
import Navigation2 from './Navigation2';
import Navigation3 from './Navigation3';
import Navigation4 from './Navigation4';
import Navigation5 from './Navigation5';
import Footer from './Footer';

function Blog() {
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
                    <img src="assets/images/logo-icon.png" className="logo-icon" / />
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
              <div className="breadcrumb-title pe-3">Blog</div>
              <div className="ms-auto">
                <Navigation4 />
              </div>
            </div>
          </div>
        </section>
        <section className="py-4">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-9">
                <div className="blog-right-sidebar p-3">
                  <div className="card">
                    <img src="assets/images/posts/01.png" className="card-img-top" alt="" />
                    <div className="card-body">
                      <div className="list-inline">	<a href="javascript:;" className="list-inline-item"><i className='bx bx-user me-1'></i>By Admin</a>
                      <a href="javascript:;" className="list-inline-item"><i className='bx bx-comment-detail me-1'></i>16 Comments</a>
                      <a href="javascript:;" className="list-inline-item"><i className='bx bx-calendar me-1'></i>November 5, 2021</a>
                    </div>
                    <h4 className="mt-4">Post Title Here</h4>
                    <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.</p>	<a href="single.html" className="btn btn-light btn-ecomm">Read More <i className='bx bx-chevrons-right' ></i></a>
                  </div>
                </div>
                <div className="card">
                  <img src="assets/images/posts/02.png" className="card-img-top" alt="" />
                  <div className="card-body">
                    <div className="list-inline">	<a href="javascript:;" className="list-inline-item"><i className='bx bx-user me-1'></i>By Admin</a>
                    <a href="javascript:;" className="list-inline-item"><i className='bx bx-comment-detail me-1'></i>16 Comments</a>
                    <a href="javascript:;" className="list-inline-item"><i className='bx bx-calendar me-1'></i>November 5, 2021</a>
                  </div>
                  <h4 className="mt-4">Post Title Here</h4>
                  <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.</p>	<a href="single.html" className="btn btn-light btn-ecomm">Read More <i className='bx bx-chevrons-right' ></i></a>
                </div>
              </div>
              <div className="card">
                <img src="assets/images/posts/03.png" className="card-img-top" alt="" />
                <div className="card-body">
                  <div className="list-inline">	<a href="javascript:;" className="list-inline-item"><i className='bx bx-user me-1'></i>By Admin</a>
                  <a href="javascript:;" className="list-inline-item"><i className='bx bx-comment-detail me-1'></i>16 Comments</a>
                  <a href="javascript:;" className="list-inline-item"><i className='bx bx-calendar me-1'></i>November 5, 2021</a>
                </div>
                <h4 className="mt-4">Post Title Here</h4>
                <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.</p>	<a href="single.html" className="btn btn-light btn-ecomm">Read More <i className='bx bx-chevrons-right' ></i></a>
              </div>
            </div>
            <hr />
            <Navigation5 />
          </div>
        </div>
        <div className="col-12 col-lg-3">
          <div className="blog-left-sidebar p-3">
            <form>
              <div className="position-relative blog-search mb-3">
                <input type="text" className="form-control form-control-lg rounded-0 pe-5" placeholder="Serach posts here..." />
                <div className="position-absolute top-50 end-0 translate-middle"><i className='bx bx-search fs-4 text-white'></i>
              </div>
            </div>
            <div className="blog-categories mb-3">
              <h5 className="mb-4">Blog Categories</h5>
              <div className="list-group list-group-flush"> <a href="javascript:;" className="list-group-item bg-transparent"><i className='bx bx-chevron-right me-1'></i> Fashion</a>
              <a href="javascript:;" className="list-group-item bg-transparent"><i className='bx bx-chevron-right me-1'></i> Electronis</a>
              <a href="javascript:;" className="list-group-item bg-transparent"><i className='bx bx-chevron-right me-1'></i> Accessories</a>
              <a href="javascript:;" className="list-group-item bg-transparent"><i className='bx bx-chevron-right me-1'></i> Kitchen & Table</a>
              <a href="javascript:;" className="list-group-item bg-transparent"><i className='bx bx-chevron-right me-1'></i> Furniture</a>
            </div>
          </div>
          <div className="blog-categories mb-3">
            <h5 className="mb-4">Recent Posts</h5>
            <div className="d-flex align-items-center">
              <img src="assets/images/gallery/05.png" width="75" alt="" />
              <div className="ms-3"> <a href="javascript:;" className="fs-6">Post title here</a>
              <p className="mb-0">March 15, 2021</p>
            </div>
          </div>
          <div className="my-3 border-bottom"></div>
          <div className="d-flex align-items-center">
            <img src="assets/images/gallery/07.png" width="75" alt="" />
            <div className="ms-3"> <a href="javascript:;" className="fs-6">Post title here</a>
            <p className="mb-0">March 15, 2021</p>
          </div>
        </div>
        <div className="my-3 border-bottom"></div>
        <div className="d-flex align-items-center">
          <img src="assets/images/gallery/16.png" width="75" alt="" />
          <div className="ms-3"> <a href="javascript:;" className="fs-6">Post title here</a>
          <p className="mb-0">March 15, 2021</p>
        </div>
      </div>
      <div className="my-3 border-bottom"></div>
      <div className="d-flex align-items-center">
        <img src="assets/images/gallery/01.png" width="75" alt="" />
        <div className="ms-3"> <a href="javascript:;" className="fs-6">Post title here</a>
        <p className="mb-0">March 15, 2021</p>
      </div>
    </div>
    </div>
    <div className="blog-categories mb-3">
      <h5 className="mb-4">Popular Tags</h5>
      <div className="tags-box">	<a href="javascript:;" className="tag-link">Cloths</a>
      <a href="javascript:;" className="tag-link">Electronis</a>
      <a href="javascript:;" className="tag-link">Furniture</a>
      <a href="javascript:;" className="tag-link">Sports</a>
      <a href="javascript:;" className="tag-link">Men Wear</a>
      <a href="javascript:;" className="tag-link">Women Wear</a>
      <a href="javascript:;" className="tag-link">Laptops</a>
      <a href="javascript:;" className="tag-link">Formal Shirts</a>
      <a href="javascript:;" className="tag-link">Topwear</a>
      <a href="javascript:;" className="tag-link">Headphones</a>
      <a href="javascript:;" className="tag-link">Bottom Wear</a>
      <a href="javascript:;" className="tag-link">Bags</a>
      <a href="javascript:;" className="tag-link">Sofa</a>
      <a href="javascript:;" className="tag-link">Shoes</a>
    </div>
    </div>
    </form>
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
                      <img src="assets/images/product-gallery/01.png" className="img-fluid" />
                    </div>
                    <div className="item">
                      <img src="assets/images/product-gallery/02.png" className="img-fluid" />
                    </div>
                    <div className="item">
                      <img src="assets/images/product-gallery/03.png" className="img-fluid" />
                    </div>
                    <div className="item">
                      <img src="assets/images/product-gallery/04.png" className="img-fluid" />
                    </div>
                  </div>
                  <div className="owl-thumbs d-flex justify-content-center" data-slider-id="1">
                    <button className="owl-thumb-item">
                      <img src="assets/images/product-gallery/01.png" />
                    </button>
                    <button className="owl-thumb-item">
                      <img src="assets/images/product-gallery/02.png" />
                    </button>
                    <button className="owl-thumb-item">
                      <img src="assets/images/product-gallery/03.png" />
                    </button>
                    <button className="owl-thumb-item">
                      <img src="assets/images/product-gallery/04.png" />
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

export default Blog;
