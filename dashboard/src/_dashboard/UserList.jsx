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
                        console.log("Clickded row :: ", obj);
                        //let obj = data.find((o) => o.id === i);
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
                console.log('remove data ')
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

/*
<Table className="responsive">
<thead>
  <tr>
    <td> Avatar </td>
    <td> Name </td>
    <td> Email </td>
    <td> Rle </td>
    <td> actions </td>
  </tr>
</thead>
<tbody>
  {users.map((prop, key) =>  {
      <tr>
        <TableCell cell={key} vlaue={prop} />
      </tr>
  }
  )}
</tbody>

</Table>
*/