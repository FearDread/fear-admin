import React, { useState } from "react";

const BreadCrumbs = (crumbs) => {

    if (!crumbs) crumbs = [
        {href: '/', icon: 'bx bx-home-alt', label: 'Home', active:false},
        {href: '/about', icon: 'bx', label: 'About Us', active:true}
    ]

    return (
        <>
                     <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                      <i className="bx bx-home-alt"></i> Home
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="/shop" onClick={(e) => { e.preventDefault(); navigate('/shop'); }}>
                      Shop
                    </a>
                  </li>
                  {breadcrumbs.map((crumb) => (
                    <li key={crumb.id} className="breadcrumb-item">
                      <a 
                        href={`/categories/${crumb.id}`}
                        onClick={(e) => { e.preventDefault(); handleCategoryClick(crumb.id); }}
                      >
                        {crumb.name}
                      </a>
                    </li>
                  ))}
                  <li className="breadcrumb-item active" aria-current="page">
                    {current}
                  </li>
                </ol>
              </nav>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                    {crumbs.forEach((idx, crumb) => {
                        if (!crumb.active) {
                            return (
                                <li key={idx} className="breadcrumb-item">
                                    <a href={crumb.href}>
                                        <i className={crumb.icon} ></i> {crumb.label}
                                    </a>
                                </li>
                            )
                        } else {
                            return (
                                <li key={idx} className='breadcrumb-item active' aria-current="page">{crumb.label}</li>
                            )
                        }

                    })}
                </ol>
            </nav>
        </>
    );
}