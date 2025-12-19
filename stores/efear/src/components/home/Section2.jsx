import React from 'react';

function Section2() {
  return (
    <section className="py-3 border-top border-bottom">
      <div className="container">
        <div className="row row-cols-1 row-cols-lg-3 row-group align-items-center">
          <div className="col p-3">
            <div className="d-flex align-items-center">
              <div className="fs-1 text-white">	<i className='bx bx-taxi'></i>
            </div>
            <div className="info-box-content ps-3">
              <h6 className="mb-0">FREE SHIPPING {"&"} RETURN</h6>
              <p className="mb-0">Free shipping on all orders over $49</p>
            </div>
          </div>
        </div>
        <div className="col p-3">
          <div className="d-flex align-items-center">
            <div className="fs-1 text-white">	<i className='bx bx-dollar-circle'></i>
          </div>
          <div className="info-box-content ps-3">
            <h6 className="mb-0">MONEY BACK GUARANTEE</h6>
            <p className="mb-0">100% money back guarantee</p>
          </div>
        </div>
      </div>
      <div className="col p-3">
        <div className="d-flex align-items-center">
          <div className="fs-1 text-white">	<i className='bx bx-support'></i>
        </div>
        <div className="info-box-content ps-3">
          <h6 className="mb-0">ONLINE SUPPORT 24/7</h6>
          <p className="mb-0">Awesome Support for 24/7 Days</p>
        </div>
      </div>
    </div>
    </div>
    </div>
    </section>
  );
}

export default Section2;
