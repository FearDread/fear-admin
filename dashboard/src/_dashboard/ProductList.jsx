import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminProducts,
  deleteProduct,
} from "_redux/actions/product";
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
  { Header: "Cover", accessor: "avatar" },
  { Header: "Name", accessor: "name" },
  { Header: "Category", accessor: "category" },
  { Header: "Price", accessor: "price" },
  { Header: "Stock", accessor: "Stock" },
  { Header: "Info", accessor: "info" },
  { Header: "Actions", accessor: "actions", sortable: false, filterable: false }
];

function ProductList() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [ toggle, setToggle ] = useState(false);
  const { error, products, loading, isDeleted } = useSelector((state) => state.product);

  const displayProducts = (products) => {
    let dataTable = [];

    if (products && products.length > 0) {
      products.map((item, key) => {
        dataTable.push({
          avatar: (
            <img 
              src={item.images[0] ? item.images[0].url : ''} 
              className="avatar"/>),
          name: item.name,
          category: item.category,
          price: "$" + item.price,
          stock: item.Stock,
          info: item.info
        })
      });
    }
    return dataTable;
  }

  useEffect(() => {
    if (isDeleted) {
     dispatch({ type: DELETE_PRODUCT_RESET });
    }
    dispatch(getAdminProducts());

  }, [dispatch]);

  useEffect(() => {
    displayProducts(products);
  }, [products, error]);

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

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
          <h1 className="text-center">Manage Inventory</h1>
        </Col>
          <Row> 
            <Col className="mb-5" md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">All Products</CardTitle>
                </CardHeader>
                <CardBody>
                <ReactTable
                  data={displayProducts(products)}
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
