import React, { useState } from 'react';


// Info Section Component
export const InfoSection = () => {
  const info = [
    { icon: "bx bx-cart", title: "FREE SHIPPING & RETURN", subtitle: "", desc: "Free shipping on all orders over $49" },
    { icon: "bx bx-credit-card", title: "Secure payment", subtitle: "We use latest SSL / TLS", desc: "Your credit card info is safer with us than your browser history. We use military-grade encryption—because your impulse purchases deserve witness protection." },
    { icon: "bx bx-dollar-circle", title: "ONLINE SUPPORT 24/7", desc: "Awesome Support for 24/7 Days" },
    { icon: "bx bx-support", title: "Customer Support", desc: ""}
  ];

  return (
    <>
      <section className="py-4 bg-dark-1 media-object">
        <div className="container">
          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 row-group">
            <div className="col">
              <div className="text-center">
                <div className="font-50 text-white">	<i className='bx bx-cart'></i>
                </div>
                <h2 className="fs-5 text-uppercase mb-0">Free delivery</h2>
                <p className="text-capitalize">Free delivery over $49</p>
                <p>We'll bring it to your door for free. Because if we charged you shipping, you'd probably just steal it from a neighbor's porch anyway.</p>
              </div>
            </div>
            <div className="col">
              <div className="text-center">
                <div className="font-50 text-white">	<i className='bx bx-credit-card'></i>
                </div>
                <h2 className="fs-5 text-uppercase mb-0">Secure payment</h2>
                <p className="text-capitalize">We use latest SSL / TLS</p>
                <p>Your credit card info is safer with us than your browser history. We use military-grade encryption—because your impulse purchases deserve witness protection.</p>
              </div>
            </div>
            <div className="col">
              <div className="text-center">
                <div className="font-50 text-white">	<i className='bx bx-dollar-circle'></i>
                </div>
                <h2 className="fs-5 text-uppercase mb-0">Free returns</h2>
                <p className="text-capitalize">Regret your life choices?</p>
                <p>Us too. Send it back within 30 days, no judgment. We've seen worse decisions, trust us.</p>
              </div>.
            </div>
            <div className="col">
              <div className="text-center">
                <div className="font-50 text-white">	<i className='bx bx-support'></i>
                </div>
                <h2 className="fs-5 text-uppercase mb-0">Customer Support</h2>
                <p className="text-capitalize">Friendly 24/7 support</p>
                <p>Can't sleep at 3 AM? Neither can our support team—misery loves company. We're here to answer your questions or just listen to you complain about life.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InfoSection;