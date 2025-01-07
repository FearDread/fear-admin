import React, { useEffect } from "react";

import BannerSub from "../components/Banner/BannerSub"

const Contact = () => {

  return (
    <>
        <BannerSub />
      <main className="float-start w-100 total-body home-body mt-0">
        <section className="top-sectionk mt-5 float-start w-100">
          <div className="container">
            <div className="row row-cols-1 row-cols-lg-3 g-5">
              <div className="col position-relative aos-init aos-animate" data-aos="fade-left">
                <div className="comon-items-con position-relative d-flex align-items-center">
                  <figure className="m-0">
                    <img alt="sert" src="images/wemial.png" />
                  </figure>
                  <div className="rightextr">
                    <h5> Email Address </h5>
                    <p> example@gmail.com
                      <br />
                      example@gmail.com
                    </p>
                  </div>
                </div>
                <div className="comiuy-after"></div>
              </div>


              <div className="col position-relative aos-init aos-animate" data-aos="fade-up">
                <div className="comon-items-con position-relative d-flex align-items-center">
                  <figure className="m-0">
                    <img alt="sert" src="images/cu.png" />
                  </figure>
                  <div className="rightextr">
                    <h5> Customer Care </h5>
                    <p> 1800-1452-2564
                      <br />
                      1800-1452-2568
                    </p>
                  </div>
                </div>
                <div className="comiuy-after"></div>
              </div>


              <div className="col position-relative aos-init aos-animate" data-aos="fade-right">
                <div className="comon-items-con position-relative d-flex align-items-center">
                  <figure className="m-0">
                    <img alt="sert" src="images/chat.png" />
                  </figure>
                  <div className="rightextr">
                    <h5> Chat Support </h5>
                    <p> example@gmail.com
                      <br /> example@gmail.com
                    </p>
                  </div>
                </div>
                <div className="comiuy-after"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-us-page d-inline-block w-100">
          <div className="container">
            <div className="row g-5 align-items-center">
              <div className="col-md-5">
                <div className="mapo">
                  <div className="responsive-map">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2822.7806761080233!2d-93.29138368446431!3d44.96844997909819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x52b32b6ee2c87c91%3A0xc20dff2748d2bd92!2sWalker+Art+Center!5e0!3m2!1sen!2sus!4v1514524647889" width="600" height="400" frameborder="0" allowfullscreen=""></iframe>
                  </div>
                </div>
              </div>
              <div className="col-md-7">
                <div className="conatct-form-div">
                  <h6 className="mb-0">Send us a message</h6>
                  <h2> We are here to Help You  </h2>
                  <form name="fmn" action="https://oxentictemplates.in/templatemonster/comicstore/contact.php" method="post">
                    <div className="row mt-4">
                      <div className="col-lg-6">
                        <input type="text" name="name" className="form-control" placeholder="Name" required="" />
                      </div>
                      <div className="col-lg-6">
                        <input type="email" name="email" className="form-control" placeholder="Email" required="" />
                      </div>
                      <div className="col-lg-6">
                        <input type="text" name="phone" className="form-control" placeholder="Phone" required="" />
                      </div>
                      <div className="col-lg-6">
                        <input type="text" name="subject" className="form-control" placeholder="Subject" required="" />
                      </div>
                      <div className="col-lg-12">
                        <textarea className="form-control" name="message" placeholder="Message"></textarea>
                      </div>
                      <div className="col-lg-12">
                        <button type="submit" name="submit" className="btn subimt-comment"> <span> Send Message </span> </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )

}

export default Contact;
