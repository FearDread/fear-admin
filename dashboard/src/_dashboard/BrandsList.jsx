
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Card,
   CardHeader, 
   CardBody, 
   CardTitle, 
   Row, 
   Col } from "reactstrap";
import SortingTable from "components/SortingTable/SortingTable.js";
import Loader from "components/Loader/Loading.js";
import * as Brand from "../_redux/actions/brand"; 
import logo from "assets/img/FEAR/logo.png";
import ReactTable from "components/ReactTable/ReactTable.js";
import ReactActions from "components/ReactTable/ReactActions.js";

function Brandlist () {
  const dispatch = useDispatch();
  const { brands, loading } = useSelector((state) => state.brand);

  useEffect(() => {
    dispatch(Brand.list());
  }, [dispatch]);

  const tableHeader = [
    { Header: "Logo", accessor: "avatar" },
    { Header: "Brand Name", accessor: "title" },
    { Header: "Is Active", accessor: "isActive" },
    { Header: "Actions", accessor: "actions", sortable: false, filterable: false }
  ]

  const displayBrands = () => {
    let dataTable = [];

    brands && brands.forEach((item, key) => {
      item.isActive = (item.isActive) ? "Active" : "Disabled";
      dataTable.push({
        avatar: (
          <img 
            src={item.avatar ? item.avatar.url : logo} 
            className="avatar"/>),
        title: item.title,
        isActive: item.isActive,
        actions: ( ReactActions(item, key) ) 
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
                  <CardTitle tag="h5">Store Brands</CardTitle>
                </CardHeader>
                <CardBody>
                  <ReactTable
                    data={displayBrands()}
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


export default Brandlist;
