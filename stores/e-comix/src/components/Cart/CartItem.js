import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const CartItem = ( data ) => {

    const linkref = "/product/" + data._id;

    return (
        <>
            <div className="comon-cart-ps">
                <div className="d-flex align-items-center justify-content-between">
                    <Link to={linkref} className="products-sm-pic">
                        <div className="imo-caty">
                            <img src={data.images[0].url} alt="bn" />
                        </div>
                    </Link>
                    <div className="cart-ps-details">
                        <Link to={linkref} className="titel-crt-products">
                            { data.title }
                        </Link>
                        <h6> ${data.price} </h6>
                    </div>
                    <Link to="/" className="close-crt"> <i className="fas fa-close"></i> </Link>
                </div>
            </div>
        </>
    )

}

export default CartItem;