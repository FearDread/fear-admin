import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  getAdminProducts,
  deleteProduct,
} from "_redux/actions/product";
import classNames from "classnames";
import SortingTable from "components/SortingTable/SortingTable.js";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button
 } from "reactstrap";
import { useHistory } from "react-router-dom";
import Loader from "components/Loader/Loading";
import { DELETE_PRODUCT_RESET } from "_redux/types/product";
import ReactTable from "components/ReactTable/ReactTable.js";

const header = [
  {
    Header: "Preview",
    accessor: "preview"
  },
  {
    Header: "Name",
    accessor: "name"
  },
  {
    Header: "Category",
    accessor: "category"
  },
  {
    Header: "Price",
    accessor: "price"
  },
  {
    Header: "# in Stock",
    accessor: "Stock"
  },
  {
    Header: "Info",
    accessor: "info"
  },
  {
    Header: "Actions",
    accessor: "actions",
    sortable: false,
    filterable: false
  }
];

function ProductList() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [toggle, setToggle] = useState(false);
  const [ data, setData ] = useState();
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
        <Col md={8} className="ml-auto mr-auto">
          <h2 className="text-center">Products React Table</h2>
          <p className="text-center">
            Here you can add / edit / or delete products from your store.
          </p>
        </Col>
          <Row>
            <Col className="mb-5" md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">All Products</CardTitle>
                </CardHeader>
                <CardBody>
                <ReactTable
                  data={products}
                  filterable
                  resizable={false}
                  columns={header}
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

export default ProductList;
