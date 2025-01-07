import React, { useEffect } from 'react';

const SuperItem = (props) => {

    const { title, description, category, price, images, brand } = props || {};

    return (
        <>
            <div className="col">
                <a href="index.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-up">
                    <div className="img-box-div position-relative">
                        <img alt="srt" src={images && images[0] ? images[0].url : "images/b5197a7a-image-22.jpg"} />
                        <span className="off">10% off</span>
                    </div>
                    <div className="details-shopi">
                        <div className="row align-items-center">
                            <div className="col-8">
                                <h5 className="text-white"> {title}
                                    <span className="d-block"> {category} </span>
                                </h5>
                            </div>
                            <div className="col-4">
                                <h3 className="text-center"> {price} <span className="d-block"> {brand} </span> </h3>
                            </div>
                        </div>

                    </div>

                </a>
            </div>
        </>
    )
}

export default SuperItem;