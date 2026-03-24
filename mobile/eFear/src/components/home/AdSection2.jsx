import React from 'react';
import { Link, Navigate } from "react-router-dom";

const AdSection2 = () => {
  return (
    <>
    <section className="py-4">
      <div className="container">
        <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
          <div className="col">
            <div className="card rounded-0 media-object media-border-big">
              <div className="row g-0 align-items-center">
                <div className="col">
                  <img src="assets/images/comics/super2.png" className="img-fluid" alt="" />
                </div>
                <div className="col">
                  <div className="card-body">
                    <h5 className="card-title text-uppercase">E-Books</h5>
                    <p className="card-text text-uppercase">Starting at $9</p>	<a href="/shop" className="btn btn-light btn-ecomm">SHOP NOW</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card rounded-0 media-object media-border-big">
              <div className="row g-0 align-items-center">
                <div className="col">
                  <img src="assets/images/comics/super1.png" className="img-fluid" alt="" />
                </div>
                <div className="col">
                  <div className="card-body">
                    <h5 className="card-title text-uppercase">Comics</h5>
                    <p className="card-text text-uppercase">Starting at $9</p>	<a href="javascript:;" className="btn btn-light btn-ecomm">SHOP NOW</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card rounded-0 media-object media-border-big">
              <div className="row g-0 align-items-center">
                <div className="col">
                  <img src="assets/images/comics/super3.png" className="img-fluid" alt="" />
                </div>
                <div className="col">
                  <div className="card-body">
                    <h5 className="card-title text-uppercase">Collectables</h5>
                    <p className="card-text text-uppercase">Starting at $9</p>	<a href="javascript:;" className="btn btn-light btn-ecomm">SHOP NOW</a>
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

export default AdSection2;
