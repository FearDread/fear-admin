import React, { useEffect } from "react";

const LostPModal = () => {
    return (
        <>
            <div className="modal fade login-div-modal" id="lostpsModal">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body">
                            <form action="index.html" method="get">
                                <div className="com-div-md">
                                    <h5 className="text-center mb-3"> Forget Your Password? </h5>
                                    <button type="button" className="close" data-bs-dismiss="modal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                        </svg>
                                    </button>
                                    <div className="login-modal-pn">
                                        <p> We'll email you a link to reset your password</p>
                                        <div className="cm-select-login mt-3">
                                            <div className="phone-div">
                                                <input type="email" name="email" className="form-control" placeholder="Enter Your Email" required />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn continue-bn"> Send Me a password reset Link </button>
                                    </div>

                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default LostPModal;