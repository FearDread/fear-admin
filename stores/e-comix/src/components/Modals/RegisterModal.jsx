import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { auth } from "@feardread/crud-service";

const RegisterModal = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
 
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("register hit = ");

        const myForm = new FormData();
              myForm.set("fullname", name);
              myForm.set("email", email);
              myForm.set("mobile", mobile);
              myForm.set("password", password);
    
        dispatch(auth.register(myForm));
      }


    return (
            <>
            <div className="modal fade login-div-modal" id="registerModal">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body">
                            <form action="index.html
                            " method="get">
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

                                                <input type="email" name="email" className="form-control" placeholder="Email or Phone Number" required />
                                            </div>
                                            <div className="phone-div">

                                                <input type="password" name="password" className="form-control" placeholder="Create Password" required />
                                            </div>
                                            <div className="phone-div">

                                                <input type="password" name="confirmpassword" className="form-control" placeholder="Confirm Password" required />
                                            </div>

                                            <div className="forget2 mt-3 ml-3 d-flex justify-content-between">
                                            <label className="form-check-label" for="exampleCheck1"> By clicking Register, you agree to our
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
                </div>
            </div>
        </>
    )
}

export default RegisterModal;