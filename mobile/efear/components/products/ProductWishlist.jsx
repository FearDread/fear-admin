import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Toast from "../../components/common/Toast";
import {
    addItem,
} from '../../features/cart/slice';

export const ProductWishlistCard = ({ product, isInCart }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };
    const renderStars = (rating = 4) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={`bx bxs-star ${i <= rating ? 'text-warning' : 'text-light-4'}`}
                ></i>
            );
        }
        return stars;
    };


    const handleAddToCart = () => {
        if (!product) return;
        const cartItem = {
            id: product._id,
            productId: product._id,
            quantity,
            name: product.title,
            title: product.title,
            image: product.images?.[0]?.url || '',
            price: product.salePrice || product.price,
            subtotal: product.price,
            sku: product.sku,
        };

        dispatch(addItem(cartItem));
        addToast('Product added to cart!', 'success')
    };

    const handleRemove = () => {
        //onRemoveFromWishlist(product.id || product.productId);
    };

    const handleViewDetails = () => {
        navigate(`/product/${product.id || product.productId}`);
    };

    // Calculate discount percentage
    const discountPercent = product.originalPrice && product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : product.discount || 0;

    return (
        <>
            <div className="col">
                <div className="card rounded-0 product-card">
                    <div className="position-relative">
                        <button
                            onClick={handleViewDetails}
                            className="border-0 bg-transparent w-100 p-0"
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={product.images?.[0] || product.image || 'assets/images/products/01.png'}
                                className="card-img-top"
                                alt={product.title || product.name}
                            />
                        </button>
                        {discountPercent > 0 && (
                            <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                                -{discountPercent}%
                            </span>
                        )}
                        {product.isFeatured && (
                            <span className="badge bg-warning position-absolute top-0 start-0 m-2">
                                <i className="bx bx-star"></i> Featured
                            </span>
                        )}
                    </div>

                    <div className="card-body">
                        <div className="product-info">
                            <button
                                onClick={handleViewDetails}
                                className="text-decoration-none border-0 bg-transparent p-0 text-start w-100"
                            >
                                <p className="product-catergory font-13 mb-1 text-muted">
                                    {product.category || 'Product Category'}
                                </p>
                            </button>

                            <button
                                onClick={handleViewDetails}
                                className="text-decoration-none border-0 bg-transparent p-0 text-start w-100"
                            >
                                <h6 className="product-name mb-2">
                                    {product.title || product.name || 'Product Name'}
                                </h6>
                            </button>

                            <div className="d-flex align-items-center mb-2">
                                <div className="mb-1 product-price">
                                    {product.originalPrice && (
                                        <span className="me-2 text-decoration-line-through text-muted">
                                            ${product.originalPrice.toFixed(2)}
                                        </span>
                                    )}
                                    <span className="text-white fs-5">
                                        ${(product.price || 0).toFixed(2)}
                                    </span>
                                </div>
                                <div className="cursor-pointer ms-auto">
                                    {renderStars(product.rating)}
                                </div>
                            </div>

                            {/* Stock Status */}
                            {product.quantity !== undefined && (
                                <p className={`text-${product.quantity > 0 ? 'success' : 'danger'} small mb-2`}>
                                    <i className={`bx ${product.quantity > 0 ? 'bx-check-circle' : 'bx-x-circle'} me-1`}></i>
                                    {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                                </p>
                            )}

                            {product.addedAt && (
                                <p className="text-muted small mb-2">
                                    <i className="bx bx-time-five me-1"></i>
                                    Added {new Date(product.addedAt).toLocaleDateString()}
                                </p>
                            )}

                            <div className="product-action mt-2">
                                <div className="d-grid gap-2">
                                    <button
                                        onClick={handleAddToCart}
                                        className="btn btn-white btn-ecomm"
                                        disabled={product.quantity === 0 || isInCart}
                                    >
                                        <i className='bx bxs-cart-add'></i>
                                        {isInCart ? 'In Cart' : product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </button>
                                    <button
                                        onClick={handleRemove}
                                        className="btn btn-light btn-ecomm"
                                    >
                                        <i className='bx bx-trash'></i> Remove From List
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </>
    );
};

export default ProductWishlistCard;