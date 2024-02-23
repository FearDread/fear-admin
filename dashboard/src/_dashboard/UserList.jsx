import React, { useState, useEffect } from "react";
// reactstrap components
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";

// core components
import SortingTable from "components/SortingTable/SortingTable.js";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { getAllUsers, clearErrors, deleteUser } from "_actions/userAction";
import { DELETE_USER_RESET } from "_constants/userConstanat";

function UserList() {
  const dispatch = useDispatch();
  const { error, users, loading } = useSelector((state) => state.allUsers);
  const { error: deleteError, isDeleted, message } = useSelector(
    (state) => state.profileData
  );
 
  const history = useHistory();
  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    if (error) {
      dispatch(clearErrors());
    }
    if (deleteError) {
      dispatch(clearErrors());
    }

    if (isDeleted) {
      history.push("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers());
  }, [dispatch, error, deleteError, history, isDeleted, message]);

  const tableRows = [];
  const tableHeader = [
    { text: "ID" },
    { text: "Name" },
    { text: "Email" },
    { className: "text-center", text: "Role" }
  ]

  users && users.forEach((item) => {
      tableRows.push(
        {
          data: [
            { text: item.id},
            { text: item.name },
            { text: item.email },
            { className: "text-center", text: item.role }
          ]
        })
    });

  // togle handler =>
  const toggleHandler = () => {
    console.log("toggle");
    setToggle(!toggle);
  };

  // to close the sidebar when the screen size is greater than 1000px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 999 && toggle) {
        setToggle(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [toggle]);

  return (
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
  );
}

export default UserList;
