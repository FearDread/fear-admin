import React from "react";
import MataData from "../layouts/MataData/MataData";
import { clearErrors, getAdminProducts } from "../../_store/actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layouts/loader/Loader";
import { useAlert } from "react-alert";
import HeroSlider from "./HeroSilder";
import FeaturedSlider from "../_Product/Featured";
import ProductCard from "../_Product/Card";
import Services from "../Terms/Service";
import { 
  Container,
  Col,
  Row
 } from "reactstrap";

import AnimatedHero from "../AnimatedHero/AnimatedHero";
import AnimatedBackground from "../AnimatedBackground/AnimatedBackground";
import PixleStars from "../PixleStars/PixleStars";
import TestimonialCard from "../_Testimonials/Card.jsx";
//import { getAllProducts } from "features/src/products/slice"

import { CRUD_API } from "@feardread/crud-service";

function Home() {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, result } = useSelector((state) => state.crud.list);

  React.useEffect(() => {

    //dispatch(getAdminProducts());
    dispatch(CRUD_API.all('product'));
    console.log('products? ', result)
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
              <Container className="section featured-parallax image">
              <div className="featured">
                <h2>
                  Featured Products
                </h2>
                <FeaturedSlider products={result} /> 
              </div>
              </Container>
              <Services />
              <Container>
              <h2>Trending Products</h2>
              <Row className="trending-products">
                  {result && result.map((product, idx) => (
                    idx < 6 && (
                      <Col md="3">
                      <ProductCard key={product._id} product={product} />
                      </Col>
                    )
                  ))}
              </Row>
              </Container>
              <Container>
                <TestimonialCard />
                <TestimonialCard />
                <TestimonialCard />
              </Container>

            </div>
        </>
      )}
    </>
  );
}

export default Home;
