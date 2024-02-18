import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  getAdminProducts,
} from "actions/productAction";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";
import { useAlert } from "react-alert"; 

import MetaData from "components/MataData/MataData";
import Loader from "components/loader/Loader";
import Navbar from "components/Navbars/AdminNavbar";
import { DELETE_PRODUCT_RESET } from "constants/productsConstatns";

function ProductList() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const [toggle, setToggle] = useState(false);

  const { error, products, loading } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.deleteUpdateProduct
  );
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Product Deleted Successfully");
    
      dispatch({ type: DELETE_PRODUCT_RESET });
    }
    dispatch(getAdminProducts());
  }, [dispatch, error, alert, deleteError, isDeleted]);

 // const deleteProductHandler = (id) => {
 //   dispatch(deleteProduct(id));
  //};

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
          <MetaData title={`ALL PRODUCTS - Admin`} />
          <div className="content">
            <Row>
              <Col md="12">
                <Card>
                  <CardHeader>
                    <Navbar toggleHandler={toggleHandler} />
                      <CardTitle tag="h4">ALL PRODUCTS</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Table className="tablesorter" responsive>
                      <thead className="text-primary">
                        <tr>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th className="text-center">Description</th> 
                      </tr>
                      </thead>
                      <tbody>
                        {products.map((data) => (
                          <tr>
                            <td>{data.name}</td>
                            <td>{data.price}</td>
                            <td>{data.stock}</td>
                            <td>{data.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  )
};

export default ProductList;
