import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import HeroSlider from '../components/sliders/HeroSlider';
import FeaturedSlider from '../components/sliders/FeaturedSlider';
import SectionsHead from '../components/common/SectionsHead';
import TopProducts from '../components/product/TopProducts';
import Services from '../components/common/Services';
import {getAllProducts} from "../features/products/slice";


const Home = () => {
    
    const dispatch = useDispatch();
    const products = useSelector((state) => state?.product?.products);
    const isLoading = useSelector((state) => state?.product?.isLoading);

    useEffect(() => {
        console.log("is loading = ", isLoading);
        if (!isLoading) {

        }
        //dispatch(getAllProducts());
        console.log("products = ", products);
    }, []);
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
                    <TopProducts />
                </div>
            </section>

            <Services />
        </main>
    );
};

export default Home;;