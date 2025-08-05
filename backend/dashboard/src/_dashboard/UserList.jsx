import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Card,
   CardHeader, 
   CardBody, 
   CardTitle, 
   Row, 
   Col } from "reactstrap";

import ReactTable from "components/ReactTable/ReactTable.js";
import ReactTableActions from "components/ReactTable/ReactTableActions.js";
import Loader from "components/Loader/Loading.js";
import * as UserActions from "_redux/user/actions";
import logo from "assets/img/FEAR/logo.png";  


function UserList() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);

  useEffect(() => {

    dispatch(UserActions.list());

  }, [dispatch]);

  const header = [
    { Header: "Avatar", accessor: "avatar" },
    { Header: "Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Role", accessor: "role" },
    { Header: "Actions", accessor: "actions", sortable: false, filterable: false }
  ];

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
        actions: ( ReactTableActions(item, key, 'user') ) 
      })
    })
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