 import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BlogCard from "../components/Cards/BlogCard";
import Container from "../components/Common/Container";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Autoplay } from "swiper/modules";
import { addToWishlist } from "../features/products/productSlilce";
import AnimatedHero from "../components/AnimatedHero/AnimatedHero";
import Services from "../components/Home/Services/Services";
import LimitedCard from "../components/Product/LimitedCard/LimitedCard";
import LimitedEdition from "../components/Home/Limited/LimitedEdition";
import DealTimer from "../components/Home/Deal/DealTimer";
import Loader from "../components/Loader/Loader";
import { cruds, auth, cart } from "@feardread/crud-service";

const Home = () => {
  const blogState = useSelector((state) => state?.blog?.blog);
  const { result, loading } = useSelector((state) => state.crud.product);
  const productState = useSelector((state) => state?.products);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getblogs();
    getProducts();
  }, []);
  const getblogs = () => {
    dispatch(cruds.all("blog"));
    //dispatch(getAllBlogs());
  };

  const getProducts = () => {
    dispatch(cruds.all("product"))
    //dispatch(getAllProducts());
  };

  const addToWish = (id) => {
    //alert(id);
    dispatch(addToWishlist(id));
  };
  return (
    <>
    {loading ? (
      <>
        <Loader />
      </>
    ) : (
    <>
    <AnimatedHero />
      <Container class1="featured-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Featured Collection</h3>
          </div>
          <Swiper
            slidesPerView={4}
            slidesPerGroup={4}
            spaceBetween={30}
            loop={true}
            navigation={{
              nextEl: ".image-swiper-button-next",
              prevEl: ".image-swiper-button-prev",
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            modules={[Navigation, Autoplay]}>
            {result && result.map((item, index) => {
              return (
                <SwiperSlide key={item._id}>
                  <LimitedCard key={index} id={item.id} product={item} />
                </SwiperSlide>
              )
            })}
            </Swiper>
        </div>
      </Container>
      
      <DealTimer />

      <Container class1="featured-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Limited Collection</h3>
            <LimitedEdition products={result} />
          </div>
        </div>
      </Container>


      <Container class1="blog-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Our Latest Blogs</h3>
          </div>
        </div>
        <div className="row">
          {blogState &&
            blogState?.map((item, index) => {
              if (index < 4) {
                return (
                  <div className="col-3 " key={index}>
                    <BlogCard
                      id={item?._id}
                      title={item?.title}
                      description={item?.description}
                      image={item?.images[0]?.url}
                      date={moment(item?.createdAt).format(
                        "MMMM Do YYYY, h:mm a"
                      )}
                    />
                  </div>
                );
              }
            })}
        </div>
      </Container>
      
      <Services />
    </>
    )}
  </>
  );
};

export default Home;
