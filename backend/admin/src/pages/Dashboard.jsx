import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Badge,
  Button,
} from 'reactstrap';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

// Import order slice
import {
  fetchOrders,
  fetchRecentOrders,
  selectAllOrders,
  selectRecentOrders,
  selectOrdersLoading,
  selectOrderStatistics,
  selectPendingOrders,
  selectShippedOrders,
  selectDeliveredOrders,
} from '../features/orders/slice';

// Import product slice
import {
  fetchProducts,
  selectProducts,
  selectLoading as selectProductsLoading,
} from '../features/products/slice';

import Loader from '../components/Loader/Loading';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux selectors
  const orders = useSelector(selectAllOrders);
  const recentOrders = useSelector(selectRecentOrders);
  const ordersLoading = useSelector(selectOrdersLoading);
  const statistics = useSelector(selectOrderStatistics);
  const pendingOrders = useSelector(selectPendingOrders);
  const shippedOrders = useSelector(selectShippedOrders);
  const deliveredOrders = useSelector(selectDeliveredOrders);
  const products = useSelector(selectProducts);
  const productsLoading = useSelector(selectProductsLoading);

  // Order status configuration
  const ORDER_STATUS = {
    pending: { color: 'warning', icon: 'fa-clock-o', label: 'Pending' },
    processing: { color: 'info', icon: 'fa-refresh', label: 'Processing' },
    shipped: { color: 'primary', icon: 'fa-truck', label: 'Shipped' },
    delivered: { color: 'success', icon: 'fa-check-circle', label: 'Delivered' },
    cancelled: { color: 'danger', icon: 'fa-times-circle', label: 'Cancelled' },
  };

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 12400, orders: 45 },
    { month: 'Feb', revenue: 15800, orders: 52 },
    { month: 'Mar', revenue: 18900, orders: 61 },
    { month: 'Apr', revenue: 16200, orders: 48 },
    { month: 'May', revenue: 21500, orders: 68 },
    { month: 'Jun', revenue: 24800, orders: 75 },
  ];

  const orderStatusData = [
    { name: 'Pending', value: pendingOrders?.length || 12, color: '#ffc107' },
    { name: 'Shipped', value: shippedOrders?.length || 8, color: '#007bff' },
    { name: 'Delivered', value: deliveredOrders?.length || 25, color: '#28a745' },
    { name: 'Processing', value: 5, color: '#17a2b8' },
  ];

  const topProductsData = [
    { name: 'Product A', sales: 45 },
    { name: 'Product B', sales: 38 },
    { name: 'Product C', sales: 32 },
    { name: 'Product D', sales: 28 },
    { name: 'Product E', sales: 22 },
  ];

  const dailyOrdersData = [
    { day: 'Mon', orders: 12 },
    { day: 'Tue', orders: 19 },
    { day: 'Wed', orders: 15 },
    { day: 'Thu', orders: 22 },
    { day: 'Fri', orders: 28 },
    { day: 'Sat', orders: 18 },
    { day: 'Sun', orders: 14 },
  ];

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchRecentOrders(6));
    dispatch(fetchProducts());
  }, [dispatch]);

  // Calculate total revenue from orders
  const totalRevenue = useMemo(() => {
    if (!orders || orders.length === 0) return 0;
    return orders.reduce((sum, order) => sum + (order.total || 0), 0);
  }, [orders]);

  // Calculate low stock products
  const lowStockProducts = useMemo(() => {
    if (!products || products.length === 0) return 0;
    return products.filter(p => p.quantity < 10).length;
  }, [products]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Show loader while fetching initial data
  if ((ordersLoading || productsLoading) && (!orders || orders.length === 0)) {
    return <Loader />;
  }

  return (
    <div className="container-fluid">
      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col lg="3" md="6">
          <Card className="card-stats">
            <CardBody>
              <Row>
                <Col xs="5">
                  <div className="icon-big text-center circle-1 bg-primary-light2">
                    <i className="fa fa-shopping-cart text-primary"></i>
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p className="card-category text-light-2">Total Orders</p>
                    <CardTitle tag="h3" className="text-white">
                      {orders?.length || 0}
                    </CardTitle>
                    <p className="mb-0">
                      <span className="text-success">
                        <i className="fa fa-arrow-up mr-1"></i>
                        4.2%
                      </span>
                    </p>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col lg="3" md="6">
          <Card className="card-stats">
            <CardBody>
              <Row>
                <Col xs="5">
                  <div className="icon-big text-center circle-1 bg-success-light2">
                    <i className="fa fa-dollar text-success"></i>
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p className="card-category text-light-2">Total Revenue</p>
                    <CardTitle tag="h3" className="text-white">
                      {formatCurrency(totalRevenue).replace('.00', '')}
                    </CardTitle>
                    <p className="mb-0">
                      <span className="text-success">
                        <i className="fa fa-arrow-up mr-1"></i>
                        1.2%
                      </span>
                    </p>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col lg="3" md="6">
          <Card className="card-stats">
            <CardBody>
              <Row>
                <Col xs="5">
                  <div className="icon-big text-center circle-1 bg-info-light2">
                    <i className="fa fa-shopping-bag text-info"></i>
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p className="card-category text-light-2">Products</p>
                    <CardTitle tag="h3" className="text-white">
                      {products?.length || 0}
                    </CardTitle>
                    <p className="mb-0">
                      <span className="text-warning">
                        <i className="fa fa-exclamation-triangle mr-1"></i>
                        {lowStockProducts} low stock
                      </span>
                    </p>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col lg="3" md="6">
          <Card className="card-stats">
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
                      {pendingOrders?.length || 0}
                    </CardTitle>
                    <p className="mb-0">
                      <span className="text-info">
                        <i className="fa fa-info-circle mr-1"></i>
                        Needs attention
                      </span>
                    </p>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row className="mb-4">
        <Col lg="8">
          <Card className="media-object">
            <CardHeader>
              <CardTitle tag="h4" className="mb-0">
                <i className="fa fa-line-chart mr-2"></i>
                Revenue & Orders Trend
              </CardTitle>
              <small className="text-light-2">Last 6 months performance</small>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#28a745" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#28a745" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#007bff" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#007bff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="month" stroke="#999" />
                  <YAxis yAxisId="left" stroke="#28a745" />
                  <YAxis yAxisId="right" orientation="right" stroke="#007bff" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#2b2b2b', border: '1px solid #444' }}
                    formatter={(value, name) => {
                      if (name === 'revenue') return formatCurrency(value);
                      return value;
                    }}
                  />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#28a745" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#007bff" 
                    fillOpacity={1} 
                    fill="url(#colorOrders)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </Col>

        <Col lg="4">
          <Card className="media-object">
            <CardHeader>
              <CardTitle tag="h4" className="mb-0">
                <i className="fa fa-pie-chart mr-2"></i>
                Order Status Distribution
              </CardTitle>
              <small className="text-light-2">Current breakdown</small>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#2b2b2b', border: '1px solid #444' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row className="mb-4">
        <Col lg="6">
          <Card className="media-object">
            <CardHeader>
              <CardTitle tag="h4" className="mb-0">
                <i className="fa fa-bar-chart mr-2"></i>
                Top Selling Products
              </CardTitle>
              <small className="text-light-2">This month's best performers</small>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProductsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: '#2b2b2b', border: '1px solid #444' }} />
                  <Bar dataKey="sales" fill="#007bff" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </Col>

        <Col lg="6">
          <Card className="media-object">
            <CardHeader>
              <CardTitle tag="h4" className="mb-0">
                <i className="fa fa-calendar mr-2"></i>
                Weekly Order Activity
              </CardTitle>
              <small className="text-light-2">Orders by day of week</small>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyOrdersData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="day" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: '#2b2b2b', border: '1px solid #444' }} />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#ffc107" 
                    strokeWidth={3}
                    dot={{ fill: '#ffc107', r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Order Status Overview */}
      <Row className="mb-4">
        <Col lg="8">
          <Card className="media-object">
            <CardHeader>
              <CardTitle tag="h4" className="mb-0">
                <i className="fa fa-bar-chart mr-2"></i>
                Order Status Overview
              </CardTitle>
              <small className="text-light-2">Current order distribution</small>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md="4">
                  <div className="text-center p-3">
                    <div className="icon-big text-center circle-1 bg-warning-light2 mx-auto mb-3">
                      <i className="fa fa-clock-o text-warning"></i>
                    </div>
                    <h3 className="text-white mb-1">{pendingOrders?.length || 0}</h3>
                    <p className="text-light-2 mb-0">Pending Orders</p>
                  </div>
                </Col>
                <Col md="4">
                  <div className="text-center p-3">
                    <div className="icon-big text-center circle-1 bg-primary-light2 mx-auto mb-3">
                      <i className="fa fa-truck text-primary"></i>
                    </div>
                    <h3 className="text-white mb-1">{shippedOrders?.length || 0}</h3>
                    <p className="text-light-2 mb-0">Shipped Orders</p>
                  </div>
                </Col>
                <Col md="4">
                  <div className="text-center p-3">
                    <div className="icon-big text-center circle-1 bg-success-light2 mx-auto mb-3">
                      <i className="fa fa-check-circle text-success"></i>
                    </div>
                    <h3 className="text-white mb-1">{deliveredOrders?.length || 0}</h3>
                    <p className="text-light-2 mb-0">Delivered Orders</p>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col lg="4">
          <Card className="media-object">
            <CardHeader>
              <CardTitle tag="h4" className="mb-0">
                <i className="fa fa-line-chart mr-2"></i>
                Quick Stats
              </CardTitle>
              <small className="text-light-2">Performance metrics</small>
            </CardHeader>
            <CardBody>
              <div className="mb-3 pb-3 border-bottom border-light-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-light-1">Average Order Value</span>
                  <span className="text-success font-weight-bold">
                    {formatCurrency(totalRevenue / (orders?.length || 1))}
                  </span>
                </div>
              </div>
              <div className="mb-3 pb-3 border-bottom border-light-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-light-1">Completion Rate</span>
                  <span className="text-info font-weight-bold">
                    {orders?.length > 0
                      ? Math.round(
                          ((deliveredOrders?.length || 0) / orders.length) * 100
                        )
                      : 0}
                    %
                  </span>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-light-1">Active Products</span>
                  <span className="text-white font-weight-bold">
                    {products?.filter(p => p.quantity > 0).length || 0}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders Table */}
      <Row>
        <Col md="12">
          <Card className="media-object">
            <CardHeader className="d-flex justify-content-between align-items-center">
              <div>
                <CardTitle tag="h4" className="mb-0">
                  <i className="fa fa-shopping-cart mr-2"></i>
                  Recent Orders
                </CardTitle>
                <small className="text-light-2">Latest customer orders</small>
              </div>
              <Button
                color="primary"
                size="sm"
                className="btn-round"
                onClick={() => navigate('/admin/orders')}
              >
                <i className="fa fa-list mr-2"></i>
                View All
              </Button>
            </CardHeader>
            <CardBody>
              {orders && orders.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-secondary text-white">
                      <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0,5).map((order) => {
                        const statusConfig =
                          ORDER_STATUS[order.orderStatus] || ORDER_STATUS.pending;
                        return (
                          <tr key={order._id}>
                            <td>
                              <div className="d-flex flex-column">
                                <span className="text-white font-weight-bold">
                                  #{order.orderNumber}
                                </span>
                                <code className="text-info small">
                                  {order._id?.substring(0, 8)}
                                </code>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex flex-column">
                                <span className="text-white">
                                  {order.customerName || 'Guest'}
                                </span>
                                <small className="text-light-2">
                                  {order.customerEmail}
                                </small>
                              </div>
                            </td>
                            <td>
                              <Badge color={statusConfig.color} pill className="px-3">
                                <i className={`fa ${statusConfig.icon} mr-2`}></i>
                                {statusConfig.label}
                              </Badge>
                            </td>
                            <td>
                              <Badge color="light" pill>
                                {order.itemsCount || order.items?.length || 0} items
                              </Badge>
                            </td>
                            <td>
                              <span className="text-success font-weight-bold">
                                {formatCurrency(order.total)}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex flex-column">
                                <span className="text-light-1">
                                  {formatDate(order.orderDate)}
                                </span>
                                <small className="text-light-2">
                                  {new Date(order.orderDate).toLocaleTimeString(
                                    'en-US',
                                    {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )}
                                </small>
                              </div>
                            </td>
                            <td>
                              <Button
                                color="info"
                                size="sm"
                                className="btn-round"
                                onClick={() =>
                                  navigate(`/admin/order/view/${order._id}`)
                                }
                                title="View Order"
                              >
                                <i className="fa fa-eye"></i>
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i
                    className="fa fa-shopping-cart"
                    style={{ fontSize: '64px', opacity: 0.3 }}
                  ></i>
                  <p className="text-light-2 mt-3">No recent orders found</p>
                  <Button
                    color="primary"
                    onClick={() => navigate('/admin/order/new')}
                    className="btn-round mt-3"
                  >
                    <i className="fa fa-plus mr-2"></i>
                    Create First Order
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;