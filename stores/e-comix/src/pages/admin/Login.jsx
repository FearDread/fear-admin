import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Auth } from "../../features/user/slice";
import BannerSub from "../../components/Banner/BannerSub";


const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { success, error } = useSelector((state) => state.auth)
    const userState = useSelector( state => state.auth.data );

    const loginHandler = (e) => {
        e.preventDefault();
        const myForm = new FormData();

        myForm.set("email", email);
        myForm.set("password", password);

        dispatch(Auth.login(myForm));
    }

    return (
        <>
        <BannerSub />
            <main class="float-start w-100 total-body home-body mt-0">
                <section class="cart-page-div pt-5 d-inline-block w-100">
                    <div class="container">
                        <div class="row gx-lg-5">
                            <form action="index.html" method="get">
                                <div id="login-td-div" className="com-div-md">
                                    <h5 className="text-center mb-3"> Login </h5>
                                    <button type="button" className="close" data-bs-dismiss="modal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                        </svg>
                                    </button>
                                    <div className="login-modal-pn">
                                        <div className="cm-select-login mt-3">
                                            <div className="country-dp">
                                                <input
                                                    name="email"
                                                    className="form-control"
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    type="email"
                                                    placeholder="Email address *"
                                                    required />

                                            </div>
                                            <div className="phone-div">
                                                <input
                                                    name="password"
                                                    className="form-control"
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    type="password"
                                                    placeholder="Password *"
                                                    required />

                                            </div>
                                        </div>
                                        <button
                                            type="submit" 
                                            name="submit" 
                                            className="btn continue-bn"
                                            onClick={loginHandler} >
                                            <i className="fas fa-lock"></i> 
                                            SIGN IN 
                                        </button>
                                    </div>
                                    <p className="text-center  mt-3">
                                        <a data-bs-toggle="modal" className="regster-bn" data-bs-target="#lostpsModal" data-bs-dismiss="modal"> Lost Password ? </a>  </p>
                                    <p className="text-center  mt-3"> Do not have an account?
                                        <a data-bs-toggle="modal" className="regster-bn" data-bs-target="#registerModal" data-bs-dismiss="modal"> Register </a>  </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default Login;