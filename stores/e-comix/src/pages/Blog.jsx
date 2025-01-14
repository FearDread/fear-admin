import React, { useEffect } from "react";

import BannerSub from "../components/Banner/BannerSub"

const Blog = () => {
  return (
    <>
    <BannerSub />
      <main className="float-start w-100 total-body home-body mt-0">

        <section className="bedcrum float-start w-100">
          <div className="container">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="blog.html#">Home</a></li>
                <li className="breadcrumb-item active" aria-current="page">Blog</li>
              </ol>
            </nav>
          </div>
        </section>

        <section className="blogs-info-div d-inline-block w-100">
          <div className="container">
            <div className="row g-5">
              <div className="col-lg-8">
                <a href="blog-details.html" className="comon-blogs-list-items mb-5">
                  <figure>
                    <img src="images/360_F_117750219_dEXN5T0ENx62pMVgADlHKDSy334VpKPJ.jpg" alt="pnm" />
                    <figcaption>
                      10<b className="d-block">Jan</b>
                    </figcaption>
                  </figure>
                  <div className="content-post">
                    <h6> <i className="fas fa-tags"></i> Webdesign</h6>
                    <h5>All the Lorem Ipsum generators Internet</h5>
                    <div className="d-flex align-items-center">
                      <div className="admin-t">
                        <i className="far fa-user"></i>
                        <span> By Admin </span>
                      </div>
                      <div className="admin-t">
                        <i className="fas fa-calendar-alt"></i>
                        <span>  25 May 2021 </span>
                      </div>
                    </div>
                    <p className="mt-3"> Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a type specimen book.</p>

                  </div>
                </a>

                <a href="blog-details.html" className="comon-blogs-list-items mb-5">
                  <figure>
                    <img src="images/blog1.png" alt="pnm" />
                    <figcaption>
                      10<b className="d-block">Jan</b>
                    </figcaption>
                  </figure>
                  <div className="content-post">
                    <h6> <i className="fas fa-tags"></i> Webdesign</h6>
                    <h5>Fusce eget nulla sed dui placerat viverra</h5>
                    <div className="d-flex align-items-center">
                      <div className="admin-t">
                        <i className="far fa-user"></i>
                        <span> By Admin </span>
                      </div>
                      <div className="admin-t">
                        <i className="fas fa-calendar-alt"></i>
                        <span>  25 May 2021 </span>
                      </div>
                    </div>
                    <p className="mt-3"> Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a type specimen book.</p>

                  </div>
                </a>


                <a href="blog-details.html" className="comon-blogs-list-items mb-5">
                  <figure>
                    <img src="images/comics-news.jpg" alt="pnm" />
                    <figcaption>
                      10<b className="d-block">Jan</b>
                    </figcaption>
                  </figure>
                  <div className="content-post">
                    <h6> <i className="fas fa-tags"></i> Webdesign</h6>
                    <h5>Maecenas cursus diam vel mi posuere scelerisque</h5>
                    <div className="d-flex align-items-center">
                      <div className="admin-t">
                        <i className="far fa-user"></i>
                        <span> By Admin </span>
                      </div>
                      <div className="admin-t">
                        <i className="fas fa-calendar-alt"></i>
                        <span>  25 May 2021 </span>
                      </div>
                    </div>
                    <p className="mt-3"> Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a type specimen book.</p>

                  </div>
                </a>

              </div>

              <div className="col-lg-4">

                <div className="comon-sec-blogs-inf-right">
                  <h5 className="subheding"> Categories </h5>
                  <span className="line-ani"></span>
                  <ul className="mt-4">
                    <li>
                      <a href="blog.html#">
                        <span> <i className="fas fa-arrow-right"></i> </span>
                        Action & Drama </a>

                    </li>
                    <li>
                      <a href="blog.html#">
                        <span> <i className="fas fa-arrow-right"></i> </span>
                        Aliquam hendrerit </a>

                    </li>
                    <li>
                      <a href="blog.html#">
                        <span> <i className="fas fa-arrow-right"></i> </span>
                        Maecenas cursus  </a>

                    </li>
                    <li>
                      <a href="blog.html#">  <span> <i className="fas fa-arrow-right"></i> </span>
                        In tempor  </a>

                    </li>
                  </ul>
                </div>

                <div className="comon-sec-blogs-inf-right">
                  <a href="blog.html#" className="como-list blogs-ioj d-flex align-items-center">
                    <div className="jou-div">
                      <img alt="ju" src="images/blog3.png" />
                    </div>
                    <div className="textry">
                      <h5> Maecenas cursus diam vel mi posuere scelerisque </h5>
                      <p className="mt-2"> Jan 01, 2023 </p>
                    </div>
                  </a>
                </div>



                <div className="comon-sec-blogs-inf-right tags02">
                  <h5 className="subheding"> Tags </h5>
                  <span className="line-ani"></span>
                  <ul className="mt-4">
                    <li>
                      <a href="blog.html#" className="btn">
                        Donec </a>

                    </li>
                    <li>
                      <a href="blog.html#" className="btn">
                        hendrerit </a>

                    </li>
                    <li>
                      <a href="blog.html#" className="btn">

                        Maecenas </a>

                    </li>
                    <li>
                      <a href="blog.html#" className="btn">
                        tempor  </a>

                    </li>
                  </ul>
                </div>

                <div className="comon-sec-blogs-inf-right">
                  <h5 className="subheding"> Archives </h5>
                  <span className="line-ani"></span>
                  <ul className="mt-4">
                    <li>
                      <a href="blog.html#"> <span> <i className="fas fa-calendar-week"></i> </span> January 2022  </a>

                    </li>
                    <li>
                      <a href="blog.html#"> <span> <i className="fas fa-calendar-week"></i> </span> February 2022  </a>

                    </li>
                    <li>
                      <a href="blog.html#"> <span> <i className="fas fa-calendar-week"></i> </span> March 2022  </a>

                    </li>
                    <li>
                      <a href="blog.html#"> <span> <i className="fas fa-calendar-week"></i> </span> April 2022   </a>

                    </li>
                  </ul>
                </div>


              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Blog;




