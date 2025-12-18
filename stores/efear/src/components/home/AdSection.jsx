import React, { useState } from 'react';

export const AdSection = () => {

    return (
        <>
            <section className="py-4">
                <div className="container">
                    <div className="add-banner">
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-4">
                            <div className="col d-flex">
                                <div className="card rounded-0 w-100">
                                    <img src="assets/images/comics/comic_banner_1.jpg" className="card-img-top" alt="..." />
                                    <div className="position-absolute top-0 end-0 m-3 product-discount"><span>-10%</span>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title">Comics Sale</h5>
                                        <p className="card-text">See our huge selection of comics and get 10% off!</p> <a href="javascript:;" className="btn btn-light btn-ecomm">SHOP BY COMICS</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col d-flex">
                                <div className="card rounded-0 w-100">
                                    <div className="position-absolute top-0 end-0 m-3 product-discount"><span>-80%</span>
                                    </div>
                                    <div className="card-body text-center mt-5">
                                        <h5 className="card-title">Trading Card Sales</h5>
                                        <p className="card-text">Buy Any Trading Card and get 30% off all Trading Cards</p> <a href="javascript:;" className="btn btn-light btn-ecomm">SHOP BY CARDS</a>
                                    </div>
                                    <img src="assets/images/comics/_trading_cards_1.jpg" className="card-img-top" alt="..." />
                                </div>
                            </div>
                            <div className="col d-flex">
                                <div className="card rounded-0 w-100">
                                    <img src="assets/images/comics/super4.png" className="card-img h-100" alt="..." />
                                    <div className="card-img-overlay text-center top-20">
                                        <div className="border border-white border-3 py-3 bg-dark-3">
                                            <h5 className="card-title">Marvel Summer Sale</h5>
                                            <p className="card-text text-uppercase fs-1 text-white lh-1 mt-3 mb-2">Up to 50% off</p>
                                            <p className="card-text fs-5">Latest Marvel Collections</p>	<a href="javascript:;" className="btn btn-white btn-ecomm">SHOP BY MARVEL</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col d-flex">
                                <div className="card rounded-0 w-100">
                                    <div className="position-absolute top-0 end-0 m-3 product-discount"><span>-50%</span>
                                    </div>
                                    <div className="card-body text-center">
                                        <img src="assets/images/comics/super1.png" className="card-img-top" alt="..." />
                                        <h5 className="card-title fs-1 text-uppercase">Super Sale</h5>
                                        <p className="card-text text-uppercase fs-4 text-white lh-1 mb-2">Up to 50% off</p>
                                        <p className="card-text">On All Graphic Novels</p> <a href="javascript:;" className="btn btn-light btn-ecomm">HURRY UP!</a>
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