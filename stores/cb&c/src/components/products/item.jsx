

export const Item = (props) => {

    return (
        <>
            <div className="col-xxl-3 col-xl-4 col-md-6">
                <div className="product__item bor">
                    <a href="#0" className="wishlist"><i className="fa-regular fa-heart"></i></a>
                    <a href="shop-single.html" className="product__image pt-20 d-block">
                        <img className="font-image" src="assets/images/product/product-image1.png"
                            alt="image" />
                        <img className="back-image" src="assets/images/product/product-image3.png"
                            alt="image" />
                    </a>
                    <div className="product__content">
                        <h4 className="mb-15"><a className="primary-hover" href="shop-single.html">Menthol
                            E-Cigarette Kit</a></h4>
                        <del>$74.50</del><span className="primary-color ml-10">$49.50</span>
                        <div className="star mt-20">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                        </div>

                    </div>
                    <a className="product__cart d-block bor-top" href="#0"><i
                        className="fa-regular fa-cart-shopping primary-color me-1"></i>
                        <span>Add to cart</span></a>
                </div>
            </div>
        </>
    )
}