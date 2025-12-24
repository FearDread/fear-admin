import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { Link, useLocation } from 'react-router-dom';



export const CartDropdown = ({ items, onRemoveItem }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="dropdown-menu dropdown-menu-end">
      <Link to="/cart">
        <div className="cart-header">
          <p className="cart-header-title mb-0">{items.length} ITEMS</p>
          <p className="cart-header-clear ms-auto mb-0">VIEW CART</p>
        </div>
      </Link>
      <div className="cart-list">
        {items.map((item) => (
          <div key={item.id} className="dropdown-item">
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h6 className="cart-product-title">{item.title}</h6>
                <p className="cart-product-price">{item.quantity} X ${item.price.toFixed(2)}</p>
              </div>
              <div className="position-relative">
                <button
                  className="cart-product-cancel position-absolute"
                  onClick={() => onRemoveItem(item.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <i className='bx bx-x'></i>
                </button>
                <div className="cart-product">
                  <img src={item.image || '/assets/images/ebooks/01.jpg'} alt={item.title} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link to="/cart">
        <div className="text-center cart-footer d-flex align-items-center">
          <h5 className="mb-0">TOTAL</h5>
          <h5 className="mb-0 ms-auto">${total.toFixed(2)}</h5>
        </div>
      </Link>
      <div className="d-grid p-3 border-top">
        <Link to="/checkout" className="btn btn-light btn-ecomm">CHECKOUT</Link>
      </div>
    </div>
  );
};

export default CartDropdown;