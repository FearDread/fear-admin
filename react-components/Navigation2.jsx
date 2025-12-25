import React from 'react';

function Navigation2() {
  return (
    <nav className="navbar navbar-expand">
      <ul className="navbar-nav ms-auto">
        <li className="nav-item"><a href="account-dashboard.html" className="nav-link cart-link"><i className='bx bx-user'></i></a>
      </li>
      <li className="nav-item"><a href="wishlist.html" className="nav-link cart-link"><i className='bx bx-heart'></i></a>
    </li>
    <li className="nav-item dropdown dropdown-large">
      <a href="#" className="nav-link dropdown-toggle dropdown-toggle-nocaret position-relative cart-link" data-bs-toggle="dropdown"> <span className="alert-count">8</span>
      <i className='bx bx-shopping-bag'></i>
    </a>
    <div className="dropdown-menu dropdown-menu-end">
      <a href="javascript:;">
        <div className="cart-header">
          <p className="cart-header-title mb-0">8 ITEMS</p>
          <p className="cart-header-clear ms-auto mb-0">VIEW CART</p>
        </div>
      </a>
      <div className="cart-list">
        <a className="dropdown-item" href="javascript:;">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <h6 className="cart-product-title">Men White T-Shirt</h6>
              <p className="cart-product-price">1 X $29.00</p>
            </div>
            <div className="position-relative">
              <div className="cart-product-cancel position-absolute"><i className='bx bx-x'></i>
            </div>
            <div className="cart-product">
              <img src="assets/images/products/01.png" alt="product image" />
            </div>
          </div>
        </div>
      </a>
      <a className="dropdown-item" href="javascript:;">
        <div className="d-flex align-items-center">
          <div className="flex-grow-1">
            <h6 className="cart-product-title">Puma Sports Shoes</h6>
            <p className="cart-product-price">1 X $29.00</p>
          </div>
          <div className="position-relative">
            <div className="cart-product-cancel position-absolute"><i className='bx bx-x'></i>
          </div>
          <div className="cart-product">
            <img src="assets/images/products/05.png" alt="product image" />
          </div>
        </div>
      </div>
    </a>
    <a className="dropdown-item" href="javascript:;">
      <div className="d-flex align-items-center">
        <div className="flex-grow-1">
          <h6 className="cart-product-title">Women Red Sneakers</h6>
          <p className="cart-product-price">1 X $29.00</p>
        </div>
        <div className="position-relative">
          <div className="cart-product-cancel position-absolute"><i className='bx bx-x'></i>
        </div>
        <div className="cart-product">
          <img src="assets/images/products/17.png" alt="product image" />
        </div>
      </div>
    </div>
    </a>
    <a className="dropdown-item" href="javascript:;">
      <div className="d-flex align-items-center">
        <div className="flex-grow-1">
          <h6 className="cart-product-title">Black Headphone</h6>
          <p className="cart-product-price">1 X $29.00</p>
        </div>
        <div className="position-relative">
          <div className="cart-product-cancel position-absolute"><i className='bx bx-x'></i>
        </div>
        <div className="cart-product">
          <img src="assets/images/products/10.png" alt="product image" />
        </div>
      </div>
    </div>
    </a>
    <a className="dropdown-item" href="javascript:;">
      <div className="d-flex align-items-center">
        <div className="flex-grow-1">
          <h6 className="cart-product-title">Blue Girl Shoes</h6>
          <p className="cart-product-price">1 X $29.00</p>
        </div>
        <div className="position-relative">
          <div className="cart-product-cancel position-absolute"><i className='bx bx-x'></i>
        </div>
        <div className="cart-product">
          <img src="assets/images/products/08.png" alt="product image" />
        </div>
      </div>
    </div>
    </a>
    <a className="dropdown-item" href="javascript:;">
      <div className="d-flex align-items-center">
        <div className="flex-grow-1">
          <h6 className="cart-product-title">Men Leather Belt</h6>
          <p className="cart-product-price">1 X $29.00</p>
        </div>
        <div className="position-relative">
          <div className="cart-product-cancel position-absolute"><i className='bx bx-x'></i>
        </div>
        <div className="cart-product">
          <img src="assets/images/products/18.png" alt="product image" />
        </div>
      </div>
    </div>
    </a>
    <a className="dropdown-item" href="javascript:;">
      <div className="d-flex align-items-center">
        <div className="flex-grow-1">
          <h6 className="cart-product-title">Men Yellow T-Shirt</h6>
          <p className="cart-product-price">1 X $29.00</p>
        </div>
        <div className="position-relative">
          <div className="cart-product-cancel position-absolute"><i className='bx bx-x'></i>
        </div>
        <div className="cart-product">
          <img src="assets/images/products/04.png" alt="product image" />
        </div>
      </div>
    </div>
    </a>
    <a className="dropdown-item" href="javascript:;">
      <div className="d-flex align-items-center">
        <div className="flex-grow-1">
          <h6 className="cart-product-title">Pool Charir</h6>
          <p className="cart-product-price">1 X $29.00</p>
        </div>
        <div className="position-relative">
          <div className="cart-product-cancel position-absolute"><i className='bx bx-x'></i>
        </div>
        <div className="cart-product">
          <img src="assets/images/products/16.png" alt="product image" />
        </div>
      </div>
    </div>
    </a>
    </div>
    <a href="javascript:;">
      <div className="text-center cart-footer d-flex align-items-center">
        <h5 className="mb-0">TOTAL</h5>
        <h5 className="mb-0 ms-auto">$189.00</h5>
      </div>
    </a>
    <div className="d-grid p-3 border-top"> <a href="javascript:;" className="btn btn-light btn-ecomm">CHECKOUT</a>
    </div>
    </div>
    </li>
    </ul>
    </nav>
  );
}

export default Navigation2;
