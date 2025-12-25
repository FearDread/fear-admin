import React from 'react';
import Navigation1 from './Navigation1';
import Navigation2 from './Navigation2';
import Navigation3 from './Navigation3';
import Navigation4 from './Navigation4';
import Footer from './Footer';

function Single() {
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
                    <img src="assets/images/logo-icon.png" className="logo-icon" alt=""/ />
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
              <h3 className="breadcrumb-title pe-3">Single Post</h3>
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
                  <div className="card shadow-none bg-transparent">
                    <img src="assets/images/posts/01.png" className="card-img-top" alt="" />
                    <div className="card-body p-0">
                      <div className="list-inline mt-4">	<a href="javascript:;" className="list-inline-item"><i className='bx bx-user me-1'></i>By Admin</a>
                      <a href="javascript:;" className="list-inline-item"><i className='bx bx-comment-detail me-1'></i>16 Comments</a>
                      <a href="javascript:;" className="list-inline-item"><i className='bx bx-calendar me-1'></i>November 5, 2021</a>
                    </div>
                    <h4 className="mt-4">Post Title Here</h4>
                    <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.</p>
                    <p>Nam dolor ligula, faucibus id sodales in, auctor fringilla libero. Pellentesque pellentesque tempor tellus eget hendrerit. Morbi id aliquam ligula. Aliquam id dui sem. Proin rhoncus consequat nisl, eu ornare mauris tincidunt vitae. Nulla aliquet turpis eget sodales scelerisque. Ut accumsan rhoncus sapien a dignissim. Sed vel ipsum nunc. Aliquam erat volutpat. Donec et dignissim elit. Etiam condimentum, ante sed rutrum auctor, quam arcu consequat massa, at gravida enim velit id nisl.</p>
                    <p>Nullam non felis odio. Praesent aliquam magna est, nec volutpat quam aliquet non. Cras ut lobortis massa, a fringilla dolor. Quisque ornare est at felis consectetur mollis. Aliquam vitae metus et enim posuere ornare. Praesent sapien erat, pellentesque quis sollicitudin eget, imperdiet bibendum magna. Aenean sit amet odio est.</p>
                    <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris quis est lobortis odio dignissim rutrum. Pellentesque blandit lacinia diam, a tincidunt felis tempus eget.</p>
                    <p>Donec egestas metus non vehicula accumsan. Pellentesque sit amet tempor nibh. Mauris in risus lorem. Cras malesuada gravida massa eget viverra. Suspendisse vitae dolor erat. Morbi id rhoncus enim. In hac habitasse platea dictumst. Aenean lorem diam, venenatis nec venenatis id, adipiscing ac massa. Nam vel dui eget justo dictum pretium a rhoncus ipsum. Donec venenatis erat tincidunt nunc suscipit, sit amet bibendum lacus posuere. Sed scelerisque, dolor a pharetra sodales, mi augue consequat sapien, et interdum tellus leo et nunc. Nunc imperdiet eu libero ut imperdiet.</p>
                    <p>Nunc varius ornare tortor. In dignissim quam eget quam sodales egestas. Nullam imperdiet velit feugiat, egestas risus nec, rhoncus felis. Suspendisse sagittis enim aliquet augue consequat facilisis. Nunc sit amet eleifend tellus. Etiam rhoncus turpis quam. Vestibulum eu lacus mattis, dignissim justo vel, fermentum nulla. Donec pharetra augue eget diam dictum, eu ullamcorper arcu feugiat.</p>
                    <p>Proin ut ante vitae magna cursus porta. Aenean rutrum faucibus augue eu convallis. Phasellus condimentum elit id cursus sodales. Vivamus nec est consectetur, tincidunt augue at, tempor libero.</p>
                    <div className="d-flex align-items-center gap-2 py-4 border-top border-bottom">
                      <div>
                        <h6 className="mb-0 text-uppercase">Share This Post</h6>
                      </div>
                      <div className="list-inline blog-sharing">	<a href="javascript:;" className="list-inline-item"><i className='bx bxl-facebook'></i></a>
                      <a href="javascript:;" className="list-inline-item"><i className='bx bxl-twitter'></i></a>
                      <a href="javascript:;" className="list-inline-item"><i className='bx bxl-linkedin'></i></a>
                      <a href="javascript:;" className="list-inline-item"><i className='bx bxl-instagram'></i></a>
                      <a href="javascript:;" className="list-inline-item"><i className='bx bxl-tumblr'></i></a>
                    </div>
                  </div>
                  <div className="author d-flex align-items-center gap-3 py-4">
                    <img src="assets/images/avatars/avatar-1.png" alt="" width="80" />
                    <div>
                      <h6 className="mb-0">Jhon Doe</h6>
                      <p className="mb-0">Donec egestas metus non vehicula accumsan. Pellentesque sit amet tempor nibh. Mauris in risus lorem. Cras malesuada gravida massa eget viverra. Suspendisse vitae dolor erat. Morbi id rhoncus enim. In hac habitasse platea dictumst. Aenean lorem diam, venenatis nec venenatis id, adipiscing ac massa.</p>
                    </div>
                  </div>
                  <div className="reply-form p-4 border bg-dark-1">
                    <h6 className="mb-0">Leave a Reply</h6>
                    <p>Your email address will not be published. Required={true} fields are marked *</p>
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Comment</label>
                        <textarea className="form-control" rows="4"></textarea>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" placeholder="" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Website</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="mb-3">
                        <button type="button" className="btn btn-light btn-ecomm">Post Comment</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="product-grid">
                <h5 className="text-uppercase mb-4">Latest Post</h5>
                <div className="latest-news owl-carousel owl-theme">
                  <div className="item">
                    <div className="card rounded-0 product-card border">
                      <div className="news-date">
                        <div className="date-number">24</div>
                        <div className="date-month">FEB</div>
                      </div>
                      <a href="javascript:;">
                        <img src="assets/images/blogs/01.png" className="card-img-top border-bottom bg-dark-1" alt="..." />
                      </a>
                      <div className="card-body">
                        <div className="news-title">
                          <a href="javascript:;">
                            <h5 className="mb-3 text-capitalize">Blog Short Title</h5>
                          </a>
                        </div>
                        <p className="news-content mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras non placerat mi. Etiam non tellus sem. Aenean...</p>
                      </div>
                      <div className="card-footer border-top">
                        <a href="javascript:;">
                          <p className="mb-0"><small className="text-white">0 Comments</small>
                        </p>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="card rounded-0 product-card border">
                    <div className="news-date">
                      <div className="date-number">24</div>
                      <div className="date-month">FEB</div>
                    </div>
                    <a href="javascript:;">
                      <img src="assets/images/blogs/02.png" className="card-img-top border-bottom bg-dark-1" alt="..." />
                    </a>
                    <div className="card-body">
                      <div className="news-title">
                        <a href="javascript:;">
                          <h5 className="mb-3 text-capitalize">Blog Short Title</h5>
                        </a>
                      </div>
                      <p className="news-content mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras non placerat mi. Etiam non tellus sem. Aenean...</p>
                    </div>
                    <div className="card-footer border-top">
                      <a href="javascript:;">
                        <p className="mb-0"><small className="text-white">0 Comments</small>
                      </p>
                    </a>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="card rounded-0 product-card border">
                  <div className="news-date">
                    <div className="date-number">24</div>
                    <div className="date-month">FEB</div>
                  </div>
                  <a href="javascript:;">
                    <img src="assets/images/blogs/03.png" className="card-img-top border-bottom bg-dark-1" alt="..." />
                  </a>
                  <div className="card-body">
                    <div className="news-title">
                      <a href="javascript:;">
                        <h5 className="mb-3 text-capitalize">Blog Short Title</h5>
                      </a>
                    </div>
                    <p className="news-content mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras non placerat mi. Etiam non tellus sem. Aenean...</p>
                  </div>
                  <div className="card-footer border-top">
                    <a href="javascript:;">
                      <p className="mb-0"><small className="text-white">0 Comments</small>
                    </p>
                  </a>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="card rounded-0 product-card border">
                <div className="news-date">
                  <div className="date-number">24</div>
                  <div className="date-month">FEB</div>
                </div>
                <a href="javascript:;">
                  <img src="assets/images/blogs/04.png" className="card-img-top border-bottom bg-dark-1" alt="..." />
                </a>
                <div className="card-body">
                  <div className="news-title">
                    <a href="javascript:;">
                      <h5 className="mb-3 text-capitalize">Blog Short Title</h5>
                    </a>
                  </div>
                  <p className="news-content mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras non placerat mi. Etiam non tellus sem. Aenean...</p>
                </div>
                <div className="card-footer border-top">
                  <a href="javascript:;">
                    <p className="mb-0"><small className="text-white">0 Comments</small>
                  </p>
                </a>
              </div>
            </div>
          </div>
          <div className="item">
            <div className="card rounded-0 product-card border">
              <div className="news-date">
                <div className="date-number">24</div>
                <div className="date-month">FEB</div>
              </div>
              <a href="javascript:;">
                <img src="assets/images/blogs/05.png" className="card-img-top border-bottom bg-dark-1" alt="..." />
              </a>
              <div className="card-body">
                <div className="news-title">
                  <a href="javascript:;">
                    <h5 className="mb-3 text-capitalize">Blog Short Title</h5>
                  </a>
                </div>
                <p className="news-content mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras non placerat mi. Etiam non tellus sem. Aenean...</p>
              </div>
              <div className="card-footer border-top">
                <a href="javascript:;">
                  <p className="mb-0"><small className="text-white">0 Comments</small>
                </p>
              </a>
            </div>
          </div>
        </div>
        <div className="item">
          <div className="card rounded-0 product-card border">
            <div className="news-date">
              <div className="date-number">24</div>
              <div className="date-month">FEB</div>
            </div>
            <a href="javascript:;">
              <img src="assets/images/blogs/06.png" className="card-img-top border-bottom bg-dark-1" alt="..." />
            </a>
            <div className="card-body">
              <div className="news-title">
                <a href="javascript:;">
                  <h5 className="mb-3 text-capitalize">Blog Short Title</h5>
                </a>
              </div>
              <p className="news-content mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras non placerat mi. Etiam non tellus sem. Aenean...</p>
            </div>
            <div className="card-footer border-top">
              <a href="javascript:;">
                <p className="mb-0"><small className="text-white">0 Comments</small>
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
    </div>
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

export default Single;
