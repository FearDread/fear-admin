import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Instagram.css";
import defaultProdImg from "../../../Assets/Images/abstract_banner_1.jpg";

const Instagram = ( products ) => {
  const { result } = useSelector((state) => state.crud.list);

  useEffect(() => {
    console.log('insta = ', products);
  }, []);
  
    return (
      <>
        <div className="instagram">
          <h2>@ E-Komix</h2>
          <div className="instagramTiles">
          {result && result.map((product) => {
              <div className="instagramtile">
                <img 
                  src={product.images ? product.images[0].url : defaultProdImg} 
                  alt="product"
                 />
              </div>
            })
          }
          </div>
        </div>
      </>
    );

};

export default Instagram;
