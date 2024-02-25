import React, { useState , useEffect } from "react";
import classnames from "classnames";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col
} from "reactstrap";
import AnimatedBackground from "views/components/AnimatedBackground";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, Link } from "react-router-dom";
import { login, clearErrors } from "_actions/userAction";
import Loader from "components/Loader/Loading";

const Login = () => {
  const [state, setState] = React.useState({});
  const history = useHistory();
  const loaction = useLocation();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const { isAuthenticated, loading, error } = useSelector((state) => state.userData);

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    setIsValidEmail(
      newEmail !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)
    );
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };
  

  const isSignInDisabled = !(email && password && isValidEmail);
  const redirect = loaction.search ? loaction.search.split("=")[1] : "/admin";
   
  useEffect(() => {
     if (error) {
       dispatch(clearErrors());
     }

     if (isAuthenticated) {
       history.push(redirect);
     }
  }, [dispatch, isAuthenticated, history, redirect]);

  function handleLoginSubmit(e) {
       e.preventDefault();
       dispatch(login(email, password));
  }


  return (
    <>
    {loading ? (
      <Loader />
    ) : (
    <>
      <AnimatedBackground />
      <div className="content">
        <Container>
          <Col className="ml-auto mr-auto" lg="4" md="6">
            <Form className="form">
              <Card className="card-login card-white">
                <CardHeader>
                  <img alt="..." src={require("assets/img/card-primary.png")} />
                  <CardTitle tag="h1">Log in</CardTitle>
                </CardHeader>
                <CardBody>
                  <InputGroup
                    className={classnames({
                      "input-group-focus": state.emailFocus
                    })}
                  >
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="tim-icons icon-email-85" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="text"
                      onFocus={(e) => setState({ ...state, emailFocus: true })}
                      onBlur={(e) => setState({ ...state, emailFocus: false })}
                      value={email}
                      autocomplete="email"
                      onChange={handleEmailChange}
                    />
                  </InputGroup>
                  <InputGroup
                    className={classnames({
                      "input-group-focus": state.passFocus
                    })}
                  >
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="tim-icons icon-lock-circle" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      autocomplete="password"
                      onFocus={(e) => setState({ ...state, passFocus: true })}
                      onBlur={(e) => setState({ ...state, passFocus: false })}
                      value={password}
                      onChange={handlePasswordChange}
                    />
                  </InputGroup>
                </CardBody>
                <CardFooter>
                  <Button
                    block
                    className="mb-3"
                    color="primary"
                    disabled={isSignInDisabled}
                    onClick={handleLoginSubmit}
                    size="lg"
                  >
                    Get Started
                  </Button>
                  <div className="pull-left">
                    <h6>
                      <Link to="/register"  className="link footer-link">
                          Create Account
                      </Link>
                    </h6>
                  </div>
                  <div className="pull-right">
                    <h6>
                      <a
                        className="link footer-link"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        Need Help?
                      </a>
                    </h6>
                  </div>
                </CardFooter>
              </Card>
            </Form>
          </Col>
        </Container>
      </div>
    </>
    )};
  </>
  )
};

export default Login;
