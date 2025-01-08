import React, { useEffect } from "react"
import { useSelector } from "react-redux";

import { auth } from "@feardread/crud-service";

const LoginModal = () => {

    return (
        <>
            <div class="modal fade login-div-modal" id="loginModal">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                        </div>
                        <div class="modal-body">
                            <form action="index.html" method="get">
                                <div id="login-td-div" class="com-div-md">
                                    <h5 class="text-center mb-3"> Login </h5>
                                    <button type="button" class="close" data-bs-dismiss="modal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                        </svg>
                                    </button>
                                    <div class="login-modal-pn">
                                        <div class="cm-select-login mt-3">
                                            <div class="country-dp">
                                                <input type="email" name="user" class="form-control" placeholder="Username Or Email" required />
                                            </div>
                                            <div class="phone-div">
                                                <input type="password" name="password" class="form-control" placeholder="Password" required />
                                            </div>
                                        </div>
                                        <button type="submit" name="submit" class="btn continue-bn"> <i class="fas fa-lock"></i> SIGN IN </button>
                                    </div>
                                    <p class="text-center  mt-3">
                                        <a data-bs-toggle="modal" class="regster-bn" data-bs-target="#lostpsModal" data-bs-dismiss="modal"> Lost Password ? </a>  </p>
                                    <p class="text-center  mt-3"> Do not have an account?
                                        <a data-bs-toggle="modal" class="regster-bn" data-bs-target="#registerModal" data-bs-dismiss="modal"> Register </a>  </p>
                                </div>
                            </form>

                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginModal;