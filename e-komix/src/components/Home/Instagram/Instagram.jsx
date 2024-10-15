import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Instagram.css";
import { CRUD } from "@feardread/crud-service";

const Instagram = ( products ) => {
  //const dispatch = useDispatch();
  //const { loading, result } = useSelector((state) => state.crud.list);
  //const [products, setProducts] = useState(data);

  useEffect(() => {
    //getProductImages();
    //etProducts(data);


  }, []);
  
  console.log("products = ", products);

    return (
      <>
        <div className="instagram">
          <h2>@ E-Komix</h2>
          <div className="instagramTiles">
          {products && products.map((product) => {
              <div className="instagramtile">
                <img 
                  src={product.images ? product.images[0].url : ""} 
                  alt=""
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
