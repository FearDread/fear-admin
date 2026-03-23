import React from "react";



export const ProductCartItem = (item) => {

    return (
        <>
            <React.Fragment key={item.productId}>
                <div className="d-flex align-items-center">
                    <a className="d-block flex-shrink-0" href={`/product/${item.productId}`}>
                        <img
                            src={item.image || "assets/images/products/01.png"}
                            width="75"
                            alt={item.name}
                        />
                    </a>
                    <div className="ps-2">
                        <h6 className="mb-1">
                            <a href={`/product/${item.productId}`}>{item.name}</a>
                        </h6>
                        <div className="widget-product-meta">
                            <span className="me-2">
                                ${item.price.toFixed(2)}
                            </span>
                            <span>x {item.quantity}</span>
                        </div>
                    </div>
                </div>
                <div className="my-3 border-top"></div>
            </React.Fragment>
        </>
    )
}

export default ProductCartItem;