import React from 'react';


function AccountAddresses() {
  return (
    <>
            <section className="py-3 border-bottom d-none d-md-flex">
          <div className="container">
            <div className="page-breadcrumb d-flex align-items-center">
              <h3 className="breadcrumb-title pe-3">My Orders</h3>
              <div className="ms-auto">

              </div>
            </div>
          </div>
        </section>
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
                        <a href="account-addresses.html" className="list-group-item active d-flex justify-content-between align-items-center">Addresses <i className='bx bx-home-smile fs-5'></i></a>
                        <a href="account-payment-methods.html" className="list-group-item d-flex justify-content-between align-items-center bg-transparent">Payment Methods <i className='bx bx-credit-card fs-5'></i></a>
                        <a href="account-user-details.html" className="list-group-item d-flex justify-content-between align-items-center bg-transparent">Account Details <i className='bx bx-user-circle fs-5'></i></a>
                        <a href="#" className="list-group-item d-flex justify-content-between align-items-center bg-transparent">Logout <i className='bx bx-log-out fs-5'></i></a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="card shadow-none mb-0">
                    <div className="card-body">
                      <h6 className="mb-4">The following addresses will be used on the checkuot page by default.</h6>
                      <div className="row">
                        <div className="col-12 col-lg-6">
                          <h5 className="mb-3">Billing Addresses</h5>
                          <address>
                            Madison Riiz<br />
                            123 Happy Street<br />
                            Cape Town<br />
                            Western Cape<br />
                            8001<br />
                            South Africa
                          </address>
                        </div>
                        <div className="col-12 col-lg-6">
                          <h5 className="mb-3">Shipping Addresses</h5>
                          <address>
                            Madison Riiz<br />
                            123 Happy Street<br />
                            Cape Town<br />
                            Western Cape<br />
                            8001<br />
                            South Africa
                          </address>
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
    </>
  );
}

export default AccountAddresses;
