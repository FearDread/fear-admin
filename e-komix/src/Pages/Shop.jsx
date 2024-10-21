import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ShopDetails from "../Components/Shop/ShopDetails/ShopDetails";
import { cruds } from "@feardread/crud-service";
import Loader from "../Components/Loader/Loader";

const Shop = () => {
  const dispatch = useDispatch();
  const { loading, result } = useSelector((state) => state.crud.list);

  const getTrendyProducts = () => {
    dispatch(cruds.all('product'));
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
        <ShopDetails {...result} />
      </>
    )}
  </>
  )
};

export default Shop;
