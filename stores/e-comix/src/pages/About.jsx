import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import BannerSub from "../components/Banner/BannerSub"
import Testimonial from "../components/Testimonial/Testimoials";


const About = () => {

  return (
    <>
      <BannerSub />
      <main className="float-start w-100 total-body home-body mt-0">
        <section className="about-hisotry float-start w-100 position-relative">
          <div className="container">
            <div className="row row-cols-1 row-cols-lg-2 g-5 mt-0 align-items-center">
              <div className="col position-relative">
                <h5 className="sub-heading mb-2"> About History </h5>
                <h2 className="page-haeding"> Provide the best
                  <span className="d-block"> Comics Emporium </span>
                </h2>
                <p className="mt-4"> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to
                  using 'Content here, content here', making it look like readable English. </p>

                <p> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to
                  using 'Content here, content here', making it look like readable English. </p>

                <a href="about.html#" className="btn comon-button mt-5  d-table" data-aos="fade-up"> <span> Explore more </span> </a>

                <div className="cloos pulse">
                  <img alt="cool" src="images/cool.png" />
                </div>

              </div>
              <div className="col">
                <figure className="aboutbui02 mt-5 mt-lg-0">
                  <img alt="abut" src="images/0ea7b3bf-image-2.jpg" />
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section className="offter-div float-start w-100 position-relative">
          <div className="container">
            <h5 className="sub-heading mb-2 text-center">  Why choose us </h5>
            <h2 className="text-center page-haeding"> Here's What we Offer </h2>
            <div className="row align-items-center mt-5 mt-lg-0">
              <div className="col-lg-3">
                <div className="comon-shape">
                  <h4>01</h4>
                  <h5 className="text-center"> Proin quis neque dapibus </h5>
                </div>

                <div className="comon-shape">
                  <h4>02</h4>
                  <h5 className="text-center"> Proin quis neque dapibus </h5>
                </div>

              </div>
              <div className="col-lg-6">
                <figure className="text-center">
                  <img alt="abnh" src="images/aboutmin.png" />
                </figure>
              </div>
              <div className="col-lg-3">
                <div className="comon-shape">
                  <h4>03</h4>
                  <h5 className="text-center"> Proin quis neque dapibus </h5>
                </div>

                <div className="comon-shape">
                  <h4>04</h4>
                  <h5 className="text-center"> Proin quis neque dapibus </h5>
                </div>

              </div>
            </div>

            <a href="about.html#" className="btn comon-button mx-auto mt-5 d-table">  <span> <i className="far fa-gem"></i> Join Now </span> </a>
          </div>

          <div className="eg-bg">
            <img alt="ser" src="images/edge1-d.svg" />
          </div>
        </section>

        <Testimonial />


      </main>
    </>
  )
}

export default About;


