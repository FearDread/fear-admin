
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
import { list, reset } from "../_redux/actions/crud";
import { getBrands, clearErrors } from "../_redux/actions/brand"; 
import logo from "assets/img/FEAR/logo.png";

function Brandlist () {
  const dispatch = useDispatch();
  const { brands, loading } = useSelector((state) => state.brand);
  const history = useHistory();

  useEffect(() => {

    //dispatch(crud.list('brand'));
    dispatch(list('brand'));
  }, [dispatch]);

  const tableRows = [];
  const tableHeader = [
    { text: "Logo" },
    { text: "Brand Name" },
    { text: "Active" },
  ];
  brands && brands.forEach((item) => {
    tableRows.push({data: [
      { img: (item.logo) ? item.logo.url : logo},
      { text: item.title },
      { text: item.isActive }
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


export default Brandlist;
