import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card,
   CardHeader, 
   CardBody, 
   CardTitle, 
   Row, 
   DropdownToggle,
   DropdownMenu,
   DropdownItem,
   UncontrolledDropdown,
   Table,
   Col } from "reactstrap";
import SortingTable from "components/SortingTable/SortingTable.js";
import Loader from "components/Loader/Loading.js";

import { useHistory } from "react-router-dom";
import { getAllUsers, clearErrors, deleteUser } from "_redux/actions/user";
import { list, reset } from "_redux/actions/crud";
//import { DELETE_USER_RESET } from "_redux/types/user";
import logo from "assets/img/FEAR/logo.png";


const tableHeader = [
  { text: "Avatar" },
  { text: "Name" },
  { text: "Email" },
  { className: "text-center", text: "Role" }
];

function UserList() {
  const dispatch = useDispatch();
  const { success, result, loading } = useSelector((state) => state.crud.list);
  const history = useHistory();

  useEffect(() => {

    dispatch(list('user'));

  }, [dispatch]);
  
  const displayUsers = (users) => {
    let tableRows = [];

    users && users.forEach((item) => {
      tableRows.push({data: [
        { img: (item.avatar.url) ? item.avatar.url : logo},
        { text: item.name },
        { text: item.email },
        { text: item.role }
        ]})
      });

    return tableRows;
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

                  <SortingTable
                      thead={tableHeader}
                      tbody={displayUsers(result)}
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