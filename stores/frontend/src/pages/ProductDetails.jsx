import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdditionalInfo from "../components/Product/AdditonInfo/AdditionalInfo";
import Product from "../components/Product/ProductMain/Product";
import LimitedEdition from "../components/Home/Limited/LimitedEdition";
import Container from "../components/Common/Container";
import RelatedProducts from "../components/Product/RelatedProducts/RelatedProducts";
import { cruds } from "@feardread/crud-service";
import Loader from "../components/Loader/Loader";


const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const relatedProducts = useSelector((state) => state?.crud?.list);
  const { loading, result } = useSelector((state) => state?.crud?.read);

  useEffect(() => {

    dispatch(cruds.read('product', id));
    dispatch(cruds.list('product'));

    console.log('related = ', relatedProducts);
  }, [dispatch, id])

  return (
    <>
      {loading ? (
      <>
        <Loader />
      </>
    ) : (
      <>
      <Container></Container>
        <div className="product-details">
          <Product product={result} />
          <AdditionalInfo />
          <RelatedProducts data={result} />
        </div>
      </>
    )};
  </>
  )
};

export default ProductDetails;
