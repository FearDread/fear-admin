import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Banner from "../Components/Home/Banner/Banner";
import CollectionBox from "../Components/Home/Collection/CollectionBox";
import Services from "../Components/Home/Services/Services";
import Trendy from "../Components/Home/Trendy/Trendy";
import LimitedEdition from "../Components/Home/Limited/LimitedEdition";
import DealTimer from "../Components/Home/Deal/DealTimer";
import Loader from "../Components/Loader/Loader";
import AnimatedHero from "../Components/AnimatedHero/AnimatedHero";
import Particles from "../Components/Particles/Particles";

import { cruds } from "@feardread/crud-service";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, result } = useSelector((state) => state.crud.list);
  const getTrendyProducts = () => {
    dispatch(cruds.list('product', 'trendy'));
  }

  useEffect(() => {

    getTrendyProducts();

  }, []);

  return (
    <>
    {loading ? (
      <>
        <Loader />
      </>
    ) : (
      <>
      <Particles />
      <CollectionBox />
      <Trendy products={result} />
      <DealTimer />
      <Banner />
      <LimitedEdition products={result} />
      <Services />
    </>
    )}
    </>
  );
};

export default Home;
