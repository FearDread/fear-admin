import React from 'react';

function ResetPassword() {
  return (
    <div id="wrapper">
      <div className="height-100v d-flex align-items-center justify-content-center">
        <div className="card card-authentication1 mb-0">
          <div className="card-body">
            <div className="card-content p-2">
              <div className="card-title text-uppercase pb-2">Reset Password</div>
              <p className="pb-2">Please enter your email address. You will receive a link to create a new password via email.</p>
              <form>
                <div className="form-group">
                  <label htmlFor="exampleInputEmailAddress">Email Address</label>
                  <div className="position-relative has-icon-right">
                    <input type="text" id="exampleInputEmailAddress" className="form-control input-shadow" placeholder="Email Address" />
                    <div className="form-control-position">
                      <i className="icon-envelope-open"></i>
                    </div>
                  </div>
                </div>
                <button type="button" className="btn btn-light btn-block mt-3">Reset Password</button>
              </form>
            </div>
          </div>
          <div className="card-footer text-center py-3">
            <p className="text-warning mb-0">Return to the <a href="login.html"> Sign In</a></p>
          </div>
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

export default ResetPassword;
