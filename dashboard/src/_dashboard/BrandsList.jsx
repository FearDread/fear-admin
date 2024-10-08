
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card,
   CardHeader, 
   CardBody, 
   CardTitle, 
   Row, 
   Col } from "reactstrap";
import Loader from "components/Loader/Loading.js";
import * as BrandActions from "../_redux/brand/actions"; 
import logo from "assets/img/FEAR/logo.png";
import ReactTable from "components/ReactTable/ReactTable.js";
import ReactTableActions from "components/ReactTable/ReactTableActions.js";

const tableHeader = [
  { Header: "Logo", accessor: "avatar" },
  { Header: "Brand Name", accessor: "title" },
  { Header: "Is Active", accessor: "isActive" },
  { Header: "Actions", accessor: "actions", sortable: false, filterable: false }
]

const Brandlist = () => {
  const dispatch = useDispatch();
  const { brands, loading } = useSelector((state) => state.brand);

  const handleRemove = (id) => {
    const nBrands = brands.filter((brand) => brand._id !== id);
    
    brands = nBrands;
  };
  
  useEffect(() => {
    dispatch(BrandActions.list());
  }, [ dispatch ]);

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
        actions: ( ReactTableActions( key, (() => {
            console.log("edit item ::", item);
          }), (() => {
            handleRemove(item._id);
            //dispatch(BrandActions.remove(item._id));
          })
        )) 
      })
    })
    return dataTable;
  }

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