import React, { useEffect } from "react";
import { Link } from "react-router-dom";


const DetailedItem = (props) => {

    const { _id, title, brand, description, category, price, images, reviews } = props;
    const link = "/product/" + _id;
    return (
        <>
            <div className="col" id={_id}>
                <div className="itemp-spost">
                    <div className="comon-items-d1">
                        <div className="left-div-list">
                            <Link to={link} >
                                <div className="posi mb-0">
                                    <img src={images && images[0] ? images[0].url : "images/se2.png"} alt="sm" />
                                    <span className="btn-sm strat-r "> {category}  </span>
                                </div>
                            </Link>
                        </div>
                        <div className="right-list-div">
                            <div className="d-flex mb-1 justify-content-between align-items-center">
                                <h6 className="tags-ts">
                                    {brand}
                                </h6>
                            </div>
                            <Link to={link} className="title-product"> {title}
                            </Link>
                            <p className="my-2">
                                <span className="ratine">
                                    <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i><i className="fas fa-star"></i>
                                </span>
                                <span className="rv-text">({reviews} Reviews)</span>
                            </p>
                            <h2 className="price-text mt-1 mb-3"> {price} <span className="ms-2"> {price} </span> </h2>
                            <div className="d-flex align-items-center justify-content-between">
                                <Link to={link} className="btn view-products mt-0">
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
                                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                        </svg>
                                    </span>  Add to Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailedItem;