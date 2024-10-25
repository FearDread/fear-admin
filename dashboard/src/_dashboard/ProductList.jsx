import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
 } from "reactstrap";
import { useHistory } from "react-router-dom";
import Loader from "components/Loader/Loading";
import ReactTable from "components/ReactTable/ReactTable.js";
import ReactTableActions from "components/ReactTable/ReactTableActions.js";
import * as ProductActions from "_redux/product/actions";
import * as ProductTypes from "_redux/product/types";
import ReactBSAlert from "react-bootstrap-sweetalert";

function ProductList() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [ alert, setAlert ] = useState(null);
  const [ toggle, setToggle ] = useState(false);
  const { products, loading } = useSelector((state) => state.product);

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

  const editProductHandler = (id) => {

  }
  
  const deleteProductHandler = (id) => {
    dispatch(ProductActions.remove(id));
    dispatch({type: ProductTypes.DELETE_PRODUCT_RESET});
    hideAlert()
  };

  const confirmDelete = (_id) => {
    setAlert( 
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => deleteProductHandler(_id)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
        btnSize="">
        Your sure you want to delete this product?
      </ReactBSAlert>
    );
  };

  const hideAlert = () => {
    setAlert(null);
  };
  */
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
          actions: ( 
            ReactTableActions( key, (() => {
              console.log("edit product ::", item);
            }),
            (() => {
              console.log("remove product :: ", item);
              setAlert(confirmDelete(item._id, "product", deleteProductHandler, hideAlert));
              //confirmDelete(item._id);
            })
          ))
        });
      })
    }

    return dataTable;
  }

  const hideAlert = () => {
    setAlert(null);
  }

  useEffect(() => {

    dispatch(ProductActions.list());

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
        {alert}
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
