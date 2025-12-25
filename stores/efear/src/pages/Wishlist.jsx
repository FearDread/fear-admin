import React from 'react';
import Breadcurmbs from "../components/common/Breadcrumbs";

const Wishlist = () => {
  return (
    <>
      <section className="py-3 border-bottom d-none d-md-flex">
        <div className="container">
          <div className="page-breadcrumb d-flex align-items-center">
            <h3 className="breadcrumb-title pe-3">Wishlist Grid</h3>
            <div className="ms-auto">
            <Breadcurmbs 
             items={[
                { label: 'Products', path: '/shop', icon: 'bx bx-shopping-bag' },
                { label: 'Wishlist', path: '/wishlist', icon: 'bx bx-heart', isActive: true }
              ]} />
            </div>
          </div>
        </div>
      </section>
      <section className="py-4">
        <div className="container">
          <div className="product-grid">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3">
              <div className="col">
                <div className="card rounded-0 product-card">
                  <a href="product-details.html">
                    <img src="assets/images/products/01.png" className="card-img-top" alt="..." />
                  </a>
                  <div className="card-body">
                    <div className="product-info">
                      <a href="javascript:;">
                        <p className="product-catergory font-13 mb-1">Catergory Name</p>
                      </a>
                      <a href="javascript:;">
                        <h6 className="product-name mb-2">Product Short Name</h6>
                      </a>
                      <div className="d-flex align-items-center">
                        <div className="mb-1 product-price">	<span className="me-1 text-decoration-line-through">$99.00</span>
                          <span className="text-white fs-5">$49.00</span>
                        </div>
                        <div className="cursor-pointer ms-auto">	<i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                        </div>
                      </div>
                      <div className="product-action mt-2">
                        <div className="d-grid gap-2">
                          <a href="javascript:;" className="btn btn-white btn-ecomm">	<i className='bx bxs-cart-add'></i>Add to Cart</a>
                          <a href="javascript:;" className="btn btn-light btn-ecomm"><i className='bx bx-zoom-in'></i>Remove From List</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card rounded-0 product-card">
                  <a href="product-details.html">
                    <img src="assets/images/products/02.png" className="card-img-top" alt="..." />
                  </a>
                  <div className="card-body">
                    <div className="product-info">
                      <a href="javascript:;">
                        <p className="product-catergory font-13 mb-1">Catergory Name</p>
                      </a>
                      <a href="javascript:;">
                        <h6 className="product-name mb-2">Product Short Name</h6>
                      </a>
                      <div className="d-flex align-items-center">
                        <div className="mb-1 product-price"> <span className="me-1 text-decoration-line-through">$99.00</span>
                          <span className="text-white fs-5">$49.00</span>
                        </div>
                        <div className="cursor-pointer ms-auto"> <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-light-4"></i>
                          <i className="bx bxs-star text-light-4"></i>
                        </div>
                      </div>
                      <div className="product-action mt-2">
                        <div className="d-grid gap-2">
                          <a href="javascript:;" className="btn btn-white btn-ecomm">	<i className='bx bxs-cart-add'></i>Add to Cart</a>
                          <a href="javascript:;" className="btn btn-light btn-ecomm"><i className='bx bx-zoom-in'></i>Remove From List</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card rounded-0 product-card">
                  <a href="product-details.html">
                    <img src="assets/images/products/03.png" className="card-img-top" alt="..." />
                  </a>
                  <div className="card-body">
                    <div className="product-info">
                      <a href="javascript:;">
                        <p className="product-catergory font-13 mb-1">Catergory Name</p>
                      </a>
                      <a href="javascript:;">
                        <h6 className="product-name mb-2">Product Short Name</h6>
                      </a>
                      <div className="d-flex align-items-center">
                        <div className="mb-1 product-price"> <span className="me-1 text-decoration-line-through">$99.00</span>
                          <span className="text-white fs-5">$49.00</span>
                        </div>
                        <div className="cursor-pointer ms-auto"> <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-light-4"></i>
                        </div>
                      </div>
                      <div className="product-action mt-2">
                        <div className="d-grid gap-2">
                          <a href="javascript:;" className="btn btn-white btn-ecomm">	<i className='bx bxs-cart-add'></i>Add to Cart</a>
                          <a href="javascript:;" className="btn btn-light btn-ecomm"><i className='bx bx-zoom-in'></i>Remove From List</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card rounded-0 product-card">
                  <a href="product-details.html">
                    <img src="assets/images/products/04.png" className="card-img-top" alt="..." />
                  </a>
                  <div className="card-body">
                    <div className="product-info">
                      <a href="javascript:;">
                        <p className="product-catergory font-13 mb-1">Catergory Name</p>
                      </a>
                      <a href="javascript:;">
                        <h6 className="product-name mb-2">Product Short Name</h6>
                      </a>
                      <div className="d-flex align-items-center">
                        <div className="mb-1 product-price"> <span className="me-1 text-decoration-line-through">$99.00</span>
                          <span className="text-white fs-5">$49.00</span>
                        </div>
                        <div className="cursor-pointer ms-auto"> <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                        </div>
                      </div>
                      <div className="product-action mt-2">
                        <div className="d-grid gap-2">
                          <a href="javascript:;" className="btn btn-white btn-ecomm">	<i className='bx bxs-cart-add'></i>Add to Cart</a>
                          <a href="javascript:;" className="btn btn-light btn-ecomm"><i className='bx bx-zoom-in'></i>Remove From List</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card rounded-0 product-card">
                  <a href="product-details.html">
                    <img src="assets/images/products/05.png" className="card-img-top" alt="..." />
                  </a>
                  <div className="card-body">
                    <div className="product-info">
                      <a href="javascript:;">
                        <p className="product-catergory font-13 mb-1">Catergory Name</p>
                      </a>
                      <a href="javascript:;">
                        <h6 className="product-name mb-2">Product Short Name</h6>
                      </a>
                      <div className="d-flex align-items-center">
                        <div className="mb-1 product-price"> <span className="me-1 text-decoration-line-through">$99.00</span>
                          <span className="text-white fs-5">$49.00</span>
                        </div>
                        <div className="cursor-pointer ms-auto"> <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-light-4"></i>
                          <i className="bx bxs-star text-light-4"></i>
                        </div>
                      </div>
                      <div className="product-action mt-2">
                        <div className="d-grid gap-2">
                          <a href="javascript:;" className="btn btn-white btn-ecomm">	<i className='bx bxs-cart-add'></i>Add to Cart</a>
                          <a href="javascript:;" className="btn btn-light btn-ecomm"><i className='bx bx-zoom-in'></i>Remove From List</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card rounded-0 product-card">
                  <a href="product-details.html">
                    <img src="assets/images/products/06.png" className="card-img-top" alt="..." />
                  </a>
                  <div className="card-body">
                    <div className="product-info">
                      <a href="javascript:;">
                        <p className="product-catergory font-13 mb-1">Catergory Name</p>
                      </a>
                      <a href="javascript:;">
                        <h6 className="product-name mb-2">Product Short Name</h6>
                      </a>
                      <div className="d-flex align-items-center">
                        <div className="mb-1 product-price"> <span className="me-1 text-decoration-line-through">$99.00</span>
                          <span className="text-white fs-5">$49.00</span>
                        </div>
                        <div className="cursor-pointer ms-auto"> <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                        </div>
                      </div>
                      <div className="product-action mt-2">
                        <div className="d-grid gap-2">
                          <a href="javascript:;" className="btn btn-white btn-ecomm">	<i className='bx bxs-cart-add'></i>Add to Cart</a>
                          <a href="javascript:;" className="btn btn-light btn-ecomm"><i className='bx bx-zoom-in'></i>Remove From List</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card rounded-0 product-card">
                  <a href="product-details.html">
                    <img src="assets/images/products/07.png" className="card-img-top" alt="..." />
                  </a>
                  <div className="card-body">
                    <div className="product-info">
                      <a href="javascript:;">
                        <p className="product-catergory font-13 mb-1">Catergory Name</p>
                      </a>
                      <a href="javascript:;">
                        <h6 className="product-name mb-2">Product Short Name</h6>
                      </a>
                      <div className="d-flex align-items-center">
                        <div className="mb-1 product-price"> <span className="me-1 text-decoration-line-through">$99.00</span>
                          <span className="text-white fs-5">$49.00</span>
                        </div>
                        <div className="cursor-pointer ms-auto"> <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-light-4"></i>
                        </div>
                      </div>
                      <div className="product-action mt-2">
                        <div className="d-grid gap-2">
                          <a href="javascript:;" className="btn btn-white btn-ecomm">	<i className='bx bxs-cart-add'></i>Add to Cart</a>
                          <a href="javascript:;" className="btn btn-light btn-ecomm"><i className='bx bx-zoom-in'></i>Remove From List</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card rounded-0 product-card">
                  <a href="product-details.html">
                    <img src="assets/images/products/08.png" className="card-img-top" alt="..." />
                  </a>
                  <div className="card-body">
                    <div className="product-info">
                      <a href="javascript:;">
                        <p className="product-catergory font-13 mb-1">Catergory Name</p>
                      </a>
                      <a href="javascript:;">
                        <h6 className="product-name mb-2">Product Short Name</h6>
                      </a>
                      <div className="d-flex align-items-center">
                        <div className="mb-1 product-price"> <span className="me-1 text-decoration-line-through">$99.00</span>
                          <span className="text-white fs-5">$49.00</span>
                        </div>
                        <div className="cursor-pointer ms-auto"> <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                          <i className="bx bxs-star text-white"></i>
                        </div>
                      </div>
                      <div className="product-action mt-2">
                        <div className="d-grid gap-2">
                          <a href="javascript:;" className="btn btn-white btn-ecomm">	<i className='bx bxs-cart-add'></i>Add to Cart</a>
                          <a href="javascript:;" className="btn btn-light btn-ecomm"><i className='bx bx-zoom-in'></i>Remove From List</a>
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
    </>
  );
}

export default Wishlist;
