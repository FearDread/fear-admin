import React, { useState } from 'react';

import HeroSlider from "../components/home/HeroSection";
import InfoSection from "../components/home/InfoSection";
import FeaturedProducts from "../components/products/Featured";

const Home = () => {
  return (
    <>
      <HeroSlider />

      <InfoSection />

      <FeaturedProducts />


    
    </>
  );
};

export default Home;