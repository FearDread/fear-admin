import React from "react";

import Breadcrumb from "../components/Common/Breadcrumbs";

const BlogDetails = (props) => {

  return (
    <>
      <main className="float-start w-100 total-body home-body mt-0">
        <Breadcrumb />

        <section className="blogs-info-div d-inline-block w-100">
          <div className="container">
            <div className="row g-5">
              <div className="col-lg-8">

                <div className="left-details-info">
                  <figure className="moni">
                    <img alt="hjm" src="images/360_F_117750219_dEXN5T0ENx62pMVgADlHKDSy334VpKPJ.jpg" />
                  </figure>
                  <div className="d-flex justify-content-between share-div mt-5">
                    <ul className="list-unstyled d-flex">
                      <li> <i className="far fa-user"></i>  By Author </li>
                      <li> <i className="far fa-calendar-alt"></i>  Oct 12, 2021 </li>
                      <li> <i className="far fa-comment"></i>  2 comments </li>
                    </ul>
                    <a data-bs-toggle="modal" data-bs-target="#exampleModal"> <i className="fas fa-share-alt"></i> Share</a>
                  </div>
                  <h1 className="mt-5"> Donec eu lectus convallis, ornare ligula eu, hendrerit tortor. </h1>

                  <p className="mt-4"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.</p>

                  <div className="oqute d-lg-flex align-items-center w-100 p-5 my-5">
                    <span> <i className="fas fa-quote-right"></i> </span>
                    <h2 className="ms-5"> Grursus mal suada faci lisis Lorem ipsum dolarorit more a ametion the is consectetur elit. Vesti at bulum nec odio aea the dumm more ipsumm ipsum the consectetur elit.</h2>
                  </div>

                  <p className="mt-3"> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident,
                    sometimes on purpose (injected humour and the like).</p>

                  <div className="comment-sec-part">
                    <h2> Comments</h2>
                    <div className="comon-com-div">
                      <div className="d-md-flex justify-content-between">
                        <figure>
                          <img src="images/testimonials-1-1.jpg" alt="user-pic" />
                        </figure>
                        <div className="comment-text">
                          <div className="d-flex align-items-center">
                            <h5 className="mb-0"> Jone due </h5> <span className="d-inline ms-3"> Oct 12 ,2021 </span>
                          </div>

                          <p> Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classNameical Latin
                            literature from 45 BC, making it over 2000 years old. Richard McClintock. </p>
                        </div>
                      </div>

                    </div>
                    <div className="comon-com-div d-inline-block w-100">
                      <div className="d-md-flex justify-content-between">
                        <figure>
                          <img src="images/testimonials-1-1.jpg" alt="user-pic" />
                        </figure>
                        <div className="comment-text">
                          <div className="d-flex align-items-center">
                            <h5 className="mb-0"> Jone due </h5> <span className="d-inline ms-3"> Oct 12 ,2021 </span>
                          </div>

                          <p> Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classNameical Latin
                            literature from 45 BC, making it over 2000 years old. Richard McClintock. </p>
                        </div>
                      </div>

                    </div>
                  </div>
                  <div className="leave-sec-part">
                    <h2> Leave a Comment </h2>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-group">
                          <input type="text" className="form-control" placeholder="Full Name" />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-group">
                          <input type="text" className="form-control" placeholder="Email" />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <textarea className="form-control" placeholder="Message"></textarea>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <button type="submit" className="btn subimt-comment"> <span> Post Comment </span> </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>








              </div>

              <div className="col-lg-4">

                <div className="comon-sec-blogs-inf-right">
                  <h5 className="subheding"> Categories </h5>
                  <span className="line-ani"></span>
                  <ul className="mt-4">
                    <li>
                      <a href="blog-details.html#">
                        <span> <i className="fas fa-arrow-right"></i> </span>
                        Action & Drama </a>

                    </li>
                    <li>
                      <a href="blog-details.html#">
                        <span> <i className="fas fa-arrow-right"></i> </span>
                        Aliquam hendrerit </a>

                    </li>
                    <li>
                      <a href="blog-details.html#">
                        <span> <i className="fas fa-arrow-right"></i> </span>
                        Maecenas cursus  </a>

                    </li>
                    <li>
                      <a href="blog-details.html#">  <span> <i className="fas fa-arrow-right"></i> </span>
                        In tempor  </a>

                    </li>
                  </ul>
                </div>

                <div className="comon-sec-blogs-inf-right">
                  <a href="blog-details.html#" className="como-list blogs-ioj d-flex align-items-center">
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
                      <a href="blog-details.html#" className="btn">
                        Donec </a>

                    </li>
                    <li>
                      <a href="blog-details.html#" className="btn">
                        hendrerit </a>

                    </li>
                    <li>
                      <a href="blog-details.html#" className="btn">

                        Maecenas </a>

                    </li>
                    <li>
                      <a href="blog-details.html#" className="btn">
                        tempor  </a>

                    </li>
                  </ul>
                </div>

                <div className="comon-sec-blogs-inf-right">
                  <h5 className="subheding"> Archives </h5>
                  <span className="line-ani"></span>
                  <ul className="mt-4">
                    <li>
                      <a href="blog-details.html#"> <span> <i className="fas fa-calendar-week"></i> </span> January 2022  </a>

                    </li>
                    <li>
                      <a href="blog-details.html#"> <span> <i className="fas fa-calendar-week"></i> </span> February 2022  </a>

                    </li>
                    <li>
                      <a href="blog-details.html#"> <span> <i className="fas fa-calendar-week"></i> </span> March 2022  </a>

                    </li>
                    <li>
                      <a href="blog-details.html#"> <span> <i className="fas fa-calendar-week"></i> </span> April 2022   </a>

                    </li>
                  </ul>
                </div>


              </div>
            </div>
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

              <a href="blog-details.html#" className="btn comon-button mx-auto ms-lg-0 mt-5 d-table d-inline-lg-block" data-aos="fade-up">  <span> <i className="fas fa-arrow-right"></i> See All Post </span> </a>
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

export default BlogDetails;