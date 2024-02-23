import React, { useState, useEffect } from "react";
import classnames from "classnames";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImg,
  CardTitle,
  Label,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";

//import { Link } from "react-router-dom";
import { signUp, clearErrors } from "../../_actions/userAction";
import { useDispatch, useSelector } from "react-redux";
//import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";
import AnimatedBackground from "views/components/AnimatedBackground";

const Register = () => {
  const dispatch = useDispatch();
  //const alert = useAlert();
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = React.useState({});
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidName, setIsValidName] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  //const [confirmPassword, setconfirmPassword] = useState("");

  const { isAuthenticated, error } = useSelector((state) => state.userData);

  useEffect(() => {
    if (error) {
      //alert.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      //alert.success("User Registered Successfully");
      history.push("/account");
    }
  }, [dispatch, isAuthenticated, error , history]);

  React.useEffect(() => {
    document.body.classList.toggle("register-page");
    return function cleanup() {
      document.body.classList.toggle("register-page");
    };
  });


  
  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    setIsValidEmail(
      newEmail !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)
    );
  };
  
  const handleNameChange = (event) => {
    const newName = event.target.value;
    setName(newName);
    setIsValidName(newName.length >= 4 && newName.length <= 20);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
      setIsValidPassword(event.target.value.length >= 8);
  };
  //const handleConfirmPasswordChange = (event) => {
  //  setconfirmPassword(event.target.value);
  //};

  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };

  function handleSignUpSubmit(e) {
    //setLoading(true);
  e.preventDefault();

  const formData = new FormData();
  formData.set("name", name);
  formData.set("email", email);
  formData.set("password", password);
  //formData.set("avatar", avatar);

  dispatch(signUp(formData));
  //setLoading(false);
}
  
  return (
    <>
      <AnimatedBackground />
      <div className="content">
        <Container>
          <Row>
            <Col className="ml-auto" md="5">
              <div className="info-area info-horizontal mt-5">
                <div className="icon icon-warning">
                  <i className="tim-icons icon-wifi" />
                </div>
                <div className="description">
                  <h3 className="info-title">Marketing</h3>
                  <p className="description">
                    We've created the marketing campaign of the website. It was
                    a very interesting collaboration.
                  </p>
                </div>
              </div>
              <div className="info-area info-horizontal">
                <div className="icon icon-primary">
                  <i className="tim-icons icon-triangle-right-17" />
                </div>
                <div className="description">
                  <h3 className="info-title">Fully Coded in HTML5</h3>
                  <p className="description">
                    We've developed the website with HTML5 and CSS3. The client
                    has access to the code using GitHub.
                  </p>
                </div>
              </div>
              <div className="info-area info-horizontal">
                <div className="icon icon-info">
                  <i className="tim-icons icon-trophy" />
                </div>
                <div className="description">
                  <h3 className="info-title">Built Audience</h3>
                  <p className="description">
                    There is also a Fully Customizable CMS Admin Dashboard for
                    this product.
                  </p>
                </div>
              </div>
            </Col>
            <Col className="mr-auto" md="7">
              <Card className="card-register card-white">
                <CardHeader>
                  <CardImg
                    alt="..."
                    src={require("assets/img/card-primary.png")}
                  />
                  <CardTitle tag="h4">Register</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form className="form">
                    <InputGroup
                      className={classnames({
                        "input-group-focus": state.nameFocus
                      })}
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="tim-icons icon-single-02" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Full Name"
                        type="text"
                        onFocus={(e) => setState({ ...state, nameFocus: true })}
                        onBlur={(e) => setState({ ...state, nameFocus: false })}
                        value={name}
                        onChange={handleNameChange}
                        error={!isValidName && name !== ""}
                      />
                    </InputGroup>
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
                        onFocus={(e) =>
                          setState({ ...state, emailFocus: true })
                        }
                        onBlur={(e) =>
                          setState({ ...state, emailFocus: false })
                        }
                        error={!isValidEmail && email !== ""}
                        value={email}
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
                        type="text"
                        onFocus={(e) => setState({ ...state, passFocus: true })}
                        onBlur={(e) => setState({ ...state, passFocus: false })}
                        error={!isValidPassword && password !== ""}
                        onClick={handleShowPasswordClick}
                        value={password}
                        onChange={handlePasswordChange}
                        
                      />
                    </InputGroup>
                    <FormGroup check className="text-left">
                      <Label check>
                        <Input type="checkbox" />
                        <span className="form-check-sign" />I agree to the{" "}
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          terms and conditions
                        </a>
                        .
                      </Label>
                    </FormGroup>
                  </Form>
                </CardBody>
                <CardFooter>
                  <Button
                    className="btn-round"
                    color="primary"
                    href="#pablo"
                    onClick={handleSignUpSubmit}
                    size="lg"
                  >
                    Get Started
                  </Button>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Register;
