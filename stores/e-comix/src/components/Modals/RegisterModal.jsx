import React, { useEffect } from "react";

const RegisterModal = () => {
    return (
            <>
            <div class="modal fade login-div-modal" id="registerModal">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-body">
                            <form action="index.html" method="get">
                                <div class="com-div-md">

                                    <h5 class="text-center mb-3"> Free Register </h5>
                                    <button type="button" class="close" data-bs-dismiss="modal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                                           
                                        </svg>
                                    </button>
                                    <div class="login-modal-pn">

                                        <div class="cm-select-login mt-0">
                                            <div class="country-dp">

                                                <input type="text" name="fullname" class="form-control" placeholder="Full Name" required />
                                            </div>
                                            <div class="phone-div">

                                                <input type="email" name="email" class="form-control" placeholder="Email or Phone Number" required />
                                            </div>
                                            <div class="phone-div">

                                                <input type="password" name="password" class="form-control" placeholder="Create Password" required />
                                            </div>
                                            <div class="phone-div">

                                                <input type="password" name="confirmpassword" class="form-control" placeholder="Confirm Password" required />
                                            </div>

                                            <div class="forget2 mt-3 ml-3 d-flex justify-content-between">
                                                <input type="checkbox" class="form-check-input" id="exampleCheck1">
                                                    <label class="form-check-label" for="exampleCheck1"> By clicking Register, you agree to our
                                                        Terms of Use
                                                        and
                                                        Cookie Policy</label>
                                            </div>
                                        </div>
                                        <button type="submit" name="submit" class="btn continue-bn"> Register </button>
                                    </div>

                                    <p class="text-center  mt-3"> Do not have an account?
                                        <a data-bs-toggle="modal" class="regster-bn" data-bs-target="#loginModal" data-bs-dismiss="modal"> Login </a>  </p>
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