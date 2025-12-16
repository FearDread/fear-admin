import React from 'react';

function ProductComparison() {
  return (
    <>
            <section className="py-4">
          <div className="container">
            <h3 className="d-none">Product Table</h3>
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead>
                  <tr>
                    <th className="align-middle text-center">
                      <p className="mb-0 text-uppercase fs-3 fw-light text-white">Product
                        <br />Photo</p>
                      </th>
                      <th className="align-middle text-center">
                        <img src="assets/images/products/22.png" alt="" width="230" />
                      </th>
                      <th className="align-middle text-center">
                        <img src="assets/images/products/23.png" alt="" width="230" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Price</td>
                      <td>$349.00</td>
                      <td>$299.00</td>
                    </tr>
                    <tr>
                      <td>Model</td>
                      <td>iPhone 8</td>
                      <td>Galaxy 9</td>
                    </tr>
                    <tr>
                      <td>Brand</td>
                      <td>Apple</td>
                      <td>Samsung</td>
                    </tr>
                    <tr>
                      <td>Rating</td>
                      <td>4.8 <i className='bx bx-star'></i>
                    </td>
                    <td>4.5 <i className='bx bx-star'></i>
                  </td>
                </tr>
                <tr>
                  <td>Summary</td>
                  <td>There are many variations of passages of Lorem Ipsum available,
                    <br />but the majority have suffered alteration in some form, by injected</td>
                    <td>There are many variations of passages of Lorem Ipsum available,
                      <br />but the majority have suffered alteration in some form, by injected</td>
                    </tr>
                    <tr>
                      <td>Memory</td>
                      <td>64 GB - 256 GB</td>
                      <td>128 GB + Memory Extended</td>
                    </tr>
                    <tr>
                      <td>Num of Cores</td>
                      <td>2</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>RAM</td>
                      <td>8 GB</td>
                      <td>16 GB</td>
                    </tr>
                    <tr>
                      <td>System</td>
                      <td>iOS 12</td>
                      <td>Android 9</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>	<a href="javascript:;" className="btn btn-white btn-ecomm">Add to Cart</a>
                      <a href="javascript:;" className="btn btn-light btn-ecomm">Remove</a>
                    </td>
                    <td>	<a href="javascript:;" className="btn btn-white btn-ecomm">Add to Cart</a>
                    <a href="javascript:;" className="btn btn-light btn-ecomm">Remove</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductComparison;
