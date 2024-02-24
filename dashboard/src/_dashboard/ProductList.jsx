import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  getAdminProducts,
  deleteProduct,
} from "_actions/productAction";
import SortingTable from "components/SortingTable/SortingTable.js";
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
import { useHistory } from "react-router-dom";
import Loader from "components/Loader/Loading";
import { DELETE_PRODUCT_RESET } from "_constants/productsConstatns";

function ProductList() {
  const dispatch = useDispatch();
  //const alert = useAlert();
  const history = useHistory();
  const [toggle, setToggle] = useState(false);

  const { error, products, loading } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.deleteUpdateProduct
  );
  useEffect(() => {
    if (error) {
      dispatch(clearErrors());
    }
    if (deleteError) {
      dispatch(clearErrors());
    }
    if (isDeleted) {
      dispatch({ type: DELETE_PRODUCT_RESET });
    }
    dispatch(getAdminProducts());
  }, [dispatch, error, deleteError, history, isDeleted]);

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };
  const tableHeader = [
    { text: "ID" },
    { text: "Name" },
    { text: "Description" },
    { text: "info" },
    { text: "Stock" },
    { text: "Price" },
    { className: "text-center", text: "Reviews" }
  ]
  const rows = [];

  products &&
    products.forEach((item) => {
      rows.push({data: [
        {id: item.name},
        {stock: item.Stock},
        {price: item.price},
        {info: item.info},
        {description: item.description},
        {reviews: item.review.length}
      ]});
    });

  // togle handler =>
  const toggleHandler = () => {
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
                    tbody={rows}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
    </>
  )}
  </>
)};

export default ProductList;
