import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Badge, Button } from 'reactstrap';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchOrders, fetchRecentOrders, selectAllOrders, selectRecentOrders, selectOrdersLoading } from '../features/orders/slice';
import { fetchProducts, selectProducts, selectLoading as selectProductsLoading } from '../features/products/slice';
import Loader from '../components/Loader/Loading';

/* -------------------------------------------------------------------------
   Constants (kept outside the component so they are not rebuilt each render)
   ---------------------------------------------------------------------- */

const LOW_STOCK_THRESHOLD = 10;
const RECENT_ORDERS_COUNT = 6;

// `hex` values match the CSS tokens in dark-theme.css
const ORDER_STATUS = {
    pending: { color: 'warning', hex: '#f0a63a', icon: 'fa-clock-o', label: 'Pending' },
    processing: { color: 'info', hex: '#4cc3e8', icon: 'fa-refresh', label: 'Processing' },
    shipped: { color: 'primary', hex: '#14abef', icon: 'fa-truck', label: 'Shipped' },
    delivered: { color: 'success', hex: '#2fbf71', icon: 'fa-check-circle', label: 'Delivered' },
    cancelled: { color: 'danger', hex: '#f0566a', icon: 'fa-times-circle', label: 'Cancelled' },
};

const CHART = {
    accent: '#14abef',
    info: '#4cc3e8',
    grid: 'rgba(255, 255, 255, 0.08)',
    axis: '#8b94a1',
    tooltip: {
        backgroundColor: '#0c0f14',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 6,
    },
};

/* -------------------------------------------------------------------------
   Formatting + data helpers
   ---------------------------------------------------------------------- */

const formatCurrency = (amount, digits = 2) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(Number(amount) || 0);

const toDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
    const date = toDate(value);
    return date
        ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'N/A';
};

const formatTime = (value) => {
    const date = toDate(value);
    return date ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';
};

const orderTotal = (order) => Number(order?.total) || 0;

const percentChange = (current, previous) =>
    previous > 0 ? ((current - previous) / previous) * 100 : null;

/** Last 6 calendar months, oldest first. `initial()` supplies each bucket's counters. */
const monthBuckets = (initial) => {
    const now = new Date();
    const buckets = [];
    for (let i = 5; i >= 0; i -= 1) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        buckets.push({
            key: `${d.getFullYear()}-${d.getMonth()}`,
            month: d.toLocaleDateString('en-US', { month: 'short' }),
            ...initial(),
        });
    }
    return buckets;
};

/** Orders and revenue for the last 6 calendar months. Cancelled orders earn no revenue. */
const buildMonthlySeries = (orders) => {
    const buckets = monthBuckets(() => ({ revenue: 0, orders: 0 }));
    const byKey = new Map(buckets.map((b) => [b.key, b]));

    orders.forEach((order) => {
        const date = toDate(order.orderDate);
        const bucket = date && byKey.get(`${date.getFullYear()}-${date.getMonth()}`);
        if (!bucket) return;
        bucket.orders += 1;
        if (order.orderStatus !== 'cancelled') bucket.revenue += orderTotal(order);
    });
    return buckets;
};

/** Accepts 'Name', { name }, or an array of either. */
const labelsOf = (value) => {
    if (Array.isArray(value)) return value.flatMap(labelsOf);
    const label = value && typeof value === 'object' ? value.name || value.title : value;
    return label ? [String(label)] : [];
};

/** Product count, units in stock and low-stock count per category or brand. Top `limit`. */
const buildCatalogSeries = (products, field, fallback, limit = 8) => {
    const groups = new Map();
    products.forEach((product) => {
        const labels = labelsOf(product[field]);
        const units = Number(product.quantity) || 0;
        (labels.length > 0 ? labels : [fallback]).forEach((name) => {
            const group = groups.get(name) || { name, products: 0, units: 0, lowStock: 0 };
            group.products += 1;
            group.units += units;
            if (units < LOW_STOCK_THRESHOLD) group.lowStock += 1;
            groups.set(name, group);
        });
    });
    return [...groups.values()].sort((a, b) => b.products - a.products).slice(0, limit);
};

/** Mongo ObjectIds start with a creation timestamp, a useful fallback when there is no createdAt. */
const objectIdDate = (id) =>
    typeof id === 'string' && /^[0-9a-f]{24}$/i.test(id)
        ? new Date(parseInt(id.slice(0, 8), 16) * 1000)
        : null;

const productDate = (product) =>
    toDate(product.createdAt || product.dateAdded) || objectIdDate(product._id);

const productName = (product) => product.name || product.title || 'Untitled';

/** Products added per calendar month, last 6 months. */
const buildProductSeries = (products) => {
    const buckets = monthBuckets(() => ({ added: 0 }));
    const byKey = new Map(buckets.map((b) => [b.key, b]));
    products.forEach((product) => {
        const date = productDate(product);
        const bucket = date && byKey.get(`${date.getFullYear()}-${date.getMonth()}`);
        if (bucket) bucket.added += 1;
    });
    return buckets;
};

const truncate = (text, max) => (text && text.length > max ? `${text.slice(0, max - 1)}…` : text);

/* -------------------------------------------------------------------------
   Small presentational components
   ---------------------------------------------------------------------- */

const Trend = ({ value, label }) => {
    if (value === null || value === undefined) {
        return <span className="text-light-2">{label || 'No prior data'}</span>;
    }
    const up = value >= 0;
    return (
        <span className={up ? 'text-success' : 'text-danger'}>
            <i className={`fa ${up ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`} aria-hidden="true"></i>
            {Math.abs(value).toFixed(1)}% vs last month
        </span>
    );
};

const StatCard = ({ icon, tone, label, value, footer }) => (
    <Col lg="3" md="6">
        <Card className="card-stats media-object">
            <CardBody>
                <Row>
                    <Col xs="5">
                        <div className={`icon-big text-center circle-1 bg-${tone}-light2`}>
                            <i className={`fa ${icon} text-${tone}`} aria-hidden="true"></i>
                        </div>
                    </Col>
                    <Col xs="7">
                        <div className="numbers">
                            <p className="card-category text-light-2">{label}</p>
                            <CardTitle tag="h3" className="text-white">{value}</CardTitle>
                            <p className="mb-0">{footer}</p>
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    </Col>
);

const ChartCard = ({ lg, icon, title, subtitle, hasData, emptyText, children }) => (
    <Col lg={lg}>
        <Card className="media-object">
            <CardHeader>
                <CardTitle tag="h4" className="mb-0">
                    <i className={`fa ${icon} mr-2`} aria-hidden="true"></i>
                    {title}
                </CardTitle>
                <small className="text-light-2">{subtitle}</small>
            </CardHeader>
            <CardBody>
                {hasData ? (
                    <ResponsiveContainer width="100%" height={300}>
                        {children}
                    </ResponsiveContainer>
                ) : (
                    <div className="d-flex align-items-center justify-content-center text-light-2" style={{ height: 300 }}>
                        {emptyText}
                    </div>
                )}
            </CardBody>
        </Card>
    </Col>
);

/* -------------------------------------------------------------------------
   Dashboard
   ---------------------------------------------------------------------- */

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const orders = useSelector(selectAllOrders);
    const recentOrders = useSelector(selectRecentOrders);
    const ordersLoading = useSelector(selectOrdersLoading);
    const products = useSelector(selectProducts);
    const productsLoading = useSelector(selectProductsLoading);

    useEffect(() => {
        dispatch(fetchOrders());
        dispatch(fetchRecentOrders(RECENT_ORDERS_COUNT));
        dispatch(fetchProducts());
    }, [dispatch]);

    const orderList = useMemo(() => (Array.isArray(orders) ? orders : []), [orders]);
    const productList = useMemo(() => (Array.isArray(products) ? products : []), [products]);

    // One source of truth for every status number on the page
    const statusCounts = useMemo(() => {
        const counts = Object.fromEntries(Object.keys(ORDER_STATUS).map((key) => [key, 0]));
        orderList.forEach((order) => {
            if (counts[order.orderStatus] !== undefined) counts[order.orderStatus] += 1;
        });
        return counts;
    }, [orderList]);

    const monthlySeries = useMemo(() => buildMonthlySeries(orderList), [orderList]);

    const categorySeries = useMemo(
        () => buildCatalogSeries(productList, 'category', 'Uncategorized'),
        [productList]
    );
    const brandSeries = useMemo(
        () => buildCatalogSeries(productList, 'brand', 'No brand'),
        [productList]
    );
    const productSeries = useMemo(() => buildProductSeries(productList), [productList]);
    const recentProducts = useMemo(
        () =>
            [...productList]
                .sort((a, b) => (productDate(b)?.getTime() || 0) - (productDate(a)?.getTime() || 0))
                .slice(0, 5),
        [productList]
    );

    const totalRevenue = useMemo(
        () =>
            orderList
                .filter((order) => order.orderStatus !== 'cancelled')
                .reduce((sum, order) => sum + orderTotal(order), 0),
        [orderList]
    );

    const revenueOrderCount = orderList.length - statusCounts.cancelled;
    const averageOrderValue = revenueOrderCount > 0 ? totalRevenue / revenueOrderCount : 0;
    const completionRate =
        orderList.length > 0 ? Math.round((statusCounts.delivered / orderList.length) * 100) : 0;

    const lowStockCount = useMemo(
        () => productList.filter((p) => (Number(p.quantity) || 0) < LOW_STOCK_THRESHOLD).length,
        [productList]
    );
    const inStockCount = useMemo(
        () => productList.filter((p) => (Number(p.quantity) || 0) > 0).length,
        [productList]
    );

    // Month-over-month change comes from the real monthly buckets
    const thisMonth = monthlySeries[monthlySeries.length - 1];
    const lastMonth = monthlySeries[monthlySeries.length - 2];
    const ordersTrend = percentChange(thisMonth.orders, lastMonth.orders);
    const revenueTrend = percentChange(thisMonth.revenue, lastMonth.revenue);

    // Prefer the API's "recent" list, fall back to newest-first from the full list
    const tableOrders = useMemo(() => {
        if (Array.isArray(recentOrders) && recentOrders.length > 0) return recentOrders;
        return [...orderList]
            .sort((a, b) => (toDate(b.orderDate)?.getTime() || 0) - (toDate(a.orderDate)?.getTime() || 0))
            .slice(0, RECENT_ORDERS_COUNT);
    }, [recentOrders, orderList]);

    if ((ordersLoading || productsLoading) && orderList.length === 0) {
        return <Loader />;
    }

    return (
        <div className="container-fluid">
            {/* Statistics */}
            <Row className="mb-4">
                <StatCard
                    icon="fa-shopping-cart"
                    tone="primary"
                    label="Total Orders"
                    value={orderList.length}
                    footer={<Trend value={ordersTrend} />}
                />
                <StatCard
                    icon="fa-dollar"
                    tone="success"
                    label="Total Revenue"
                    value={formatCurrency(totalRevenue, 0)}
                    footer={<Trend value={revenueTrend} />}
                />
                <StatCard
                    icon="fa-shopping-bag"
                    tone="info"
                    label="Products"
                    value={productList.length}
                    footer={
                        <span className={lowStockCount > 0 ? 'text-warning' : 'text-success'}>
                            <i
                                className={`fa ${lowStockCount > 0 ? 'fa-exclamation-triangle' : 'fa-check'} mr-1`}
                                aria-hidden="true"
                            ></i>
                            {lowStockCount} low stock
                        </span>
                    }
                />
                <StatCard
                    icon="fa-clock-o"
                    tone="warning"
                    label="Pending"
                    value={statusCounts.pending}
                    footer={
                        <span className="text-info">
                            <i className="fa fa-info-circle mr-1" aria-hidden="true"></i>
                            {statusCounts.pending > 0 ? 'Needs attention' : 'All caught up'}
                        </span>
                    }
                />
            </Row>

            {/* Status overview + quick stats */}
            <Row className="mb-4">
                <Col lg="8">
                    <Card className="media-object">
                        <CardHeader>
                            <CardTitle tag="h4" className="mb-0">
                                <i className="fa fa-tasks mr-2" aria-hidden="true"></i>
                                Order Status Overview
                            </CardTitle>
                            <small className="text-light-2">Orders by fulfilment stage</small>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                {['pending', 'shipped', 'delivered'].map((key) => {
                                    const cfg = ORDER_STATUS[key];
                                    return (
                                        <Col md="4" key={key}>
                                            <div className="text-center p-3">
                                                <div className={`icon-big text-center circle-1 bg-${cfg.color}-light2 mx-auto mb-3`}>
                                                    <i className={`fa ${cfg.icon} text-${cfg.color}`} aria-hidden="true"></i>
                                                </div>
                                                <h3 className="text-white mb-1">{statusCounts[key]}</h3>
                                                <p className="text-light-2 mb-0">{cfg.label}</p>
                                            </div>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </CardBody>
                    </Card>
                </Col>

                <Col lg="4">
                    <Card className="media-object">
                        <CardHeader>
                            <CardTitle tag="h4" className="mb-0">
                                <i className="fa fa-bolt mr-2" aria-hidden="true"></i>
                                Quick Stats
                            </CardTitle>
                            <small className="text-light-2">Performance metrics</small>
                        </CardHeader>
                        <CardBody>
                            <div className="mb-3 pb-3 border-bottom border-light-3 d-flex justify-content-between align-items-center">
                                <span className="text-light-1">Average Order Value</span>
                                <span className="text-success font-weight-bold">{formatCurrency(averageOrderValue)}</span>
                            </div>
                            <div className="mb-3 pb-3 border-bottom border-light-3 d-flex justify-content-between align-items-center">
                                <span className="text-light-1">Completion Rate</span>
                                <span className="text-info font-weight-bold">{completionRate}%</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="text-light-1">Products In Stock</span>
                                <span className="text-white font-weight-bold">{inStockCount}</span>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* Catalog: categories + brands */}
            <Row className="mb-4">
                <ChartCard
                    lg="6"
                    icon="fa-th-large"
                    title="Products by Category"
                    subtitle="Product count and units in stock, top 8"
                    hasData={categorySeries.length > 0}
                    emptyText="No products yet"
                >
                    <BarChart data={categorySeries}>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                        <XAxis dataKey="name" stroke={CHART.axis} tickFormatter={(v) => truncate(v, 12)} />
                        <YAxis stroke={CHART.axis} allowDecimals={false} />
                        <Tooltip contentStyle={CHART.tooltip} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
                        <Legend />
                        <Bar dataKey="products" name="Products" fill={CHART.accent} radius={[6, 6, 0, 0]} />
                        <Bar dataKey="units" name="Units in stock" fill={CHART.info} radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ChartCard>

                <ChartCard
                    lg="6"
                    icon="fa-tags"
                    title="Products by Brand"
                    subtitle="Top 8 brands by product count"
                    hasData={brandSeries.length > 0}
                    emptyText="No products yet"
                >
                    <BarChart data={brandSeries} layout="vertical" margin={{ left: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} horizontal={false} />
                        <XAxis type="number" stroke={CHART.axis} allowDecimals={false} />
                        <YAxis
                            type="category"
                            dataKey="name"
                            stroke={CHART.axis}
                            width={96}
                            tickFormatter={(v) => truncate(v, 14)}
                        />
                        <Tooltip contentStyle={CHART.tooltip} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
                        <Bar dataKey="products" name="Products" fill={CHART.accent} radius={[0, 6, 6, 0]} />
                    </BarChart>
                </ChartCard>
            </Row>

            {/* Recent products */}
            <Row className="mb-4">
                <ChartCard
                    lg="5"
                    icon="fa-line-chart"
                    title="Products Added"
                    subtitle="New products per month, last 6 months"
                    hasData={productSeries.some((m) => m.added > 0)}
                    emptyText="No products added in the last 6 months"
                >
                    <LineChart data={productSeries}>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                        <XAxis dataKey="month" stroke={CHART.axis} />
                        <YAxis stroke={CHART.axis} allowDecimals={false} />
                        <Tooltip contentStyle={CHART.tooltip} />
                        <Line
                            type="monotone"
                            dataKey="added"
                            name="Products added"
                            stroke={CHART.accent}
                            strokeWidth={3}
                            dot={{ fill: CHART.accent, r: 4 }}
                            activeDot={{ r: 7 }}
                        />
                    </LineChart>
                </ChartCard>

                <Col lg="7">
                    <Card className="media-object">
                        <CardHeader className="d-flex justify-content-between align-items-center">
                            <div>
                                <CardTitle tag="h4" className="mb-0">
                                    <i className="fa fa-cube mr-2" aria-hidden="true"></i>
                                    Recent Products
                                </CardTitle>
                                <small className="text-light-2">Newest additions to the catalog</small>
                            </div>
                            <Button color="primary" size="sm" className="btn-round" onClick={() => navigate('/admin/products')}>
                                <i className="fa fa-list mr-2" aria-hidden="true"></i>
                                View All
                            </Button>
                        </CardHeader>
                        <CardBody>
                            {recentProducts.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Category</th>
                                                <th>Brand</th>
                                                <th>Price</th>
                                                <th>Stock</th>
                                                <th>Added</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentProducts.map((product) => {
                                                const qty = Number(product.quantity) || 0;
                                                const stockColor = qty === 0 ? 'danger' : qty < LOW_STOCK_THRESHOLD ? 'warning' : 'success';
                                                const stockLabel = qty === 0 ? 'Out of stock' : `${qty} in stock`;
                                                const name = productName(product);
                                                return (
                                                    <tr key={product._id || product.id || name}>
                                                        <td className="text-white" title={name}>{truncate(name, 30)}</td>
                                                        <td className="text-light-1">{labelsOf(product.category).join(', ') || '\u2014'}</td>
                                                        <td className="text-light-1">{labelsOf(product.brand).join(', ') || '\u2014'}</td>
                                                        <td className="text-success font-weight-bold">{formatCurrency(product.price)}</td>
                                                        <td>
                                                            <Badge color={stockColor} pill className="px-3">{stockLabel}</Badge>
                                                        </td>
                                                        <td className="text-light-1">{formatDate(productDate(product))}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="fa fa-cube" style={{ fontSize: 64, opacity: 0.3 }} aria-hidden="true"></i>
                                    <p className="text-light-2 mt-3">No products yet</p>
                                    <Button color="primary" onClick={() => navigate('/admin/product/new')} className="btn-round mt-3">
                                        <i className="fa fa-plus mr-2" aria-hidden="true"></i>
                                        Add First Product
                                    </Button>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* Recent orders */}
            <Row>
                <Col md="12">
                    <Card className="media-object">
                        <CardHeader className="d-flex justify-content-between align-items-center">
                            <div>
                                <CardTitle tag="h4" className="mb-0">
                                    <i className="fa fa-shopping-cart mr-2" aria-hidden="true"></i>
                                    Recent Orders
                                </CardTitle>
                                <small className="text-light-2">Latest customer orders</small>
                            </div>
                            <Button color="primary" size="sm" className="btn-round" onClick={() => navigate('/admin/orders')}>
                                <i className="fa fa-list mr-2" aria-hidden="true"></i>
                                View All
                            </Button>
                        </CardHeader>
                        <CardBody>
                            {tableOrders.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead>
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
                                            {tableOrders.map((order) => {
                                                const status = ORDER_STATUS[order.orderStatus] || ORDER_STATUS.pending;
                                                const itemCount = order.itemsCount ?? order.items?.length ?? 0;
                                                return (
                                                    <tr key={order._id}>
                                                        <td>
                                                            <div className="d-flex flex-column">
                                                                <span className="text-white font-weight-bold">#{order.orderNumber}</span>
                                                                <code className="small">{order._id?.substring(0, 8)}</code>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex flex-column">
                                                                <span className="text-white">{order.customerName || 'Guest'}</span>
                                                                <small className="text-light-2">{order.customerEmail}</small>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <Badge color={status.color} pill className="px-3">
                                                                <i className={`fa ${status.icon} mr-2`} aria-hidden="true"></i>
                                                                {status.label}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <Badge color="light" pill>
                                                                {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <span className="text-success font-weight-bold">{formatCurrency(order.total)}</span>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex flex-column">
                                                                <span className="text-light-1">{formatDate(order.orderDate)}</span>
                                                                <small className="text-light-2">{formatTime(order.orderDate)}</small>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <Button
                                                                color="info"
                                                                size="sm"
                                                                className="btn-round"
                                                                onClick={() => navigate(`/admin/order/view/${order._id}`)}
                                                                title="View order"
                                                                aria-label={`View order ${order.orderNumber}`}
                                                            >
                                                                <i className="fa fa-eye" aria-hidden="true"></i>
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
                                    <i className="fa fa-shopping-cart" style={{ fontSize: 64, opacity: 0.3 }} aria-hidden="true"></i>
                                    <p className="text-light-2 mt-3">No recent orders found</p>
                                    <Button color="primary" onClick={() => navigate('/admin/order/new')} className="btn-round mt-3">
                                        <i className="fa fa-plus mr-2" aria-hidden="true"></i>
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