import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Instagram.css";
import { CRUD } from "@feardread/crud-service";

const Instagram = () => {
  const dispatch = useDispatch();
  const { loading, result } = useSelector((state) => state.crud.list);
  const [products, setProducts] = useState(result);

  const getProductImages = () => {
    dispatch(CRUD.all('product'));
    setProducts(result);
  }

  useEffect(() => {
    getProductImages();
    console.log("products = ", result);
  }, [dispatch]);
  
  return (
    <>
    {loading ? ( 
      <>
      <div className="instagram">
      <h2>@ E-Komix</h2>
      </div>
      </>
    ) : (
    <>
      <div className="instagram">
        <h2>@ E-Komix</h2>
        <div className="instagramTiles">
        {products && products.map((product) => {
            <div className="instagramtile">
              <img 
              src={product.images[0] ? product.images[0].url : ""} 
              alt=""
               />
            </div>
          })
        }
        </div>
      </div>
    </>
    )}
  </>
  );
};

export default Instagram;
