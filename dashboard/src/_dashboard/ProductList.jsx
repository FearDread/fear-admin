import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import * as Product from "_redux/actions/product";
import { DELETE_PRODUCT_RESET } from "_redux/types/product";
import ReactTable from "components/ReactTable/ReactTable.js";
import ReactTableActions from "components/ReactTable/ReactTableActions.js";

const header = [
  { Header: "Cover", accessor: "avatar" },
  { Header: "Title", accessor: "title" },
  { Header: "Category", accessor: "category" },
  { Header: "Price", accessor: "price" },
  { Header: "Available", accessor: "quantity" },
  { Header: "Brand", accessor: "brand" },
  { Header: "ID", accessor: "id" },
  { Header: "Actions", accessor: "actions", sortable: false, filterable: false }
];

function ProductList() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [ toggle, setToggle ] = useState(false);
  const { success, products, loading } = useSelector((state) => state.product);


  const deleteProductHandler = (id) => {
    dispatch(Product.remove(id));
  };
  
  const displayProducts = () => {
    let dataTable = [];

    if (products && products.length > 0) {
      products.map((item, key) => {
        dataTable.push({
          avatar: (
            <img 
              src={item.images[0] ? item.images[0].url : ''} 
              className="avatar"/>),
          title: item.title,
          category: item.category,
          price: "$" + item.price,
          quantity: item.quantity || 1,
          brand: item.brand,
          id: item._id,
          actions: ( ReactTableActions(item, key, 'product') )
        })
      });
    }
    return dataTable;
  }

  useEffect(() => {
    dispatch(Product.list());
  }, [dispatch]);

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
                <ReactTable
                  data={displayProducts()}
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
