import React from 'react';
import Breadcrumbs from '../../components/common/Breadcrumbs';


const CheckoutShipping = () => {
  return (
    <>
      <section className="py-3 border-bottom d-none d-md-flex">
        <div className="container">
          <div className="page-breadcrumb d-flex align-items-center">
            <h3 className="breadcrumb-title pe-3">Checkout</h3>
            <div className="ms-auto">
              <Breadcrumbs
                items={[
                  { label: 'Checkout', path: '/checkout/detials', icon: 'bx bx-check ' },
                  { label: 'Shipping', path: '/checkout/shipping', icon: 'bx bx-shopping-cart', isActive: true }
              ]}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-4">
        <div className="container">
          <div className="shop-cart">
            <div className="row">
              <div className="col-12 col-xl-8">
                <div className="checkout-shipping">
                  <div className="card bg-transparent rounded-0 shadow-none">
                    <div className="card-body">
                      <div className="steps steps-light">
                        <a className="step-item active" href="shop-cart.html">
                          <div className="step-progress"><span className="step-count">1</span>
                          </div>
                          <div className="step-label"><i className='bx bx-cart'></i>Cart</div>
                        </a>
                        <a className="step-item active" href="checkout-details.html">
                          <div className="step-progress"><span className="step-count">2</span>
                          </div>
                          <div className="step-label"><i className='bx bx-user-circle'></i>Details</div>
                        </a>
                        <a className="step-item active current" href="checkout-shipping.html">
                          <div className="step-progress"><span className="step-count">3</span>
                          </div>
                          <div className="step-label"><i className='bx bx-cube'></i>Shipping</div>
                        </a>
                        <a className="step-item" href="checkout-payment.html">
                          <div className="step-progress"><span className="step-count">4</span>
                          </div>
                          <div className="step-label"><i className='bx bx-credit-card'></i>Payment</div>
                        </a>
                        <a className="step-item" href="checkout-review.html">
                          <div className="step-progress"><span className="step-count">5</span>
                          </div>
                          <div className="step-label"><i className='bx bx-check-circle'></i>Review</div>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="card rounded-0 shadow-none">
                    <div className="card-body">
                      <h2 className="h5 mb-0">Choose Shipping Method</h2>
                      <div className="my-3 border-bottom"></div>
                      <div className="table-responsive">
                        <table className="table">
                          <thead className="table-light">
                            <tr>
                              <th>Method</th>
                              <th>Time</th>
                              <th>Fee</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Flat Rate</td>
                              <td>2 days</td>
                              <td>$10.00</td>
                            </tr>
                            <tr>
                              <td>International shipping</td>
                              <td>12 days</td>
                              <td>$12.00</td>
                            </tr>
                            <tr>
                              <td>Same day delivery</td>
                              <td>1 day</td>
                              <td>$22.00</td>
                            </tr>
                            <tr>
                              <td>Expedited shipping</td>
                              <td>--</td>
                              <td>$15.00</td>
                            </tr>
                            <tr>
                              <td>Local Pickup</td>
                              <td>--</td>
                              <td>$0.00</td>
                            </tr>
                            <tr>
                              <td>UPS Ground</td>
                              <td>2-5 days</td>
                              <td>$16.00</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="card rounded-0 shadow-none">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="d-grid">	<a href="javascript:;" className="btn btn-light btn-ecomm"><i className="bx bx-chevron-left"></i>Back to Details</a>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-grid">	<a href="javascript:;" className="btn btn-white btn-ecomm">Proceed to Payment<i className="bx bx-chevron-right"></i></a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-xl-4">
                <div className="order-summary">
                  <div className="card rounded-0">
                    <div className="card-body">
                      <div className="card rounded-0 border bg-transparent shadow-none">
                        <div className="card-body">
                          <p className="fs-5 text-white">Apply Discount Code</p>
                          <div className="input-group">
                            <input type="text" className="form-control rounded-0" placeholder="Enter discount code" />
                            <button className="btn btn-light btn-ecomm" type="button">Apply Discount</button>
                          </div>
                        </div>
                      </div>
                      <div className="card rounded-0 border bg-transparent shadow-none">
                        <div className="card-body">
                          <p className="fs-5 text-white">Order summary</p>
                          <div className="my-3 border-top"></div>
                          <div className="d-flex align-items-center">
                            <a className="d-block flex-shrink-0" href="javascript:;">
                              <img src="assets/images/products/01.png" width="75" alt="Product" />
                            </a>
                            <div className="ps-2">
                              <h6 className="mb-1"><a href="javascript:;">White Polo T-Shirt</a></h6>
                              <div className="widget-product-meta"><span className="me-2">$19.<small>00</small></span><span>x 1</span>
                              </div>
                            </div>
                          </div>
                          <div className="my-3 border-top"></div>
                          <div className="d-flex align-items-center">
                            <a className="d-block flex-shrink-0" href="javascript:;">
                              <img src="assets/images/products/17.png" width="75" alt="Product" />
                            </a>
                            <div className="ps-2">
                              <h6 className="mb-1"><a href="javascript:;">Fancy Red Sneakers</a></h6>
                              <div className="widget-product-meta"><span className="me-2">$16.<small>00</small></span><span>x 2</span>
                              </div>
                            </div>
                          </div>
                          <div className="my-3 border-top"></div>
                          <div className="d-flex align-items-center">
                            <a className="d-block flex-shrink-0" href="javascript:;">
                              <img src="assets/images/products/04.png" width="75" alt="Product" />
                            </a>
                            <div className="ps-2">
                              <h6 className="mb-1"><a href="javascript:;">Yellow Shine Blazer</a></h6>
                              <div className="widget-product-meta"><span className="me-2">$22.<small>00</small></span><span>x 1</span>
                              </div>
                            </div>
                          </div>
                          <div className="my-3 border-top"></div>
                          <div className="d-flex align-items-center">
                            <a className="d-block flex-shrink-0" href="javascript:;">
                              <img src="assets/images/products/09.png" width="75" alt="Product" />
                            </a>
                            <div className="ps-2">
                              <h6 className="mb-1"><a href="javascript:;">Men Black Hat Cap</a></h6>
                              <div className="widget-product-meta"><span className="me-2">$14.<small>00</small></span><span>x 1</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card rounded-0 border bg-transparent mb-0 shadow-none">
                        <div className="card-body">
                          <p className="mb-2">Subtotal: <span className="float-end">$198.00</span>
                          </p>
                          <p className="mb-2">Shipping: <span className="float-end">--</span>
                          </p>
                          <p className="mb-2">Taxes: <span className="float-end">$14.00</span>
                          </p>
                          <p className="mb-0">Discount: <span className="float-end">--</span>
                          </p>
                          <div className="my-3 border-top"></div>
                          <h5 className="mb-0">Order Total: <span className="float-end">212.00</span></h5>
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

export default CheckoutShipping;
