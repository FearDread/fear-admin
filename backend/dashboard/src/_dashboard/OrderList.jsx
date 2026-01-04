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

  const { loading, ORDER } = useSelector((state) => state.order);
  const header = [
    { Header: "Order ID", accessor: "number" },
    { Header: "Status", accessor: "status" },
    { Header: "Payment", accessor: "payment" },
    { Header: "Items", accessor: "items" },
    { Header: "Total", accessor: "total" },
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

    if (ORDER && ORDER.length > 0) {
      ORDER.map((item, key) => {
        dataTable.push({
          number: item.orderNumber,
          status: item.orderStatus,
          payment: item.paymentStatus,
          items: item.itemsCount || 1,
          total: "$" + item.total,
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
    console.log('order table = ', dataTable);
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
