import React, { useState } from 'react';

import HeroSection from "../components/home/HeroSection";
import AdSection from "../components/home/AdSection";
import InfoSection from "../components/home/InfoSection";
import FeaturedProducts from "../components/products/FeaturedProducts";

const Home = () => {
  return (
    <>
      <HeroSection />

      <InfoSection />

      <FeaturedProducts />

      <AdSection />
    
    </>
  );
};

export default Home;