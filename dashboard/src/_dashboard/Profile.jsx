import React, { useState , useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col
} from "reactstrap";
import { logout } from "_redux/actions/auth";
import logo from "assets/img/FEAR/logo.png"; 

const Profile = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { user } = useSelector((state) => state.auth);

    //dispatch(loadProfile());
  
    const handleLogoutClick = (e) => {
      e.preventDefault();
      dispatch(logout());
    }

    useEffect(() => {
      if (user) {
        console.log("User Data :: ", user);
      }
    }, [history, user]);

  return (
    <>
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Edit Profile</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-md-1" md="5">
                      <FormGroup>
                        <label>Email Address (disabled)</label>
                        <Input
                          disabled
                          type="text"
                          defaultValue={user.email}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="px-md-1" md="3">
                      <FormGroup>
                        <label>Username</label>
                        <Input defaultValue={user.name} type="text" />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="4">
                      <FormGroup>
                        <label>Email address</label>
                        <Input placeholder="mike@email.com" type="email" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label>Full Name</label>
                        <Input defaultValue="Mike" value={user.name} type="text" />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="6">
                      <FormGroup>
                        <label>Username</label>
                        <Input defaultValue="Andrew" value={user.name} type="text" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Shipping Address</label>
                        <Input
                          defaultValue={user.address}
                          placeholder="Home Address"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md="4">
                      <FormGroup>
                        <label>Role</label>
                        <Input defaultValue="Mike" value={user.role} type="text" />
                      </FormGroup>
                    </Col>
                    <Col className="px-md-1" md="4">
                      <FormGroup>
                        <label>City</label>
                        <Input defaultValue="Andrew" type="text" />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="4">
                      <FormGroup>
                        <label>Postal Code</label>
                        <Input placeholder="ZIP Code" type="number" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="8">
                      <FormGroup>
                        <label>My Stuff</label>
                        <span> {user.wishlist} </span>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
              <CardFooter>
                <Button className="btn-fill" color="primary" type="submit">
                  Update
                </Button>
              </CardFooter>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <CardBody>
                <CardText />
                <div className="author">
                  <div className="block block-one" />
                  <div className="block block-two" />
                  <div className="block block-three" />
                  <div className="block block-four" />
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar"
                      src={(user.avatar.url === "") ? logo : user.avatar.url}
                    />
                    <h5 className="title">{user.name}</h5>
                  </a>
                  <p className="description">{user.role}</p>
                </div>
                <div className="card-description">
                  {user.address}
                </div>
              </CardBody>
              <CardFooter>
                <div className="button-container">
                  <Button className="btn-icon btn-round" color="facebook">
                    <i className="fab fa-facebook" />
                  </Button>
                  <Button className="btn-icon btn-round" color="twitter">
                    <i className="fab fa-twitter" />
                  </Button>
                  <Button className="btn-icon btn-round" color="google">
                    <i className="fab fa-google-plus" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Profile;
