import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Card,
   CardHeader, 
   CardBody, 
   CardTitle, 
   Row, 
   DropdownToggle,
   DropdownMenu,
   DropdownItem,
   UncontrolledDropdown,
   Button,
   Col } from "reactstrap";
import classNames from "classnames";
import ReactTable from "components/ReactTable/ReactTable.js";
import Loader from "components/Loader/Loading.js";
import * as User from "_redux/actions/user";
import logo from "assets/img/FEAR/logo.png";  

const header = [
  { Header: "Avatar", accessor: "avatar" },
  { Header: "Name", accessor: "name" },
  { Header: "Email", accessor: "email" },
  { Header: "Role", accessor: "role" },
  { Header: "Actions", accessor: "actions", sortable: false, filterable: false }
];

function UserList() {
  const dispatch = useDispatch();
  const { success, users, loading } = useSelector((state) => state.user);
  const history = useHistory();

  useEffect(() => {


    dispatch(User.list());
    
  }, [dispatch]);
  
  const displayUsers = () => {
    let dataTable = [];

    users && users.forEach((item, key) => {
      dataTable.push({
        avatar: (
          <img 
            src={item.avatar ? item.avatar.url : logo} 
            className="avatar"/>),
        name: item.name,
        email: item.email,
        role: item.role,
        actions: (
          <div className="actions-right">
            <Button
              onClick={() => {
                        let obj = item[key];
                        console.log("Edit row :: ", obj);
                        alert("edit action :: " + key);
              }}
              color="warning"
              size="sm"
              className={classNames("btn-icon btn-link like", {
                "btn-neutral": key < 5
              })}>
              <i className="tim-icons icon-pencil" />
            </Button>{" "}
            <Button
              onClick={() => {
                console.log('remove row ')
              }}
              color="danger"
              size="sm"
              className={classNames("btn-icon btn-link like", {
                "btn-neutral": key < 5
              })}>
              <i className="tim-icons icon-simple-remove" />
            </Button>{" "}
          </div>
        )
      })
      });

    return dataTable;
  }

  return (
    <>
    {loading ? (
      <Loader />
    ) : (
    <>
      <div className="content">
        <Row>
          <Col className="mb-5" md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Users Table</CardTitle>
              </CardHeader>
              <CardBody>
                  <ReactTable
                  data={displayUsers()}
                  filterable
                  resizable={false}
                  columns={header}
                  defaultPageSize={10}
                  showPaginationTop
                  showPaginationBottom={true}
                  className="-striped -highlight"
                />  
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
    )}
  </>
  );
}

export default UserList;