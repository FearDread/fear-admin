import React from "react";
import MataData from "../layouts/MataData/MataData";
import { clearErrors, getAdminProducts } from "../../_store/actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layouts/loader/Loader";
import { useAlert } from "react-alert";
import HeroSlider from "./HeroSilder";
import FeaturedSlider from "../_Product/Featured";
import ProductCard from "../_Product/Card";
import { 
  Container,
  Col,
  Row
 } from "reactstrap";

import AnimatedHero from "../AnimatedHero/AnimatedHero";
import AnimatedBackground from "../AnimatedBackground/AnimatedBackground";
import PixleStars from "../PixleStars/PixleStars";

function Home() {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  React.useEffect(() => {

    dispatch(getAdminProducts());
  }, [ dispatch ]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
          <>

          <MataData title="E-KomiX" />
          {/* <AnimatedBackground /> */}
            <div className="home-page">
              <div className="heroSlider_Home">
               {/*  <HeroSlider />; */}
                <AnimatedHero />
              </div>
              <Container>
              <div className="featured">
                <h2>
                  Featured Products
                </h2>
                {products &&
                <FeaturedSlider products={products} /> }
              </div>
              </Container>
              <Container>
              <h2>Trending Products</h2>
              <Row className="trending-products">
                  {products &&
                  products.map((product) => (
                    <Col md="3">
                    <ProductCard key={product._id} product={product} />
                    </Col>
                  ))}
              </Row>
              </Container>
            </div>
        </>
      )}
    </>
  );
}

export default Home;
