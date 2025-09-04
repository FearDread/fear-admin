import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import BannerSub from "../../components/Banner/BannerSub";
import { store } from "../../features/store";
import { Order } from "../../features/orders/slice";

// Country data
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
];

// Form validation helper
const validateForm = (formData) => {
  const errors = {};
  
  // Billing address validation
  if (!formData.billing.fullName.trim()) errors.billingFullName = "Full name is required";
  if (!formData.billing.country) errors.billingCountry = "Country is required";
  if (!formData.billing.city.trim()) errors.billingCity = "City is required";
  if (!formData.billing.postalCode.trim()) errors.billingPostalCode = "Postal code is required";
  if (!formData.billing.houseNumber.trim()) errors.billingHouseNumber = "House number is required";
  if (!formData.billing.address.trim()) errors.billingAddress = "Address is required";
  if (!formData.billing.phone.trim()) errors.billingPhone = "Phone is required";
  
  // If shipping is different, validate shipping address
  if (!formData.sameAsShipping) {
    if (!formData.shipping.fullName.trim()) errors.shippingFullName = "Full name is required";
    if (!formData.shipping.country) errors.shippingCountry = "Country is required";
    if (!formData.shipping.city.trim()) errors.shippingCity = "City is required";
    if (!formData.shipping.postalCode.trim()) errors.shippingPostalCode = "Postal code is required";
    if (!formData.shipping.houseNumber.trim()) errors.shippingHouseNumber = "House number is required";
    if (!formData.shipping.address.trim()) errors.shippingAddress = "Address is required";
    if (!formData.shipping.phone.trim()) errors.shippingPhone = "Phone is required";
  }
  
  // Payment validation
  if (formData.paymentMethod === 'card') {
    if (!formData.payment.cardholderName.trim()) errors.cardholderName = "Cardholder name is required";
    if (!formData.payment.cardNumber.trim()) errors.cardNumber = "Card number is required";
    if (!formData.payment.expiryMonth) errors.expiryMonth = "Expiry month is required";
    if (!formData.payment.expiryYear) errors.expiryYear = "Expiry year is required";
    if (!formData.payment.cvv.trim()) errors.cvv = "CVV is required";
  } else if (formData.paymentMethod === 'banking') {
    if (!formData.payment.bank) errors.bank = "Bank selection is required";
  }
  
  return errors;
};

// Order Summary Component
const OrderSummary = ({ cartData, totals }) => {
  if (!cartData || cartData.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted">No items in cart</p>
      </div>
    );
  }

  return (
    <>
      <div className="oder-summary-item mt-4">
        <table className="table checkout-table">
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Quantity</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {cartData.map((item) => (
              <tr key={item._id}>
                <td>{item.productId?.name || 'Unknown Product'}</td>
                <td>x {item.quantity || 1}</td>
                <td>${((item.productId?.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="oder-right-details-new">
        <div className="price-sec-order">
          <p className="price-am">
            Subtotal <span>${totals.subtotal}</span>
          </p>
          <p className="delivery-am">
            Delivery charges <span>{totals.deliveryCharges === '0.00' ? 'Free' : `$${totals.deliveryCharges}`}</span>
          </p>
          <p className="discount-am">
            Discount <span>-${totals.discount}</span>
          </p>
          <div className="total-price p-0">
            <p className="discount-am mb-lg-0">
              Total Amount <span>${totals.total}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// Address Form Component
const AddressForm = ({ data, onChange, errors, prefix, title }) => (
  <div className="comon-steps-div mt-5">
    <h2 className="page-haeding m-0">{title}</h2>
    <div className="row mt-4">
      <div className="col-lg-12">
        <div className="form-group">
          <label htmlFor={`${prefix}FullName`}>Full Name *</label>
          <input
            id={`${prefix}FullName`}
            type="text"
            className={`form-control ${errors[`${prefix}FullName`] ? 'is-invalid' : ''}`}
            value={data.fullName}
            onChange={(e) => onChange(`${prefix}.fullName`, e.target.value)}
          />
          {errors[`${prefix}FullName`] && (
            <div className="invalid-feedback">{errors[`${prefix}FullName`]}</div>
          )}
        </div>
      </div>

      <div className="col-lg-6">
        <div className="form-group">
          <label htmlFor={`${prefix}Country`}>Select Country *</label>
          <select
            id={`${prefix}Country`}
            className={`form-select ${errors[`${prefix}Country`] ? 'is-invalid' : ''}`}
            value={data.country}
            onChange={(e) => onChange(`${prefix}.country`, e.target.value)}
          >
            <option value="">Select Country</option>
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          {errors[`${prefix}Country`] && (
            <div className="invalid-feedback">{errors[`${prefix}Country`]}</div>
          )}
        </div>
      </div>

      <div className="col-lg-6">
        <div className="form-group">
          <label htmlFor={`${prefix}State`}>State / Region</label>
          <input
            id={`${prefix}State`}
            type="text"
            className="form-control"
            placeholder="Enter state or region"
            value={data.state}
            onChange={(e) => onChange(`${prefix}.state`, e.target.value)}
          />
        </div>
      </div>

      <div className="col-lg-6">
        <div className="form-group">
          <label htmlFor={`${prefix}City`}>Town / City *</label>
          <input
            id={`${prefix}City`}
            type="text"
            className={`form-control ${errors[`${prefix}City`] ? 'is-invalid' : ''}`}
            value={data.city}
            onChange={(e) => onChange(`${prefix}.city`, e.target.value)}
          />
          {errors[`${prefix}City`] && (
            <div className="invalid-feedback">{errors[`${prefix}City`]}</div>
          )}
        </div>
      </div>

      <div className="col-lg-6">
        <div className="form-group">
          <label htmlFor={`${prefix}PostalCode`}>Postal Code / Zipcode *</label>
          <input
            id={`${prefix}PostalCode`}
            type="text"
            className={`form-control ${errors[`${prefix}PostalCode`] ? 'is-invalid' : ''}`}
            value={data.postalCode}
            onChange={(e) => onChange(`${prefix}.postalCode`, e.target.value)}
          />
          {errors[`${prefix}PostalCode`] && (
            <div className="invalid-feedback">{errors[`${prefix}PostalCode`]}</div>
          )}
        </div>
      </div>

      <div className="col-lg-6">
        <div className="form-group">
          <label htmlFor={`${prefix}HouseNumber`}>House Number *</label>
          <input
            id={`${prefix}HouseNumber`}
            type="text"
            className={`form-control ${errors[`${prefix}HouseNumber`] ? 'is-invalid' : ''}`}
            value={data.houseNumber}
            onChange={(e) => onChange(`${prefix}.houseNumber`, e.target.value)}
          />
          {errors[`${prefix}HouseNumber`] && (
            <div className="invalid-feedback">{errors[`${prefix}HouseNumber`]}</div>
          )}
        </div>
      </div>

      <div className="col-lg-6">
        <div className="form-group">
          <label htmlFor={`${prefix}Phone`}>Phone *</label>
          <input
            id={`${prefix}Phone`}
            type="tel"
            className={`form-control ${errors[`${prefix}Phone`] ? 'is-invalid' : ''}`}
            value={data.phone}
            onChange={(e) => onChange(`${prefix}.phone`, e.target.value)}
          />
          {errors[`${prefix}Phone`] && (
            <div className="invalid-feedback">{errors[`${prefix}Phone`]}</div>
          )}
        </div>
      </div>

      <div className="col-lg-12">
        <div className="form-group">
          <label htmlFor={`${prefix}Address`}>Address 1 *</label>
          <input
            id={`${prefix}Address`}
            type="text"
            className={`form-control ${errors[`${prefix}Address`] ? 'is-invalid' : ''}`}
            value={data.address}
            onChange={(e) => onChange(`${prefix}.address`, e.target.value)}
          />
          {errors[`${prefix}Address`] && (
            <div className="invalid-feedback">{errors[`${prefix}Address`]}</div>
          )}
        </div>
      </div>
    </div>
  </div>
);

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartData = useSelector(state => state.cart.data);
  const { data: userData } = useSelector(state => state.user);
  const { data, success, loading } = useSelector(state => state.order);
  const [formData, setFormData] = useState({
    billing: {
      fullName: "",
      country: "",
      state: "",
      city: "",
      postalCode: "",
      houseNumber: "",
      phone: "",
      address: ""
    },
    shipping: {
      fullName: "",
      country: "",
      state: "",
      city: "",
      postalCode: "",
      houseNumber: "",
      phone: "",
      address: ""
    },
    sameAsShipping: false,
    paymentMethod: 'card',
    payment: {
      cardholderName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      bank: ""
    }
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cartTotals = useMemo(() => {
    if (!cartData || cartData.length === 0) {
      return {
        subtotal: '0.00',
        deliveryCharges: '0.00',
        discount: '0.00',
        total: '0.00'
      };
    }
    
    const subtotal = cartData.reduce((sum, item) => {
      const price = item.productId?.price || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);
    
    const deliveryCharges = subtotal > 50 ? 0 : 10; // Free shipping over $50
    const discount = 0; // TODO: Implement discount logic
    const total = subtotal + deliveryCharges - discount;
    
    return {
      subtotal: subtotal.toFixed(2),
      deliveryCharges: deliveryCharges.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2)
    };
  }, [cartData]);
  const handleFieldChange = useCallback((fieldPath, value) => {
    const keys = fieldPath.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[fieldPath.replace('.', '')]) {
      setErrors(prev => ({
        ...prev,
        [fieldPath.replace('.', '')]: ""
      }));
    }
  }, [errors]);
  const handleSameAsShipping = (e) => {
    const checked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      sameAsShipping: checked,
      ...(checked && { shipping: { ...prev.billing } })
    }));
  };
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const orderData = { formData, cartData, totals: cartTotals }
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setIsSubmitting(true);
    setErrors({});
  
    console.log('Processing checkout:', orderData);
    try {
      dispatch(Order.process(orderData))
    } catch (error) {
      console.error('Checkout error:', error);
      setErrors({ general: 'Payment processing failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, cartData, cartTotals, navigate]);
  
  useEffect(() => {
    if (!cartData || cartData.length === 0) {
      navigate('/cart');
    }
  }, [cartData, navigate]);
  
  useEffect(() => {
    if (success) navigate('/order-success');
  }, [success])
  return (
    <>
      <BannerSub />
      <main className="float-start w-100 total-body home-body mt-0">
        <section className="checkout-page-main-div my-5">
          <div className="container">
            <div className="form-wizard">
              <form onSubmit={handleSubmit} method="post" role="form" noValidate>
                <fieldset className="wizard-fieldset show">
                  <div className="row g-lg-5">
                    <div className="col-lg-8 checkout-left-div">
                      <div className="ad-fm">
                        {/* General Error */}
                        {errors.general && (
                          <div className="alert alert-danger mb-4">
                            {errors.general}
                          </div>
                        )}
                        
                        {/* Billing Address */}
                        <AddressForm
                          data={formData.billing}
                          onChange={handleFieldChange}
                          errors={errors}
                          prefix="billing"
                          title="Billing Address"
                        />
                        
                        {/* Same as Shipping Checkbox */}
                        <div className="form-check mt-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="sameAsShipping"
                            checked={formData.sameAsShipping}
                            onChange={handleSameAsShipping}
                          />
                          <label className="form-check-label" htmlFor="sameAsShipping">
                            Shipping address same as billing address
                          </label>
                        </div>
                        
                        {/* Shipping Address */}
                        {!formData.sameAsShipping && (
                          <AddressForm
                            data={formData.shipping}
                            onChange={handleFieldChange}
                            errors={errors}
                            prefix="shipping"
                            title="Shipping Address"
                          />
                        )}
                        
                        {/* Payment Method */}
                        <div className="paymeny comon-steps-div mt-5">
                          <h2 className="page-haeding m-0">Payment Method</h2>
                          
                          {/* Credit Card Option */}
                          <div className="d-flex align-items-center justify-content-between mt-4">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="paymentMethod"
                                id="creditCard"
                                value="card"
                                checked={formData.paymentMethod === 'card'}
                                onChange={(e) => handleFieldChange('paymentMethod', e.target.value)}
                              />
                              <label className="form-check-label" htmlFor="creditCard">
                                Credit Cards / Debit Card
                              </label>
                            </div>
                            <figure className="m-0">
                              <img src="images/visag01.jpg" alt="Payment cards" />
                            </figure>
                          </div>
                          
                          {/* Credit Card Form */}
                          {formData.paymentMethod === 'card' && (
                            <div className="account-page-n mt-3">
                              <div className="row">
                                <div className="col-12">
                                  <div className="form-group">
                                    <label htmlFor="cardholderName">Cardholder Name *</label>
                                    <input
                                      id="cardholderName"
                                      type="text"
                                      className={`form-control ${errors.cardholderName ? 'is-invalid' : ''}`}
                                      value={formData.payment.cardholderName}
                                      onChange={(e) => handleFieldChange('payment.cardholderName', e.target.value)}
                                    />
                                    {errors.cardholderName && (
                                      <div className="invalid-feedback">{errors.cardholderName}</div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="col-12">
                                  <div className="form-group mt-3">
                                    <label htmlFor="cardNumber">Card Number *</label>
                                    <input
                                      id="cardNumber"
                                      type="text"
                                      className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                                      placeholder="1234 5678 9012 3456"
                                      value={formData.payment.cardNumber}
                                      onChange={(e) => handleFieldChange('payment.cardNumber', e.target.value)}
                                    />
                                    {errors.cardNumber && (
                                      <div className="invalid-feedback">{errors.cardNumber}</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="d-flex mt-3 gap-3">
                                <div className="flex-grow-1">
                                  <h6>Expiry Date</h6>
                                  <div className="d-flex gap-2">
                                    <select
                                      className={`form-select ${errors.expiryMonth ? 'is-invalid' : ''}`}
                                      value={formData.payment.expiryMonth}
                                      onChange={(e) => handleFieldChange('payment.expiryMonth', e.target.value)}
                                    >
                                      <option value="">MM</option>
                                      {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                          {String(i + 1).padStart(2, '0')}
                                        </option>
                                      ))}
                                    </select>
                                    
                                    <select
                                      className={`form-select ${errors.expiryYear ? 'is-invalid' : ''}`}
                                      value={formData.payment.expiryYear}
                                      onChange={(e) => handleFieldChange('payment.expiryYear', e.target.value)}
                                    >
                                      <option value="">YYYY</option>
                                      {Array.from({ length: 10 }, (_, i) => {
                                        const year = new Date().getFullYear() + i;
                                        return (
                                          <option key={year} value={year}>
                                            {year}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                </div>
                                
                                <div>
                                  <h6>CVV</h6>
                                  <div className="d-flex align-items-center gap-2">
                                    <input
                                      type="text"
                                      className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                                      placeholder="123"
                                      maxLength="4"
                                      value={formData.payment.cvv}
                                      onChange={(e) => handleFieldChange('payment.cvv', e.target.value)}
                                    />
                                    <span className="text-muted small">
                                      <i className="fas fa-info-circle"></i> 3-4 digits
                                    </span>
                                  </div>
                                  {errors.cvv && (
                                    <div className="invalid-feedback d-block">{errors.cvv}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Online Banking Option */}
                          <div className="form-check mt-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="paymentMethod"
                              id="onlineBanking"
                              value="banking"
                              checked={formData.paymentMethod === 'banking'}
                              onChange={(e) => handleFieldChange('paymentMethod', e.target.value)}
                            />
                            <label className="form-check-label" htmlFor="onlineBanking">
                              Online Banking
                            </label>
                          </div>
                          
                          {formData.paymentMethod === 'banking' && (
                            <div className="account-page-n mt-3">
                              <div className="form-group">
                                <label htmlFor="bankSelect">Select Bank *</label>
                                <select
                                  id="bankSelect"
                                  className={`form-select ${errors.bank ? 'is-invalid' : ''}`}
                                  value={formData.payment.bank}
                                  onChange={(e) => handleFieldChange('payment.bank', e.target.value)}
                                >
                                  <option value="">Select your bank</option>
                                  <option value="chase">Chase Bank</option>
                                  <option value="wells">Wells Fargo</option>
                                  <option value="bofa">Bank of America</option>
                                  <option value="citi">Citibank</option>
                                </select>
                                {errors.bank && (
                                  <div className="invalid-feedback">{errors.bank}</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Summary */}
                    <div className="col-lg-4 checkout-right-div">
                      <div className="ceck-out-right-div new-checkout mt-5 mt-lg-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <h2 className="page-haeding m-0">Your Order</h2>
                        </div>
                        
                        <OrderSummary cartData={cartData} totals={cartTotals} />
                      </div>
                      
                      <button
                        type="submit"
                        className="comon-button btn text-center mt-5 w-100"
                        disabled={isSubmitting || !cartData || cartData.length === 0}
                      >
                        <span>
                          {isSubmitting ? 'Processing...' : `Pay Now - $${cartTotals.total}`}
                        </span>
                      </button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Checkout;