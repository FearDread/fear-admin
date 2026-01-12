import React from 'react';
import Spotlight from "../../components/animated/SpotLight";

function Register() {
  return (
    <>
    <Spotlight />
      <div className="container">
        <div className="row">

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
                        <input type="checkbox" id="user-checkbox" checked="" />
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
          </div>
        </div>
    </>
  );
}

export default Register;
