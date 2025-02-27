import React, { useEffect } from "react";


const ShopItem = (props) => {

    const { _id, title, description, price, images, brand, category } = props || {};

    const link = "/product/" + _id;

    return (
        <>
            <div className="col" data-idx={_id}>
                <a href={link} className="shop-items overflow-hidden d-inline-block w-100 position-relative" data-aos="zoom-in">
                    <div className="img-box-div position-relative">
                        <img alt="srt" src={images && images[0] ? images[0].url : "images/b5197a7a-image-22.jpg" } />
                        <span className="off">10% off</span>
                    </div>
                    <div className="details-shopi">
                        <div className="row align-items-center">
                            <div className="col-8">
                                <h5>{title}</h5>
                            </div>
                            <div className="col-4">
                                <h3> {category} <span> {price} </span> </h3>
                            </div>
                        </div>

                    </div>

                </a>
            </div>
        </>
    )

}

export default ShopItem;