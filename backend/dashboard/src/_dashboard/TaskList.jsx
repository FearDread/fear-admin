
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card,
   CardHeader, 
   CardBody, 
   CardTitle, 
   Row, 
   Col } from "reactstrap";
import Loader from "components/Loader/Loading.js";
import * as TaskActions from "../_redux/task/actions"; 
import logo from "assets/img/FEAR/logo.png";
import ReactTable from "components/ReactTable/ReactTable.js";
import ReactTableActions from "components/ReactTable/ReactTableActions.js";

const tableHeader = [
  { Header: "Completed", accessor: "isComplete" },
  { Header: "Task", accessor: "task" },
  { Header: "Created ", accessor: "createdAt" },
  { Header: "Actions", accessor: "actions", sortable: false, filterable: false }
]

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.task);

  const handleRemove = (id) => {
    const nTasks = tasks.filter((task) => task._id !== id);
    
    tasks = nTasks;
  };
  
  const displayTasks = () => {
    let dataTable = [];

    tasks && tasks.forEach((item, key) => {
      item.isActive = (item.isActive) ? "Active" : "Disabled";
      
      dataTable.push({
        isComplete: item.isComplete,
        task: item.title,
        createdAt: item.createdAt,
        actions: ( ReactTableActions( key, (() => {
            console.log("edit item ::", item);
          }), (() => {
            handleRemove(item._id);
          })
        )) 
      })
    })
    return dataTable;
  }

  useEffect(() => {

    dispatch(TaskActions.list());
    
  }, [ dispatch ]);

  return (
      <>
      {loading ? (
        <>
          <div className="content">
            <Loader />
          </div>
        </>
      ) : (
      <>
        <div className="content">
          <Row>
            <Col className="mb-5" md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Store Brands</CardTitle>
                </CardHeader>
                <CardBody>
                  <ReactTable
                    data={displayTasks()}
                    filterable
                    resizable={false}
                    columns={tableHeader}
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

export default TaskList;