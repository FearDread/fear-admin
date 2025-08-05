import React, { useState, useEffect } from "react";
import { VectorMap } from "react-jvectormap";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Loader from "components/Loader/Loading.js";
import { logout } from "_redux/auth/actions";
import { Line, Bar, Pie } from "react-chartjs-2";
import * as UserActions from "_redux/user/actions";
import * as ProductActions from "_redux/product/actions";
import * as TaskActions from "_redux/task/actions";
import { TaskRow } from "components/TaskRow/TaskRow";
import logo from "assets/img/FEAR/logo.png";
// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Progress,
  Table,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";

import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4
} from "variables/charts.js";
// core components
import {
  chartExample5,
  chartExample6,
  chartExample7,
  chartExample8,
  chartExample9,
  chartExample10
} from "variables/charts.js";
var mapData = {
  AU: 760,
  BR: 550,
  CA: 120,
  DE: 1300,
  FR: 540,
  GB: 690,
  GE: 200,
  IN: 200,
  RO: 600,
  RU: 300,
  US: 2920
};


const Dashboard = () => {
  let totalInventory = 0;
  const dispatch = useDispatch();
  const history = useHistory();
  const [toggle, setToggle] = useState(false);
  const [bigChartData, setbigChartData] = React.useState("data1");
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.user);
  const { products, loading } = useSelector((state) => state.product);
  const { tasks } = useSelector((state) => state.task);



  const setBgChartData = (name) => {
    setbigChartData(name);
  };

  const logoutHandler = () => {
    dispatch(logout());
    alert.success("Logged out successfully");
    history.push("/login");
  };

  useEffect(() => {

    dispatch(ProductActions.list());
    dispatch(UserActions.list());
    dispatch(TaskActions.list());

  }, [dispatch]);
  
  return (
    <>
    {loading ? (
      <Loader />
    ) : (
    <>
      <div className="content">
          <Row>
            <Col Lg="5">

            <Row>
          <Col className="ml-auto" md="5">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Multiple Bars Chart With Grid</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-time-alarm text-warning" />{" "}
                  130,000$
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Bar
                    data={chartExample8.data}
                    options={chartExample8.options}
                  />
                </div>
              </CardBody>
            </Card>
            </Col>
           <Col className="mr-auto" md="5">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">With Numbers and Grid</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-send text-info" /> 750,000€
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chartExample6.data}
                    options={chartExample6.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
            <Row>
              <Col xs="4" sm="3">
                <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col xs="5">
                    <div className="info-icon text-center icon-warning">
                      <i className="tim-icons icon-chat-33" />
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Inventory</p>
                      <CardTitle tag="h3">{products && products.length}</CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="tim-icons icon-refresh-01" /> Update Now
                </div>
              </CardFooter>
            </Card>
            </Col>
            <Col xs="4" sm="3">
            <Card className="card-stats card-animation-on-hover">
              <CardBody>
                <Row>
                  <Col xs="5">
                    <div className="info-icon text-center icon-primary">
                      <i className="tim-icons icon-shape-star" />
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Followers</p>
                      <CardTitle tag="h3">+45k</CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="tim-icons icon-sound-wave" /> Last Research
                </div>
              </CardFooter>
            </Card>
            </Col>
            <Col xs="4" sm="3">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col xs="5">
                    <div className="info-icon text-center icon-success">
                      <i className="tim-icons icon-single-02" />
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Users</p>
                      <CardTitle tag="h3">150,000</CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="tim-icons icon-trophy" /> Customers feedback
                </div>
              </CardFooter>
            </Card>
            </Col>
            <Col xs="4" sm="3">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col xs="5">
                    <div className="info-icon text-center icon-danger">
                      <i className="tim-icons icon-molecule-40" />
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Errors</p>
                      <CardTitle tag="h3">12</CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="tim-icons icon-watch-time" /> In the last hours
                </div>
              </CardFooter>
            </Card>
            </Col>
            </Row>
          </Col>

          <Col lg="5">
          <Card className="card-tasks">
              <CardHeader>
                <h6 className="title d-inline">Tasks(5)</h6>
                <p className="card-category d-inline">today</p>
              </CardHeader>
              <CardBody>
                <div className="table-full-width table-responsive">
                  <Table>
                    <tbody>
                      {tasks && tasks.map((item, idx) => {
                        return (
    
                        <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input
                                defaultChecked
                                defaultValue=""
                                type="checkbox"
                              />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Task # {idx}</p>
                          <p className="text-muted">
                            {item.task}
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip155151810"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip155151810"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                        </tr>
                      
                          )
                      })}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="7">
            <Card>
              <CardHeader>
                <div className="tools float-right">
                  <UncontrolledDropdown>
                    <DropdownToggle
                      caret
                      className="btn-icon"
                      color="link"
                      data-toggle="dropdown"
                      type="button"
                    >
                      <i className="tim-icons icon-settings-gear-63" />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        Action
                      </DropdownItem>
                      <DropdownItem
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        Another action
                      </DropdownItem>
                      <DropdownItem
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        Something else
                      </DropdownItem>
                      <DropdownItem
                        className="text-danger"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        Remove Data
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
                <CardTitle tag="h5">Users Table</CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th className="text-center">Avatar</th>
                      <th>Name</th>
                      <th>Email Address</th>
                      <th>Role</th>
                      <th>Mobile</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users && users.map((user, idx) => {
                      return (
                        <tr>
                        <td className="text-center">
                          <div className="photo">
                            <img
                              alt="..."
                              src={user.avatar ? user.avatar.url : logo}
                            />
                          </div>
                        </td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td className="text-center">
                          <div className="progress-container progress-sm">
                            <span>{user.role}</span>
                          </div>
                        </td>
                        <td className="text-right">{user.mobile}</td>
                        <td className="text-right">
                          <Button
                            className="btn-link btn-icon btn-neutral"
                            color="success"
                            id="tooltip618296632"
                            size="sm"
                            title="Refresh"
                            type="button"
                          >
                            <i className="tim-icons icon-refresh-01" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip618296632"
                          >
                            Tooltip on top
                          </UncontrolledTooltip>
                          <Button
                            className="btn-link btn-icon btn-neutral"
                            color="danger"
                            id="tooltip707467505"
                            size="sm"
                            title="Delete"
                            type="button"
                          >
                            <i className="tim-icons icon-simple-remove" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip707467505"
                          >
                            Tooltip on top
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col lg="5">
          <Card className="card-chart card-chart-pie">
              <CardHeader>
                <h5 className="card-category">Simple Pie Chart</h5>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs="6">
                    <div className="chart-area">
                      <Pie
                        data={chartExample9.data}
                        options={chartExample9.options}
                      />
                    </div>
                  </Col>
                  <Col xs="6">
                    <CardTitle tag="h4">
                      <i className="tim-icons icon-trophy text-success" />{" "}
                      10.000$
                    </CardTitle>
                    <p className="category">A total of $54000</p>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            </Col>

          <Col lg="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Global Sales by Top Locations</CardTitle>
                <p className="card-category">All products that were shipped</p>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="6">
                    <Table responsive>
                      <tbody>
                        <tr>
                          <td>
                            <div className="flag">
                              <img
                                alt="..."
                                src={require("assets/img/US.png")}
                              />
                            </div>
                          </td>
                          <td>USA</td>
                          <td className="text-right">2.920</td>
                          <td className="text-right">53.23%</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="flag">
                              <img
                                alt="..."
                                src={require("assets/img/DE.png")}
                              />
                            </div>
                          </td>
                          <td>Germany</td>
                          <td className="text-right">1.300</td>
                          <td className="text-right">20.43%</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="flag">
                              <img
                                alt="..."
                                src={require("assets/img/AU.png")}
                              />
                            </div>
                          </td>
                          <td>Australia</td>
                          <td className="text-right">760</td>
                          <td className="text-right">10.35%</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="flag">
                              <img
                                alt="..."
                                src={require("assets/img/GB.png")}
                              />
                            </div>
                          </td>
                          <td>United Kingdom</td>
                          <td className="text-right">690</td>
                          <td className="text-right">7.87%</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="flag">
                              <img
                                alt="..."
                                src={require("assets/img/RO.png")}
                              />
                            </div>
                          </td>
                          <td>Romania</td>
                          <td className="text-right">600</td>
                          <td className="text-right">5.94%</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="flag">
                              <img
                                alt="..."
                                src={require("assets/img/BR.png")}
                              />
                            </div>
                          </td>
                          <td>Brasil</td>
                          <td className="text-right">550</td>
                          <td className="text-right">4.34%</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col className="ml-auto mr-auto" md="6">
                    <VectorMap
                      map={"world_mill"}
                      backgroundColor="transparent"
                      zoomOnScroll={false}
                      containerStyle={{
                        width: "100%",
                        height: "300px"
                      }}
                      regionStyle={{
                        initial: {
                          fill: "#e4e4e4",
                          "fill-opacity": 0.9,
                          stroke: "none",
                          "stroke-width": 0,
                          "stroke-opacity": 0
                        }
                      }}
                      series={{
                        regions: [
                          {
                            values: mapData,
                            scale: ["#AAAAAA", "#444444"],
                            normalizeFunction: "polynomial"
                          }
                        ]
                      }}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )};
  </>
  );
}

export default Dashboard;
