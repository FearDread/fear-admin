
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import * as Category from "_redux/category/actions";

function CategoryList () {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.cat);

  useEffect(() => {
    dispatch(Category.list());
  }, [dispatch]);

  const tableHeader = [
    { Header: "Category", accessor: "title" },
    { Header: "Actions", accessor: "actions", sortable: false, filterable: false }
  ]

  const displayCategroies = () => {
    let dataTable = [];

    categories && categories.forEach((item, key) => {
      dataTable.push({
        title: item.title,
        actions: ( ReactTableActions(item, key, 'category') ) 
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
                  <CardTitle tag="h5">Product Categories</CardTitle>
                </CardHeader>
                <CardBody>
                  <ReactTable
                    data={displayCategroies()}
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


export default CategoryList;
