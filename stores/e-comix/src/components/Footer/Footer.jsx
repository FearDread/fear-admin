import React from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/images/ekomix/logo_transparent.png";
import paymentIcon from "../../assets/images/paymentIcon.png";
import PageEdge from "../PageEdge/PageEdge";
import "./Footer.css";

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault(); 
    alert("Subscribed Successfully");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <section className="footer float-start w-100">
       <div className="container">
          <div className="row">
            <div className="col-lg-3 footer-logo">
              <a href="index.html"><span>.</span></a>
              <img src="images/ekomix/logo_transparent.png" alt="bat-img" />
            </div>
            <div className="col-lg-2 col-md-4 footer-menu">
              <h3>Quick Link</h3>
              <a href="/">Home Page</a>
              <a href="/about#">About</a>
              <a href="/contact">Contact Us</a>
            </div>
            <div className="col-lg-2 col-md-4 footer-menu">
              <h3>Community</h3>
              <a href="/contact#">Career Page</a>
              <a href="/faq">FAQ</a>
              <a href="index.html#">Supports</a>
              <a href="/privacy#">Privacy Policy</a>
              <a href="index.html#">Affiliate Marketing</a>
              <a href="index.html#">Partnership</a>
              <a href="/terms#">Terms & Condition</a>
            </div>
            <div className="col-lg-2 col-md-4 footer-menu">
              <h3>Action Link</h3>
              <a href="/contact">Contact Us</a>
              <a href="index.html#">Payments</a>
              <a href="/shop">Comic Books</a>
              <a href="/collection">Community</a>
            </div>
            <div className="col-lg-3 footer-action">
              <h3>Connect Us</h3>
              <div className="footer-social">
                <a href="index.html#"><i className="fa-brands fa-facebook-f"></i></a>
                <a href="index.html#"><i className="fa-brands fa-instagram"></i></a>
                <a href="index.html#"><i className="fa-brands fa-twitter"></i></a>
                <a href="index.html#"><i className="fa-brands fa-youtube"></i></a>
                <a href="index.html#"><i className="fa-brands fa-tiktok"></i></a>
              </div>
              <h3>Get The App</h3>
              <div className="footer-download">
                <a href="index.html#" className="button-primary android"><i className="fa-brands fa-google-play"></i> Play Store</a>
                <a href="index.html#" className="button-primary ios"><i className="fa-brands fa-apple"></i> App Store</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    <PageEdge />

      <section className="copy_right float-start w-100">
        <div className="container">
          <div className="row copyright-txt">
            <div className="col-lg-6">
              <span>LANGUAGE: </span>
              <a href="#">BAN</a>
              <a href="#">NL</a>
              <a href="#" className="active">EN</a>
              <a href="#">FR</a>
              <a href="#">EU</a>
            </div>
            <div className="col-lg-6 text-end">
              <p>&copy; Made with love by InMoshyn Inc.n. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Footer;
