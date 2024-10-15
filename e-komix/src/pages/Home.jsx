import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Banner from "../Components/Home/Banner/Banner";
import CollectionBox from "../Components/Home/Collection/CollectionBox";
import Services from "../Components/Home/Services/Services";
import Instagram from "../Components/Home/Instagram/Instagram";
import Trendy from "../Components/Home/Trendy/Trendy";
import LimitedEdition from "../Components/Home/Limited/LimitedEdition";
import DealTimer from "../Components/Home/Deal/DealTimer";
import HeroSection from "../Components/Home/Hero/HeroSection";
import Loader from "../Components/Loader/Loader";
import AnimatedHero from "../Components/AnimatedHero/AnimatedHero";

import { CRUD } from "@feardread/crud-service";

function Home () {
  const dispatch = useDispatch();
  
  const { loading, result } = useSelector((state) => state.crud.list);

  useEffect(() => {
    dispatch(CRUD.all('product'));
    console.log('res = ', result)
  }, [dispatch])


  return (
    <>
    {loading ? (
      <>
        <Loader />
      </>
    ) : (
      <>
      <AnimatedHero />
      <CollectionBox />
      <Trendy {...result} />
      <DealTimer />
      <Banner />
      <LimitedEdition />
      <Instagram {...result} />
      <Services />
    </>
    )}
    </>
  );
};

export default Home;
