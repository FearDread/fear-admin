import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import about_comic_banner from "../assets/images/adobe_bg_1.jpeg";
import facebook_profile from "../assets/images/ekomix/facebook_profile_image.png";
import Services from "../components/Home/Services/Services";
import brand1 from "../assets/brands/brand1.png";
import brand2 from "../assets/brands/brand2.png";
import brand3 from "../assets/brands/brand3.png";
import brand4 from "../assets/brands/brand4.png";
import brand5 from "../assets/brands/brand5.png";
import brand6 from "../assets/brands/brand6.png";
import brand7 from "../assets/brands/brand7.png";

import "swiper/css";
import "../assets/css/AboutPage.css";


const About = () => {
  return (
    <>
      <div className="aboutSection">
        <h2> About E-Komix </h2>
        <img src={about_comic_banner} alt="" />
        <div className="aboutContent">
          <h3>Our Story</h3>
          <h4>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </h4>
          <p>
            Saw wherein fruitful good days image them, midst, waters upon, saw.
            Seas lights seasons. Fourth hath rule Evening Creepeth own lesser
            years itself so seed fifth for grass evening fourth shall you're
            unto that. Had. Female replenish for yielding so saw all one to
            yielding grass you'll air sea it, open waters subdue, hath. Brought
            second Made. Be. Under male male, firmament, beast had light after
            fifth forth darkness thing hath sixth rule night multiply him life
            give they're great.
          </p>
          <div className="content1">
            <div className="contentBox">
              <h5>Our Mission</h5>
              <p>
                Here at E-Komix we want to offer some of the best and the widest varaity of Comics, Coins, Cards, and Collectibles. 
                Not just offer the lowest prices but offer competitive pricing so you can trust what your buying is indeed authentic.
                Custom orders can be made anytime for any of our lines of collectibles, simply submit contact form with your inquiry.
              
              </p>
            </div>
            <div className="contentBox">
              <h5>Our Vision</h5>
              <p>
                We see ourselves continuing to collect various collectibles as it is one of our beloved hobbies.  
              </p>
            </div>
          </div>
          <div className="content2">
            <div className="imgContent">
              <img src={facebook_profile} alt="" />
            </div>
            <div className="textContent">
              <h5>The Company</h5>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet
                sapien dignissim a elementum. Sociis metus, hendrerit mauris id
                in. Quis sit sit ultrices tincidunt euismod luctus diam. Turpis
                sodales orci etiam phasellus lacus id leo. Amet turpis nunc,
                nulla massa est viverra interdum. Praesent auctor nulla morbi
                non posuere mattis. Arcu eu id maecenas cras.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Services />
      <div className="companyPartners">
        <h5>Company Partners</h5>
        <Swiper
          slidesPerView={1}
          loop={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 5,
            },

            768: {
              slidesPerView: 4,
              spaceBetween: 40,
            },

            1024: {
              slidesPerView: 5,
              spaceBetween: 50,
            },
          }}
          spaceBetween={10}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
        >
          <SwiperSlide>
            <div className="aboutbrands">
              <img src={brand1} alt="" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="aboutbrands">
              <img src={brand2} alt="" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="aboutbrands">
              <img src={brand3} alt="" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="aboutbrands">
              <img src={brand4} alt="" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="aboutbrands">
              <img src={brand5} alt="" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="aboutbrands">
              <img src={brand6} alt="" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="aboutbrands">
              <img src={brand7} alt="" />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
};

export default About;
