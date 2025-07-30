import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BannerSub from "../components/Banner/BannerSub";
import Breadcrumbs from "../components/Common/BreadCrumb";
import { User } from "../features/user/slice";
import { store } from "../features/store";
import { toast } from "react-toastify";

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const loginSucess = useSelector(state => state.user.success );
    const userState = useSelector(state => state.user.data );

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("register hit = ");
        if (password != confirmPassword) {
            toast("Passwords do not match!");
            return false;
        }

        const myForm = new FormData();
              myForm.set("fullname", name);
              myForm.set("email", email);
              myForm.set("mobile", mobile);
              myForm.set("password", password);
    
        store.dispatch(User.register(myForm));
      }

    useEffect(() => {
        if ( loginSucess ) {
            store.local.set("auth", userState);
            navigate('/cart');
        }
    }, []);

    return (
        <>
            <BannerSub />
            <main class="float-start w-100 total-body home-body mt-0">
                <Breadcrumbs crumbs={{ link: "/", crumb: "Privacy Policy" }} />
                <section class="cart-page-div pt-5 d-inline-block w-100">
                    <div class="container">
                        <div class="row gx-lg-5">
                                <form action="" method="get">
                                    <div className="com-div-md">

                                        <h5 className="text-center mb-3"> Free Register </h5>
                                        <button type="button" className="close" data-bs-dismiss="modal">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">

                                            </svg>
                                        </button>
                                        <div className="login-modal-pn">

                                            <div className="cm-select-login mt-0">
                                                <div className="country-dp">

                                                    <input type="text"
                                                        name="fullname"
                                                        className="form-control"
                                                        placeholder="Full Name"
                                                        onChange={(e) => setName(e.target.value)}
                                                        required

                                                    />
                                                </div>
                                                <div className="phone-div">

                                                    <input type="email" 
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        name="email"
                                                        className="form-control" placeholder="Email or Phone Number" required />
                                                </div>
                                                <div className="phone-div">

                                                    <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="Create Password" required />
                                                </div>
                                                <div className="phone-div">

                                                    <input type="password" name="confirmpassword" onChange={(e) => setConfirmPassword(e.target.value)} className="form-control" placeholder="Confirm Password" required />
                                                </div>

                                                <div className="forget2 mt-3 ml-3 d-flex justify-content-between">
                                                    <label className="form-check-label" htmlFor="exampleCheck1"> By clicking Register, you agree to our
                                                        Terms of Use
                                                        and
                                                        Cookie Policy</label>
                                                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                                </div>
                                            </div>
                                            <button type="submit" name="submit" className="btn continue-bn" onSubmit={handleSubmit}> Register </button>
                                        </div>

                                        <p className="text-center  mt-3"> Do not have an account?
                                            <a data-bs-toggle="modal" className="regster-bn" data-bs-target="#loginModal" data-bs-dismiss="modal"> Login </a>  </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                </section>
            </main>
        </>
    )
}

export default Register;