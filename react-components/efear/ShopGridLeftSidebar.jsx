import React from 'react';
import Navigation1 from './Navigation1';
import Navigation2 from './Navigation2';
import Navigation3 from './Navigation3';
import Navigation4 from './Navigation4';
import Navigation5 from './Navigation5';
import Footer from './Footer';

function ShopGridLeftSidebar() {
  return (
    <b className="screen-overlay"></b>
    <div className="wrapper">
      <div className="header-wrapper bg-dark-1">
        <div className="top-menu border-bottom">
          <div className="container">
            <Navigation1 />
          </div>
        </div>
        <div className="header-content pb-3 pb-md-0">
          <div className="container">
            <div className="row align-items-center">
              <div className="col col-md-auto">
                <div className="d-flex align-items-center">
                  <div className="mobile-toggle-menu d-lg-none px-lg-2" data-trigger="#navbar_main"><i className='bx bx-menu'></i>
                </div>
                <div className="logo d-none d-lg-flex">
                  <a href="index.html">
                    <img src="assets/images/logo-icon.png" className="logo-icon" alt="" / />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-12 col-md order-4 order-md-2">
              <div className="input-group flex-nowrap px-xl-4">
                <input type="text" className="form-control w-100" placeholder="Search for Products" />
                <select className="form-select flex-shrink-0" aria-label="Default select example" style={{'width':'10.5rem'}}>
                  <option selected={true}>All Categories</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select> <span className="input-group-text cursor-pointer"><i className='bx bx-search'></i></span>
              </div>
            </div>
            <div className="col col-md-auto order-3 d-none d-xl-flex align-items-center">
              <div className="fs-1 text-white"><i className='bx bx-headphone'></i>
            </div>
            <div className="ms-2">
              <p className="mb-0 font-13">CALL US NOW</p>
              <h5 className="mb-0">+011 5827918</h5>
            </div>
          </div>
          <div className="col col-md-auto order-2 order-md-4">
            <div className="top-cart-icons">
              <Navigation2 />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="primary-menu border-top">
      <div className="container">
        <Navigation3 />
      </div>
    </div>
    </div>
    <div className="page-wrapper">
      <div className="page-content">
        <section className="py-3 border-bottom d-none d-md-flex">
          <div className="container">
            <div className="page-breadcrumb d-flex align-items-center">
              <h3 className="breadcrumb-title pe-3">Shop Grid Left Sidebar</h3>
              <div className="ms-auto">
                <Navigation4 />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-4">
          <div className="container">
            <div className="row">
              <div className="col-12 col-xl-3">
                <div className="btn-mobile-filter d-xl-none"><i className='bx bx-slider-alt'></i>
              </div>
              <div className="filter-sidebar d-none d-xl-flex">
                <div className="card rounded-0 w-100">
                  <div className="card-body">
                    <div className="align-items-center d-flex d-xl-none">
                      <h6 className="text-uppercase mb-0">Filter</h6>
                      <div className="btn-mobile-filter-close btn-close ms-auto cursor-pointer"></div>
                    </div>
                    <hr className="d-flex d-xl-none" / />
                    <div className="product-categories">
                      <h6 className="text-uppercase mb-3">Categories</h6>
                      <ul className="list-unstyled mb-0 categories-list">
                        <li><a href="javascript:;">Clothings <span className="float-end badge rounded-pill bg-light">42</span></a>
                      </li>
                      <li><a href="javascript:;">Sunglasses <span className="float-end badge rounded-pill bg-light">32</span></a>
                    </li>
                    <li><a href="javascript:;">Bags <span className="float-end badge rounded-pill bg-light">17</span></a>
                  </li>
                  <li><a href="javascript:;">Watches <span className="float-end badge rounded-pill bg-light">217</span></a>
                </li>
                <li><a href="javascript:;">Furniture <span className="float-end badge rounded-pill bg-light">28</span></a>
              </li>
              <li><a href="javascript:;">Shoes <span className="float-end badge rounded-pill bg-light">145</span></a>
            </li>
            <li><a href="javascript:;">Accessories <span className="float-end badge rounded-pill bg-light">15</span></a>
          </li>
          <li><a href="javascript:;">Headphones <span className="float-end badge rounded-pill bg-light">8</span></a>
        </li>
      </ul>
    </div>
    <hr />
    <div className="price-range">
      <h6 className="text-uppercase mb-3">Price</h6>
      <div className="my-4" id="slider"></div>
      <div className="d-flex align-items-center">
        <button type="button" className="btn btn-white btn-sm text-uppercase rounded-0 font-13 fw-500">Filter</button>
        <div className="ms-auto">
          <p className="mb-0">Price: $200.00 - $900.00</p>
        </div>
      </div>
    </div>
    <hr />
    <div className="size-range">
      <h6 className="text-uppercase mb-3">Size</h6>
      <ul className="list-unstyled mb-0 categories-list">
        <li>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="Small" />
            <label className="form-check-label" htmlFor="Small">Small</label>
          </div>
        </li>
        <li>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="Medium" />
            <label className="form-check-label" htmlFor="Medium">Medium</label>
          </div>
        </li>
        <li>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="Large" />
            <label className="form-check-label" htmlFor="Large">Large</label>
          </div>
        </li>
        <li>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="ExtraLarge" />
            <label className="form-check-label" htmlFor="ExtraLarge">Extra Large</label>
          </div>
        </li>
      </ul>
    </div>
    <hr />
    <div className="product-brands">
      <h6 className="text-uppercase mb-3">Brands</h6>
      <ul className="list-unstyled mb-0 categories-list">
        <li>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="Adidas" />
            <label className="form-check-label" htmlFor="Adidas">Adidas (15)</label>
          </div>
        </li>
        <li>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="Armani" />
            <label className="form-check-label" htmlFor="Armani">Armani (26)</label>
          </div>
        </li>
        <li>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="CalvinKlein" />
            <label className="form-check-label" htmlFor="CalvinKlein">Calvin Klein (24)</label>
          </div>
        </li>
        <li>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="Columbia" />
            <label className="form-check-label" htmlFor="Columbia">Columbia (38)</label>
          </div>
        </li>
        <li>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="JhonPlayers" />
            <label className="form-check-label" htmlFor="JhonPlayers">Jhon Players (48)</label>
          </div>
        </li>
        <li>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="Diesel" />
            <label className="form-check-label" htmlFor="Diesel">Diesel (64)</label>
          </div>
        </li>
      </ul>
    </div>
    <hr />
    <div className="product-colors">
      <h6 className="text-uppercase mb-3">Colors</h6>
      <ul className="list-unstyled mb-0 categories-list">
        <li>
          <div className="d-flex align-items-center cursor-pointer">
            <div className="color-indigator bg-black"></div>
            <p className="mb-0 ms-3">Black</p>
          </div>
        </li>
        <li>
          <div className="d-flex align-items-center cursor-pointer">
            <div className="color-indigator bg-warning"></div>
            <p className="mb-0 ms-3">Yellow</p>
          </div>
        </li>
        <li>
          <div className="d-flex align-items-center cursor-pointer">
            <div className="color-indigator bg-danger"></div>
            <p className="mb-0 ms-3">Red</p>
          </div>
        </li>
        <li>
          <div className="d-flex align-items-center cursor-pointer">
            <div className="color-indigator bg-primary"></div>
            <p className="mb-0 ms-3">Blue</p>
          </div>
        </li>
        <li>
          <div className="d-flex align-items-center cursor-pointer">
            <div className="color-indigator bg-white"></div>
            <p className="mb-0 ms-3">White</p>
          </div>
        </li>
        <li>
          <div className="d-flex align-items-center cursor-pointer">
            <div className="color-indigator bg-success"></div>
            <p className="mb-0 ms-3">Green</p>
          </div>
        </li>
        <li>
          <div className="d-flex align-items-center cursor-pointer">
            <div className="color-indigator bg-info"></div>
            <p className="mb-0 ms-3">Sky Blue</p>
          </div>
        </li>
      </ul>
    </div>
    </div>
    </div>
    </div>
    </div>
    <div className="col-12 col-xl-9">
      <div className="product-wrapper">
        <div className="toolbox d-flex align-items-center mb-3 gap-2">
          <div className="d-flex flex-wrap flex-grow-1 gap-1">
            <div className="d-flex align-items-center flex-nowrap">
              <p className="mb-0 font-13 text-nowrap text-white">Sort By:</p>
              <select className="form-select ms-3 rounded-0">
                <option value="menu_order" selected="selected">Default sorting</option>
                <option value="popularity">Sort by popularity</option>
                <option value="rating">Sort by average rating</option>
                <option value="date">Sort by newness</option>
                <option value="price">Sort by price: low to high</option>
                <option value="price-desc">Sort by price: high to low</option>
              </select>
            </div>
          </div>
          <div className="d-flex flex-wrap">
            <div className="d-flex align-items-center flex-nowrap">
              <p className="mb-0 font-13 text-nowrap text-white">Show:</p>
              <select className="form-select ms-3 rounded-0">
                <option>9</option>
                <option>12</option>
                <option>16</option>
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
          </div>
          <div>	<a href="shop-grid-left-sidebar.html" className="btn btn-white rounded-0"><i className='bx bxs-grid me-0'></i></a>
        </div>
        <div>	<a href="shop-list-left-sidebar.html" className="btn btn-light rounded-0"><i className='bx bx-list-ul me-0'></i></a>
      </div>
    </div>

    <div className="product-grid">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-3">
        <div className="col">
          <div className="card rounded-0 product-card">
            <div className="card-header bg-transparent border-bottom-0">
              <div className="d-flex align-items-center justify-content-end gap-3">
                <a href="javascript:;">
                  <div className="product-compare"><span><i className="bx bx-git-compare"></i> Compare</span>
                </div>
              </a>
              <a href="javascript:;">
                <div className="product-wishlist"> <i className="bx bx-heart"></i>
              </div>
            </a>
          </div>
        </div>
        <img src="assets/images/products/01.png" className="card-img-top" alt="..." />
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
            <a href="javascript:;" className="btn btn-light btn-ecomm">	<i className="bx bxs-cart-add"></i>Add to Cart</a>	<a href="javascript:;" className="btn btn-link btn-ecomm" data-bs-toggle="modal" data-bs-target="#QuickViewProduct"><i className="bx bx-zoom-in"></i>Quick View</a>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    <div className="col">
      <div className="card rounded-0 product-card">
        <div className="card-header bg-transparent border-bottom-0">
          <div className="d-flex align-items-center justify-content-end gap-3">
            <a href="javascript:;">
              <div className="product-compare"><span><i className="bx bx-git-compare"></i> Compare</span>
            </div>
          </a>
          <a href="javascript:;">
            <div className="product-wishlist"> <i className="bx bx-heart"></i>
          </div>
        </a>
      </div>
    </div>
    <img src="assets/images/products/02.png" className="card-img-top" alt="..." />
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
        <a href="javascript:;" className="btn btn-light btn-ecomm"> <i className="bx bxs-cart-add"></i>Add to Cart</a> <a href="javascript:;" className="btn btn-link btn-ecomm"><i className="bx bx-zoom-in"></i>Quick View</a>
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    <div className="col">
      <div className="card rounded-0 product-card">
        <div className="card-header bg-transparent border-bottom-0">
          <div className="d-flex align-items-center justify-content-end gap-3">
            <a href="javascript:;">
              <div className="product-compare"><span><i className="bx bx-git-compare"></i> Compare</span>
            </div>
          </a>
          <a href="javascript:;">
            <div className="product-wishlist"> <i className="bx bx-heart"></i>
          </div>
        </a>
      </div>
    </div>
    <img src="assets/images/products/03.png" className="card-img-top" alt="..." />
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
        <a href="javascript:;" className="btn btn-light btn-ecomm"> <i className="bx bxs-cart-add"></i>Add to Cart</a> <a href="javascript:;" className="btn btn-link btn-ecomm"><i className="bx bx-zoom-in"></i>Quick View</a>
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    <div className="col">
      <div className="card rounded-0 product-card">
        <div className="card-header bg-transparent border-bottom-0">
          <div className="d-flex align-items-center justify-content-end gap-3">
            <a href="javascript:;">
              <div className="product-compare"><span><i className="bx bx-git-compare"></i> Compare</span>
            </div>
          </a>
          <a href="javascript:;">
            <div className="product-wishlist"> <i className="bx bx-heart"></i>
          </div>
        </a>
      </div>
    </div>
    <img src="assets/images/products/04.png" className="card-img-top" alt="..." />
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
        <a href="javascript:;" className="btn btn-light btn-ecomm"> <i className="bx bxs-cart-add"></i>Add to Cart</a> <a href="javascript:;" className="btn btn-link btn-ecomm"><i className="bx bx-zoom-in"></i>Quick View</a>
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    <div className="col">
      <div className="card rounded-0 product-card">
        <div className="card-header bg-transparent border-bottom-0">
          <div className="d-flex align-items-center justify-content-end gap-3">
            <a href="javascript:;">
              <div className="product-compare"><span><i className="bx bx-git-compare"></i> Compare</span>
            </div>
          </a>
          <a href="javascript:;">
            <div className="product-wishlist"> <i className="bx bx-heart"></i>
          </div>
        </a>
      </div>
    </div>
    <img src="assets/images/products/05.png" className="card-img-top" alt="..." />
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
        <a href="javascript:;" className="btn btn-light btn-ecomm"> <i className="bx bxs-cart-add"></i>Add to Cart</a> <a href="javascript:;" className="btn btn-link btn-ecomm"><i className="bx bx-zoom-in"></i>Quick View</a>
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    <div className="col">
      <div className="card rounded-0 product-card">
        <div className="card-header bg-transparent border-bottom-0">
          <div className="d-flex align-items-center justify-content-end gap-3">
            <a href="javascript:;">
              <div className="product-compare"><span><i className="bx bx-git-compare"></i> Compare</span>
            </div>
          </a>
          <a href="javascript:;">
            <div className="product-wishlist"> <i className="bx bx-heart"></i>
          </div>
        </a>
      </div>
    </div>
    <img src="assets/images/products/06.png" className="card-img-top" alt="..." />
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
        <a href="javascript:;" className="btn btn-light btn-ecomm"> <i className="bx bxs-cart-add"></i>Add to Cart</a> <a href="javascript:;" className="btn btn-link btn-ecomm"><i className="bx bx-zoom-in"></i>Quick View</a>
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    <div className="col">
      <div className="card rounded-0 product-card">
        <div className="card-header bg-transparent border-bottom-0">
          <div className="d-flex align-items-center justify-content-end gap-3">
            <a href="javascript:;">
              <div className="product-compare"><span><i className="bx bx-git-compare"></i> Compare</span>
            </div>
          </a>
          <a href="javascript:;">
            <div className="product-wishlist"> <i className="bx bx-heart"></i>
          </div>
        </a>
      </div>
    </div>
    <img src="assets/images/products/07.png" className="card-img-top" alt="..." />
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
        <a href="javascript:;" className="btn btn-light btn-ecomm"> <i className="bx bxs-cart-add"></i>Add to Cart</a> <a href="javascript:;" className="btn btn-link btn-ecomm"><i className="bx bx-zoom-in"></i>Quick View</a>
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    <div className="col">
      <div className="card rounded-0 product-card">
        <div className="card-header bg-transparent border-bottom-0">
          <div className="d-flex align-items-center justify-content-end gap-3">
            <a href="javascript:;">
              <div className="product-compare"><span><i className="bx bx-git-compare"></i> Compare</span>
            </div>
          </a>
          <a href="javascript:;">
            <div className="product-wishlist"> <i className="bx bx-heart"></i>
          </div>
        </a>
      </div>
    </div>
    <img src="assets/images/products/08.png" className="card-img-top" alt="..." />
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
        <a href="javascript:;" className="btn btn-light btn-ecomm"> <i className="bx bxs-cart-add"></i>Add to Cart</a> <a href="javascript:;" className="btn btn-link btn-ecomm"><i className="bx bx-zoom-in"></i>Quick View</a>
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    <div className="col">
      <div className="card rounded-0 product-card">
        <div className="card-header bg-transparent border-bottom-0">
          <div className="d-flex align-items-center justify-content-end gap-3">
            <a href="javascript:;">
              <div className="product-compare"><span><i className="bx bx-git-compare"></i> Compare</span>
            </div>
          </a>
          <a href="javascript:;">
            <div className="product-wishlist"> <i className="bx bx-heart"></i>
          </div>
        </a>
      </div>
    </div>
    <img src="assets/images/products/09.png" className="card-img-top" alt="..." />
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
        <a href="javascript:;" className="btn btn-light btn-ecomm"> <i className="bx bxs-cart-add"></i>Add to Cart</a> <a href="javascript:;" className="btn btn-link btn-ecomm"><i className="bx bx-zoom-in"></i>Quick View</a>
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    <hr />
    <Navigation5 />
    </div>
    </div>
    </div>
    </div>
    </section>
    </div>
    </div>
    <Footer />
    <div className="modal fade" id="QuickViewProduct">
      <div className="modal-dialog modal-dialog-centered modal-xl modal-fullscreen-xl-down">
        <div className="modal-content bg-dark-4 rounded-0 border-0">
          <div className="modal-body">
            <button type="button" className="btn-close float-end" data-bs-dismiss="modal"></button>
            <div className="row g-0">
              <div className="col-12 col-lg-6">
                <div className="image-zoom-section">
                  <div className="product-gallery owl-carousel owl-theme border mb-3 p-3" data-slider-id="1">
                    <div className="item">
                      <img src="assets/images/product-gallery/01.png" className="img-fluid" alt="" />
                    </div>
                    <div className="item">
                      <img src="assets/images/product-gallery/02.png" className="img-fluid" alt="" />
                    </div>
                    <div className="item">
                      <img src="assets/images/product-gallery/03.png" className="img-fluid" alt="" />
                    </div>
                    <div className="item">
                      <img src="assets/images/product-gallery/04.png" className="img-fluid" alt="" />
                    </div>
                  </div>
                  <div className="owl-thumbs d-flex justify-content-center" data-slider-id="1">
                    <button className="owl-thumb-item">
                      <img src="assets/images/product-gallery/01.png" alt="" />
                    </button>
                    <button className="owl-thumb-item">
                      <img src="assets/images/product-gallery/02.png" alt="" />
                    </button>
                    <button className="owl-thumb-item">
                      <img src="assets/images/product-gallery/03.png" alt="" />
                    </button>
                    <button className="owl-thumb-item">
                      <img src="assets/images/product-gallery/04.png" alt="" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6">
                <div className="product-info-section p-3">
                  <h3 className="mt-3 mt-lg-0 mb-0">Allen Solly Men's Polo T-Shirt</h3>
                  <div className="product-rating d-flex align-items-center mt-2">
                    <div className="rates cursor-pointer font-13">	<i className="bx bxs-star text-warning"></i>
                    <i className="bx bxs-star text-warning"></i>
                    <i className="bx bxs-star text-warning"></i>
                    <i className="bx bxs-star text-warning"></i>
                    <i className="bx bxs-star text-light-4"></i>
                  </div>
                  <div className="ms-1">
                    <p className="mb-0">(24 Ratings)</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mt-3 gap-2">
                  <h5 className="mb-0 text-decoration-line-through text-light-3">$98.00</h5>
                  <h4 className="mb-0">$49.00</h4>
                </div>
                <div className="mt-3">
                  <h6>Discription :</h6>
                  <p className="mb-0">Virgil Abloh’s Off-White is a streetwear-inspired collection that continues to break away from the conventions of mainstream fashion. Made in Italy, these black and brown Odsy-1000 low-top sneakers.</p>
                </div>
                <dl className="row mt-3">	<dt className="col-sm-3">Product id</dt>
                <dd className="col-sm-9">#BHU5879</dd>	<dt className="col-sm-3">Delivery</dt>
                <dd className="col-sm-9">Russia, USA, and Europe</dd>
              </dl>
              <div className="row row-cols-auto align-items-center mt-3">
                <div className="col">
                  <label className="form-label">Quantity</label>
                  <select className="form-select form-select-sm">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </select>
                </div>
                <div className="col">
                  <label className="form-label">Size</label>
                  <select className="form-select form-select-sm">
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XS</option>
                    <option>XL</option>
                  </select>
                </div>
                <div className="col">
                  <label className="form-label">Colors</label>
                  <div className="color-indigators d-flex align-items-center gap-2">
                    <div className="color-indigator-item bg-primary"></div>
                    <div className="color-indigator-item bg-danger"></div>
                    <div className="color-indigator-item bg-success"></div>
                    <div className="color-indigator-item bg-warning"></div>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <a href="javascript:;" className="btn btn-white btn-ecomm">	<i className="bx bxs-cart-add"></i>Add to Cart</a>	<a href="javascript:;" className="btn btn-light btn-ecomm"><i className="bx bx-heart"></i>Add to Wishlist</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    <a href="javaScript:;" className="back-to-top"><i className='bx bxs-up-arrow-alt'></i></a>
    </div>
    <div className="switcher-wrapper">
      <div className="switcher-btn"> <i className='bx bx-cog bx-spin'></i>
    </div>
    <div className="switcher-body">
      <div className="d-flex align-items-center">
        <h5 className="mb-0 text-uppercase">Theme Customizer</h5>
        <button type="button" className="btn-close ms-auto close-switcher" aria-label="Close"></button>
      </div>
      <hr/ />
      <p className="mb-0">Gaussian Texture</p>
      <hr />
      <ul className="switcher">
        <li id="theme1"></li>
        <li id="theme2"></li>
        <li id="theme3"></li>
        <li id="theme4"></li>
        <li id="theme5"></li>
        <li id="theme6"></li>
      </ul>
      <hr />
      <p className="mb-0">Gradient Background</p>
      <hr />
      <ul className="switcher">
        <li id="theme7"></li>
        <li id="theme8"></li>
        <li id="theme9"></li>
        <li id="theme10"></li>
        <li id="theme11"></li>
        <li id="theme12"></li>
        <li id="theme13"></li>
        <li id="theme14"></li>
        <li id="theme15"></li>
      </ul>
    </div>
    </div>
    <script src="assets/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/plugins/simplebar/js/simplebar.min.js"></script>
    <script src="assets/plugins/OwlCarousel/js/owl.carousel.min.js"></script>
    <script src="assets/plugins/OwlCarousel/js/owl.carousel2.thumbs.min.js"></script>
    <script src="assets/plugins/metismenu/js/metisMenu.min.js"></script>
    <script src="assets/plugins/perfect-scrollbar/js/perfect-scrollbar.js"></script>
    <script src="assets/plugins/nouislider/nouislider.min.js"></script>
    <script src="assets/js/price-slider.js"></script>
    <script src="assets/js/product-gallery.js"></script>
    <script src="assets/js/app.js"></script>
    <script src='../../../img1.wsimg.com/signals/js/clients/scc-c2/scc-c2.min.js'></script>
  );
}

export default ShopGridLeftSidebar;
