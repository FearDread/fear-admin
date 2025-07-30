import { useEffect } from "react";
import { useSelector } from "react-redux";
import BannerSub from "../../components/Banner/BannerSub";
import UserCartItem from "../../components/Cart/UserCartItem";

const UserCart = (props) => {

  const cartData = useSelector( state => state.cart.data );
  useEffect(() => {
    console.log('user car = ', cartData);
  }, [])
  return (
    <>
      <BannerSub />
      <main className="float-start w-100 total-body home-body mt-0">
        <section className="cart-page-div pt-5 d-inline-block w-100">
          <div className="container">
            <div className="row gx-lg-5">
              <div className="col-lg-8 user-cart-items">
                <div className="cart-haedeing">
                  <h2 className="d-flex page-haeding align-items-center justify-content-between mb-4">  My Cart
                    <span className="ms-lg-auto">
                      3Items
                    </span>
                  </h2>
                </div>

                {cartData && cartData.map((item) => {
                  return (
                    <UserCartItem data={{...item.productId}} key={item._id} /> 
                  )
                  
                })}
                </div>
                <div className="col-lg-4 cart-summary">
                  <div className="total-count-div">
                    <h4> Order Summary</h4>
                    <hr className="my-2" />
                    <div className="itemsl-list my-4">
                      <ul>
                        <li className="d-flex align-items-center justify-content-between">
                          <span>Items(3)</span>
                          <span>$104.00</span>
                        </li>
                      </ul>
                    </div>

                    <div className="promo-code1">
                      <div className="form-group">
                        <label>Do you have Any Discount Code?</label>
                        <input type="text" className="form-control" placeholder="Enter your code" />
                        <input type="submit" value="Apply" className="btn" />
                      </div>
                    </div>
                    <ul className="pay-listy mt-4">
                      <li>
                        <span className="list-payt">Subtotal <b>(3 Items)</b></span>
                        <span className="price-bn">$45.00</span>
                      </li>
                      <li>
                        <span className="list-payt">Delivery charges</span>
                        <span className="price-bn">$05.00</span>
                      </li>
                      <li>
                        <span className="list-payt">Discount price</span>
                        <span className="price-bn">-</span>
                      </li>
                    </ul>
                    <hr />

                    <h3><span>Total Cost</span> <span>$40.00</span> </h3>

                  </div>
                  <a href="cart.html#" className="btn comon-button mt-5">
                    <span> Checkout </span>
                  </a>
                </div>

                <div className="reconded-procuts d-inline-block w-100 py-5">
                  <h2>  Recommended  </h2>


                  <div className="like-slide owl-carousel owl-theme mt-4">

                    <a href="cart.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-left">
                      <div className="img-box-div position-relative">
                        <img alt="srt" src="images/0ea7b3bf-image-2.jpg" />
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


                    <a href="cart.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-left">
                      <div className="img-box-div position-relative">
                        <img alt="srt" src="images/_742c2c04-e263-11e7-814a-000c05070a4c.jpg" />
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

                    <a href="cart.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-left">
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


                    <a href="cart.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-left">
                      <div className="img-box-div position-relative">
                        <img alt="srt" src="images/brett-jordan-CsZQ50xO35I-unsplash.jpg" />
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

                    <a href="cart.html#" className="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-left">
                      <div className="img-box-div position-relative">
                        <img alt="srt" src="images/super5.png" />
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
                </div>
            </div>

          </div>
        </section>
      </main>
    </>
  )
}

export default UserCart;



