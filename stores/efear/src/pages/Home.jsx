import React, { useState } from 'react';

import HeroSection from "../components/home/HeroSection";
import AdSection from "../components/home/AdSection";
import InfoSection1 from "../components/home/InfoSection1";
import InfoSection2 from "../components/home/InfoSection2";
import FeaturedProducts from "../components/products/FeaturedProducts";
import NewArrivals from '../components/home/NewArrivals';
import CategorySection from '../components/home/CategorySection';
import LatestNews from '../components/home/LatestNews';
import BrandSection from '../components/home/BrandSection';
import AdSection2 from "../components/home/AdSection2";

const Home = () => {
  return (
    <>
      <HeroSection />

      <InfoSection1 />
      
      <AdSection2 />

      <FeaturedProducts />

      <InfoSection2 />

      <NewArrivals />

      <CategorySection />

      <BrandSection />
    
      <AdSection />

    </>
  );
};

export default Home;