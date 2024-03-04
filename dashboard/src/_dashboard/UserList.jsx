import React, { useState, useEffect } from "react";
// reactstrap components
import { Card,
   CardHeader, 
   CardBody, 
   CardTitle, 
   Row, 
   Col } from "reactstrap";

// core components
import SortingTable from "components/SortingTable/SortingTable.js";
import Loader from "components/Loader/Loading.js";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";


import { getAllUsers, clearErrors, deleteUser } from "_redux/actions/user";
import { DELETE_USER_RESET } from "_redux/types/user";

function UserList() {
  const dispatch = useDispatch();
  const { error, users, loading } = useSelector((state) => state.user);
  //const { error: deleteError, isDeleted, message } = useSelector((state) => state.profileData); 
  const history = useHistory();


  useEffect(() => {


    //if (isDeleted) {
      //history.push("/admin/users");
      //dispatch({ type: DELETE_USER_RESET });
    //}

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
      tableRows.push(
        {
          data: [
            { img: (item.avatar.url) ? item.avatar.url : ""},
            { text: item.name },
            { text: item.email },
            { text: item.role }
          ]
        })
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
                <CardTitle tag="h4">All Users</CardTitle>
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
