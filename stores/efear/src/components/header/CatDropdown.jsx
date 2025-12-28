import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { Link, useLocation } from 'react-router-dom';


export const CatDropdown = ({ categories: categoryData }) => {
  return (
    <div className="dropdown-menu dropdown-large-menu">
      <div className="row">
        {Object.entries(categoryData).map(([title, items], idx) => (
          <div key={title} className="col-md-4">
            <h6 className="large-menu-title">{title}</h6>
            <ul>
              {items.map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="dropdown-item">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="col-md-4">
          <div className="pramotion-banner1">
            <img src="assets/images/comics/banner/01.png" className="img-fluid" alt="Promotion" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatDropdown
