import React from 'react';
import Breadcrumbs from "../../components/common/Breadcrumbs";

function CheckoutPayment() {
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
                  { label: 'Payment', path: '/checkout/payment', icon: 'bx bx-shopping-cart', isActive: true }
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
                <div className="checkout-payment">
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
                        <a className="step-item active" href="checkout-shipping.html">
                          <div className="step-progress"><span className="step-count">3</span>
                          </div>
                          <div className="step-label"><i className='bx bx-cube'></i>Shipping</div>
                        </a>
                        <a className="step-item active current" href="checkout-payment.html">
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
                    <div className="card-header border-bottom">
                      <h2 className="h5 my-2">Choose Payment Method</h2>
                    </div>
                    <div className="card-body">
                      <ul className="nav nav-pills mb-3 border p-3" role="tablist">
                        <li className="nav-item" role="presentation">
                          <a className="nav-link active rounded-0" data-bs-toggle="pill" href="#credit-card" role="tab" aria-selected="true">
                            <div className="d-flex align-items-center">
                              <div className="tab-icon"><i className='bx bx-credit-card font-18 me-1'></i>
                              </div>
                              <div className="tab-title">Credit Card</div>
                            </div>
                          </a>
                        </li>
                        <li className="nav-item" role="presentation">
                          <a className="nav-link rounded-0" data-bs-toggle="pill" href="#paypal-payment" role="tab" aria-selected="false">
                            <div className="d-flex align-items-center">
                              <div className="tab-icon"><i className='bx bxl-paypal font-18 me-1'></i>
                              </div>
                              <div className="tab-title">Paypal</div>
                            </div>
                          </a>
                        </li>
                        <li className="nav-item" role="presentation">
                          <a className="nav-link rounded-0" data-bs-toggle="pill" href="#net-banking" role="tab" aria-selected="false">
                            <div className="d-flex align-items-center">
                              <div className="tab-icon"><i className='bx bx-mobile font-18 me-1'></i>
                              </div>
                              <div className="tab-title">Net Banking</div>
                            </div>
                          </a>
                        </li>
                      </ul>
                      <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="credit-card" role="tabpanel">
                          <div className="p-3 border">
                            <form>
                              <div className="mb-3">
                                <label className="form-label">Card Owner</label>
                                <input type="text" className="form-control rounded-0" placeholder="Card Owner name" />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Card number</label>
                                <div className="input-group">
                                  <input type="text" className="form-control rounded-0" placeholder="Valid Owner number" />	<span className="input-group-text rounded-0"><img src="assets/images/icons/mastercard.png" width="35" alt="" /></span>
                                  <span className="input-group-text rounded-0"><img src="assets/images/icons/visa.png" width="35" alt="" /></span>
                                  <span className="input-group-text rounded-0"><img src="assets/images/icons/american-express.png" width="35" alt="" /></span>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-12 col-lg-8">
                                  <div className="mb-3">
                                    <label className="form-label">Expiration Date</label>
                                    <div className="input-group">
                                      <input type="text" className="form-control rounded-0" placeholder="MM" />
                                      <input type="text" className="form-control rounded-0" placeholder="YY" />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 col-lg-4">
                                  <div className="mb-3">
                                    <label className="form-label">CVV</label>
                                    <input type="text" className="form-control rounded-0" placeholder="Three digit CCV number" />
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="d-grid">	<a href="javascript:;" className="btn btn-white btn-ecomm rounded-0">Confirm Payment</a>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                        <div className="tab-pane fade" id="paypal-payment" role="tabpanel">
                          <div className="p-3 border">
                            <div className="mb-3">
                              <p>Select your Paypal Account type</p>
                              <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
                                <label className="form-check-label" htmlFor="inlineRadio1">Domestic</label>
                              </div>
                              <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
                                <label className="form-check-label" htmlFor="inlineRadio2">International</label>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="d-block">	<a href="javscript:;" className="btn btn-light rounded-0"><i className='bx bxl-paypal'></i>Login to my Paypal</a>
                              </div>
                            </div>
                            <div className="mb-3">
                              <p className="mb-0">Note: After clicking on the button, you will be directed to a secure gateway for payment. After completing the payment process, you will be redirected back to the website to view details of your order.</p>
                            </div>
                          </div>
                        </div>
                        <div className="tab-pane fade" id="net-banking" role="tabpanel">
                          <div className="p-3 border">
                            <div className="mb-3">
                              <p>Select your Bank</p>
                              <select className="form-select rounded-0" aria-label="Default select example">
                                <option selected={true}>--Please Select Your Bank--</option>
                                <option value="1">Bank Name 1</option>
                                <option value="2">Bank Name 2</option>
                                <option value="3">Bank Name 3</option>
                              </select>
                            </div>
                            <div className="mb-3">
                              <div className="d-block"> <a href="javscript:;" className="btn btn-light rounded-0"><i className='bx bxl-paypal'></i>Login to my Paypal</a>
                              </div>
                            </div>
                            <div className="mb-3">
                              <p className="mb-0">Note: After clicking on the button, you will be directed to a secure gateway for payment. After completing the payment process, you will be redirected back to the website to view details of your order.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card rounded-0 shadow-none">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="d-grid">	<a href="javascript:;" className="btn btn-light btn-ecomm"><i className="bx bx-chevron-left"></i>Back to Shipping</a>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-grid">	<a href="javascript:;" className="btn btn-white btn-ecomm">Review Your Order<i className="bx bx-chevron-right"></i></a>
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

export default CheckoutPayment;
