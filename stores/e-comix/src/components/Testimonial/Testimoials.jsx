import React, { useEffect } from "react";
import OwlCarousel from 'react-owl-carousel2';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const Testimonial = () => {


    return (
        <>
            <section className="testmonsaosl-div float-start w-100 position-relative">
                <div className="woo pulse">
                    <img alt="wo" src="images/wow.svg" />
                </div>
                <div className="container">
                    <h6 className="text-center sub-heading" data-aos="fade-down"> Testimonial </h6>
                    <h2 className="text-center page-haeding mt-4" data-aos="fade-up">  Few word form our community  </h2>
                    
                        <OwlCarousel options={{
                                items: 3, // Number of items to display at once
                                loop: true, // Loop the carousel
                                margin: 10, // Margin between items
                                nav: true, // Display navigation arrows
                                 dots: true // Display navigation dots
                         }}>
                    <div className="slider-divu owl-carousel owl-theme">
                        <div className="items-slider-txeti position-relative d-block w-100">
                            <div className="text-box d-inline-block w-100 position-relative">
                                <p> It is a long established fact that a reader will be distracted by the readable content of a
                                    page when looking at its layout. The point of using Lorem Ipsum.</p>
                            </div>
                            <div className="userid d-flex align-items-center mt-4">
                                <figure className="m-0">
                                    <img alt="ser" src="images/test1.png" />
                                </figure>
                                <div className="name-d ms-4">
                                    <h5> James Robert
                                        <span className="d-block"> Creative director, NBC</span>
                                    </h5>

                                </div>
                            </div>
                        </div>

                        <div className="items-slider-txeti position-relative d-block w-100">
                            <div className="text-box d-inline-block w-100 position-relative">
                                <p> It is a long established fact that a reader will be distracted by the readable content of a
                                    page when looking at its layout. The point of using Lorem Ipsum.</p>
                            </div>
                            <div className="userid d-flex align-items-center mt-4">
                                <figure className="m-0">
                                    <img alt="ser" src="images/testimonials-1-1.jpg" />
                                </figure>
                                <div className="name-d ms-4">
                                    <h5> James Robert
                                        <span className="d-block"> Creative director, NBC</span>
                                    </h5>

                                </div>
                            </div>
                        </div>


                        <div className="items-slider-txeti position-relative d-block w-100">
                            <div className="text-box d-inline-block w-100 position-relative">
                                <p> It is a long established fact that a reader will be distracted by the readable content of a
                                    page when looking at its layout. The point of using Lorem Ipsum.</p>
                            </div>
                            <div className="userid d-flex align-items-center mt-4">
                                <figure className="m-0">
                                    <img alt="ser" src="images/manages-st2.jpg" />
                                </figure>
                                <div className="name-d ms-4">
                                    <h5> Smith Robert
                                        <span className="d-block"> Creative director, NBC</span>
                                    </h5>

                                </div>
                            </div>
                        </div>


                        <div className="items-slider-txeti position-relative d-block w-100">
                            <div className="text-box d-inline-block w-100 position-relative">
                                <p> It is a long established fact that a reader will be distracted by the readable content of a
                                    page when looking at its layout. The point of using Lorem Ipsum.</p>
                            </div>
                            <div className="userid d-flex align-items-center mt-4">
                                <figure className="m-0">
                                    <img alt="ser" src="images/tim-hufner-9qBSeAN9vps-unsplash.jpg" />
                                </figure>
                                <div className="name-d ms-4">
                                    <h5> Willum Robert
                                        <span className="d-block"> Creative director, NBC</span>
                                    </h5>

                                </div>
                            </div>
                        </div>
                    </div>
                    </OwlCarousel>
                </div>
            </section>
        </>
    )
}


export default Testimonial;