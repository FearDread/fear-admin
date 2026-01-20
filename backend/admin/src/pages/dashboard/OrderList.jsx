import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  Input,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import ReactTable from "../../components/ReactTable/ReactTable.jsx";
import Loader from "../../components/Loader/Loading";
import {
  fetchOrders,
  fetchOrdersWithFilters,
  cancelOrder,
  setOrderFilters,
  clearOrderFilters,
  clearError,
  selectAllOrders,
  selectOrdersLoading,
  selectOrdersError,
  selectOrderFilters,
  selectOrderStatistics,
  selectPendingOrders,
  selectShippedOrders,
  selectDeliveredOrders,
} from "../../features/orders/slice";


const OrderList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Local state
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  // Redux state from order slice
  const orders = useSelector(selectAllOrders);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const filters = useSelector(selectOrderFilters);
  const statistics = useSelector(selectOrderStatistics);
  const pendingOrders = useSelector(selectPendingOrders);
  const shippedOrders = useSelector(selectShippedOrders);
  const deliveredOrders = useSelector(selectDeliveredOrders);

  const ORDER_STATUS = {
    pending: { color: "warning", icon: "fa-clock-o", label: "Pending" },
    processing: { color: "info", icon: "fa-refresh", label: "Processing" },
    shipped: { color: "primary", icon: "fa-truck", label: "Shipped" },
    delivered: { color: "success", icon: "fa-check-circle", label: "Delivered" },
    cancelled: { color: "danger", icon: "fa-times-circle", label: "Cancelled" },
    refunded: { color: "secondary", icon: "fa-undo", label: "Refunded" },
  };

  const PAYMENT_STATUS = {
    pending: { color: "warning", label: "Pending" },
    paid: { color: "success", label: "Paid" },
    failed: { color: "danger", label: "Failed" },
    refunded: { color: "secondary", label: "Refunded" },
  };

  const columns = useMemo(() => [
    { Header: "Order #", accessor: "number" },
    { Header: "Customer", accessor: "customer" },
    { Header: "Status", accessor: "status", sortable: true },
    { Header: "Payment", accessor: "payment", sortable: true },
    { Header: "Items", accessor: "items" },
    { Header: "Total", accessor: "total", sortable: true },
    { Header: "Date", accessor: "date", sortable: true },
    { Header: "Actions", accessor: "actions", sortable: false, filterable: false }
  ], []);

  useEffect(() => {

    dispatch(fetchOrders());

  }, [dispatch]);

 useEffect(() => {
    const handleResize = () => {
      // Add responsive logic if needed
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * Navigate to order details/edit page
   */
  const handleEditOrder = (orderId) => {
    navigate(`/admin/order/edit/${orderId}`);
  };

  /**
   * View order details
   */
  const handleViewOrder = (orderId) => {
    navigate(`/admin/order/view/${orderId}`);
  };

  /**
   * Cancel order with confirmation and reason
   */
  const handleCancelOrder = async (orderId, orderNumber) => {

  };

  /**
   * Show cancellation confirmation dialog
   */
  const confirmCancelOrder = (orderId, order) => {

  };

  /**
   * Hide alert dialog
   */
  const hideAlert = () => {
    setAlert(null);
  };

  /**
   * Apply status filter
   */
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    if (status !== "all") {
      dispatch(setOrderFilters({ status }));
    } else {
      dispatch(clearOrderFilters());
    }
    dispatch(fetchOrdersWithFilters());
  };

  /**
   * Filter and search orders
   */
  const filteredOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    return orders.filter(order => {
      // Status filter
      if (statusFilter !== "all" && order.orderStatus !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          order.orderNumber?.toLowerCase().includes(searchLower) ||
          order.customerName?.toLowerCase().includes(searchLower) ||
          order.customerEmail?.toLowerCase().includes(searchLower) ||
          order._id?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [orders, searchTerm, statusFilter]);

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  /**
   * Transform orders data for table display
   */
  const tableData = useMemo(() => {
    return filteredOrders.map((order, index) => {
      const statusConfig = ORDER_STATUS[order.orderStatus] || ORDER_STATUS.pending;
      const paymentConfig = PAYMENT_STATUS[order.paymentStatus] || PAYMENT_STATUS.pending;

      return {
        number: (
          <div className="d-flex flex-column">
            <span className="text-white font-weight-bold">#{order.orderNumber}</span>
            <code className="text-info small">{order._id?.substring(0, 8)}</code>
          </div>
        ),
        customer: (
          <div className="d-flex flex-column">
            <span className="text-white">{order.customerName || "Guest"}</span>
            <small className="text-light-2">{order.customerEmail}</small>
          </div>
        ),
        status: (
          <Badge color={statusConfig.color} pill className="px-3">
            <i className={`fa ${statusConfig.icon} mr-2`}></i>
            {statusConfig.label}
          </Badge>
        ),
        payment: (
          <Badge color={paymentConfig.color} pill className="px-3">
            {paymentConfig.label}
          </Badge>
        ),
        items: (
          <Badge color="light" pill>
            {order.itemsCount || order.items?.length || 0} items
          </Badge>
        ),
        total: (
          <span className="text-success font-weight-bold">
            ${order.total?.toFixed(2) || "0.00"}
          </span>
        ),
        date: (
          <div className="d-flex flex-column">
            <span className="text-light-1">{formatDate(order.orderDate)}</span>
            <small className="text-light-2">
              {new Date(order.orderDate).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </small>
          </div>
        ),
        actions: (
          <div className="d-flex gap-2">
            <Button
              color="info"
              size="sm"
              className="btn-round"
              onClick={() => handleViewOrder(order._id)}
              title="View Order"
            >
              <i className="fa fa-eye"></i>
            </Button>
            <Button
              color="primary"
              size="sm"
              className="btn-round"
              onClick={() => handleEditOrder(order._id)}
              title="Edit Order"
            >
              <i className="fa fa-edit"></i>
            </Button>
            {order.orderStatus !== "cancelled" && order.orderStatus !== "delivered" && (
              <Button
                color="warning"
                size="sm"
                className="btn-round"
                onClick={() => confirmCancelOrder(order._id, order)}
                title="Cancel Order"
              >
                <i className="fa fa-ban"></i>
              </Button>
            )}
          </div>
        )
      };
    });
  }, [filteredOrders]);

  /**
   * Get unique order statuses
   */
  const orderStatuses = useMemo(() => {
    return Object.keys(ORDER_STATUS);
  }, []);

  // Show loader while fetching
  if (loading && (!orders || orders.length === 0)) {
    return <Loader />;
  }

  return (
    <>
      <div className="container-fluid">
        <Row className="mb-4">
          <Col lg="3" md="6">
            <Card className="card-stats media-object">
              <CardBody>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center circle-1 bg-warning-light2">
                      <i className="fa fa-clock-o text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category text-light-2">Pending</p>
                      <CardTitle tag="h3" className="text-white">
                        {pendingOrders.length}
                      </CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="6">
            <Card className="card-stats media-object">
              <CardBody>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center circle-1 bg-primary-light2">
                      <i className="fa fa-truck text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category text-light-2">Shipped</p>
                      <CardTitle tag="h3" className="text-white">
                        {shippedOrders.length}
                      </CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="6">
            <Card className="card-stats media-object">
              <CardBody>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center circle-1 bg-success-light2">
                      <i className="fa fa-check-circle text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category text-light-2">Delivered</p>
                      <CardTitle tag="h3" className="text-white">
                        {deliveredOrders.length}
                      </CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="6">
            <Card className="card-stats media-object">
              <CardBody>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center circle-1 bg-info-light2">
                      <i className="fa fa-dollar text-info"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category text-light-2">Revenue</p>
                      <CardTitle tag="h3" className="text-white">
                        ${statistics?.totalRevenue?.toFixed(0) || 0}
                      </CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Orders Table */}
        <Row>
          <Col md="12">
            <Card className="media-object">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <div>
                  <CardTitle tag="h4" className="mb-0">
                    <i className="fa fa-shopping-cart mr-2"></i>
                    All Orders
                  </CardTitle>
                  <small className="text-light-2">
                    Manage customer orders and track fulfillment
                  </small>
                </div>
                <Button 
                  color="primary" 
                  size="sm"
                  onClick={() => navigate('/admin/order/new')}
                  className="btn-round"
                >
                  <i className="fa fa-plus mr-2"></i>
                  Create Order
                </Button>
              </CardHeader>


              <CardBody>
                {/* Search and Filter Section */}
                <Row className="mb-4">
                  <Col md="5">
                    <div className="position-relative">
                      <Input
                        type="text"
                        placeholder="Search orders, customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control-rounded"
                        style={{ paddingLeft: '35px' }}
                      />
                      <i 
                        className="fa fa-search" 
                        style={{ 
                          position: 'absolute', 
                          left: '12px', 
                          top: '12px',
                          color: 'rgba(255,255,255,0.5)'
                        }}
                      ></i>
                    </div>
                  </Col>
                  <Col md="3">
                    <UncontrolledDropdown>
                      <DropdownToggle 
                        caret 
                        color="light" 
                        className="w-100 text-left"
                      >
                        <i className="fa fa-filter mr-2"></i>
                        {statusFilter === "all" ? "All Statuses" : ORDER_STATUS[statusFilter]?.label}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => handleStatusFilter("all")}>
                          All Statuses
                        </DropdownItem>
                        <DropdownItem divider />
                        {orderStatuses.map(status => (
                          <DropdownItem 
                            key={status}
                            onClick={() => handleStatusFilter(status)}
                          >
                            <i className={`fa ${ORDER_STATUS[status].icon} mr-2`}></i>
                            {ORDER_STATUS[status].label}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Col>
                  <Col md="4" className="text-right">
                    <div className="d-flex justify-content-end align-items-center gap-2">
                      <Badge color="light" className="px-3">
                        Total: {orders?.length || 0}
                      </Badge>
                      <Badge color="info" className="px-3">
                        Filtered: {tableData.length}
                      </Badge>
                      {(searchTerm || statusFilter !== "all") && (
                        <Button
                          color="secondary"
                          size="sm"
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                            dispatch(clearOrderFilters());
                          }}
                        >
                          <i className="fa fa-times mr-2"></i>
                          Clear
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>

                {/* Error Display */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="fa fa-exclamation-triangle mr-2"></i>
                    {error}
                    <button 
                      type="button" 
                      className="close" 
                      onClick={() => dispatch(clearError())}
                    >
                      <span>&times;</span>
                    </button>
                  </div>
                )}

                {/* Orders Table */}
                {tableData.length > 0 ? (
                  <div className="table-responsive">
                    <ReactTable
                      data={tableData}
                      filterable
                      resizable={false}
                      columns={columns}
                      defaultPageSize={10}
                      showPaginationTop
                      showPaginationBottom={true}
                      className="-striped -highlight"
                    />
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="fa fa-shopping-cart" style={{ fontSize: '64px', opacity: 0.3 }}></i>
                    <p className="text-light-2 mt-3">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'No orders match your filters' 
                        : 'No orders found. Create your first order!'}
                    </p>
                    {!searchTerm && statusFilter === 'all' && (
                      <Button 
                        color="primary" 
                        onClick={() => navigate('/admin/order/new')}
                        className="btn-round mt-3"
                      >
                        <i className="fa fa-plus mr-2"></i>
                        Create First Order
                      </Button>
                    )}
                  </div>
                )}

                {/* Loading Overlay */}
                {loading && orders && orders.length > 0 && (
                  <div 
                    className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ 
                      top: 0, 
                      left: 0, 
                      background: 'rgba(0,0,0,0.5)',
                      zIndex: 999
                    }}
                  >
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default OrderList;