


const CartItem = ( data ) => {

    const linkref = "/product/" + data._id;

    return (
        <>
            <div className="comon-cart-ps">
                <div className="d-flex align-items-center justify-content-between">
                    <a href={linkref} className="products-sm-pic">
                        <div className="imo-caty">
                            <img src={data.images[0].url} alt="bn" />
                        </div>
                    </a>
                    <div className="cart-ps-details">
                        <a href={linkref} className="titel-crt-products">
                            { data.title }
                        </a>
                        <h6> ${data.price} </h6>
                    </div>
                    <a href="index.html#" className="close-crt"> <i className="fas fa-close"></i> </a>
                </div>
            </div>
        </>
    )

}

export default CartItem;