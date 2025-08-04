import { useEffect } from "react";
import { useSelector } from "react-redux";
import BannerSub from "../../components/Banner/BannerSub";
import UserCartItem from "../../components/Cart/UserCartItem";
import Recommended from "../../components/Carousel/Recommended";

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
                  <a href="/checkout" className="btn comon-button mt-5">
                    <span> Checkout </span>
                  </a>
                </div>

                <div className="reconded-procuts d-inline-block w-100 py-5">
                  <h2>  Recommended  </h2>


                  <div className="like-slide owl-carousel owl-theme mt-4">
                    <Recommended />
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



