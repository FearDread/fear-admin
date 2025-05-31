import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";



const RelatedProducts = (products) => {

    return (
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
                    modules={[Navigation, Autoplay]}
                    breakpoints={{
                      320: {
                        slidesPerView: 2,
                        slidesPerGroup: 1,
                        spaceBetween: 14,
                      },
                      768: {
                        slidesPerView: 3,
                        slidesPerGroup: 1,
                        spaceBetween: 24,
                      },
                      1024: {
                        slidesPerView: 4,
                        slidesPerGroup: 1,
                        spaceBetween: 30,
                      },
                    }}
                  >
            {products && products.slice(0, 13).map((product) => {
              return (
                <SwiperSlide key={product._id}>

                  <a href="product-details.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-left">
                    <div className="img-box-div position-relative">
                      <img alt="srt" src="images/se3.png" />
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

                </SwiperSlide>
              )
            })}
                  </Swiper>
    )
}

export default RelatedProducts;