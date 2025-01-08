import React, { useEffect } from "react";

const Services = () => {

    return (
        <>
            <section className="top-sectionk float-start w-100">
                <div className="container">
                    <div className="row row-cols-1 row-cols-lg-3 gy-5 g-lg-5">
                        <div className="col position-relative">
                            <div className="comon-items-con position-relative d-flex align-items-center">
                                <figure className="m-0">
                                    <img alt="sert" src="images/world-icon.png" />
                                </figure>
                                <div className="rightextr">
                                    <h5> Worldwide  Shipping </h5>
                                    <p> International Shipping Available </p>
                                </div>
                            </div>
                            <div className="comiuy-after"></div>
                        </div>
                        <div className="col position-relative" data-aos="fade-up">
                            <div className="comon-items-con position-relative d-flex align-items-center" >
                                <figure className="m-0">
                                    <img alt="sert" src="images/secure.png" />
                                </figure>
                                <div className="rightextr">
                                    <h5> Secure  Payment </h5>
                                    <p> Guarantee Secure Online Payment </p>
                                </div>
                            </div>
                            <div className="comiuy-after"></div>
                        </div>
                        <div className="col position-relative">
                            <div className="comon-items-con position-relative d-flex align-items-center">
                                <figure className="m-0">
                                    <img alt="sert" src="images/online-supot.png" />
                                </figure>
                                <div className="rightextr">
                                    <h5> Online Support </h5>
                                    <p> Any Time Support our Team </p>
                                </div>
                            </div>
                            <div className="comiuy-after"></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Services;