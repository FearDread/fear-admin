
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
import { crud } from "../_redux/actions/crud";

function CategoryList () {
  const dispatch = useDispatch();
  const { error, categories, loading } = useSelector((state) => state.categories);
  const history = useHistory();

  useEffect(() => {

    dispatch(crud.list('category'));

  }, [dispatch]);

  const tableRows = [];
  const tableHeader = [
    { text: "_ID" },
    { text: "Category Name" },

  ];
  brands && brands.forEach((item) => {
    tableRows.push({data: [
      { text: item._id },
      { text: item.name }
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
                <CardTitle tag="h5">All Brands</CardTitle>
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


export default CategoryList;
