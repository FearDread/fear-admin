import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchCategories, selectAllCategories } from '../../features/categories/slice';


export const Footer = ({ categories }) => {
  const [subEmail, setSubEmail] = useState('');
  const [subLoading, setSubLoading] = useState(false);
  const [subMessage, setSubMessage] = useState({ text: '', type: '' });
  const allCategories = useSelector(selectAllCategories);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  
  if (!categories) categories = allCategories;
 
  const handleSubscribe = async () => {
    setSubMessage({ text: '', type: '' });
    if (!subEmail.trim()) {
      setSubMessage({ text: 'Please enter an email address', type: 'error' });
      return;
    }
    if (!isValidEmail(subEmail)) {
      setSubMessage({ text: 'Please enter a valid email address', type: 'error' });
      return;
    }

    setSubLoading(true);

    try {
      // Replace with your actual API endpoint
      const response = await fetch('https://fear.dedyn.io/fear/api/email/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: subEmail }),
      });
      console.log('subscript response = ', response);
      const data = await response.json();

      setSubMessage({ text: 'Successfully subscribed! Check your email.', type: 'success' });
      setSubEmail('');

    } catch (error) {

      setSubMessage({ 
        text: 'Failed to subscribe. Please try again later.', 
        type: 'error' 
      });
      console.error('Subscription error:', error);
    } finally {
      setSubLoading(false);
    }
  };
  
  return (
    <footer>
      <section className="py-4 bg-dark-1">
        <div className="container">
          <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-4">
            <div className="col">
              <div className="footer-section1 mb-3">
                <h6 className="mb-3 text-uppercase">Contact Info</h6>
                <hr />
                <div className="address mb-3">
                  <p className="mb-0 text-uppercase text-white">Address</p>
                  <p className="mb-0 font-12">2003 E. Veterans Memorial Blvd.</p>
                </div>
                <div className="phone mb-3">
                  <p className="mb-0 text-uppercase text-white">Phone</p>
                  <p className="mb-0 font-13">Toll Free (254) 345-0130</p>
                  <p className="mb-0 font-13">Mobile : +1 (254) 345-0130</p>
                </div>
                <div className="email mb-3">
                  <p className="mb-0 text-uppercase text-white">Email</p>
                  <p className="mb-0 font-13">fear.dread@underworld.dog</p>
                </div>
                <div className="working-days mb-3">
                  <p className="mb-0 text-uppercase text-white">WORKING DAYS</p>
                  <p className="mb-0 font-13">Mon - FRI / 9:30 AM - 6:30 PM</p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="footer-section2 mb-3">
                <h6 className="mb-3 text-uppercase">Shop Categories</h6>
                <hr />
                <ul className="list-unstyled">
                  {categories && categories.slice(0,10).map((category) => (
                    <li key={category._id} className="mb-1">

                      <Link to={"/shop?search=" + category.title}>
                        {category.title}
                      </Link>
                      <i className='bx bx-chevron-right'></i>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col">
              <div className="footer-section3 mb-3">
                <h6 className="mb-3 text-uppercase">Support</h6>
                                    <hr /> 
                  <ul className="list-unstyled">

                    <li>
                      <Link to="/privacy">* Privacy Policy</Link>
                    </li>

                    <li>
                      <Link to="/terms">* Terms & Conditions</Link>
                    </li>

                    <li>
                      <Link to="/returns">* Shipping & Return Policy</Link>
                    </li>

                    <li>
                      <Link to="/faq">* Frequently Asked Questions</Link>
                    </li>
                  </ul>
              </div>  
            </div>
            <div className="col">
              <div className="footer-section4 mb-3">

                <h6 className="mb-3 text-uppercase">Stay informed</h6>
                <div className="subscribe">
                  <input type="text" className="form-control radius-30" placeholder="Enter Your Email" />
                  <div className="mt-2 d-grid">	<a href="javascript:;" className="btn btn-white btn-ecomm radius-30">Subscribe</a>
                  </div>
                  <p className="mt-2 mb-0 font-13">Subscribe to our newsletter to receive early discount offers, updates and new products info.</p>
                </div>
                
                <div className="download-app mt-3">
                  <h6 className="mb-3 text-uppercase">Download our app</h6>
                  <div className="d-flex align-items-center gap-2">
                    <a href="javascript:;">
                      <img src="assets/images/icons/apple-store.png" width="160" alt="" />
                    </a>
                    <a href="javascript:;">
                      <img src="assets/images/icons/play-store.png" width="160" alt="" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="row row-cols-1 row-cols-md-2 align-items-center">
            <div className="col">
              <p className="mb-0">Copyright © <a href="https://feard.vercel.app">FEAR Inc.</a> 2025. All right reserved.</p>
            </div>
            <div className="col text-end">
              <div className="payment-icon">
                <div className="row row-cols-auto g-2 justify-content-end">
                  <div className="col">
                    <img src="assets/images/icons/visa.png" alt="" />
                  </div>
                  <div className="col">
                    <img src="assets/images/icons/paypal.png" alt="" />
                  </div>
                  <div className="col">
                    <img src="assets/images/icons/mastercard.png" alt="" />
                  </div>
                  <div className="col">
                    <img src="assets/images/icons/american-express.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
