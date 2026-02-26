import React, { useState } from 'react';

import HeroSection from "../components/home/v1/HeroSection";
import AdSection from "../components/home/v1/AdSection";
import InfoSection1 from "../components/home/v1/InfoSection1";
import InfoSection2 from "../components/home/v1/InfoSection2";
import FeaturedProducts from "../components/products/FeaturedProducts";
import NewArrivals from '../components/home/v1/NewArrivals';
import CategorySection from '../components/home/v1/CategorySection';
import LatestNews from '../components/home/v1/LatestNews';
import BrandSection from '../components/home/v1/BrandSection';
import AdSection2 from "../components/home/v1/AdSection2";
//import LatestNews from "../components/home/LatestNews";

const Home = () => {
  return (
    <>
      <HeroSection />

      <InfoSection1 />
      
      <AdSection2 />
      <FeaturedProducts />
     {/*  <NewArrivals /> */}
      <InfoSection2 />

      <AdSection />
    
      <LatestNews />
      { /* <CategorySection /> */}
      <BrandSection />
    </>
  );
};

export default Home;