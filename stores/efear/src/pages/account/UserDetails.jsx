import React from 'react';


export const UserDetails = () => {

  return (
    <>
      <section className="py-4">
        <div className="container">
          <h3 className="d-none">Account</h3>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-4">
                  <div className="card shadow-none mb-3 mb-lg-0">
                    <div className="card-body">
                      <div className="list-group list-group-flush">	<a href="account-dashboard.html" className="list-group-item d-flex justify-content-between align-items-center bg-transparent">Dashboard <i className='bx bx-tachometer fs-5'></i></a>
                        <a href="account-orders.html" className="list-group-item d-flex justify-content-between align-items-center bg-transparent">Orders <i className='bx bx-cart-alt fs-5'></i></a>
                        <a href="account-downloads.html" className="list-group-item d-flex justify-content-between align-items-center bg-transparent">Downloads <i className='bx bx-download fs-5'></i></a>
                        <a href="account-addresses.html" className="list-group-item d-flex justify-content-between align-items-center bg-transparent">Addresses <i className='bx bx-home-smile fs-5'></i></a>
                        <a href="account-payment-methods.html" className="list-group-item d-flex justify-content-between align-items-center bg-transparent">Payment Methods <i className='bx bx-credit-card fs-5'></i></a>
                        <a href="account-user-details.html" className="list-group-item active d-flex justify-content-between align-items-center">Account Details <i className='bx bx-user-circle fs-5'></i></a>
                        <a href="#" className="list-group-item d-flex justify-content-between align-items-center bg-transparent">Logout <i className='bx bx-log-out fs-5'></i></a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="card shadow-none mb-0">
                    <div className="card-body">
                      <form className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">First Name</label>
                          <input type="text" className="form-control" value="Madison" />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Last Name</label>
                          <input type="text" className="form-control" value="Ruiz" />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Display Name</label>
                          <input type="text" className="form-control" value="Madison Ruiz" />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Email address</label>
                          <input type="text" className="form-control" value="madison.ruiz@gmail.com" />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Current Password</label>
                          <input type="text" className="form-control" value="................." />
                        </div>
                        <div className="col-12">
                          <label className="form-label">New Password</label>
                          <input type="text" className="form-control" value="................." />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Confirm New Password</label>
                          <input type="text" className="form-control" value="................." />
                        </div>
                        <div className="col-12">
                          <button type="button" className="btn btn-light btn-ecomm">Save Changes</button>
                        </div>
                      </form>
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

export default UserDetails;
