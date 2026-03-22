import React, { useState, useEffect } from 'react';
import Toast from "../components/common/Toast";
import { useDispatch, useSelector } from "react-redux";
import {
    sendContact,
} from "../features/mail/slice";

export const Contact = () => {
    const dispatch = useDispatch();
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [contactLoading, setContactLoading] = useState(false);
    const [contactMessage, setContactMessage] = useState({ text: '', type: '' });
    const [toasts, setToasts] = useState([]);
    const { success, loading, error } = useSelector(state => state.mail);

    const addToast = (message, type) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleContact = async (e) => {
        e.preventDefault();
        setContactMessage({ text: '', type: '' });

        if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
            setContactMessage({ text: 'Please fill in all fields', type: 'error' });
            return;
        }

        if (!isValidEmail(contactForm.email)) {
            setContactMessage({ text: 'Please enter a valid email address', type: 'error' });
            return;
        }

        const contactData = JSON.stringify({ '$name': contactForm.name, '$email': contactForm.email, '$message': contactForm.message });

        setContactLoading(true);
        dispatch(sendContact(contactData))
    };

    const handleContactChange = (e) => {
        setContactForm({
            ...contactForm,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {

        if (!loading && error) {
            addToast('Failed to subscribe. Please try again later.', 'error');
            console.error('Subscription error');
        }
        if (!loading && success) {
            addToast('Message sent successfully! We\'ll get back to you soon.', 'success');
            setContactLoading(false);
            setContactForm({ name: '', email: '', message: '' });
        }
    }, [loading, success, error]);

    return (
        <>
            <section className="py-3 border-bottom d-none d-md-flex">
                <div className="container">
                    <div className="page-breadcrumb d-flex align-items-center">
                        <h3 className="breadcrumb-title pe-3">Contact Us</h3>
                        <div className="ms-auto">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0 p-0">
                                    <li className="breadcrumb-item"><a href="javascript:;"><i className="bx bx-home-alt"></i> Home</a>
                                    </li>
                                    <li className="breadcrumb-item"><a href="javascript:;">Pages</a>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">Contact Us</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                                                                            <h3>Want to know more?</h3>
                             <p>Shoot us a message with your contact info and we will be happy set your mind at ease!</p>
                            <div className="p-3 bg-dark-1 media-object">
    
                                <form>
                                    <div className="space-y-4 form-body">
                                        <div>
                                            <label htmlFor="name" className="form-label">
                                                Name
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="name"
                                                    type="text"
                                                    name="name"
                                                    value={contactForm.name}
                                                    onChange={handleContactChange}
                                                    placeholder="Your name"
                                                    className="form-control"
                                                    disabled={contactLoading}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="form-label">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    value={contactForm.email}
                                                    onChange={handleContactChange}
                                                    placeholder="you@example.com"
                                                    className="form-control"
                                                    disabled={contactLoading}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="form-label">
                                                Message
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={contactForm.message}
                                                onChange={handleContactChange}
                                                placeholder="Your message..."
                                                rows="13"
                                                className="form-control"
                                                disabled={contactLoading}
                                            />
                                        </div>

                                        {contactMessage.text && (
                                            <div className={`p-3 rounded-lg text-sm ${contactMessage.type === 'success'
                                                ? 'bg-green-50 text-green-800 border border-green-200'
                                                : 'bg-red-50 text-red-800 border border-red-200'
                                                }`}>
                                                {contactMessage.text}
                                            </div>
                                        )}

                                        <button
                                            onClick={handleContact}
                                            disabled={contactLoading}
                                            className="btn btn-light btn-ecomm"
                                        >
                                            {contactLoading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-4">
                                                        <div className="p-3 bg-dark-1">
                                <div className="address mb-3">
                                    <p className="mb-0 text-uppercase text-white">Address</p>
                                    <p className="mb-0 font-12">2003 E. Veterans Memorial Blvd, Killeen TX 76541</p>
                                </div>
                                <div className="phone mb-3">
                                    <p className="mb-0 text-uppercase text-white">Phone</p>
                                    <p className="mb-0 font-13">Toll Free (254) 435-0130 </p>
                                    <p className="mb-0 font-13">Mobile : +1 (254) 623-5923 </p>
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
                                                        <div className="blog-left-sidebar p-3 dark-bg-2">

                                <div className="p-3 bg-dark-1 border">
                                    <h6 className="mb-3"><i className='bx bx-shield me-2'></i>Your Privacy Matters</h6>
                                    <p className="mb-3"><small>We are committed to protecting your personal information and your right to privacy.</small></p>
                                    <p className="mb-2"><small>Questions or concerns about our privacy practices?</small></p>
                                    <a href="mailto:fear.dread@underworld.dog" className="btn btn-light btn-ecomm btn-sm">Contact Privacy Team</a>
                                </div>

                                <div className="p-3 mt-3 border">
                                    <h6 className="mb-3"><i className='bx bx-info-circle me-2'></i>Privacy Rights</h6>
                                    <p className="mb-0"><small>You have rights regarding your personal data, including access, deletion, and correction. Contact us to exercise your rights.</small></p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            <section className="py-4">
                <div className="container">
                    <h3 className="d-none">Google Map</h3>
                    <div className="contact-map p-3 bg-dark-1 rounded-0 shadow-none">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d805184.6319269302!2d144.49269200596396!3d-37.971237009163936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad646b5d2ba4df7%3A0x4045675218ccd90!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sin!4v1618835176130!5m2!1sen!2sin" className="w-100" height="450" style={{ 'border': 0 }} allowFullScreen="" loading="lazy"></iframe>
                    </div>
                </div>
            </section>
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </>
    )

}

export default Contact;