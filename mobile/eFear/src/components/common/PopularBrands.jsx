import React, { useState } from "react";
import { Link } from "react-router-dom";

export const PopularBrands = () => {


    return (
        <>
            <section className="py-4">
                <div className="container">
                    <div className="popular-brands">
                        <div className="text-center">
                            <h2 className="text-uppercase mb-0">Popular Brands</h2>
                            <hr />
                        </div>
                        <div className="row row-cols-2 row-cols-sm-2 row-cols-md-4 row-cols-xl-5">
                            <div className="col">
                                <div className="card">
                                    <div className="card-body">
                                        <Link to="/shop?brand=DC">
                                            <img src="assets/images/brands/dc.jpg" className="img-fluid" alt="" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card">
                                    <div className="card-body">
                                        <Link to="/shop?brand=Dark Horse">
                                            <img src="assets/images/brands/dh.jpg" className="img-fluid" alt="" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card">
                                    <div className="card-body">
                                        <Link to="/shop?brand=IDW Publishing">
                                            <img src="assets/images/brands/idw.jpg" className="img-fluid" alt="" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card">
                                    <div className="card-body">
                                        <Link to="/shop?brand=Marvel">
                                            <img src="assets/images/brands/marvel.jpg" className="img-fluid" alt="" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card">
                                    <div className="card-body">
                                        <Link to="/shop?brand=Amazon">
                                            <img src="assets/images/brands/01.png" className="img-fluid" alt="" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default PopularBrands;