import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Subscribe = () => {
    

    return (
        <>
            <section className="subscribe-section float-start w-100 position-relative">
                <div className="azp shake">
                    <img alt="ser" src="images/zap.png" />
                </div>
                <div className="container">
                    <div className="col-lg-8">
                        <h6 className="text-center text-lg-start sub-heading" data-aos="fade-down"> You may unsubscribe at any moment </h6>
                        <h2 className="text-center text-lg-start page-haeding mt-4" data-aos="fade-up">  Get your Need on by subcribing
                            our newsletter </h2>

                        <a href="index.html#" className="btn comon-button mx-auto ms-lg-0 mt-5 d-table d-inline-lg-block" data-aos="fade-up">  <span> <i className="fas fa-arrow-right"></i> See All Post </span> </a>
                    </div>
                </div>
                <div className="sub-ixtr" data-aos="fade-up">
                    <img alt="set" src="images/footer-superhero.png" />
                </div>
            </section>
        </>
    )
}

export default Subscribe;
