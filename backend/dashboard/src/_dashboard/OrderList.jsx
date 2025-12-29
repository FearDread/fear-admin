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
import * as OrderActions from "_redux/order/actions";
import * as OrderTypes from "_redux/order/types";
import ReactBSAlert from "react-bootstrap-sweetalert";

function OrderList() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [alert, setAlert] = useState(null);
  const [toggle, setToggle] = useState(false);

  const { error, loading, orders } = useSelector((state) => state.order);
  const header = [
    { Header: "Order ID", accessor: "_id" },
    { Header: "Status", accessor: "status" },
    { Header: "Items", accessor: "items" },
    { Header: "Price", accessor: "price" },
    { Header: "Actions", accessor: "actions", sortable: true, filterable: false }
  ];
  // delet order handler
  const deleteOrderHandler = (id) => {
    dispatch(OrderActions.remove(id));
    dispatch({ type: OrderTypes.DELETE_ORDER_RESET });
    hideAlert()
  };
  const confirmDelete = (_id) => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => deleteOrderHandler(_id)}
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

  const displayOrders = () => {
    let dataTable = [];

    if (orders && orders.length > 0) {
      orders.map((item, key) => {
        dataTable.push({
          id: item._id,
          status: item.status,
          price: "$" + item.orderPrice,
          items: item.items || 1,
          actions: (
            ReactTableActions(key, (() => {
              console.log("edit order ::", item);
              history.push("/admin/order/edit/" + item._id);

            }),
              (() => {
                console.log("remove order :: ", item);
                confirmDelete(item._id, "order", deleteOrderHandler, hideAlert);
                //confirmDelete(item._id);
              })
            ))
        });
      })
    }

    return dataTable;
  }

  useEffect(() => {

    dispatch(OrderActions.list());

  }, [dispatch]);

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
                    <CardTitle tag="h4">ALL ORDERS</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <ReactTable
                      data={displayOrders()}
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

export default OrderList;
