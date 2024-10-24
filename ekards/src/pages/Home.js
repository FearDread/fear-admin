import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import HeroSlider from '../components/sliders/HeroSlider';
import FeaturedSlider from '../components/sliders/FeaturedSlider';
import SectionsHead from '../components/common/SectionsHead';
import TopProducts from '../components/product/TopProducts';
import Services from '../components/common/Services';
import {getAllProducts, getAdminProducts} from "../features/products/slice";
//import { CRUD_API } from "@feardread/crud-service";


const Home = () => {
    
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.product.products);
    //const { loading, result } = useSelector((state) => state.crud.list);
    //const isLoading = useSelector((state) => state?.product?.isLoading);
    //dispatch(getAllProducts());
    useEffect(() => {
        //dispatch(getAllProducts());
        //dispatch(CRUD_API.all('product'));
        console.log('prods = ', products);
    }, [dispatch]);
    
    return (
        <main>
            <section id="hero">
                <HeroSlider />
            </section>

            <section id="featured" className="section">
                <div className="container">
                    <SectionsHead heading="Featured Products" />
                    <FeaturedSlider />
                </div>
            </section>

            <section id="products" className="section">
                <div className="container">
                    <SectionsHead heading="Top Products" />
                    <TopProducts {...products} />
                </div>
            </section>

            <Services />
        </main>
    );
};

export default Home;;