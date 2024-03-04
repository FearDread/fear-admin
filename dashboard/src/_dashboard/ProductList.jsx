import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  getAdminProducts,
  deleteProduct,
} from "_redux/actions/product";
import SortingTable from "components/SortingTable/SortingTable.js";
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
import { useHistory } from "react-router-dom";
import Loader from "components/Loader/Loading";
import { DELETE_PRODUCT_RESET } from "_redux/types/product";

function ProductList() {
  const dispatch = useDispatch();
  //const alert = useAlert();
  const history = useHistory();
  const [toggle, setToggle] = useState(false);
  const { error, products, loading } = useSelector((state) => state.product);
  //const { error: deleteError, isDeleted, message } = useSelector((state) => state.deleteUpdateProduct);
  
  useEffect(() => {

    //if (isDeleted) {
    //  dispatch({ type: DELETE_PRODUCT_RESET });
   // }

    dispatch(getAdminProducts());
    
  }, [dispatch]);

  //const deleteProductHandler = (id) => {
  //  dispatch(deleteProduct(id));
  //};

  const tableRows = [];
  const tableHeader = [
    { text: "Preview" },
    { text: "Name" },
    { text: "Category" },
    { text: "Stock" },
    { text: "Price" },
    { text: "Info" },
    { text: "Description" },
  ];
  
  console.log("Product data :: ", products);
  products && products.forEach((item) => {
    tableRows.push({data: [
      {img: (item.images.length > 0 ) ? item.images[0].url : ""},
      {text: item.name},
      {text: item.category},
      {text: item.Stock},
      {text: item.price},
      {text: item.info},
      {text: item.description}
      ]});
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 999 && toggle) {
        setToggle(false);
      }};
    
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [toggle]);

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
                  <CardTitle tag="h4">All Products</CardTitle>
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

export default ProductList;
