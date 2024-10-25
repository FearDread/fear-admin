import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdditionalInfo from "../Components/Product/AdditonInfo/AdditionalInfo";
import Product from "../Components/Product/ProductMain/Product";
import LimitedEdition from "../Components/Home/Limited/LimitedEdition";
import RelatedProducts from "../Components/Product/RelatedProducts/RelatedProducts";
import { cruds } from "@feardread/crud-service";
import Loader from "../Components/Loader/Loader";


const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, result } = useSelector((state) => state.crud.read);

  useEffect(() => {

    dispatch(cruds.read('product', id));
    dispatch(cruds.list('product'));

  }, [dispatch, id])

  return (
    <>
      {loading ? (
      <>
        <Loader />
      </>
    ) : (
      <>
        <Product product={result} />
        <AdditionalInfo />
        <LimitedEdition products={result} />
        { /*<RelatedProducts /> */ }
      </>
    )};
  </>
  )
};

export default ProductDetails;
