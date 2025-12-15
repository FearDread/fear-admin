import React from 'react';

function Section3() {
  return (
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
                    <input type="text" className="form-control" / />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Enter Email</label>
                    <input type="text" className="form-control" / />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input type="text" className="form-control" / />
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
                <p className="mb-0 font-12">123 Street Name, City, Australia</p>
              </div>
              <div className="phone mb-3">
                <p className="mb-0 text-uppercase text-white">Phone</p>
                <p className="mb-0 font-13">Toll Free (123) 472-796</p>
                <p className="mb-0 font-13">Mobile : +91-9910XXXX</p>
              </div>
              <div className="email mb-3">
                <p className="mb-0 text-uppercase text-white">Email</p>
                <p className="mb-0 font-13">mail@example.com</p>
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
  );
}

export default Section3;
