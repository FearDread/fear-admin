import React from 'react';
import Navigation from './Navigation';
import Header from './Header';
import Footer from './Footer';

function Forms() {
  return (
    <div id="pageloader-overlay" className="visible incoming"><div className="loader-wrapper-outer"><div className="loader-wrapper-inner" ><div className="loader"></div></div></div></div>
    <div id="wrapper">
      <div id="sidebar-wrapper" data-simplebar="" data-simplebar-auto-hide="true">
        <div className="brand-logo">
          <a href="index.html">
            <img src="assets/images/logo-icon.png" className="logo-icon" alt="logo icon" />
            <h5 className="logo-text">Dashtreme Admin</h5>
          </a>
        </div>
        <ul className="sidebar-menu do-nicescrol">
          <li className="sidebar-header">MAIN NAVIGATION</li>
          <li>
            <a href="index.html">
              <i className="zmdi zmdi-view-dashboard"></i> <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="icons.html">
              <i className="zmdi zmdi-invert-colors"></i> <span>UI Icons</span>
            </a>
          </li>
          <li>
            <a href="forms.html">
              <i className="zmdi zmdi-format-list-bulleted"></i> <span>Forms</span>
            </a>
          </li>
          <li>
            <a href="tables.html">
              <i className="zmdi zmdi-grid"></i> <span>Tables</span>
            </a>
          </li>
          <li>
            <a href="calendar.html">
              <i className="zmdi zmdi-calendar-check"></i> <span>Calendar</span>
              <small className="badge float-right badge-light">New</small>
            </a>
          </li>
          <li>
            <a href="profile.html">
              <i className="zmdi zmdi-face"></i> <span>Profile</span>
            </a>
          </li>
          <li>
            <a href="login.html" target="_blank">
              <i className="zmdi zmdi-lock"></i> <span>Login</span>
            </a>
          </li>
          <li>
            <a href="register.html" target="_blank">
              <i className="zmdi zmdi-account-circle"></i> <span>Registration</span>
            </a>
          </li>
          <li className="sidebar-header">LABELS</li>
          <li><a href="javaScript:void();"><i className="zmdi zmdi-coffee text-danger"></i> <span>Important</span></a></li>
          <li><a href="javaScript:void();"><i className="zmdi zmdi-chart-donut text-success"></i> <span>Warning</span></a></li>
          <li><a href="javaScript:void();"><i className="zmdi zmdi-share text-info"></i> <span>Information</span></a></li>
        </ul>
      </div>
      <Header />
      <div className="clearfix"></div>
      <div className="content-wrapper">
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <div className="card-title">Vertical Form</div>
                  <hr />
                  <form>
                    <div className="form-group">
                      <label htmlFor="input-1">Name</label>
                      <input type="text" className="form-control" id="input-1" placeholder="Enter Your Name" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="input-2">Email</label>
                      <input type="text" className="form-control" id="input-2" placeholder="Enter Your Email Address" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="input-3">Mobile</label>
                      <input type="text" className="form-control" id="input-3" placeholder="Enter Your Mobile Number" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="input-4">Password</label>
                      <input type="text" className="form-control" id="input-4" placeholder="Enter Password" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="input-5">Confirm Password</label>
                      <input type="text" className="form-control" id="input-5" placeholder="Confirm Password" />
                    </div>
                    <div className="form-group py-2">
                      <div className="icheck-material-white">
                        <input type="checkbox" id="user-checkbox1" checked=""/ />
                        <label htmlFor="user-checkbox1">I Agree Terms & Conditions</label>
                      </div>
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-light px-5"><i className="icon-lock"></i> Register</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <div className="card-title">Round Vertical Form</div>
                  <hr />
                  <form>
                    <div className="form-group">
                      <label htmlFor="input-6">Name</label>
                      <input type="text" className="form-control form-control-rounded" id="input-6" placeholder="Enter Your Name" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="input-7">Email</label>
                      <input type="text" className="form-control form-control-rounded" id="input-7" placeholder="Enter Your Email Address" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="input-8">Mobile</label>
                      <input type="text" className="form-control form-control-rounded" id="input-8" placeholder="Enter Your Mobile Number" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="input-9">Password</label>
                      <input type="text" className="form-control form-control-rounded" id="input-9" placeholder="Enter Password" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="input-10">Confirm Password</label>
                      <input type="text" className="form-control form-control-rounded" id="input-10" placeholder="Confirm Password" />
                    </div>
                    <div className="form-group py-2">
                      <div className="icheck-material-white">
                        <input type="checkbox" id="user-checkbox2" checked=""/ />
                        <label htmlFor="user-checkbox2">I Agree Terms & Conditions</label>
                      </div>
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-light btn-round px-5"><i className="icon-lock"></i> Register</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="overlay toggle-menu"></div>
        </div>
      </div>
      <a href="javaScript:void();" className="back-to-top"><i className="fa fa-angle-double-up"></i> </a>
      <Footer />
      <div className="right-sidebar">
        <div className="switcher-icon">
          <i className="zmdi zmdi-settings zmdi-hc-spin"></i>
        </div>
        <div className="right-sidebar-content">
          <p className="mb-0">Gaussion Texture</p>
          <hr />
          <ul className="switcher">
            <li id="theme1"></li>
            <li id="theme2"></li>
            <li id="theme3"></li>
            <li id="theme4"></li>
            <li id="theme5"></li>
            <li id="theme6"></li>
          </ul>
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
    </div>
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/popper.min.js"></script>
    <script src="assets/js/bootstrap.min.js"></script>
    <script src="assets/plugins/simplebar/js/simplebar.js"></script>
    <script src="assets/js/sidebar-menu.js"></script>
    <script src="assets/js/app-script.js"></script>
  );
}

export default Forms;
