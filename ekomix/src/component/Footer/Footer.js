import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  Button,
  NavItem,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

const footMenu = [
  {
    id: 1,
    title: "Help",
    menu: [
      {
        id: 1,
        link: "Track Order",
        path: "/orders",
      },
      {
        id: 2,
        link: "FAQs",
        path: "/terms/conditions",
      },

      {
        id: 3,
        link: "Cancel Order",
        path: "/policy/return",
      },
      {
        id: 4,
        link: "Return Order",
        path: "/policy/return",
      },
      {
        id: 5,
        link: "Warranty Info",
        path: "/policy/Terms",
      },
    ],
  },
  {
    id: 2,
    title: "Policies",
    menu: [
      {
        id: 1,
        link: "Return Policy",
        path: "/policy/return",
      },
      {
        id: 2,
        link: "Security",
        path: "/policy/privacy",
      },
      {
        id: 3,
        link: "Sitemap",
        path: "/policy/Terms",
      },
      {
        id: 4,
        link: "Privacy Policy",
        path: "/policy/privacy",
      },
      {
        id: 5,
        link: "T&C",
        path: "/terms/conditions",
      },
    ],
  },
  {
    id: 3,
    title: "Company",
    menu: [
      {
        id: 1,
        link: "About Us",
        path: "/about",
      },
      {
        id: 2,
        link: "Contact Us",
        path: "/contact",
      },
      {
        id: 3,
        link: "Service Centres",
        path: "/",
      },
      {
        id: 4,
        link: "Careers",
        path: "/",
      },
      {
        id: 5,
        link: "Affiliates",
        path: "/terms/conditions",
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md="3">
            <img src={require("assets/img/ekomix/logo_transparent.png")} alt="logo" />
          </Col>

            {footMenu.map((item) => {
                const { id, title, menu } = item;
                return (
                  <Col className="col-6 col-md-2">
                    <Nav className="nav" key={id}>
                      <h3 className="title">{title}</h3>

                      {menu.map((item) => {
                        const { id, link, path } = item;
                        return (
                          <NavItem key={id} className="nav-item">
                            <a key={id} className="nav-link" href={path}>
                              {link}
                            </a>
                          </NavItem>
                        );
                      })}
                    </Nav>
                  </Col>
                );
              }
            )}
           <Col className="col-6 col-md-2">
            <Nav>
              <h3 className="title">Follow us:</h3>
              <div className="btn-wrapper profile">
                <Button
                  className="btn-icon btn-neutral btn-round btn-simple"
                  color="default"
                  href="https://twitter.com/creativetim"
                  id="tooltip622135962"
                  target="_blank"
                >
                  <i className="fab fa-twitter" />
                </Button>
                <UncontrolledTooltip delay={0} target="tooltip622135962">
                  Follow us
                </UncontrolledTooltip>
                <Button
                  className="btn-icon btn-neutral btn-round btn-simple"
                  color="default"
                  href="https://www.facebook.com/creativetim"
                  id="tooltip230450801"
                  target="_blank"
                >
                  <i className="fab fa-facebook-square" />
                </Button>
                <UncontrolledTooltip delay={0} target="tooltip230450801">
                  Like us
                </UncontrolledTooltip>
                <Button
                  className="btn-icon btn-neutral btn-round btn-simple"
                  color="default"
                  href="https://dribbble.com/creativetim"
                  id="tooltip318450378"
                  target="_blank"
                >
                  <i className="fab fa-dribbble" />
                </Button>
                <UncontrolledTooltip delay={0} target="tooltip318450378">
                Follow us
                </UncontrolledTooltip>
                </div>
              </Nav>
            </Col>
          </Row>
        </Container>
      </footer>
  )
}
