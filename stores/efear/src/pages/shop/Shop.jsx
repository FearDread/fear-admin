import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from "react-redux";
import ProductCard from "../../components/products/ProductCard";
import { dispatch } from "../../features/store";
import { fetchBrands, selectAllBrands, selectBrandsLoading, selectBrandsError } from "../../features/brands/slice";


export const Shop = ({ data }) => {
    const products = useSelector((state) => state.products.data);
    const brands = useSelector(selectAllBrands);
    const loading = useSelector(selectBrandsLoading);
    const productData = useMemo(() => {
        return data || products;
    }, [data, products]);

    // Memoize the recommended products slice
    const filteredProducts = useMemo(() => {
        return productData?.slice(20, 29) || [];
    }, [productData]);

    useEffect(() => {

        dispatch(fetchBrands());
    
    }, [dispatch]);


  if (loading && brands.length === 0) {
    return (
      <div className="loading-container">
        <p>Loading brands...</p>
      </div>
    );
  }

    if (!loading && brands.length > 0) {
        console.log('brands = ', brands)
    }

    return (
        <>
            <section className="py-3 border-bottom d-none d-md-flex">
                <div className="container">
                    <div className="page-breadcrumb d-flex align-items-center">
                        <h3 className="breadcrumb-title pe-3">Shop Grid Left Sidebar</h3>
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
                                        <hr className="d-flex d-xl-none" />
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
                                        {filteredProducts.map((product) => (
                                            <div className="item" key={product._id}>
                                                <ProductCard {...product} />
                                            </div>
                                        ))}


                                    </div>
                                </div>
                                <hr />

                                {/* convert to pagination component */}
                                <nav className="d-flex justify-content-between" aria-label="Page navigation">
                                    <ul className="pagination">
                                        <li className="page-item"><a className="page-link" href="javascript:;"><i className='bx bx-chevron-left'></i> Prev</a>
                                        </li>
                                    </ul>
                                    <ul className="pagination">
                                        <li className="page-item active d-none d-sm-block" aria-current="page"><span className="page-link">1<span className="visually-hidden">(current)</span></span>
                                        </li>
                                        <li className="page-item d-none d-sm-block"><a className="page-link" href="javascript:;">2</a>
                                        </li>
                                        <li className="page-item d-none d-sm-block"><a className="page-link" href="javascript:;">3</a>
                                        </li>
                                        <li className="page-item d-none d-sm-block"><a className="page-link" href="javascript:;">4</a>
                                        </li>
                                        <li className="page-item d-none d-sm-block"><a className="page-link" href="javascript:;">5</a>
                                        </li>
                                    </ul>
                                    <ul className="pagination">
                                        <li className="page-item"><a className="page-link" href="javascript:;" aria-label="Next">Next <i className='bx bx-chevron-right'></i></a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )

}

export default Shop;