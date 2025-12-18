import React from 'react';

export const Contact = () => {

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
                    <h3 className="d-none">Google Map</h3>
                    <div className="contact-map p-3 bg-dark-1 rounded-0 shadow-none">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d805184.6319269302!2d144.49269200596396!3d-37.971237009163936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad646b5d2ba4df7%3A0x4045675218ccd90!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sin!4v1618835176130!5m2!1sen!2sin" className="w-100" height="450" style={{ 'border': 0 }} allowfullscreen="" loading="lazy"></iframe>
                    </div>
                </div>
            </section>
            <section className="py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="p-3 bg-dark-1">
                                <form>
                                    <div className="form-body">
                                        <h6 className="mb-0 text-uppercase">Drop us a line</h6>
                                        <div className="my-3 border-bottom"></div>
                                        <div className="mb-3">
                                            <label className="form-label">Enter Your Name</label>
                                            <input type="text" className="form-control" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Enter Email</label>
                                            <input type="text" className="form-control" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Phone Number</label>
                                            <input type="text" className="form-control" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Message</label>
                                            <textarea className="form-control" rows="4" cols="4"></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <button className="btn btn-light btn-ecomm">Send Message</button>
                                        </div>
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
                        </div>
                    </div>
                </div>
            </section>
        </>
    )

}

export default Contact;