import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Footer = () => {

    return (
        <>
        <footer className="float-start w-100 position-relative">
            <div className="svg-bg">
                <img alt="sty" src="images/fg-bg.svg"/>
            </div>
            <div className="fuyr-divu float-start">  
     
                <div className="container">
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4">
                    <div className="col">
                    <div className="items-footer-div w-100">
                        <h5 className="text-white"> About </h5>
                        <ul className="mt-5">
                            <li>
                                <a href="about.html" className="d-flex align-items-center w-100">
                                    <span>  <i className="fas fa-caret-right"></i> </span> <span> About Us </span>
                                </a>
                            </li>
                  <li>
                    <a href="blog.html" className="d-flex align-items-center w-100">
                        <span>  <i className="fas fa-caret-right"></i> </span> <span> Blogs </span>
                    </a>
                  </li>
                  <li>
                    <a href="index.html" className="d-flex align-items-center w-100">
                        <span>  <i className="fas fa-caret-right"></i> </span> <span> Home </span>
                    </a>
                  </li>
                </ul>
            </div>
          </div>
          <div className="col">
            <div className="items-footer-div w-100">
                <h5 className="text-white"> Shop </h5>
                <ul className="mt-5">
                  <li>
                    <a href="shop.html" className="d-flex align-items-center w-100">
                        <span>  <i className="fas fa-caret-right"></i> </span> <span> Shop Al </span>
                    </a>
                  </li>
                  <li>
                    <a href="shop.html" className="d-flex align-items-center w-100">
                        <span>  <i className="fas fa-caret-right"></i> </span> <span> Comic </span>
                    </a>
                  </li>
                  <li>
                    <a href="blog.html" className="d-flex align-items-center w-100">
                        <span>  <i className="fas fa-caret-right"></i> </span> <span> blog </span>
                    </a>
                  </li>
                </ul>
            </div>
          </div>
          <div className="col">
            <div className="items-footer-div w-100">
                <h5 className="text-white"> Customer Care </h5>
                <ul className="mt-5">
                  <li>
                    <a href="contact.html" className="d-flex align-items-center w-100">
                        <span>  <i className="fas fa-caret-right"></i> </span> <span> Contact Us </span>
                    </a>
                  </li>
                  <li>
                    <a href="index.html#" className="d-flex align-items-center w-100">
                        <span>  <i className="fas fa-caret-right"></i> </span> <span> FAQ </span>
                    </a>
                  </li>
                  <li>
                    <a href="index.html" className="d-flex align-items-center w-100">
                        <span>  <i className="fas fa-caret-right"></i> </span> <span> Account Support </span>
                    </a>
                  </li>
                </ul>
            </div>
          </div>
          <div className="col">
            <div className="items-footer-div w-100">
                <h5 className="text-white"> Need More Help? </h5>
                <ul className="mt-5">
                  <li className="d-flex align-items-center w-100 text-white">
                   <span className="me-3"> <i className="fas fa-envelope"></i> </span> <span> exmaple@gmail.com </span>
                  </li>
                  <li className="d-flex align-items-center w-100 callo">
                    <span className="me-3"> <i className="fas fa-phone-alt"></i> </span> <span> 1800-254-256 </span>
                   </li>
                   <li className="d-flex align-items-center w-100 text-white">
                    <span className="me-3"> <i className="fas fa-envelope"></i> </span> <span> exmaple02@gmail.com </span>
                   </li>
                  
                  
                </ul>
            </div>
          </div>
        </div>
        <hr/>
        <a href="index.html#" className="text-center mx-auto my-5 d-table">
          <img alt="logo" src="images/foter-logo.png"/>
        </a>
        <ul className="solico my-5 d-block">
          <li className="d-flex justify-content-center align-items-center">
            <a href="index.html#" className="btn btn-socla">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="index.html#" className="btn btn-socla">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="index.html#" className="btn btn-socla">
              <i className="fab fa-google"></i>
            </a>
          </li>
        </ul>
        <div className="coptext mt-5 d-block">
           <ul className="d-lg-flex justify-content-center align-items-center">
            <li className="text-white">
              2023-2024 Rebbot All Rights Reserved.  Cookie
            </li>
            <li className="mx-lg-5">
              <a href="index.html#" className="text-white">  Terms & Conditions </a>
            </li>
            <li>
              <a href="index.html#" className="text-white">  Privacy Policy </a>
            </li>
           </ul>
        </div>
      </div>
      <div className="head-boyd-img">
          <img alt="ser" src="images/healboy.png"/>
      </div>
  </div>
</footer>
        </>
    )
}

export default Footer;