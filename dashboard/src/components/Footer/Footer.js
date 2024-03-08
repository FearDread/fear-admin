import React from "react";
import { Container, Row } from "reactstrap";
import PropTypes from "prop-types";

const Footer = (props) => {
  return (
    <footer className={"footer" + (props.default ? " footer-default" : "")}>
      <Container fluid={props.fluid ? true : false}>
        <ul className="nav">
          <li className="nav-item">
            <a className="nav-link" href="https://fear.master.com">
              Face Everything and Rise
            </a>
          </li>{" "}
          <li className="nav-item">
            <a
              className="nav-link"
              href="http://fear.master.com/about"
            >
              About us
            </a>
          </li>{" "}
          <li className="nav-item">
            <a className="nav-link" href="http://fear.master.com/blog">
              Blog
            </a>
          </li>
        </ul>
        <div className="copyright">
          © {new Date().getFullYear()} inspired with{" "}
          <i className="tim-icons icon-heart-2" /> by{" "}
          <a href="https://www.creative-tim.com/" target="_blank">
            Creative Tim
          </a>{" "}
          for a better web.
        </div>
      </Container>
    </footer>
  );
};

Footer.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool
};

export default Footer;
