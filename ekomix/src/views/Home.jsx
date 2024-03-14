import React from "react";

// { clearErrors, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
//import Loader from "../layouts/loader/Loader";
import { useAlert } from "react-alert";
import { Carousel } from "components/Carousel";


function Home() {

  const alert = useAlert();

  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  React.useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors);
    }
    //dispatch(getProduct());
  }, [dispatch, error, alert]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <>
            <div className="wrapper">
              <div >
                <Carousel />;
              </div>

              <div className="feature" style={{ marginTop: "2.7rem" }}>
                <h2
                  style={{
                    textAlign: "center",
                    fontFamily: `"Archivo", sans-serif`,
                    fontWeight: "800",
                  }}
                >
                  Featured Products
                </h2>
                {products &&
             
                
                       <FeaturedSlider   products ={products}/> }
                  
                 
              
              </div>

              <h2 className="trending_heading">Trending Products</h2>

              <div className="trending-products">
                {products &&
                  products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
              </div>
            </div>
          </>
        </>
      )}
    </>
  );
}

export default Home;
