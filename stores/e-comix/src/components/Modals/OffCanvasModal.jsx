import React, { useEffect } from "react";

const OffCanvasModal = () => {

    return (
        <>
            <div className="offcanvas offcanvas-end desktop-rightcanvas" id="offcanvasRightmobile">
                <div className="offcanvas-header py-0">
                    <button type="button" className="close-menu-02 btn mt-4" data-bs-dismiss="offcanvas">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                        </svg>
                    </button>
                </div>
                <div className="offcanvas-body px-5">
                    <div className="head-contact d-none d-lg-block mt-3">
                        <a href="index.html" className="logo-side">
                            <img src="images/logo.svg" alt="logo" />
                        </a>
                        <p className="mt-4"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                            standard dummy text ever since the 1500s, when an unknown printer
                            took a galley of type and scrambled it to make a type specimen book.
                        </p>
                        <div className="quick-link my-4">
                            <ul>
                                <li>
                                    <span className="svg-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt" viewBox="0 0 16 16">
                                            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                                            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                        </svg>
                                    </span>
                                    <span> 89 Mounthoolie Lane,<br /> Sutton Bassett, UK </span> </li>
                                <li> <i className="fab fa-whatsapp"></i> <span> 180-205-2560 </span>  </li>
                                <li>
                                    <span className="svg-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
                                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                                        </svg>
                                    </span>
                                    <span> example@gmail.com </span> </li>
                            </ul>
                        </div>
                        <ul className="side-media d-flex align-items-center mt-5">
                            <li> <a href="blog.html#"> <i className="fab fa-facebook-f"></i> </a> </li>
                            <li> <a href="blog.html#"> <i className="fab fa-twitter"></i> </a> </li>
                            <li> <a href="blog.html#"> <i className="fab fa-google-plus-g"></i> </a> </li>
                            <li> <a href="blog.html#"> <i className="fab fa-instagram"></i> </a> </li>
                        </ul>
                    </div>

                    <div className="head-contact d-block d-lg-none mt-3">
                        <a href="index.html" className="logo-side">
                            <img src="images/logo.svg" alt="logo" />
                        </a>

                        <ul className="side-media list-unstyled">
                            <li> <a href="blog.html#"> <i className="fab fa-facebook-f"></i> </a> </li>
                            <li> <a href="blog.html#"> <i className="fab fa-twitter"></i> </a> </li>
                            <li> <a href="blog.html#"> <i className="fab fa-google-plus-g"></i> </a> </li>
                            <li> <a href="blog.html#"> <i className="fab fa-instagram"></i> </a> </li>
                        </ul>
                    </div>


                </div>
            </div>
        </>
    )
}

export default OffCanvasModal;