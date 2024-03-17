import React from "react";
import "./Home.css";
import ProductCard from "./ProductCard";
import MataData from "../layouts/MataData/MataData";
import { clearErrors, getAdminProducts } from "../../_store/actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layouts/loader/Loader";
import { useAlert } from "react-alert";
import HeroSlider from "./HeroSilder";
import FeaturedSlider from "./FeatureSlider";
import { 
  Container
 } from "reactstrap";


function Home() {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  React.useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors);
    }

    dispatch(getAdminProducts());
  }, [dispatch, error, alert]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
          <>
            <MataData title="E-KomiX" />
            <div className="Home_Page">
              <div className="heroSlider_Home">
                <HeroSlider />;
              </div>
              <Container>
              <div className="feature" style={{ marginTop: "2.7rem" }}>
                <h2>
                  Featured Products
                </h2>
                {products &&
                <FeaturedSlider products={products} /> }
              </div>
              </Container>
              <Container>
              <h2 className="trending_heading">Trending Products</h2>
              <div className="trending-products">
              {products && <FeaturedSlider products={products} />}
                { /* products &&
                  products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))*/}
              </div>
              </Container>
            </div>
        </>
      )}
    </>
  );
}

export default Home;
