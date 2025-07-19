import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const CollectionItem = (item) => {

    return (
            <a href="collection.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-left">
                <div className="img-box-div position-relative">
                  <img alt="srt" src={item.images[0]?.url}/>
                  <span className="off">10% off</span>
                </div>
                <div className="details-shopi">
                  <div className="row align-items-center">
                    <div className="col-8">
                      <h5 className="text-white"> {item.title}
                        <span className="d-block"> {item.category} </span>
                      </h5>
                    </div>
                    <div className="col-4">
                      <h3 className="text-center"> {item.price} <span className="d-block"> $50 </span> </h3>
                    </div>
                  </div>

                </div>

              </a>
    )
}

export default CollectionItem;