import React from 'react';

export const Register = () => {
  return (
    <>
      <section className="py-0 py-lg-5">
        <div className="container">
          <div clasasName="section-authentication-signin d-flex align-items-center justify-content-center my-5 my-lg-0">
            <div className="row row-cols-1 row-cols-lg-1 row-cols-xl-2">
              <div className="col mx-auto">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="border p-4 rounded">
                      <div className="text-center">
                        <h3>Sign Up</h3>
                        <p>Already have an account? <a href="authentication-signin.html">Sign in here</a>
                        </p>
                      </div>
                      <div className="d-grid">
                        <a className="btn my-4 shadow-sm btn-light" href="javascript:;"> <span className="d-flex justify-content-center align-items-center">
                          <img className="me-2" src="assets/images/icons/search.svg" width="16" alt="Image Description" />
                          <span>Sign Up with Google</span>
                        </span>
                        </a> <a href="javascript:;" className="btn btn-light"><i className="bx bxl-facebook"></i>Sign Up with Facebook</a>
                      </div>
                      <div className="login-separater text-center mb-4"> <span>OR SIGN UP WITH EMAIL</span>
                        <hr / />
                      </div>
                      <div className="form-body">
                        <form className="row g-3">
                          <div className="col-sm-6">
                            <label htmlFor="inputFirstName" className="form-label">First Name</label>
                            <input type="email" className="form-control" id="inputFirstName" placeholder="Jhon" />
                          </div>
                          <div className="col-sm-6">
                            <label htmlFor="inputLastName" className="form-label">Last Name</label>
                            <input type="email" className="form-control" id="inputLastName" placeholder="Deo" />
                          </div>
                          <div className="col-12">
                            <label htmlFor="inputEmailAddress" className="form-label">Email Address</label>
                            <input type="email" className="form-control" id="inputEmailAddress" placeholder="example@user.com" />
                          </div>
                          <div className="col-12">
                            <label htmlFor="inputChoosePassword" className="form-label">Password</label>
                            <div className="input-group" id="show_hide_password">
                              <input type="password" className="form-control border-end-0" id="inputChoosePassword" value="12345678" placeholder="Enter Password" /> <a href="javascript:;" className="input-group-text bg-transparent"><i className='bx bx-hide'></i></a>
                            </div>
                          </div>
                          <div className="col-12">
                            <label htmlFor="inputSelectCountry" className="form-label">Country</label>
                            <select className="form-select" id="inputSelectCountry" aria-label="Default select example">
                              <option selected={true}>India</option>
                              <option value="1">United Kingdom</option>
                              <option value="2">America</option>
                              <option value="3">Dubai</option>
                            </select>
                          </div>
                          <div className="col-12">
                            <div className="form-check form-switch">
                              <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked" />
                              <label className="form-check-label" htmlFor="flexSwitchCheckChecked">I read and agree to Terms & Conditions</label>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="d-grid">
                              <button type="submit" className="btn btn-light"><i className='bx bx-user'></i>Sign up</button>
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
    </>
  );
}

export default Register;
