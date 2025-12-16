import React from 'react';

function Section1() {
  return (
    <section className="py-3 border-bottom d-none d-md-flex">
      <div className="container">
        <div className="page-breadcrumb d-flex align-items-center">
          <h3 className="breadcrumb-title pe-3">Allen Solly Men's Polo T-Shirt</h3>
          <div className="ms-auto">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item"><a href="javascript:;"><i className="bx bx-home-alt"></i> Home</a>
                </li>
                <li className="breadcrumb-item"><a href="javascript:;">Shop</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">Shop List Left Sidebar</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Section1;
