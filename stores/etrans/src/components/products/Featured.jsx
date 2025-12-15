import React, { useState } from 'react';
import ProductCard from "./ProductCard";

// Featured Products Section
export const FeaturedProducts = () => {
  const products = [
    { id: 1, name: "Men White T-Shirt", category: "Fashion", price: 49, rating: 5, icon: "👕" },
    { id: 2, name: "Puma Sports Shoes", category: "Sports", price: 49, rating: 4, icon: "👟" },
    { id: 3, name: "Women Red Sneakers", category: "Fashion", price: 49, rating: 4, icon: "👠" },
    { id: 4, name: "Black Headphone", category: "Electronics", price: 49, rating: 5, icon: "🎧" },
    { id: 5, name: "Smart Watch", category: "Electronics", price: 49, rating: 4, icon: "⌚" },
    { id: 6, name: "Laptop Bag", category: "Accessories", price: 49, rating: 5, icon: "💼" },
    { id: 7, name: "Sunglasses", category: "Accessories", price: 49, rating: 4, icon: "🕶️" },
    { id: 8, name: "Blue Girl Shoes", category: "Fashion", price: 49, rating: 5, icon: "👡" }
  ];

  return (
    <section className="py-4">
      <div className="container">
        <div className="d-flex align-items-center">
          <h5 className="text-uppercase mb-0">FEATURED PRODUCTS</h5>
          <a href="javascript:;" className="btn btn-light ms-auto rounded-0">More Products<i className='bx bx-chevron-right'></i></a>
        </div>
        <hr />
        <div className="product-grid">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
            <div className="col">
              <div className="card rounded-0 product-card">
                <div className="card-header bg-transparent border-bottom-0">
                  <div className="d-flex align-items-center justify-content-end gap-3">
                    <a href="javascript:;">
                      <div className="product-compare"><span><i className='bx bx-git-compare'></i> Compare</span>
                    </div>
                  </a>
                  <a href="javascript:;">
                    <div className="product-wishlist"> <i className='bx bx-heart'></i>
                  </div>
                </a>
              </div>
            </div>
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
                <a href="javascript:;" className="btn btn-light btn-ecomm">	<i className='bx bxs-cart-add'></i>Add to Cart</a>	<a href="javascript:;" className="btn btn-link btn-ecomm" data-bs-toggle="modal" data-bs-target="#QuickViewProduct"><i className='bx bx-zoom-in'></i>Quick View</a>
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
              <div className="product-compare"><span><i className='bx bx-git-compare'></i> Compare</span>
            </div>
          </a>
          <a href="javascript:;">
            <div className="product-wishlist"> <i className='bx bx-heart'></i>
          </div>
        </a>
      </div>
    </div>
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
        <a href="javascript:;" className="btn btn-light btn-ecomm"> <i className='bx bxs-cart-add'></i>Add to Cart</a> <a href="javascript:;" className="btn btn-link btn-ecomm" data-bs-toggle="modal" data-bs-target="#QuickViewProduct"><i className='bx bx-zoom-in'></i>Quick View</a>
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
              <div className="product-compare"><span><i className='bx bx-git-compare'></i> Compare</span>
            </div>
          </a>
          <a href="javascript:;">
            <div className="product-wishlist"> <i className='bx bx-heart'></i>
          </div>
        </a>
      </div>
    </div>
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
        <a href="javascript:;" className="btn btn-light btn-ecomm"> <i className='bx bxs-cart-add'></i>Add to Cart</a> <a href="javascript:;" className="btn btn-link btn-ecomm" data-bs-toggle="modal" data-bs-target="#QuickViewProduct"><i className='bx bx-zoom-in'></i>Quick View</a>
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
              <div className="product-compare"><span><i className='bx bx-git-compare'></i> Compare</span>
            </div>
          </a>
          <a href="javascript:;">
            <div className="product-wishlist"> <i className='bx bx-heart'></i>
          </div>
        </a>
      </div>
    </div>
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
        <a href="javascript:;" className="btn btn-light btn-ecomm"> <i className='bx bxs-cart-add'></i>Add to Cart</a> <a href="javascript:;" className="btn btn-link btn-ecomm" data-bs-toggle="modal" data-bs-target="#QuickViewProduct"><i className='bx bx-zoom-in'></i>Quick View</a>
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
              <div className="product-compare"><span><i className='bx bx-git-compare'></i> Compare</span>
            </div>
          </a>
          <a href="javascript:;">
            <div className="product-wishlist"> <i className='bx bx-heart'></i>
          </div>
        </a>
      </div>
    </div>
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
        <a href="javascript:;" className="btn btn-light btn-ecomm"> <i className='bx bxs-cart-add'></i>Add to Cart</a> <a href="javascript:;" className="btn btn-link btn-ecomm" data-bs-toggle="modal" data-bs-target="#QuickViewProduct"><i className='bx bx-zoom-in'></i>Quick View</a>
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
              <div className="product-compare"><span><i className='bx bx-git-compare'></i> Compare</span>
            </div>
          </a>
          <a href="javascript:;">
            <div className="product-wishlist"> <i className='bx bx-heart'></i>
          </div>
        </a>
      </div>
    </div>
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
        <a href="javascript:;" className="btn btn-light btn-ecomm"> <i className='bx bxs-cart-add'></i>Add to Cart</a> <a href="javascript:;" className="btn btn-link btn-ecomm" data-bs-toggle="modal" data-bs-target="#QuickViewProduct"><i className='bx bx-zoom-in'></i>Quick View</a>
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
              <div className="product-compare"><span><i className='bx bx-git-compare'></i> Compare</span>
            </div>
          </a>
          <a href="javascript:;">
            <div className="product-wishlist"> <i className='bx bx-heart'></i>
          </div>
        </a>
      </div>
    </div>
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
        <a href="javascript:;" className="btn btn-light btn-ecomm"> <i className='bx bxs-cart-add'></i>Add to Cart</a> <a href="javascript:;" className="btn btn-link btn-ecomm" data-bs-toggle="modal" data-bs-target="#QuickViewProduct"><i className='bx bx-zoom-in'></i>Quick View</a>
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
              <div className="product-compare"><span><i className='bx bx-git-compare'></i> Compare</span>
            </div>
          </a>
          <a href="javascript:;">
            <div className="product-wishlist"> <i className='bx bx-heart'></i>
          </div>
        </a>
      </div>
    </div>
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
        <a href="javascript:;" className="btn btn-light btn-ecomm"> <i className='bx bxs-cart-add'></i>Add to Cart</a> <a href="javascript:;" className="btn btn-link btn-ecomm" data-bs-toggle="modal" data-bs-target="#QuickViewProduct"><i className='bx bx-zoom-in'></i>Quick View</a>
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
};

export default FeaturedProducts;