import React, { useContext } from 'react';
import { IoMdStar } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { displayMoney } from '../../helpers/utils';
import cartContext from '../../contexts/cart/cartContext';
import useActive from '../../hooks/useActive';


const ProductCard = (props) => {

   //const { key, item } = props;
    const { _id, images, title, description, price, quantity } = props?.data;
    console.log('product = ', props);
    const { addItem } = useContext(cartContext);
    const { active, handleActive, activeClass } = useActive(false);


    // handling Add-to-cart
    const handleAddItem = () => {
        const item = { ...props };
        addItem(item);

        handleActive(_id);

        setTimeout(() => {
            handleActive(false);
        }, 3000);
    };

    //const newPrice = displayMoney(finalPrice);
    //const oldPrice = displayMoney(originalPrice);


    return (
        <>
            <div className="card products_card">
                <figure className="products_img">
                    <Link to={`${_id}`}>
                        <img src={images[0].url} alt="product-img" />
                    </Link>
                </figure>
                <div className="products_details">
                    <span className="rating_star">
                        {
                            [...Array(quantity)].map((_, i) => <IoMdStar key={i} />)
                        }
                    </span>
                    <h3 className="products_title">
                        <Link to={`${_id}`}>{title}</Link>
                    </h3>
                    <h5 className="products_info">{description}</h5>
                    <div className="separator"></div>
                    <h2 className="products_price">
                        {price} &nbsp;
                        <small><del>{price}</del></small>
                    </h2>
                    <button
                        type="button"
                        className={`btn products_btn ${activeClass(_id)}`}
                        onClick={handleAddItem}
                    >
                        {active ? 'Added' : 'Add to cart'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProductCard;