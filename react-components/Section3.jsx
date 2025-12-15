import React from 'react';

function Section3() {
  return (
    <section className="py-4">
      <div className="container">
        <div className="product-more-info">
          <ul className="nav nav-tabs mb-0" role="tablist">
            <li className="nav-item" role="presentation">
              <a className="nav-link active" data-bs-toggle="tab" href="#discription" role="tab" aria-selected="true">
                <div className="d-flex align-items-center">
                  <div className="tab-title text-uppercase fw-500">Description</div>
                </div>
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a className="nav-link" data-bs-toggle="tab" href="#more-info" role="tab" aria-selected="false">
                <div className="d-flex align-items-center">
                  <div className="tab-title text-uppercase fw-500">More Info</div>
                </div>
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a className="nav-link" data-bs-toggle="tab" href="#tags" role="tab" aria-selected="false">
                <div className="d-flex align-items-center">
                  <div className="tab-title text-uppercase fw-500">Tags</div>
                </div>
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a className="nav-link" data-bs-toggle="tab" href="#reviews" role="tab" aria-selected="false">
                <div className="d-flex align-items-center">
                  <div className="tab-title text-uppercase fw-500">(3) Reviews</div>
                </div>
              </a>
            </li>
          </ul>
          <div className="tab-content pt-3">
            <div className="tab-pane fade show active" id="discription" role="tabpanel">
              <p>Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi.</p>
              <ul>
                <li>Not just for commute</li>
                <li>Branded tongue and cuff</li>
                <li>Super fast and amazing</li>
                <li>Lorem sed do eiusmod tempor</li>
              </ul>
              <p className="mb-1">Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone.</p>
              <p className="mb-1">Seitan aliquip quis cardigan american apparel, butcher voluptate nisi.</p>
            </div>
            <div className="tab-pane fade" id="more-info" role="tabpanel">
              <p>Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia yr, vero magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit, sustainable jean shorts beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester stumptown, tumblr butcher vero sint qui sapiente accusamus tattooed echo park.</p>
            </div>
            <div className="tab-pane fade" id="tags" role="tabpanel">
              <div className="tags-box w-50">	<a href="javascript:;" className="tag-link">Cloths</a>
              <a href="javascript:;" className="tag-link">Electronis</a>
              <a href="javascript:;" className="tag-link">Furniture</a>
              <a href="javascript:;" className="tag-link">Sports</a>
              <a href="javascript:;" className="tag-link">Men Wear</a>
              <a href="javascript:;" className="tag-link">Women Wear</a>
              <a href="javascript:;" className="tag-link">Laptops</a>
              <a href="javascript:;" className="tag-link">Formal Shirts</a>
              <a href="javascript:;" className="tag-link">Topwear</a>
              <a href="javascript:;" className="tag-link">Headphones</a>
              <a href="javascript:;" className="tag-link">Bottom Wear</a>
              <a href="javascript:;" className="tag-link">Bags</a>
              <a href="javascript:;" className="tag-link">Sofa</a>
              <a href="javascript:;" className="tag-link">Shoes</a>
            </div>
          </div>
          <div className="tab-pane fade" id="reviews" role="tabpanel">
            <div className="row">
              <div className="col col-lg-8">
                <div className="product-review">
                  <h5 className="mb-4">3 Reviews For The Product</h5>
                  <div className="review-list">
                    <div className="d-flex align-items-start">
                      <div className="review-user">
                        <img src="assets/images/avatars/avatar-1.png" width="65" height="65" className="rounded-circle" alt="" / />
                      </div>
                      <div className="review-content ms-3">
                        <div className="rates cursor-pointer fs-6">	<i className="bx bxs-star text-white"></i>
                        <i className="bx bxs-star text-white"></i>
                        <i className="bx bxs-star text-white"></i>
                        <i className="bx bxs-star text-white"></i>
                        <i className="bx bxs-star text-light-4"></i>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <h6 className="mb-0">James Caviness</h6>
                        <p className="mb-0 ms-auto">February 16, 2021</p>
                      </div>
                      <p>Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan</p>
                    </div>
                  </div>
                  <hr/ />
                  <div className="d-flex align-items-start">
                    <div className="review-user">
                      <img src="assets/images/avatars/avatar-2.png" width="65" height="65" className="rounded-circle" alt="" / />
                    </div>
                    <div className="review-content ms-3">
                      <div className="rates cursor-pointer fs-6"> <i className="bx bxs-star text-white"></i>
                      <i className="bx bxs-star text-white"></i>
                      <i className="bx bxs-star text-white"></i>
                      <i className="bx bxs-star text-white"></i>
                      <i className="bx bxs-star text-light-4"></i>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <h6 className="mb-0">David Buckley</h6>
                      <p className="mb-0 ms-auto">February 22, 2021</p>
                    </div>
                    <p>Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan</p>
                  </div>
                </div>
                <hr/ />
                <div className="d-flex align-items-start">
                  <div className="review-user">
                    <img src="assets/images/avatars/avatar-3.png" width="65" height="65" className="rounded-circle" alt="" / />
                  </div>
                  <div className="review-content ms-3">
                    <div className="rates cursor-pointer fs-6">	<i className="bx bxs-star text-white"></i>
                    <i className="bx bxs-star text-white"></i>
                    <i className="bx bxs-star text-white"></i>
                    <i className="bx bxs-star text-white"></i>
                    <i className="bx bxs-star text-light-4"></i>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <h6 className="mb-0">Peter Costanzo</h6>
                    <p className="mb-0 ms-auto">February 26, 2021</p>
                  </div>
                  <p>Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col col-lg-4">
          <div className="add-review bg-dark-1">
            <div className="form-body p-3">
              <h4 className="mb-4">Write a Review</h4>
              <div className="mb-3">
                <label className="form-label">Your Name</label>
                <input type="text" className="form-control rounded-0" />
              </div>
              <div className="mb-3">
                <label className="form-label">Your Email</label>
                <input type="text" className="form-control rounded-0" />
              </div>
              <div className="mb-3">
                <label className="form-label">Rating</label>
                <select className="form-select rounded-0">
                  <option selected={true}>Choose Rating</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="3">4</option>
                  <option value="3">5</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Example textarea</label>
                <textarea className="form-control rounded-0" rows="3"></textarea>
              </div>
              <div className="d-grid">
                <button type="button" className="btn btn-light btn-ecomm">Submit a Review</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    </div>
    </section>
  );
}

export default Section3;
