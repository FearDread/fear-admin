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
      <main class="float-start w-100 total-body home-body mt-0">
        <section class="cart-page-div pt-5 d-inline-block w-100">
          <div class="container">
            <div class="row gx-lg-5">
              <div class="col-lg-8 user-cart-items">
                <div class="cart-haedeing">
                  <h2 class="d-flex page-haeding align-items-center justify-content-between mb-4">  My Cart
                    <span class="ms-lg-auto">
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
                  <div class="total-count-div">
                    <h4> Order Summary</h4>
                    <hr class="my-2" />
                    <div class="itemsl-list my-4">
                      <ul>
                        <li class="d-flex align-items-center justify-content-between">
                          <span>Items(3)</span>
                          <span>$104.00</span>
                        </li>
                      </ul>
                    </div>

                    <div class="promo-code1">
                      <div class="form-group">
                        <label>Do you have Any Discount Code?</label>
                        <input type="text" class="form-control" placeholder="Enter your code" />
                        <input type="submit" value="Apply" class="btn" />
                      </div>
                    </div>
                    <ul class="pay-listy mt-4">
                      <li>
                        <span class="list-payt">Subtotal <b>(3 Items)</b></span>
                        <span class="price-bn">$45.00</span>
                      </li>
                      <li>
                        <span class="list-payt">Delivery charges</span>
                        <span class="price-bn">$05.00</span>
                      </li>
                      <li>
                        <span class="list-payt">Discount price</span>
                        <span class="price-bn">-</span>
                      </li>
                    </ul>
                    <hr />

                    <h3><span>Total Cost</span> <span>$40.00</span> </h3>

                  </div>
                  <a href="cart.html#" class="btn comon-button mt-5">
                    <span> Checkout </span>
                  </a>
                </div>

                <div class="reconded-procuts d-inline-block w-100 py-5">
                  <h2>  Recommended  </h2>


                  <div class="like-slide owl-carousel owl-theme mt-4">

                    <a href="cart.html#" class="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-left">
                      <div class="img-box-div position-relative">
                        <img alt="srt" src="images/0ea7b3bf-image-2.jpg" />
                        <span class="off">10% off</span>
                      </div>
                      <div class="details-shopi">
                        <div class="row align-items-center">
                          <div class="col-8">
                            <h5 class="text-white"> Figures & Statues..
                              <span class="d-block"> Das deutschsprachige </span>
                            </h5>
                          </div>
                          <div class="col-4">
                            <h3 class="text-center"> $30 <span class="d-block"> $50 </span> </h3>
                          </div>
                        </div>

                      </div>

                    </a>


                    <a href="cart.html#" class="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-left">
                      <div class="img-box-div position-relative">
                        <img alt="srt" src="images/_742c2c04-e263-11e7-814a-000c05070a4c.jpg" />
                        <span class="off">10% off</span>
                      </div>
                      <div class="details-shopi">
                        <div class="row align-items-center">
                          <div class="col-8">
                            <h5 class="text-white"> Figures & Statues..
                              <span class="d-block"> Das deutschsprachige </span>
                            </h5>
                          </div>
                          <div class="col-4">
                            <h3 class="text-center"> $30 <span class="d-block"> $50 </span> </h3>
                          </div>
                        </div>

                      </div>

                    </a>

                    <a href="cart.html#" class="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-left">
                      <div class="img-box-div position-relative">
                        <img alt="srt" src="images/b5197a7a-image-22.jpg" />
                        <span class="off">10% off</span>
                      </div>
                      <div class="details-shopi">
                        <div class="row align-items-center">
                          <div class="col-8">
                            <h5 class="text-white"> Figures & Statues..
                              <span class="d-block"> Das deutschsprachige </span>
                            </h5>
                          </div>
                          <div class="col-4">
                            <h3 class="text-center"> $30 <span class="d-block"> $50 </span> </h3>
                          </div>
                        </div>

                      </div>

                    </a>


                    <a href="cart.html#" class="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-left">
                      <div class="img-box-div position-relative">
                        <img alt="srt" src="images/brett-jordan-CsZQ50xO35I-unsplash.jpg" />
                        <span class="off">10% off</span>
                      </div>
                      <div class="details-shopi">
                        <div class="row align-items-center">
                          <div class="col-8">
                            <h5 class="text-white"> Figures & Statues..
                              <span class="d-block"> Das deutschsprachige </span>
                            </h5>
                          </div>
                          <div class="col-4">
                            <h3 class="text-center"> $30 <span class="d-block"> $50 </span> </h3>
                          </div>
                        </div>

                      </div>

                    </a>

                    <a href="cart.html#" class="shop-items super-items overflow-hidden d-inline-block w-100 position-relative" data-aos="fade-left">
                      <div class="img-box-div position-relative">
                        <img alt="srt" src="images/super5.png" />
                        <span class="off">10% off</span>
                      </div>
                      <div class="details-shopi">
                        <div class="row align-items-center">
                          <div class="col-8">
                            <h5 class="text-white"> Figures & Statues..
                              <span class="d-block"> Das deutschsprachige </span>
                            </h5>
                          </div>
                          <div class="col-4">
                            <h3 class="text-center"> $30 <span class="d-block"> $50 </span> </h3>
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



