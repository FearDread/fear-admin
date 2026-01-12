import React from 'react';

function Register() {
  return (
    <div id="pageloader-overlay" className="visible incoming"><div className="loader-wrapper-outer"><div className="loader-wrapper-inner" ><div className="loader"></div></div></div></div>
    <div id="wrapper">
      <div className="card card-authentication1 mx-auto my-4">
        <div className="card-body">
          <div className="card-content p-2">
            <div className="text-center">
              <img src="assets/images/logo-icon.png" alt="logo icon" />
            </div>
            <div className="card-title text-uppercase text-center py-3">Sign Up</div>
            <form>
              <div className="form-group">
                <label htmlFor="exampleInputName" className="sr-only">Name</label>
                <div className="position-relative has-icon-right">
                  <input type="text" id="exampleInputName" className="form-control input-shadow" placeholder="Enter Your Name" />
                  <div className="form-control-position">
                    <i className="icon-user"></i>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmailId" className="sr-only">Email ID</label>
                <div className="position-relative has-icon-right">
                  <input type="text" id="exampleInputEmailId" className="form-control input-shadow" placeholder="Enter Your Email ID" />
                  <div className="form-control-position">
                    <i className="icon-envelope-open"></i>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword" className="sr-only">Password</label>
                <div className="position-relative has-icon-right">
                  <input type="text" id="exampleInputPassword" className="form-control input-shadow" placeholder="Choose Password" />
                  <div className="form-control-position">
                    <i className="icon-lock"></i>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="icheck-material-white">
                  <input type="checkbox" id="user-checkbox" checked="" / />
                  <label htmlFor="user-checkbox">I Agree With Terms & Conditions</label>
                </div>
              </div>
              <button type="button" className="btn btn-light btn-block waves-effect waves-light">Sign Up</button>
              <div className="text-center mt-3">Sign Up With</div>
              <div className="form-row mt-4">
                <div className="form-group mb-0 col-6">
                  <button type="button" className="btn btn-light btn-block"><i className="fa fa-facebook-square"></i> Facebook</button>
                </div>
                <div className="form-group mb-0 col-6 text-right">
                  <button type="button" className="btn btn-light btn-block"><i className="fa fa-twitter-square"></i> Twitter</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="card-footer text-center py-3">
          <p className="text-warning mb-0">Already have an account? <a href="login.html"> Sign In here</a></p>
        </div>
      </div>
      <a href="javaScript:void();" className="back-to-top"><i className="fa fa-angle-double-up"></i> </a>
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
    <script src="assets/js/sidebar-menu.js"></script>
    <script src="assets/js/app-script.js"></script>
  );
}

export default Register;
