import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const BannerMain = () => {

    return (
        <>
            <section className="banner-part float-start w-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5">
                            <div className="form-search-banner position-relative w-100 d-block">
                                <h2 data-aos="fade-up"> The best online <span className="d-lg-block">
                                    comic Store </span> </h2>
                                <p> It is a long established fact that a reader best Comic
                                    will be distracted by the readable content.</p>
                                <form action="https://oxentictemplates.in/templatemonster/comicstore/mu" method="get">
                                    <div className="form-inside-div d-flex align-items-center justify-content-between">
                                        <div className="form-group">
                                            <input type="text" className="form-control" placeholder="Search keyword" required />
                                        </div>
                                        <div className="form-group">
                                            <button type="button" className="btn btn-search">
                                                <i className="fas fa-search" />
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                <figure className="m-0 strat-02 blink" data-aos="fade-up">
                                    <img alt="star" src="images/banner-star.svg" />
                                </figure>
                                <figure className="m-0 strat-023 blink">
                                    <img alt="star" src="images/banner-star2.svg" />
                                </figure>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <figure className="m-0 banner-pic">
                                <img alt="banner" src="images/supoert.png" />
                            </figure>
                        </div>
                    </div>
                </div>
                <div className="egge-img">
                    <img alt="eage" src="images/edge1-d.svg" />
                </div>
            </section>
        </>
    )
}

export default BannerMain;