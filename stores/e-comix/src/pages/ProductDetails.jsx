import React, { useEffect, useState } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader/Loader";
import BannerSub from "../components/Banner/BannerSub"
import { Product } from "../features/products/slice";
import { store } from "../features/store";
import ReactImageZoom from "react-image-zoom";
import ReactStars from "react-rating-stars-component"
import { toast } from "react-toastify";
//ddProdToCart, getCart } from "../features/user/service";
import defaultProdImg from "../assets/images/abstract_banner_1.jpg";

const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  //const [imgProps, setImgProps ] = useState({})
  const { loading, success, error } = useSelector((state) => state?.product);
  const activeProduct = useSelector((state) => state?.product?.data);
  //const cartState = useSelector((state) => state?.auth?.cartProducts);
  //const { isLoggedIn, user } = useSelector((state) => state?.auth);
/*
  const ratings = product?.totalrating;
  //const wishlist = useSelector((state) => state?.auth?.wishlist?.wishlist);

*/

  const props = {
            width: 594,
    height: 600,
    zoomWidth: 600,
    img: "../assets/images/abstract_banner_1.jpg"
  }
  useEffect(() => {
    store.dispatch(Product.fetch(id));

    /*
    console.log('Auth = ', user, isLoggedIn);
    if (isLoggedIn) {
      dispatch(Product.getCart());
    }
      */
  }, []);

  /*
  useEffect(() => {
    for (let index = 0; index < cartState?.length; index++) {
      if (id === cartState[index]?.productId?._id) {
        setAlreadyAdded(true);
      }
    }
  });
*/

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
      <BannerSub />
      <main className="float-start w-100 total-body home-body mt-0">

        <section className="bedcrum float-start w-100">
          <div className="container">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="product-details.html#">Home</a></li>
                <li className="breadcrumb-item active" aria-current="page">Product Details</li>
              </ol>
            </nav>
          </div>
        </section>

        <section className="category float-start w-100 position-relative">

          <div className="listing-page-div">
            <div className="container">
                  <div className="row g-5 product-details-div">
                    <div className="col-lg-6">
                      <div className="main-product-image products-slide-1">
                        <div>x
                            <ReactImageZoom {...props} />
                          { /* <ReactImageZoom props={getImgProps(activeProduct)} /> */}
                        </div>
                      </div>
                      <div className="other-product-images thum-pic-slide d-flex flex-wrap gap-15">
                        {activeProduct.images.map((item, index) => {
                          return (
                            <div className="item">
                              <figure className="main-ppic ">
                                <img src={item?.url} className="img-fluid" alt="" />
                              </figure>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="comon-details-part">
                        <h5 className="tags-ts"> {activeProduct.title} </h5>
                        <h2 className="my-2"> {activeProduct.slug} </h2>
                        <div className="ratine">
                          <span>
                            <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                            <i className="fas fa-star"></i><i className="fas fa-star"></i>
                          </span>
                          <span>({activeProduct.reviews.length} Reviews)</span>
                        </div>
                        <h3 className="price-text mt-3">
                          ${activeProduct.price}
                          {/*<span> ${product.price} </span>*/}
                        </h3>
                        <div className="feature-div-list">
                          <ul className="mt-4">
                            <li>
                              <span>Category:</span>
                              <span>{activeProduct.category}</span>
                            </li>
                            <li>
                              <span>Brand</span>
                              <span>{activeProduct.brand}</span>
                            </li>

                            <li>
                              <span>Tags:</span>
                              <span>Action, Adventure, Manhua, Martial Arts</span>
                            </li>
                            <li>
                              <span>ID:</span>
                              <span>{activeProduct._id}</span>
                            </li>
                          </ul>
                        </div>
                        <div className="quantity-control" data-quantity="">
                          <button className="btn quantity-btn" data-quantity-minus="">
                            <i className="fas fa-minus"></i>
                          </button>
                          <input type="number" className="quantity-input"
                            data-quantity-target=""
                            value={quantity}
                            step="0.1" min="1" max="50"
                            name="quantity"
                            onChange={() => {
                              const newQuant = quantity++;
                              setQuantity(newQuant)
                            }} />

                          <button className="btn quantity-btn" data-quantity-plus="">
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>

                        <div className="d-flex align-items-center my-4">
                          <a href="product-details.html#" className="btn add-btn">
                            <span>
                              <i className="fas fa-shopping-cart"></i>
                            </span> <span> Add to Cart  </span> </a>
                          <a href="product-details.html#" className="btn ad-whish">
                            <span> Buy Now </span>  </a>
                        </div>



                        <div className="delivery-part">
                          <h5> Free worldwide shipping for orders over <span> $70</span> </h5>
                          <ul>
                            <li> Order will dispatch with in <span> 2 Hours </span> </li>
                            <li>  Order delivery with in <span> 3day </span> </li>
                          </ul>
                        </div>

                      </div>
                    </div>
                  </div>
              <div className="tabs-details-gn mt-5 mt-lg-0">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab"
                    >Description</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile"
                      type="button" role="tab" >
                      Review & Feedback     </button>
                  </li>

                  <li className="nav-item" role="presentation">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#shipping"
                      type="button" role="tab" >
                      Shipping Policy     </button>
                  </li>

                </ul>
                <div className="tab-content" id="myTabContent">
                  <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <div className="comon-desctiopn py-5">
                      <h3> Did you know </h3>
                      <p className="mt-3"> The journey to the martial peak is a lonely, solitary and long one.In the face of adversity,you must survive and remain unyielding.Only then can you break through and and continue on your journey to become the strongest. Sky Tower tests its disciples in the harshest ways to prepare them for this journey.One day the lowly sweeper Yang Kai managed to obtain a
                        black book, setting him on the road to the peak of the martials world. </p>

                      <div className="feature-div-list">
                        <ul className="mt-4">
                          <li>
                            <span>Chapter:</span>
                            <span>3547</span>
                          </li>
                          <li>
                            <span>Author(s):</span>
                            <span> James Art</span>
                          </li>
                          <li>
                            <span>Release:</span>
                            <span>Jun 5 2022</span>
                          </li>
                          <li>
                            <span>Language:</span>
                            <span>English</span>

                          </li>



                        </ul>
                      </div>

                      <h3 className="mt-5"> Storyline </h3>
                      <p className="mt-3"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                        into electronic typesetting, remaining essentially unchanged.</p>

                      <h5> Packaging & Delivery </h5>
                      <p className="mt-2"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                        into electronic typesetting, remaining essentially unchanged.</p>

                      <h5> Other Ingredients</h5>
                      <p className="mt-2"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                        into electronic typesetting, remaining essentially unchanged.</p>

                    </div>
                  </div>
                  <div className="tab-pane fade" id="profile" role="tabpanel"
                    aria-labelledby="profile-tab">
                    <div className="listing-paage-divb">
                      <div className="review-div-sec mt-4">


                        <div className="comment-user-div">
                          <div className="userp">
                            <div className="us-pic">  <img src="images/testimonials-1-1.jpg" alt="pico" /> </div>
                          </div>
                          <div className="user-dsl">
                            <h6> Kelvin Martine <span className="d-block"> <i className="fas fa-star"></i> <i className="fas fa-star"></i> <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                            </span> <span>  June 10, 2020 </span> </h6>

                            <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                              Lorem Ipsum has been the industry's standard. </p>
                          </div>
                        </div>

                        <div className="comment-user-div">
                          <div className="userp">
                            <div className="us-pic">  <img src="images/manages-st2.jpg" alt="pico" /> </div>
                          </div>
                          <div className="user-dsl">
                            <h6> Jone Martine <span className="d-block"> <i className="fas fa-star"></i> <i className="fas fa-star"></i> <i className="fas fa-star"></i> <i className="fas fa-star"></i>
                            </span> <span>  Nov 05, 2022 </span> </h6>

                            <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                              Lorem Ipsum has been the industry's standard. </p>
                          </div>
                        </div>


                      </div>

                      <div className="submit-review mt-5">
                        <h5> Leave a Comment </h5>
                        <p> Your email address will not be published. Required fields are marked * </p>

                        <form action="https://oxentictemplates.in/templatemonster/comicstore/man" method="get">
                          <div className="col-lg-12 pl-0">
                            <ul className="rate-area">
                              <input type="radio" id="5-star" name="rating" value="5" readOnly={true} /><label htmlFor="5-star" title="Amazing">5 stars</label>
                              <input type="radio" id="4-star" name="rating" value="4" readOnly={true} /><label htmlFor="4-star" title="Good">4 stars</label>
                              <input type="radio" id="3-star" name="rating" value="3" readOnly={true} /><label htmlFor="3-star" title="Average">3 stars</label>
                              <input type="radio" id="2-star" name="rating" value="2" readOnly={true} /><label htmlFor="2-star" title="Not Good">2 stars</label>
                              <input type="radio" id="1-star" name="rating" value="1" readOnly={true} /><label htmlFor="1-star" title="Bad">1 star</label>
                            </ul>


                          </div>
                          <div className="row w-100">
                            <div className="col-lg-6 form-group">
                              <input type="text" className="form-control" placeholder="Full Name" />

                            </div>
                            <div className="col-lg-6 form-group">
                              <input type="text" className="form-control" placeholder="Email" />

                            </div>
                            <div className="col-lg-12 form-group">
                              <textarea className="form-control ted"></textarea>
                            </div>
                            <div className="col-lg-12">
                              <button type="submit" className="btn sub-re">
                                <span> Submit </span></button>

                            </div>



                          </div>
                        </form>
                      </div>


                    </div>
                  </div>

                  <div className="tab-pane fade" id="shipping" role="tabpanel"
                    aria-labelledby="profile-tab">
                    <div className="listing-paage-divb my-5">
                      <p className="mt-3"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                        into electronic typesetting, remaining essentially unchanged.</p>

                      <h5> Packaging & Delivery </h5>
                      <p className="mt-2"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                        into electronic typesetting, remaining essentially unchanged.</p>

                      <h5> Other Ingredients</h5>
                      <p className="mt-2"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                        into electronic typesetting, remaining essentially unchanged.</p>


                    </div>
                  </div>
                </div>
              </div>

              <div className="like-div-also mt-5">
                <h2> You may also like </h2>
                {/* <RelatedProducts {...products} /> */}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )}
  </>
  )
}
export default ProductDetails;


