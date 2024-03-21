import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  Button,
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

export default function NavbarMain() {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [collapseOut, setCollapseOut] = React.useState("");
  const [color, setColor] = React.useState("navbar-transparent");
  React.useEffect(() => {
    window.addEventListener("scroll", changeColor);
    return function cleanup() {
      window.removeEventListener("scroll", changeColor);
    };
  }, []);
  const changeColor = () => {
    if (
      document.documentElement.scrollTop > 99 ||
      document.body.scrollTop > 99
    ) {
      setColor("bg-info");
    } else if (
      document.documentElement.scrollTop < 100 ||
      document.body.scrollTop < 100
    ) {
      setColor("navbar-transparent");
    }
  };
  const toggleCollapse = () => {
    document.documentElement.classList.toggle("nav-open");
    setCollapseOpen(!collapseOpen);
  };
  const onCollapseExiting = () => {
    setCollapseOut("collapsing-out");
  };
  const onCollapseExited = () => {
    setCollapseOut("");
  };
  return (
    <Navbar className={"fixed-top " + color} color-on-scroll="100" expand="lg">
      <Container>
        <div className="navbar-translate">
          <NavbarBrand to="/" id="navbar-brand" tag={Link}>
            <span>BLK• </span>
            Design System React
          </NavbarBrand>
          <UncontrolledTooltip placement="bottom" target="navbar-brand">
            Designed and Coded by Creative Tim
          </UncontrolledTooltip>
          <button
            aria-expanded={collapseOpen}
            className="navbar-toggler navbar-toggler"
            onClick={toggleCollapse}
          >
            <span className="navbar-toggler-bar bar1" />
            <span className="navbar-toggler-bar bar2" />
            <span className="navbar-toggler-bar bar3" />
          </button>
        </div>
        <Collapse
          className={"justify-content-end " + collapseOut}
          navbar
          isOpen={collapseOpen}
          onExiting={onCollapseExiting}
          onExited={onCollapseExited}
        >
          <div className="navbar-collapse-header">
            <Row>
              <Col className="collapse-brand" xs="6">
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                  BLK•React
                </a>
              </Col>
              <Col className="collapse-close text-right" xs="6">
                <button
                  aria-expanded={collapseOpen}
                  className="navbar-toggler"
                  onClick={toggleCollapse}
                >
                  <i className="tim-icons icon-simple-remove" />
                </button>
              </Col>
            </Row>
          </div>
          <Nav navbar>
            <NavItem className="p-0">
              <NavLink
                data-placement="bottom"
                href="https://twitter.com/CreativeTim"
                rel="noopener noreferrer"
                target="_blank"
                title="Follow us on Twitter"
              >
                <i className="fab fa-twitter" />
                <p className="d-lg-none d-xl-none">Twitter</p>
              </NavLink>
            </NavItem>
            <NavItem className="p-0">
              <NavLink
                data-placement="bottom"
                href="https://www.facebook.com/CreativeTim"
                rel="noopener noreferrer"
                target="_blank"
                title="Like us on Facebook"
              >
                <i className="fab fa-facebook-square" />
                <p className="d-lg-none d-xl-none">Facebook</p>
              </NavLink>
            </NavItem>
            <NavItem className="p-0">
              <NavLink
                data-placement="bottom"
                href="https://www.instagram.com/CreativeTimOfficial"
                rel="noopener noreferrer"
                target="_blank"
                title="Follow us on Instagram"
              >
                <i className="fab fa-instagram" />
                <p className="d-lg-none d-xl-none">Instagram</p>
              </NavLink>
            </NavItem>
            <NavItem>
              <Button
                className="nav-link d-none d-lg-block"
                color="primary"
                target="_blank"
                href="https://www.creative-tim.com/product/blk-design-system-pro-react?ref=bdsr-examples-navbar-upgrade-pro"
              >
                <i className="tim-icons icon-spaceship" /> Upgrade to PRO
              </Button>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/">
                Back to Kit
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/creativetimofficial/blk-design-system-react/issues">
                Have an issue?
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

/*

    <nav class="fixed-top bg-info navbar navbar-expand-lg">
        <div class="container">
            <div class="navbar-translate">
                <a id="tooltip6619950104" class="navbar-brand" href="#/index"><span>BLK•</span> Design System PRO React</a>
                <button class="navbar-toggler" id="navigation"><span class="navbar-toggler-bar bar1"></span><span class="navbar-toggler-bar bar2"></span><span class="navbar-toggler-bar bar3"></span></button>
            </div>
            <div toggler="#navigation" class="collapse navbar-collapse">
                <div class="navbar-collapse-header">
                    <div class="row">
                        <div class="collapse-brand col-6">
                            <a href="#pablo">BLK• <span>PRO React</span></a>
                        </div>
                        <div class="collapse-close text-right col-6">
                            <button class="navbar-toggler" id="navigation"><i class="tim-icons icon-simple-remove"></i></button>
                        </div>
                    </div>
                </div>
                <ul class="ml-auto navbar-nav">
                    <li class="dropdown nav-item">
                        <a aria-haspopup="true" href="#" class="dropdown-toggle nav-link" aria-expanded="false"><i class="fa fa-cogs d-lg-none d-xl-none"></i>Getting started</a>
                        <div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-with-icons dropdown-menu">
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/index"><i class="tim-icons icon-paper"></i>Components</a>
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/presentation"><i class="tim-icons icon-bullet-list-67"></i>Presentation Page</a>
                            <a href="https://demos.creative-tim.com/blk-design-system-pro-react/#/documentation/overview?ref=blkdspr-pages-navbar" target="_blank" tabindex="0" role="menuitem" class="dropdown-item">
                                <i class="tim-icons icon-book-bookmark"></i>Documentation
                            </a>
                        </div>
                    </li>
                    <li class="dropdown nav-item">
                        <a aria-haspopup="true" href="#" class="dropdown-toggle nav-link" aria-expanded="false">
                            <i aria-hidden="true" class="tim-icons icon-paper"></i>
                            <p>Sections</p>
                        </a>
                        <div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu dropdown-menu-right">
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/sections#headers"><i class="tim-icons icon-app"></i>Headers</a>
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/sections#features"><i class="tim-icons icon-settings"></i>Features</a>
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/sections#blogs"><i class="tim-icons icon-align-left-2"></i>Blogs</a>
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/sections#teams"><i class="tim-icons icon-user-run"></i>Teams</a>
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/sections#projects"><i class="tim-icons icon-paper"></i>Projects</a>
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/sections#pricing"><i class="tim-icons icon-money-coins"></i>Pricing</a>
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/sections#testimonials"><i class="tim-icons icon-chat-33"></i>Testimonials</a>
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/sections#contactus"><i class="tim-icons icon-mobile"></i>Contact Us</a>
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/sections#tables"><i class="tim-icons icon-chart-bar-32"></i>Tables</a>
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/sections#accordion"><i class="tim-icons icon-paper"></i>Accordion</a>
                        </div>
                    </li>
                    <li class="dropdown nav-item">
                        <a aria-haspopup="true" href="#" class="dropdown-toggle nav-link" aria-expanded="false">
                            <i aria-hidden="true" class="tim-icons icon-book-bookmark"></i>
                            <p>Examples</p>
                        </a>
                        <div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu dropdown-menu-right">
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/about-us"><i class="tim-icons icon-bulb-63"></i>About-us</a>
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/blog-post"><i class="tim-icons icon-align-center"></i>Blog Post</a>
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/blog-posts"><i class="tim-icons icon-chart-bar-32"></i>Blog Posts</a>
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/contact-us"><i class="tim-icons icon-square-pin"></i>Contact Us</a>
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/landing-page"><i class="tim-icons icon-paper"></i>Landing Page</a>
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/pricing"><i class="tim-icons icon-coins"></i>Pricing</a>
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/ecommerce"><i class="tim-icons icon-basket-simple"></i>Ecommerce Page</a>
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/product-page"><i class="tim-icons icon-bag-16"></i>Product Page</a>
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/profile-page"><i class="tim-icons icon-lock-circle"></i>Profile Page</a>
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/404-error"><i class="tim-icons icon-button-power"></i>404 Error Page</a>
                            <a tabindex="0" role="menuitem" class="dropdown-item" href="#/500-error"><i class="tim-icons icon-alert-circle-exc"></i>500 Error Page</a>
                            <div class="dropdown">
                                <a href="#pablo" aria-haspopup="true" class="dropdown-item dropdown-toggle" aria-expanded="false"><i aria-hidden="true" class="tim-icons icon-book-bookmark"></i>App Pages</a>
                                <div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu">
                                    <a tabindex="0" role="menuitem" class="dropdown-item" href="#/account-settings"><i class="tim-icons icon-lock-circle"></i>Account Settings</a>
                                    <a tabindex="0" role="menuitem" class="dropdown-item" href="#/login-page"><i class="tim-icons icon-tablet-2"></i>Login Page</a>
                                    <a tabindex="0" role="menuitem" class="dropdown-item" href="#/register-page"><i class="tim-icons icon-laptop"></i>Register Page</a>
                                    <a tabindex="0" role="menuitem" class="dropdown-item" href="#/reset-page"><i class="tim-icons icon-molecule-40"></i>Reset Page</a>
                                    <a tabindex="0" role="menuitem" class="dropdown-item" href="#/invoice-page"><i class="tim-icons icon-notes"></i>Invoice Page</a>
                                    <a tabindex="0" role="menuitem" class="dropdown-item" href="#/checkout-page"><i class="tim-icons icon-basket-simple"></i>Checkout Page</a>
                                    <a tabindex="0" role="menuitem" class="dropdown-item" href="#/chat-page"><i class="tim-icons icon-email-85"></i>Chat Page</a>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a href="https://www.creative-tim.com/product/blk-design-system-pro-react?reaf=blkdspr-pages-navbar" target="_blank" class="nav-link btn btn-default btn-sm"><p>Buy Now</p></a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    */