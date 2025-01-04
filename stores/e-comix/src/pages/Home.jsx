import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {

  return (
    <>
      <main className="float-start w-100 total-body home-body">
        <section className="top-sectionk float-start w-100">
          <div className="container">
            <div className="row row-cols-1 row-cols-lg-3 gy-5 g-lg-5">
              <div className="col position-relative">
                <div className="comon-items-con position-relative d-flex align-items-center">
                  <figure className="m-0">
                    <img alt="sert" src="images/world-icon.png" />
                  </figure>
                  <div className="rightextr">
                    <h5> Worldwide  Shipping </h5>
                    <p> International Shipping Available </p>
                  </div>
                </div>
                <div className="comiuy-after"></div>
              </div>


              <div className="col position-relative" data-aos="fade-up">
                <div className="comon-items-con position-relative d-flex align-items-center" >
                  <figure className="m-0">
                    <img alt="sert" src="images/secure.png" />
                  </figure>
                  <div className="rightextr">
                    <h5> Secure  Payment </h5>
                    <p> Guarantee Secure Online Payment </p>
                  </div>
                </div>
                <div className="comiuy-after"></div>
              </div>


              <div className="col position-relative">
                <div className="comon-items-con position-relative d-flex align-items-center">
                  <figure className="m-0">
                    <img alt="sert" src="images/online-supot.png" />
                  </figure>
                  <div className="rightextr">
                    <h5> Online Support </h5>
                    <p> Any Time Support our Team </p>
                  </div>
                </div>
                <div className="comiuy-after"></div>
              </div>



            </div>
          </div>
        </section>

        <section className="serices-div float-start w-100 position-relative">
          <div className="cloos pulse">
            <img alt="cool" src="images/cool.png" />
          </div>
          <div className="container">
            <h6 className="text-center sub-heading" data-aos="fade-down"> Comic </h6>
            <h2 className="text-center page-haeding mt-4" data-aos="fade-up">  Find Your Series  </h2>
            <div className="tabs-div d-inline-block w-100">
              <ul className="nav nav-pills mb-3 justify-content-center" role="tablist">
                <li className="nav-item" role="presentation">
                  <button className="nav-link active" data-bs-toggle="pill" data-bs-target="#today"
                    type="button" role="tab" >Today's Top</button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" data-bs-toggle="pill" data-bs-target="#new-release"
                    type="button" role="tab">New release</button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" data-bs-toggle="pill" data-bs-target="#most-popular"
                    type="button" role="tab">Most Popular</button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" data-bs-toggle="pill" data-bs-target="#upcoming"
                    type="button" role="tab">Upcoming</button>
                </li>
              </ul>
              <div className="tab-content">
                <div className="tab-pane fade show active" id="today" role="tabpanel">
                  <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 gy-5 g-lg-5 mt-0">
                    <div className="col">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/se01.png" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>

                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/se2.png" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>


                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/b5197a7a-image-22.jpg" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>


                    <div className="col">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/se3.png" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>

                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/comics-news.jpg" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>


                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/360_F_117750219_dEXN5T0ENx62pMVgADlHKDSy334VpKPJ.jpg" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="tab-pane fade" id="new-release" role="tabpanel">
                  <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-5 mt-0">
                    <div className="col">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/se01.png" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>

                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/se2.png" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>


                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/b5197a7a-image-22.jpg" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>


                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/se3.png" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>

                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/comics-news.jpg" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>


                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/360_F_117750219_dEXN5T0ENx62pMVgADlHKDSy334VpKPJ.jpg" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="tab-pane fade" id="most-popular" role="tabpanel">
                  <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-5 mt-0">
                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/se01.png" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>

                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/se2.png" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>


                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/b5197a7a-image-22.jpg" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>


                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/se3.png" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>

                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/comics-news.jpg" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>


                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/360_F_117750219_dEXN5T0ENx62pMVgADlHKDSy334VpKPJ.jpg" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="tab-pane fade" id="upcoming" role="tabpanel">
                  <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-5 mt-0">
                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/se01.png" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>

                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/se2.png" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>


                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/b5197a7a-image-22.jpg" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>


                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/se3.png" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>

                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/comics-news.jpg" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>


                    <div className="col" data-aos="fade-up">
                      <a href="index.html#" className="comon-items d-inline-block w-100 position-relative overflow-hidden">
                        <div className="img-box-div">
                          <img alt="srt" src="images/360_F_117750219_dEXN5T0ENx62pMVgADlHKDSy334VpKPJ.jpg" />
                        </div>
                        <div className="content-section">
                          <h5> The Vitals: True EMS #0 </h5>
                          <p> Ryan, Bachs </p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <a href="index.html#" className="btn comon-button mx-auto d-table" data-aos="fade-up"> <span> Explore more </span> </a>
          </div>

          <div className="eg-bg">
            <img alt="ser" src="images/edge1-d.svg" />
          </div>
        </section>

        <section className="shop-collections float-start w-100 position-relative">
          <div className="lool pulse">
            <img alt="loo" src="images/lol.png" />
          </div>
          <div className="woder-women">
            <figure className="m-0">
              <img alt="woder" src="images/wonder.svg" />
            </figure>
          </div>
          <div className="container">

            <div className="col-lg-8 ms-auto d-block">
              <h2 className="text-center text-lg-start text-white page-haeding mt-4" data-aos="fade-up">  Shop the collection  </h2>
              <div className="row row-cols-1 row-cols-sm-2 gy-5 g-lg-5 mt-0">
                <div className="col">
                  <a href="index.html#" className="shop-items overflow-hidden d-inline-block w-100 position-relative" data-aos="zoom-in">
                    <div className="img-box-div position-relative">
                      <img alt="srt" src="images/b5197a7a-image-22.jpg" />
                      <span className="off">10% off</span>
                    </div>
                    <div className="details-shopi">
                      <div className="row align-items-center">
                        <div className="col-8">
                          <h5> Integer vulputate.. </h5>
                        </div>
                        <div className="col-4">
                          <h3> $30 <span> $50 </span> </h3>
                        </div>
                      </div>

                    </div>

                  </a>
                </div>
                <div className="col">
                  <a href="index.html#" className="shop-items overflow-hidden d-inline-block w-100 position-relative" data-aos="zoom-in">
                    <div className="img-box-div position-relative">
                      <img alt="srt" src="images/ghui.jpg" />
                      <span className="off">10% off</span>
                    </div>
                    <div className="details-shopi">
                      <div className="row align-items-center">
                        <div className="col-8">
                          <h5> Fusce molestie.. </h5>
                        </div>
                        <div className="col-4">
                          <h3> $30 <span> $50 </span> </h3>
                        </div>
                      </div>

                    </div>

                  </a>
                </div>

                <div className="col">
                  <a href="index.html#" className="shop-items overflow-hidden d-inline-block w-100 position-relative" data-aos="zoom-in">
                    <div className="img-box-div position-relative">
                      <img alt="srt" src="images/krish.jpg" />
                      <span className="off">10% off</span>
                    </div>
                    <div className="details-shopi">
                      <div className="row align-items-center">
                        <div className="col-8">
                          <h5> Figures & Statues.. </h5>
                        </div>
                        <div className="col-4">
                          <h3> $30 <span> $50 </span> </h3>
                        </div>
                      </div>

                    </div>

                  </a>
                </div>
                <div className="col">
                  <a href="index.html#" className="btn comon-button mx-auto mt-5 d-table" data-aos="fade-up">  <span> <i className="fas fa-arrow-right"></i> View All Products </span> </a>
                </div>
              </div>
            </div>
          </div>

        </section>

        <section className="super-hero-div float-start w-100 position-relative">
          <div className="eg-bg2">
            <img alt="ser" src="images/edge1-d.svg" />
          </div>
          <div className="boom hithere">
            <img alt="so" src="images/boom.png" />
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

                      <div className="col">
                        <a href="index.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-up">
                          <div className="img-box-div position-relative">
                            <img alt="srt" src="images/super1.png" />
                            <span className="off">10% off</span>
                          </div>
                          <div className="details-shopi">
                            <div className="row align-items-center">
                              <div className="col-8">
                                <h5 className="text-white"> Figures & Statues..
                                  <span className="d-block"> Das deutschsprachige </span>
                                </h5>
                              </div>
                              <div className="col-4">
                                <h3 className="text-center"> $30 <span className="d-block"> $50 </span> </h3>
                              </div>
                            </div>

                          </div>

                        </a>
                      </div>

                      <div className="col">
                        <a href="index.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-up">
                          <div className="img-box-div position-relative">
                            <img alt="srt" src="images/super2.png" />
                            <span className="off">10% off</span>
                          </div>
                          <div className="details-shopi">
                            <div className="row align-items-center">
                              <div className="col-8">
                                <h5 className="text-white"> Ultimate Spiderman
                                  <span className="d-block"> Das deutschsprachige </span>
                                </h5>
                              </div>
                              <div className="col-4">
                                <h3 className="text-center"> $30 <span className="d-block"> $50 </span> </h3>
                              </div>
                            </div>

                          </div>

                        </a>
                      </div>

                      <div className="col">
                        <a href="index.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-up">
                          <div className="img-box-div position-relative">
                            <img alt="srt" src="images/super3.png" />
                            <span className="off">10% off</span>
                          </div>
                          <div className="details-shopi">
                            <div className="row align-items-center">
                              <div className="col-8">
                                <h5 className="text-white"> Figures & Statues..
                                  <span className="d-block"> Das deutschsprachige </span>
                                </h5>
                              </div>
                              <div className="col-4">
                                <h3 className="text-center"> $30 <span className="d-block"> $50 </span> </h3>
                              </div>
                            </div>

                          </div>

                        </a>
                      </div>

                      <div className="col">
                        <a href="index.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-up">
                          <div className="img-box-div position-relative">
                            <img alt="srt" src="images/super5.png" />
                            <span className="off">10% off</span>
                          </div>
                          <div className="details-shopi">
                            <div className="row align-items-center">
                              <div className="col-8">
                                <h5 className="text-white"> Dragon Ball Z
                                  <span className="d-block"> Das deutschsprachige </span>
                                </h5>
                              </div>
                              <div className="col-4">
                                <h3 className="text-center"> $30 <span className="d-block"> $50 </span> </h3>
                              </div>
                            </div>

                          </div>

                        </a>
                      </div>

                      <div className="col">
                        <a href="index.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-up">
                          <div className="img-box-div position-relative">
                            <img alt="srt" src="images/super4.png" />
                            <span className="off">10% off</span>
                          </div>
                          <div className="details-shopi">
                            <div className="row align-items-center">
                              <div className="col-8">
                                <h5 className="text-white"> Batman Wayne
                                  <span className="d-block"> Das deutschsprachige </span>
                                </h5>
                              </div>
                              <div className="col-4">
                                <h3 className="text-center"> $30 <span className="d-block"> $50 </span> </h3>
                              </div>
                            </div>

                          </div>

                        </a>
                      </div>
                      <div className="col">

                        <a href="index.html#" className="btn comon-button mx-auto mt-5 d-table" data-aos="fade-up">  <span> <i className="fas fa-arrow-right"></i> See More Hero </span> </a>
                      </div>

                    </div>
                  </div>
                  <div className="tab-pane fade" id="sbest" role="tabpanel">
                    <div className="row row-cols-1 row-cols-sm-2 gy-5 g-lg-5 mt-0">

                      <div className="col">
                        <a href="index.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-up">
                          <div className="img-box-div position-relative">
                            <img alt="srt" src="images/b5197a7a-image-22.jpg" />
                            <span className="off">10% off</span>
                          </div>
                          <div className="details-shopi">
                            <div className="row align-items-center">
                              <div className="col-8">
                                <h5 className="text-white"> Figures & Statues..
                                  <span className="d-block"> Das deutschsprachige </span>
                                </h5>
                              </div>
                              <div className="col-4">
                                <h3 className="text-center"> $30 <span className="d-block"> $50 </span> </h3>
                              </div>
                            </div>

                          </div>

                        </a>
                      </div>

                      <div className="col">
                        <a href="index.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-up">
                          <div className="img-box-div position-relative">
                            <img alt="srt" src="images/b5197a7a-image-22.jpg" />
                            <span className="off">10% off</span>
                          </div>
                          <div className="details-shopi">
                            <div className="row align-items-center">
                              <div className="col-8">
                                <h5 className="text-white"> Figures & Statues..
                                  <span className="d-block"> Das deutschsprachige </span>
                                </h5>
                              </div>
                              <div className="col-4">
                                <h3 className="text-center"> $30 <span className="d-block"> $50 </span> </h3>
                              </div>
                            </div>

                          </div>

                        </a>
                      </div>

                      <div className="col">
                        <a href="index.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-up">
                          <div className="img-box-div position-relative">
                            <img alt="srt" src="images/b5197a7a-image-22.jpg" />
                            <span className="off">10% off</span>
                          </div>
                          <div className="details-shopi">
                            <div className="row align-items-center">
                              <div className="col-8">
                                <h5 className="text-white"> Figures & Statues..
                                  <span className="d-block"> Das deutschsprachige </span>
                                </h5>
                              </div>
                              <div className="col-4">
                                <h3 className="text-center"> $30 <span className="d-block"> $50 </span> </h3>
                              </div>
                            </div>

                          </div>

                        </a>
                      </div>

                      <div className="col">
                        <a href="index.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-up">
                          <div className="img-box-div position-relative">
                            <img alt="srt" src="images/b5197a7a-image-22.jpg" />
                            <span className="off">10% off</span>
                          </div>
                          <div className="details-shopi">
                            <div className="row align-items-center">
                              <div className="col-8">
                                <h5 className="text-white"> Figures & Statues..
                                  <span className="d-block"> Das deutschsprachige </span>
                                </h5>
                              </div>
                              <div className="col-4">
                                <h3 className="text-center"> $30 <span className="d-block"> $50 </span> </h3>
                              </div>
                            </div>

                          </div>

                        </a>
                      </div>

                      <div className="col">
                        <a href="index.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-up">
                          <div className="img-box-div position-relative">
                            <img alt="srt" src="images/b5197a7a-image-22.jpg" />
                            <span className="off">10% off</span>
                          </div>
                          <div className="details-shopi">
                            <div className="row align-items-center">
                              <div className="col-8">
                                <h5 className="text-white"> Figures & Statues..
                                  <span className="d-block"> Das deutschsprachige </span>
                                </h5>
                              </div>
                              <div className="col-4">
                                <h3 className="text-center"> $30 <span className="d-block"> $50 </span> </h3>
                              </div>
                            </div>

                          </div>

                        </a>
                      </div>
                      <div className="col">

                        <a href="index.html#" className="btn comon-button mx-auto mt-5 d-table" data-aos="fade-up">  <span> <i className="fas fa-arrow-right"></i> See More Hero </span> </a>
                      </div>

                    </div>
                  </div>
                  <div className="tab-pane fade" id="smost" role="tabpanel">
                    <div className="row row-cols-1 row-cols-sm-2 gy-5 g-lg-5 mt-0">

                      <div className="col">
                        <a href="index.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-up">
                          <div className="img-box-div position-relative">
                            <img alt="srt" src="images/b5197a7a-image-22.jpg" />
                            <span className="off">10% off</span>
                          </div>
                          <div className="details-shopi">
                            <div className="row align-items-center">
                              <div className="col-8">
                                <h5 className="text-white"> Figures & Statues..
                                  <span className="d-block"> Das deutschsprachige </span>
                                </h5>
                              </div>
                              <div className="col-4">
                                <h3 className="text-center"> $30 <span className="d-block"> $50 </span> </h3>
                              </div>
                            </div>

                          </div>

                        </a>
                      </div>

                      <div className="col">
                        <a href="index.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-up">
                          <div className="img-box-div position-relative">
                            <img alt="srt" src="images/b5197a7a-image-22.jpg" />
                            <span className="off">10% off</span>
                          </div>
                          <div className="details-shopi">
                            <div className="row align-items-center">
                              <div className="col-8">
                                <h5 className="text-white"> Figures & Statues..
                                  <span className="d-block"> Das deutschsprachige </span>
                                </h5>
                              </div>
                              <div className="col-4">
                                <h3 className="text-center"> $30 <span className="d-block"> $50 </span> </h3>
                              </div>
                            </div>

                          </div>

                        </a>
                      </div>

                      <div className="col">
                        <a href="index.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-up">
                          <div className="img-box-div position-relative">
                            <img alt="srt" src="images/b5197a7a-image-22.jpg" />
                            <span className="off">10% off</span>
                          </div>
                          <div className="details-shopi">
                            <div className="row align-items-center">
                              <div className="col-8">
                                <h5 className="text-white"> Figures & Statues..
                                  <span className="d-block"> Das deutschsprachige </span>
                                </h5>
                              </div>
                              <div className="col-4">
                                <h3 className="text-center"> $30 <span className="d-block"> $50 </span> </h3>
                              </div>
                            </div>

                          </div>

                        </a>
                      </div>

                      <div className="col">
                        <a href="index.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-up">
                          <div className="img-box-div position-relative">
                            <img alt="srt" src="images/b5197a7a-image-22.jpg" />
                            <span className="off">10% off</span>
                          </div>
                          <div className="details-shopi">
                            <div className="row align-items-center">
                              <div className="col-8">
                                <h5 className="text-white"> Figures & Statues..
                                  <span className="d-block"> Das deutschsprachige </span>
                                </h5>
                              </div>
                              <div className="col-4">
                                <h3 className="text-center"> $30 <span className="d-block"> $50 </span> </h3>
                              </div>
                            </div>

                          </div>

                        </a>
                      </div>

                      <div className="col">
                        <a href="index.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-up">
                          <div className="img-box-div position-relative">
                            <img alt="srt" src="images/b5197a7a-image-22.jpg" />
                            <span className="off">10% off</span>
                          </div>
                          <div className="details-shopi">
                            <div className="row align-items-center">
                              <div className="col-8">
                                <h5 className="text-white"> Figures & Statues..
                                  <span className="d-block"> Das deutschsprachige </span>
                                </h5>
                              </div>
                              <div className="col-4">
                                <h3 className="text-center"> $30 <span className="d-block"> $50 </span> </h3>
                              </div>
                            </div>

                          </div>

                        </a>
                      </div>
                      <div className="col">

                        <a href="index.html#" className="btn comon-button mx-auto mt-5 d-table" data-aos="fade-up">  <span> <i className="fas fa-arrow-right"></i> See More Hero </span> </a>
                      </div>

                    </div>
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

        <section className="join-div02 float-start w-100 position-relative">
          <div className="container">
            <div className="join-serc-divu w-100 text-center" data-aos="fade-down">

              <h2 className="text-white col-lg-8 mx-auto"> Want to readers and listeners see Your digital comics? Join this team! </h2>
              <p> We Strongly Believe That our team support & Drive You. </p>
              <a href="index.html#" className="btn comon-button mx-auto mt-5 d-table">  <span> <i className="far fa-gem"></i> Join Now </span> </a>
            </div>

            <figure className="m-0 boy-img" data-aos="fade-up">
              <img alt="boy" src="images/join-boy.svg" />
            </figure>

          </div>

          <div className="eg-bg">
            <img alt="ser" src="images/edge1-d.svg" />
          </div>

        </section>

        <section className="testmonsaosl-div float-start w-100 position-relative">
          <div className="woo pulse">
            <img alt="wo" src="images/wow.svg" />
          </div>
          <div className="container">
            <h6 className="text-center sub-heading" data-aos="fade-down"> Testimonial </h6>
            <h2 className="text-center page-haeding mt-4" data-aos="fade-up">  Few word form our community  </h2>
            <div className="slider-divu owl-carousel owl-theme">
              <div className="items-slider-txeti position-relative d-block w-100">
                <div className="text-box d-inline-block w-100 position-relative">
                  <p> It is a long established fact that a reader will be distracted by the readable content of a
                    page when looking at its layout. The point of using Lorem Ipsum.</p>
                </div>
                <div className="userid d-flex align-items-center mt-4">
                  <figure className="m-0">
                    <img alt="ser" src="images/test1.png" />
                  </figure>
                  <div className="name-d ms-4">
                    <h5> James Robert
                      <span className="d-block"> Creative director, NBC</span>
                    </h5>

                  </div>
                </div>
              </div>

              <div className="items-slider-txeti position-relative d-block w-100">
                <div className="text-box d-inline-block w-100 position-relative">
                  <p> It is a long established fact that a reader will be distracted by the readable content of a
                    page when looking at its layout. The point of using Lorem Ipsum.</p>
                </div>
                <div className="userid d-flex align-items-center mt-4">
                  <figure className="m-0">
                    <img alt="ser" src="images/testimonials-1-1.jpg" />
                  </figure>
                  <div className="name-d ms-4">
                    <h5> James Robert
                      <span className="d-block"> Creative director, NBC</span>
                    </h5>

                  </div>
                </div>
              </div>


              <div className="items-slider-txeti position-relative d-block w-100">
                <div className="text-box d-inline-block w-100 position-relative">
                  <p> It is a long established fact that a reader will be distracted by the readable content of a
                    page when looking at its layout. The point of using Lorem Ipsum.</p>
                </div>
                <div className="userid d-flex align-items-center mt-4">
                  <figure className="m-0">
                    <img alt="ser" src="images/manages-st2.jpg" />
                  </figure>
                  <div className="name-d ms-4">
                    <h5> Smith Robert
                      <span className="d-block"> Creative director, NBC</span>
                    </h5>

                  </div>
                </div>
              </div>


              <div className="items-slider-txeti position-relative d-block w-100">
                <div className="text-box d-inline-block w-100 position-relative">
                  <p> It is a long established fact that a reader will be distracted by the readable content of a
                    page when looking at its layout. The point of using Lorem Ipsum.</p>
                </div>
                <div className="userid d-flex align-items-center mt-4">
                  <figure className="m-0">
                    <img alt="ser" src="images/tim-hufner-9qBSeAN9vps-unsplash.jpg" />
                  </figure>
                  <div className="name-d ms-4">
                    <h5> Willum Robert
                      <span className="d-block"> Creative director, NBC</span>
                    </h5>

                  </div>
                </div>
              </div>


            </div>
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

        <section className="subscribe-section float-start w-100 position-relative">
          <div className="azp shake">
            <img alt="ser" src="images/zap.png" />
          </div>
          <div className="container">
            <div className="col-lg-8">
              <h6 className="text-center text-lg-start sub-heading" data-aos="fade-down"> You may unsubscribe at any moment </h6>
              <h2 className="text-center text-lg-start page-haeding mt-4" data-aos="fade-up">  Get your Need on by subcribing
                our newsletter </h2>

              <a href="index.html#" className="btn comon-button mx-auto ms-lg-0 mt-5 d-table d-inline-lg-block" data-aos="fade-up">  <span> <i className="fas fa-arrow-right"></i> See All Post </span> </a>
            </div>
          </div>
          <div className="sub-ixtr" data-aos="fade-up">
            <img alt="set" src="images/footer-superhero.png" />
          </div>
        </section>
      </main>
    </>
  )
}

export default Home;
   