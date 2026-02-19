import React, { useState } from 'react';

export const AdSection = () => {

    return (
        <>
            <section className="py-4">
                <div className="container">
                                            <div className="text-center">
                            <h4 className="text-uppercase mb-0">Our Best Deals</h4>
                            <hr />
                        </div>
                    <div className="add-banner">
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-4">
                            <div className="col d-flex">
                                <div className="card rounded-0 w-100 media-object">
                                    <img src="assets/images/comics/_sale_banner_2.jpg" className="ad-image" alt="..." />
                                    <div className="position-absolute top-0 end-0 m-3 product-discount"><span>-10%</span>
                                    </div>
                                    <div className="card-body text-center">
                                        <h5 className="card-title">Comics Sale</h5>
                                        <p className="card-text">See our huge selection of comics and get 10% off!</p> <a href="#" className="btn btn-light btn-ecomm">SHOP BY COMICS</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col d-flex">
                                <div className="card rounded-0 w-100 media-object">
                                    <div className="position-absolute top-0 end-0 m-3 product-discount"><span>-80%</span>
                                    </div>
                                    <div className="card-body text-center mt-5">
                                        <h5 className="card-title">Trading Card Sales</h5>
                                        <p className="card-text">Buy Any Trading Card and get 30% off your entire order!</p> <a href="#" className="btn btn-light btn-ecomm">SHOP CARDS</a>
                                    </div>
                                    <img src="assets/images/comics/trade01.jpg" className="ad-image-btm" alt="..." />
                                </div>
                            </div>
                            <div className="col d-flex">
                                <div className="card rounded-0 w-100 media-object">
                                    <img src="assets/images/comics/background.gif" className="card-img-full" alt="..." />
                                    <div className="card-img-overlay text-center top-20">
                                        <div className="border border-white border-3 py-3 bg-dark-3">
                                            <h5 className="card-title">Marvel Summer Sale</h5>
                                            <p className="card-text text-uppercase fs-1 text-white lh-1 mt-3 mb-2">Up to 50% off</p>
                                            <p className="card-text fs-5">Latest Marvel Collections</p>	<a href="#" className="btn btn-white btn-ecomm">SHOP BY MARVEL</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col d-flex">
                                <div className="card rounded-0 w-100 media-object">
                                    <div className="position-absolute top-0 end-0 m-3 product-discount"><span>-50%</span>
                                    </div>

                                        <img src="assets/images/ebooks/03.jpg" className="ad-img-top" alt="..." />
                                                                          <div className="card-body text-center">
                                        <h5 className="card-title fs-1 text-uppercase">Super Sale</h5>
                                        <p className="card-text text-uppercase fs-4 text-white lh-1 mb-2">Up to 50% off</p>
                                        <p className="card-text">On All E-Books</p> <a href="#" className="btn btn-light btn-ecomm">HURRY UP!</a>
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

export default AdSection;