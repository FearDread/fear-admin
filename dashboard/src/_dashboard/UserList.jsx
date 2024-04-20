import React, { useState, useEffect } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllUsers, clearErrors, deleteUser } from "_redux/actions/user";
//import { DELETE_USER_RESET } from "_redux/types/user";
import logo from "assets/img/FEAR/logo.png";

function UserList() {
  const dispatch = useDispatch();
  const { error, users, loading } = useSelector((state) => state.user);
  const history = useHistory();

  useEffect(() => {

    dispatch(getAllUsers());

  }, [dispatch]);

  const tableRows = [];
  const tableHeader = [
    { text: "Avatar" },
    { text: "Name" },
    { text: "Email" },
    { className: "text-center", text: "Role" }
  ];
  users && users.forEach((item) => {
    tableRows.push({data: [
      { img: (item.avatar.url) ? item.avatar.url : logo},
      { text: item.name },
      { text: item.email },
      { text: item.role }
      ]})
    });

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
                      tbody={tableRows}
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