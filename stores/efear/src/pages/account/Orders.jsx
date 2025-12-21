
function AccountOrders() {
  return (
    <>
      <section className="py-3 border-bottom d-none d-md-flex">
        <div className="container">
          <div className="page-breadcrumb d-flex align-items-center">
            <h3 className="breadcrumb-title pe-3">My Orders</h3>
            <div className="ms-auto">
              {/* breadcrumbs */}
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
                        <a href="account-orders.html" className="list-group-item active d-flex justify-content-between align-items-center">Orders <i className='bx bx-cart-alt fs-5'></i></a>
                        <a href="account-downloads.html" className="list-group-item d-flex justify-content-between align-items-center bg-transparent">Downloads <i className='bx bx-download fs-5'></i></a>
                        <a href="account-addresses.html" className="list-group-item d-flex justify-content-between align-items-center bg-transparent">Addresses <i className='bx bx-home-smile fs-5'></i></a>
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
                      <div className="table-responsive">
                        <table className="table">
                          <thead className="table-light">
                            <tr>
                              <th>Order</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Total</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>#800</td>
                              <td>Novermber 15, 2021</td>
                              <td>
                                <div className="badge rounded-pill bg-light w-100">Completed</div>
                              </td>
                              <td>$100.00 for 1 item</td>
                              <td>
                                <div className="d-flex gap-2">	<a href="javascript:;" className="btn btn-light btn-sm rounded-0">View</a>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>#796</td>
                              <td>Novermber 12, 2021</td>
                              <td>
                                <div className="badge rounded-pill bg-light w-100">Failed</div>
                              </td>
                              <td>$100.00 for 1 item</td>
                              <td>
                                <div className="d-flex gap-2"> <a href="javascript:;" className="btn btn-light btn-sm rounded-0">View</a>
                                  <a href="javascript:;" className="btn btn-light btn-sm rounded-0">Pay</a>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>#859</td>
                              <td>Novermber 10, 2021</td>
                              <td>
                                <div className="badge rounded-pill bg-light w-100">Failed</div>
                              </td>
                              <td>$100.00 for 1 item</td>
                              <td>
                                <div className="d-flex gap-2"> <a href="javascript:;" className="btn btn-light btn-sm rounded-0">View</a>
                                  <a href="javascript:;" className="btn btn-light btn-sm rounded-0">Pay</a>
                                  <a href="javascript:;" className="btn btn-light btn-sm rounded-0">Cancel</a>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>#869</td>
                              <td>Novermber 9, 2021</td>
                              <td>
                                <div className="badge rounded-pill bg-light w-100">Cancelled</div>
                              </td>
                              <td>$120.00 for 1 item</td>
                              <td>
                                <div className="d-flex gap-2"> <a href="javascript:;" className="btn btn-light btn-sm rounded-0">View</a>
                                  <a href="javascript:;" className="btn btn-light btn-sm rounded-0">Pay</a>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>#829</td>
                              <td>Novermber 8, 2021</td>
                              <td>
                                <div className="badge rounded-pill bg-light w-100">Completed</div>
                              </td>
                              <td>$224.00 for 2 item</td>
                              <td>
                                <div className="d-flex gap-2"> <a href="javascript:;" className="btn btn-light btn-sm rounded-0">View</a>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>#879</td>
                              <td>Novermber 8, 2021</td>
                              <td>
                                <div className="badge rounded-pill bg-light w-100">Completed</div>
                              </td>
                              <td>$126.00 for 3 item</td>
                              <td>
                                <div className="d-flex gap-2"> <a href="javascript:;" className="btn btn-light btn-sm rounded-0">View</a>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>#863</td>
                              <td>Novermber 4, 2021</td>
                              <td>
                                <div className="badge rounded-pill bg-light w-100">Failed</div>
                              </td>
                              <td>$200.00 for 2 item</td>
                              <td>
                                <div className="d-flex gap-2"> <a href="javascript:;" className="btn btn-light btn-sm rounded-0">View</a>
                                  <a href="javascript:;" className="btn btn-light btn-sm rounded-0">Pay</a>
                                  <a href="javascript:;" className="btn btn-light btn-sm rounded-0">Cancel</a>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
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
  )
}

export default AccountOrders;
