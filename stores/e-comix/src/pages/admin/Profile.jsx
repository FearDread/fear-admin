import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import CartItem from "../../components/Cart/CartItem";
import BannerSub from "../../components/Banner/BannerSub";
import { store } from "../../features/store";
import User from "../../features/user/slice";
import Recommended from "../../components/Carousel/Recommended";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const cartData = useSelector(state => state.cart.data)
  const userInfo = useSelector(state => state.user.data.user);
  const loadingUpdateProfile = useSelector(state => state.user.data.loading)
  const userData = store.local.get('auth');
  const [cartItems, setCartItems] = useState(0);
  const [totalCost, setTotalCost] = useState(0.00);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    store.dispatch(User.updateProfile({
      _id: userInfo._id,
      username,
      email,
      password,
    }))

    //store.dispatch(User.setCredentials({ ...res }));
    if (userInfo.success) {
      toast.success("Profile updated successfully");
    }
  };
  useEffect(() => {
    let totalSum = 0;
    for (let index = 0; index < cartData?.length; index++) {
      totalSum =
      totalSum + Number(cartData[index].quantity) * cartData[index].price;
     
      setTotalCost(totalSum);
    }
  }, [cartData]);

  useEffect(() => {

    let items = cartData?.length;
    setCartItems(items);

  }, [cartData])
  useEffect(() => {

    setUserName(userData.user.username);
    setEmail(userData.user.email);

  }, [userData.user.email, userData.user.username]);

  return (
    <>
      <BannerSub />

      <main className="float-start w-100 total-body home-body mt-0">
        <section className="cart-page-div pt-5 d-inline-block w-100">
          <div className="container">
            <div className="row gx-lg-5">
              <div className="col-lg-8 cart-summary">
                <div className="total-count-div">
                  <h4> Profile Summary</h4>
                  <hr className="my-2" />

                  <ul className="pay-listy mt-4">
                    <form onSubmit={submitHandler}>
                      <li>
                        <div className="mb-4">
                          <label className="block text-white mb-2">Name</label>
                          <input
                            type="text"
                            placeholder="Enter name"
                            className="form-input p-4 rounded-sm w-full"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                          />
                        </div>
                      </li>
                      <li>
                        <div className="mb-4">
                          <label className="block text-white mb-2">Email Address</label>
                          <input
                            type="email"
                            placeholder="Enter email"
                            className="form-input p-4 rounded-sm w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </li>
                      <li>

                        <div className="mb-4">
                          <label className="block text-white mb-2">Password</label>
                          <input
                            type="password"
                            placeholder="Enter password"
                            className="form-input p-4 rounded-sm w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-white mb-2">Confirm Password</label>
                          <input
                            type="password"
                            placeholder="Confirm password"
                            className="form-input p-4 rounded-sm w-full"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </li>
                    </form>
                  </ul>
                  <hr />

                  <button
                    type="submit"
                    className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
                  >
                    Update
                  </button>
                </div>

                <Link
                  to="/user-orders"
                  className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700"
                >
                  <span>My Orders</span>
                </Link>
            </div>
            <div className="col-lg-4 ">
            <ul className="shadow p-4 profile-cart-items" >
               <li className="top-notitext">
                 <div className="d-flex align-items-center justify-content-between">
                   <h6> Your Products: ({cartItems} Items) </h6>
                   <Link to='/cart' className="btn cart-drop-bn m-0">View Cart</Link>
                 </div>
               </li>
               <li>
                  <div className='cart-basket-items'>


                { cartData && cartData.map((item) => {
                  return (
                    <CartItem data={{...item.productId}} key={item._id} />
                  )
                })}
                    
                  </div>
               </li>
               <li>
                 <div className="sub-total-products">
                   <h6 className="ct-text05"> <span> Subtotal: </span> <span> ${totalCost || 0.00} </span>  </h6>
                   <h6 className="ct-text05"> <span> Shipping: </span> <span> ${cartData.tax || 0.00} </span>  </h6>
                   <hr/>
                   <h6 className="ct-text06"> <span> Total: </span> <span> ${totalCost} </span>  </h6>
                 </div>
               </li>
               <li>
                   <a href="/checkout" className="btn mb-4 check-drop-bn"> Check out <span> <i className="fas fa-arrow-right"></i> </span> </a>
               </li>
             </ul>
            </div>
 l

          </div>
                <Recommended />
        </div>
      </section>
    </main >
    </>
  );
};

export default Profile;
{/*
      <main className="float-start w-100 total-body home-body mt-0">
        <section className="cart-page-div pt-5 d-inline-block w-100">
          <div className="col-lg-8 user-cart-items">
            <div className="flex justify-center align-center md:flex md:space-x-4">
              <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
              <div className="col-lg-4 cart-summary">
                <div className="total-count-div">
                  <h4> Profile Summary</h4>
                  <hr className="my-2" />

                  <ul className="pay-listy mt-4">
                    <form onSubmit={submitHandler}>
                      <li>
                        <div className="mb-4">
                          <label className="block text-white mb-2">Name</label>
                          <input
                            type="text"
                            placeholder="Enter name"
                            className="form-input p-4 rounded-sm w-full"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                          />
                        </div>
                      </li>
                      <li>
                        <div className="mb-4">
                          <label className="block text-white mb-2">Email Address</label>
                          <input
                            type="email"
                            placeholder="Enter email"
                            className="form-input p-4 rounded-sm w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </li>
                      <li>

                        <div className="mb-4">
                          <label className="block text-white mb-2">Password</label>
                          <input
                            type="password"
                            placeholder="Enter password"
                            className="form-input p-4 rounded-sm w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-white mb-2">Confirm Password</label>
                          <input
                            type="password"
                            placeholder="Confirm password"
                            className="form-input p-4 rounded-sm w-full"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </li>
                    </form>
                  </ul>
                  <hr />

                  <button
                    type="submit"
                    className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
                  >
                    Update
                  </button>
                </div>

                <Link
                  to="/user-orders"
                  className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700"
                >
                  <span>My Orders</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 cart-summary">
            <div className="container mx-auto p-4 mt-[10rem]">

              <div className="col-lg-6 user-cart-items">
                <div className="cart-haedeing">
                  <h2 className="d-flex page-haeding align-items-center justify-content-between mb-4">  My Cart
                    <span className="ms-lg-auto">
                      3Items
                    </span>
                  </h2>
                </div>

                {cartData && cartData.map((item) => {
                  return (
                    <UserCartItem data={{ ...item.productId }} key={item._id} />
                  )

                })}
              </div>
            </div>
          </div>

        </section>
      </main>
      */}