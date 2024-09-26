import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import useActive from '../../hooks/useActive';
import productsData from '../../data/productsData';
import ProductCard from './ProductCard';
import { getAllProducts, addToWishlist } from "../../features/products/slice";


const TopProducts = () => {
    
    
    const dispatch = useDispatch();
    //const [allprods, setProducts] = useState(productsData);
    //const { activeClass, handleActive } = useActive(0);
    const products = useSelector((state) => state?.product?.products);
    const isLoading = useSelector((state) => state?.product?.isLoading);


    const getProducts = () => {
      dispatch(getAllProducts());
    };
  
    const addToWish = (id) => {
      //alert(id);
      dispatch(addToWishlist(id));
    };
    

    // making a unique set of product's category
    const getProductCategory = ( data ) => {
        return [
            'All',
            ...new Set(data.map(item => item.category))
        ];
    }
    

    // handling product's filtering
    const handleProducts = (category, i) => {
        if (category === 'All') {
            //setProducts(productsData);
            handleActive(i);
            return;
        }

        const filteredProducts = products.filter(item => item.category === category);
        //setProducts(filteredProducts);
        handleActive(i);
    };

    useEffect(() => {

      }, [dispatch]);


      //getProducts();
    return (
        <>
        {isLoading ? (
                         <div className="card products_card browse_card">
                         <Link to="/all-products">
                             Browse All <br /> Products <BsArrowRight />
                         </Link>
                     </div>
        ) : (

        <>
            <div className="products_filter_tabs">
                <ul className="tabs">
                    { getProductCategory(products).map((item, i) => (
                            <li
                                key={i}
                                className={`tabs_item ${activeClass(i)}`}
                                onClick={() => handleProducts(item, i)}
                            >
                                {item}
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className="wrapper products_wrapper">
                {products && products?.map((item) => {
                        <ProductCard data={item} />
                    })
                }
                <div className="card products_card browse_card">
                    <Link to="/all-products">
                        Browse All <br /> Products <BsArrowRight />
                    </Link>
                </div>
            </div>
        </>
      )}
      </>
    );
  }

export default TopProducts;