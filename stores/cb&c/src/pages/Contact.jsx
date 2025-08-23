import React, { useState } from 'react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '0',
    message: '',
    acceptTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <>
      <section className="contact pt-130 pb-130">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="content radius-10 bg-image">
                <h2>Have something in mind? <br />
                  Let's talk.</h2>
                <p>Adipiscing elit, sed do eiusmod tempor incididunt ut labore <br /> et dolore magna
                  aliqua.
                  Ut enim ad minim.</p>
                <div className="arry">
                  <img src="assets/images/contact/arry.png" alt="" />
                </div>
                <ul>
                  <li>
                    <a href="https://www.google.com/maps/d/viewer?mid=1UZ57Drfs3SGrTgh6mrYjQktu6uY&hl=en_US&ll=18.672105000000013%2C105.68673800000003&z=17"
                      target="_blank"
                      rel="noopener noreferrer">
                      <i className="fa-solid fa-location-dot"></i>785 15h Street,
                      Office 478 Berlin
                    </a>
                  </li>
                  <li>
                    <a href="tel:1-732-798-0976">
                      <i className="fa-solid fa-phone-volume"></i>+1 800 555 45 65
                    </a>
                  </li>
                  <li>
                    <a href="mailto:company.info@mail.com">
                      <i className="fa-solid fa-envelope"></i>info.stoky@company.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6">
              <form>
                <input className="form-area"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}>
                </input>
                <select
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                >
                  <option value="0">Select Subject</option>
                  <option value="account">Account</option>
                  <option value="service">Service</option>
                  <option value="pricing">Pricing</option>
                  <option value="support">Support</option>
                </select>
                <textarea
                  name="message"
                  id="massage"
                  placeholder="Message..."
                  value={formData.message}
                  onChange={handleInputChange}
                />
                <div className="radio-btn mt-2">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                  />
                  <span></span>
                  <label htmlFor="acceptTerms">I accept your terms & conditions</label>
                </div>
                <button type="submit" className="mt-40 btn-one">
                  <span>Submit Now</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <div className="google-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.3059445134!2d-74.2598661379975!3d40.697149417741365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1670395681365!5m2!1sen!2sbd"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Maps"
        />
      </div>
    </>
  );
};

export default Contact;