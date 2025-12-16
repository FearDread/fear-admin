import React from 'react';
import Navigation1 from './Navigation1';
import Navigation2 from './Navigation2';
import Navigation3 from './Navigation3';
import Navigation4 from './Navigation4';
import Footer from './Footer';

function AuthenticationSignin() {
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
              <h3 className="breadcrumb-title pe-3">Sign in</h3>
              <div className="ms-auto">
                <Navigation4 />
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <div className="section-authentication-signin d-flex align-items-center justify-content-center my-5 my-lg-0">
              <div className="row row-cols-1 row-cols-xl-2">
                <div className="col mx-auto">
                  <div className="card">
                    <div className="card-body">
                      <div className="border p-4 rounded">
                        <div className="text-center">
                          <h3>Sign in</h3>
                          <p>Don't have an account yet? <a href="authentication-signup.html">Sign up here</a>
                        </p>
                      </div>
                      <div className="d-grid">
                        <a className="btn my-4 shadow-sm btn-light" href="javascript:;"> <span className="d-flex justify-content-center align-items-center">
                          <img className="me-2" src="assets/images/icons/search.svg" width="16" alt="Image Description" />
                          <span>Sign in with Google</span>
                        </span>
                      </a> <a href="javascript:;" className="btn btn-light"><i className="bx bxl-facebook"></i>Sign in with Facebook</a>
                    </div>
                    <div className="login-separater text-center mb-4"> <span>OR SIGN IN WITH EMAIL</span>
                    <hr/ />
                  </div>
                  <div className="form-body">
                    <form className="row g-3">
                      <div className="col-12">
                        <label htmlFor="inputEmailAddress" className="form-label">Email Address</label>
                        <input type="email" className="form-control" id="inputEmailAddress" placeholder="Email Address" />
                      </div>
                      <div className="col-12">
                        <label htmlFor="inputChoosePassword" className="form-label">Enter Password</label>
                        <div className="input-group" id="show_hide_password">
                          <input type="password" className="form-control border-end-0" id="inputChoosePassword" value="12345678" placeholder="Enter Password" /> <a href="javascript:;" className="input-group-text bg-transparent"><i className='bx bx-hide'></i></a>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked={true} />
                          <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Remember Me</label>
                        </div>
                      </div>
                      <div className="col-md-6 text-end">	<a href="authentication-forgot-password.html">Forgot Password ?</a>
                    </div>
                    <div className="col-12">
                      <div className="d-grid">
                        <button type="submit" className="btn btn-light"><i className="bx bxs-lock-open"></i>Sign in</button>
                      </div>
                    </div>
                  </form>
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
    <script src="assets/js/show-hide-password.js"></script>
    <script src='../../../img1.wsimg.com/signals/js/clients/scc-c2/scc-c2.min.js'></script>
  );
}

export default AuthenticationSignin;
