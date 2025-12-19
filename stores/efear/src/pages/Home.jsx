import React, { useState } from 'react';

import HeroSection from "../components/home/HeroSection";
import AdSection from "../components/home/AdSection";
import InfoSection from "../components/home/InfoSection";
import FeaturedProducts from "../components/products/FeaturedProducts";

import Section2 from './components/home/Section2';
import Section3 from '../components/home/Section3';
import Section4 from '../components/home/Section4';
import Section5 from '../components/home/Section5';
import Section6 from '../components/home/Section6';
import Section7 from '../components/home/Section7';
import Section8 from '../components/home/Section8';
import Section9 from '../components/home/Section9';
import Section10 from '../components/home/Section10';
import Section11 from '../components/home/Section11';

const Home = () => {
  return (
    <>
    {/* 
      <HeroSection />

      <InfoSection />

      <FeaturedProducts />

      <AdSection />
      */}
        <Section2 />
        <Section3 />
        <Section4 />
        <Section5 />
        <Section6 />
        <Section7 />
        <Section8 />
        <Section9 />
        <Section10 />
        <Section11 />
    
    </>
  );
};

export default Home;