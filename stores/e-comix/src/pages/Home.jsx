import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../components/Loader/Loader";
import BannerMain from "../components/Banner/BannerMain";
import ShopItem from "../components/Product/ShopItem";
import SuperItem from "../components/Product/SuperItem";
import Services from "../components/Services/Services";
import Brands from "../components/Brands/Brands";

//import { Blog } from "../features/blogs/factory";
import { Product } from "../features/products/slice";
//import { addToWishlist } from "../features/products/slice";


const Home = () => {
  //const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, success } = useSelector( state => state.product);
  const productState = useSelector(state => state.product.data);

  useEffect(() => {
    
    dispatch(Product.fetch());

  }, [dispatch]);

  return (
    <>
      {(loading) ? (
        <>
          <main className="float-start w-100 total-body home-body mt-0">
            <section className="float-start w-100">
              <Loader />
            </section>
          </main>
        </>
      ) : (
        <>
          <BannerMain />
          <main className="float-start w-100 total-body home-body">

            <Services />

            <section className="shop-collections float-start w-100 position-relative">
              <div className="woder-women">
                <figure className="m-0">
                  <img alt="woder" src="images/wonder.svg" />
                </figure>
              </div>
              <div className="container">
                <div className="col-lg-8 ms-auto d-block">
                  <h2 className="text-center text-lg-start text-white page-haeding mt-4" data-aos="fade-up">  Shop the collection  </h2>
                  <div className="row row-cols-1 row-cols-sm-2 gy-5 g-lg-5 mt-0">


                    {productState && productState.slice(0, 4).map((item) => {
                      return (
                        <ShopItem {...item} />
                      )
                    })}

                    <div className="col">
                      <a href="/shop" className="btn comon-button mx-auto mt-5 d-table" data-aos="fade-up">  <span> <i className="fas fa-arrow-right"></i> View All Products </span> </a>
                    </div>
                  </div>
                </div>
              </div>

            </section>

            <Brands />

            <section className="super-hero-div float-start w-100 position-relative">
              <div className="eg-bg2">
                <img alt="ser" src="images/edge1-d.svg" />
              </div>
              <div className="container">

                <div className="col-lg-8">
                  <h2 className="text-center text-lg-start page-haeding mt-4" data-aos="fade-up">  Superhero Series  </h2>

                  <div className="tabs-div d-inline-block w-100" >
                    <ul className="nav nav-pills mb-3 justify-content-center justify-content-lg-start" id="pills-tab" role="tablist" data-aos="zoom-in">
                      <li className="nav-item" role="presentation">
                        <button className="nav-link active" data-bs-toggle="pill" data-bs-target="#supcoming"
                          type="button" role="tab" >Upcoming</button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button className="nav-link" data-bs-toggle="pill" data-bs-target="#sbest"
                          type="button" role="tab">Weekly Best</button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button className="nav-link" data-bs-toggle="pill" data-bs-target="#smost"
                          type="button" role="tab">Most Polpular</button>
                      </li>

                    </ul>
                    <div className="tab-content" id="pills-tabContent">
                      <div className="tab-pane fade show active" id="supcoming" role="tabpanel">
                        <div className="row row-cols-1 row-cols-sm-2 gy-5 g-lg-5 mt-0">

                          {productState && productState.slice(5, 9).map((item) => {
                            return (
                              <SuperItem {...item} />
                            )
                          })}
                        </div>
                      </div>
                      <div className="tab-pane fade" id="sbest" role="tabpanel">
                        <div className="row row-cols-1 row-cols-sm-2 gy-5 g-lg-5 mt-0">

                          {productState && productState.slice(10, 14).map((item) => {
                            return (
                              <SuperItem {...item} />
                            )
                          })}
                        </div>
                      </div>

                      <div className="col">

                        <a href="/shop" className="btn comon-button mx-auto mt-5 d-table" data-aos="fade-up">  <span> <i className="fas fa-arrow-right"></i> See More Hero </span> </a>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className="superman" data-aos="fade-up">
                <figure className="m-0">
                  <img alt="seu" src="images/superman-hero-bg.svg" />
                </figure>
              </div>
            </section>

            <section className="blogs-div float-start w-100 position-relative">
              <div className="eg-bg2">
                <img alt="ser" src="images/edge1-d.svg" />
              </div>
              <div className="spoider">
                <img alt="speic" src="images/spider.svg" />
              </div>
              <div className="container">
                <h2 className="text-center page-haeding mt-4" data-aos="fade-down">  OUR LATEST NEWS & EVENT  </h2>
                <div className="row row-cols-1 row-cols-lg-2 gy-5 g-lg-5 mt-0">
                  <div className="col">
                    <a href="index.html#" className="hilishf-blogs d-inline-block w-100" data-aos="fade-up">
                      <div className="img-figh-pic">
                        <img alt="st" src="images/blog1.png" />
                      </div>
                      <div className="blos-pos-dl">
                        <h5>  Anthology of comics by the magazine </h5>
                        <h6> By admin / Aug 25 , 2023</h6>
                      </div>
                    </a>
                  </div>
                  <div className="col">
                    <a href="index.html#" className="list-blogs-divu d-inline-block w-100" data-aos="fade-up">

                      <div className="row align-items-center gy-5 g-lg-5">
                        <div className="col-sm-4">
                          <div className="b-pic">
                            <img alt="ser" src="images/blog2.png" />
                          </div>
                        </div>
                        <div className="col-sm-8">
                          <div className="left-blogs-text">
                            <h5> Anthology of comics by the magazine </h5>
                            <h6> By admin / Aug 25 , 2023 </h6>
                            <p> It is a long established fact that a reader will be distracted.. </p>
                          </div>
                        </div>
                      </div>

                    </a>
                    <a href="index.html#" className="list-blogs-divu d-inline-block w-100" data-aos="zoom-in">

                      <div className="row align-items-center gy-5 g-lg-5">
                        <div className="col-sm-4">
                          <div className="b-pic">
                            <img alt="ser" src="images/blog3.png" />
                          </div>
                        </div>
                        <div className="col-sm-8">
                          <div className="left-blogs-text">
                            <h5> Anthology of comics by the magazine </h5>
                            <h6> By admin / Aug 25 , 2023 </h6>
                            <p> It is a long established fact that a reader will be distracted.. </p>
                          </div>
                        </div>
                      </div>

                    </a>
                    <a href="index.html#" className="list-blogs-divu d-inline-block w-100" data-aos="fade-up">

                      <div className="row align-items-center gy-5 g-lg-5">
                        <div className="col-sm-4">
                          <div className="b-pic">
                            <img alt="ser" src="images/blog4.png" />
                          </div>
                        </div>
                        <div className="col-sm-8">
                          <div className="left-blogs-text">
                            <h5> Anthology of comics by the magazine </h5>
                            <h6> By admin / Aug 25 , 2023 </h6>
                            <p> It is a long established fact that a reader will be distracted.. </p>
                          </div>
                        </div>
                      </div>

                    </a>

                  </div>
                </div>

                <a href="index.html#" className="btn comon-button mx-auto mt-5 d-table" data-aos="fade-up">  <span> <i className="fas fa-arrow-right"></i> See All Post </span> </a>

              </div>
            </section>

          </main>
        </>
      )}
    </>
  )
}

export default Home;
