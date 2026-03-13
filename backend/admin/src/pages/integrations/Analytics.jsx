
import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Badge,
  Button,
  Input,
  Alert,
  Progress,
} from 'reactstrap';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const API_BASE = 'https://fear.dedyn.io/fear/api/analytics' // production -> 'https://fear.dedyn.io/fear/api';

const DATE_RANGES = [
  { label: '7 Days', value: '7daysAgo' },
  { label: '30 Days', value: '30daysAgo' },
  { label: '90 Days', value: '90daysAgo' },
  { label: '1 Year', value: '365daysAgo' },
];

const PIE_COLORS = ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#dc3545', '#6f42c1'];

const CHART_TOOLTIP_STYLE = {
  contentStyle: { backgroundColor: '#2b2b2b', border: '1px solid #444' },
};

const analyticsApi = {
  status: () => fetch(`${API_BASE}/auth/status`).then(r => r.json()),
  disconnect: () => fetch(`${API_BASE}/auth/disconnect`, { method: 'POST' }).then(r => r.json()),
  connect: () => window.open(`${API_BASE}/auth/connect`, '_blank', 'width=600,height=700'),
  properties: () => fetch(`${API_BASE}/properties`).then(r => r.json()),
  overview: (p, s, e) => fetch(`${API_BASE}/report/overview?propertyId=${p}&startDate=${s}&endDate=${e}`).then(r => r.json()),
  traffic: (p, s, e) => fetch(`${API_BASE}/report/traffic?propertyId=${p}&startDate=${s}&endDate=${e}`).then(r => r.json()),
  topPages: (p, s, e) => fetch(`${API_BASE}/report/pages?propertyId=${p}&startDate=${s}&endDate=${e}`).then(r => r.json()),
  devices: (p, s, e) => fetch(`${API_BASE}/report/devices?propertyId=${p}&startDate=${s}&endDate=${e}`).then(r => r.json()),
  geo: (p, s, e) => fetch(`${API_BASE}/report/geo?propertyId=${p}&startDate=${s}&endDate=${e}`).then(r => r.json()),
  realtime: (p) => fetch(`${API_BASE}/report/realtime?propertyId=${p}`).then(r => r.json()),
};
const fmtNum = (n) => Number(n || 0).toLocaleString();
const fmtPct = (n) => `${Number(n || 0).toFixed(1)}%`;
const fmtDur = (s) => {
  const sec = Math.round(Number(s || 0));
  const m = Math.floor(sec / 60);
  const rem = sec % 60;
  return `${m}m ${rem}s`;
};

// ── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({ icon, iconBg, iconColor, label, value, sub, subColor = 'text-success', subIcon }) => (
  <Card className="card-stats">
    <CardBody>
      <Row>
        <Col xs="5">
          <div className={`icon-big text-center circle-1 ${iconBg}`}>
            <i className={`fa ${icon} ${iconColor}`}></i>
          </div>
        </Col>
        <Col xs="7">
          <div className="numbers">
            <p className="card-category text-light-2">{label}</p>
            <CardTitle tag="h3" className="text-white">{value}</CardTitle>
            {sub && (
              <p className="mb-0">
                <span className={subColor}>
                  {subIcon && <i className={`fa ${subIcon} mr-1`}></i>}
                  {sub}
                </span>
              </p>
            )}
          </div>
        </Col>
      </Row>
    </CardBody>
  </Card>
);

const SectionLoader = ({ text = 'Loading data…' }) => (
  <div className="text-center py-4">
    <i className="fa fa-refresh fa-spin text-primary" style={{ fontSize: 28 }}></i>
    <p className="text-light-2 mt-2 mb-0">{text}</p>
  </div>
);

const EmptyState = ({ icon = 'fa-bar-chart', text = 'No data available' }) => (
  <div className="text-center py-4">
    <i className={`fa ${icon}`} style={{ fontSize: 48, opacity: 0.25 }}></i>
    <p className="text-light-2 mt-3 mb-0">{text}</p>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

const GoogleAnalytics = () => {

  // ── Auth / connection ──────────────────────────────────────────────────────
  const [connected, setConnected] = useState(false);
  const [connectionLoading, setConnectionLoading] = useState(true);

  // ── Property selection ─────────────────────────────────────────────────────
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [propertiesLoading, setPropertiesLoading] = useState(false);

  // ── Date range ─────────────────────────────────────────────────────────────
  const [dateRange, setDateRange] = useState('30daysAgo');

  // ── Report data ────────────────────────────────────────────────────────────
  const [overview, setOverview] = useState(null);
  const [traffic, setTraffic] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [devices, setDevices] = useState([]);
  const [geo, setGeo] = useState([]);
  const [realtime, setRealtime] = useState(null);

  // ── Loading flags ──────────────────────────────────────────────────────────
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [trafficLoading, setTrafficLoading] = useState(false);
  const [pagesLoading, setPagesLoading] = useState(false);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [realtimeLoading, setRealtimeLoading] = useState(false);

  // ── Misc ───────────────────────────────────────────────────────────────────
  const [alert, setAlert] = useState(null);
  const [realtimeInterval, setRealtimeInterval] = useState(null);

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  useEffect(() => {
    checkConnection();
    return () => { if (realtimeInterval) clearInterval(realtimeInterval); };
  }, []);

  useEffect(() => {
    if (connected) loadProperties();
  }, [connected]);

  useEffect(() => {
    if (selectedProperty) loadAllReports();
  }, [selectedProperty, dateRange]);

  useEffect(() => {
    if (selectedProperty) {
      const id = setInterval(() => loadRealtime(selectedProperty), 30_000);
      setRealtimeInterval(id);
      return () => clearInterval(id);
    }
  }, [selectedProperty]);

  // ── Auth handlers ─────────────────────────────────────────────────────────

  const checkConnection = async () => {
    setConnectionLoading(true);
    try {
      // const { connected: ok } = await analyticsApi.status();
      // setConnected(ok);
      setConnected(false); // ← remove when backend ready
    } catch {
      setConnected(false);
    } finally {
      setConnectionLoading(false);
    }
  };

  const handleConnect = () => {
    analyticsApi.connect();
    
    const poll = setInterval(async () => {
      try {
        const { connected: ok } = await analyticsApi.status();
        if (ok) {
          setConnected(true);
          showAlert('success', 'Google Analytics connected successfully!');
          clearInterval(poll);
        }
      } catch { }
    }, 3000);
    setTimeout(() => clearInterval(poll), 180_000);
    
  };

  const handleDisconnect = async () => {
    try {
      await analyticsApi.disconnect();
      setConnected(false);
      setProperties([]);
      setSelectedProperty('');
      setOverview(null);
      setTraffic([]);
      showAlert('warning', 'Disconnected from Google Analytics.');
    } catch {
      showAlert('danger', 'Failed to disconnect. Please try again.');
    }
  };

  // ── Data loaders ──────────────────────────────────────────────────────────

  const loadProperties = async () => {
    setPropertiesLoading(true);
    try {
      // const { properties: list } = await analyticsApi.properties();
      // Mocked for demo — replace with real call:
      const list = [
        { id: '123456789', displayName: 'My Store — Production' },
        { id: '987654321', displayName: 'My Store — Staging' },
      ];
      setProperties(list);
      if (list.length) setSelectedProperty(list[0].id);
    } catch {
      showAlert('danger', 'Failed to load GA4 properties.');
    } finally {
      setPropertiesLoading(false);
    }
  };

  const loadAllReports = () => {
    if (!selectedProperty) return;
    loadOverview();
    loadTraffic();
    loadTopPages();
    loadDevices();
    loadGeo();
    loadRealtime(selectedProperty);
  };

  const loadOverview = async () => {
    setOverviewLoading(true);
    try {
      // const data = await analyticsApi.overview(selectedProperty, dateRange, 'today');
      // Mocked:
      await delay(600);
      setOverview({
        sessions: 42_810,
        users: 31_204,
        newUsers: 18_950,
        pageviews: 128_430,
        bounceRate: 42.3,
        avgSessionDuration: 187,
        sessionsChange: '+8.4%',
        usersChange: '+5.1%',
        pageviewsChange: '+12.3%',
        bounceChange: '-2.1%',
      });
    } catch {
      showAlert('danger', 'Failed to load overview report.');
    } finally {
      setOverviewLoading(false);
    }
  };

  const loadTraffic = async () => {
    setTrafficLoading(true);
    try {
      // const data = await analyticsApi.traffic(selectedProperty, dateRange, 'today');
      await delay(800);
      setTraffic([
        { date: 'Jan 1', sessions: 1200, users: 980, pageviews: 3200 },
        { date: 'Jan 5', sessions: 1450, users: 1120, pageviews: 3900 },
        { date: 'Jan 10', sessions: 1300, users: 1050, pageviews: 3500 },
        { date: 'Jan 15', sessions: 1800, users: 1400, pageviews: 4800 },
        { date: 'Jan 20', sessions: 2100, users: 1650, pageviews: 5600 },
        { date: 'Jan 25', sessions: 1950, users: 1520, pageviews: 5100 },
        { date: 'Jan 30', sessions: 2400, users: 1880, pageviews: 6400 },
      ]);
    } catch {
      showAlert('danger', 'Failed to load traffic report.');
    } finally {
      setTrafficLoading(false);
    }
  };

  const loadTopPages = async () => {
    setPagesLoading(true);
    try {
      // const data = await analyticsApi.topPages(selectedProperty, dateRange, 'today');
      await delay(700);
      setTopPages([
        { page: '/', pageviews: 18_430, avgTime: '2m 14s', bounceRate: '38.2%' },
        { page: '/products', pageviews: 12_810, avgTime: '3m 02s', bounceRate: '28.6%' },
        { page: '/products/:id', pageviews: 9_204, avgTime: '4m 17s', bounceRate: '22.1%' },
        { page: '/cart', pageviews: 6_388, avgTime: '1m 48s', bounceRate: '44.3%' },
        { page: '/checkout', pageviews: 4_120, avgTime: '5m 31s', bounceRate: '15.8%' },
        { page: '/about', pageviews: 2_944, avgTime: '1m 22s', bounceRate: '62.4%' },
        { page: '/contact', pageviews: 1_802, avgTime: '1m 05s', bounceRate: '55.9%' },
      ]);
    } catch {
      showAlert('danger', 'Failed to load top pages.');
    } finally {
      setPagesLoading(false);
    }
  };

  const loadDevices = async () => {
    setDevicesLoading(true);
    try {
      // const data = await analyticsApi.devices(selectedProperty, dateRange, 'today');
      await delay(500);
      setDevices([
        { name: 'Mobile', value: 58, color: '#007bff' },
        { name: 'Desktop', value: 35, color: '#28a745' },
        { name: 'Tablet', value: 7, color: '#ffc107' },
      ]);
    } catch {
      showAlert('danger', 'Failed to load device breakdown.');
    } finally {
      setDevicesLoading(false);
    }
  };

  const loadGeo = async () => {
    setGeoLoading(true);
    try {
      // const data = await analyticsApi.geo(selectedProperty, dateRange, 'today');
      await delay(650);
      setGeo([
        { country: 'United States', sessions: 18_420, pct: '43.0%' },
        { country: 'United Kingdom', sessions: 5_210, pct: '12.2%' },
        { country: 'Canada', sessions: 4_380, pct: '10.2%' },
        { country: 'Australia', sessions: 2_910, pct: '6.8%' },
        { country: 'Germany', sessions: 2_140, pct: '5.0%' },
        { country: 'France', sessions: 1_880, pct: '4.4%' },
        { country: 'Other', sessions: 7_870, pct: '18.4%' },
      ]);
    } catch {
      showAlert('danger', 'Failed to load geo report.');
    } finally {
      setGeoLoading(false);
    }
  };

  const loadRealtime = async (propId) => {
    setRealtimeLoading(true);
    try {
      // const data = await analyticsApi.realtime(propId);
      await delay(400);
      setRealtime({
        activeUsers: Math.floor(Math.random() * 80) + 20,
        topActivePages: [
          { page: '/', users: 18 },
          { page: '/products', users: 12 },
          { page: '/cart', users: 7 },
        ],
      });
    } catch { /* fail silently for realtime */ } finally {
      setRealtimeLoading(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  const delay = (ms) => new Promise(r => setTimeout(r, ms));
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="container-fluid">

      {/* Alert */}
      {alert && (
        <Alert color={alert.type} className="mb-4" toggle={() => setAlert(null)}>
          <i className={`fa mr-2 ${alert.type === 'success' ? 'fa-check-circle' :
              alert.type === 'danger' ? 'fa-times-circle' :
                alert.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'
            }`} />
          {alert.message}
        </Alert>
      )}

      {/* ── Connection Card ──────────────────────────────────────────────── */}
      <Row className="mb-4">
        <Col md="12">
          <Card className="media-object">
            <CardHeader className="d-flex justify-content-between align-items-center">
              <div>
                <CardTitle tag="h4" className="mb-0">
                  <i className="fa fa-bar-chart mr-2"></i>
                  Google Analytics
                </CardTitle>
                <small className="text-light-2">Connect your GA4 property to view site analytics</small>
              </div>

              <div className="d-flex align-items-center" style={{ gap: 10 }}>
                {/* Property selector */}
                {connected && properties.length > 0 && (
                  <Input
                    type="select"
                    bsSize="sm"
                    value={selectedProperty}
                    onChange={e => setSelectedProperty(e.target.value)}
                    style={{ minWidth: 220 }}
                    disabled={propertiesLoading}
                  >
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.displayName}</option>
                    ))}
                  </Input>
                )}

                {/* Date range selector */}
                {connected && (
                  <Input
                    type="select"
                    bsSize="sm"
                    value={dateRange}
                    onChange={e => setDateRange(e.target.value)}
                    style={{ minWidth: 120 }}
                  >
                    {DATE_RANGES.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </Input>
                )}

                {connectionLoading ? (
                  <Badge color="secondary" pill className="px-3">
                    <i className="fa fa-refresh fa-spin mr-2"></i>Checking…
                  </Badge>
                ) : connected ? (
                  <>
                    <Badge color="success" pill className="px-3">
                      <i className="fa fa-check-circle mr-2"></i>Connected
                    </Badge>
                    <Button color="secondary" size="sm" className="btn-round" onClick={loadAllReports}>
                      <i className="fa fa-refresh mr-1"></i>Refresh
                    </Button>
                    <Button color="danger" size="sm" className="btn-round" onClick={handleDisconnect}>
                      <i className="fa fa-unlink mr-2"></i>Disconnect
                    </Button>
                  </>
                ) : (
                  <Button color="primary" className="btn-round" onClick={handleConnect}>
                    <i className="fa fa-google mr-2"></i>Connect Google Analytics
                  </Button>
                )}
              </div>
            </CardHeader>

            {/* Disconnected empty state */}
            {!connected && !connectionLoading && (
              <CardBody>
                <div className="text-center py-5">
                  <div
                    className="icon-big text-center circle-1 bg-primary-light2 mx-auto mb-3"
                    style={{ width: 80, height: 80 }}
                  >
                    <i className="fa fa-google text-primary" style={{ fontSize: 32, lineHeight: '80px' }}></i>
                  </div>
                  <h5 className="text-white mb-2">No Google Analytics Account Connected</h5>
                  <p className="text-light-2 mb-4" style={{ maxWidth: 480, margin: '0 auto' }}>
                    Connect your GA4 property to view sessions, users, top pages, device breakdowns,
                    geographic data, and real-time active users — all in one place.
                  </p>
                  <Button color="primary" className="btn-round" size="lg" onClick={handleConnect}>
                    <i className="fa fa-google mr-2"></i>Connect Google Analytics
                  </Button>
                </div>
              </CardBody>
            )}
          </Card>
        </Col>
      </Row>

      {/* ── Everything below only renders when connected ─────────────────── */}
      {connected && (
        <>

          {/* ── Realtime pulse ─────────────────────────────────────────────── */}
          <Row className="mb-4">
            <Col md="12">
              <Card className="media-object">
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <div>
                    <CardTitle tag="h4" className="mb-0">
                      <span
                        style={{
                          display: 'inline-block', width: 10, height: 10,
                          borderRadius: '50%', background: '#28a745',
                          marginRight: 8, animation: 'pulse 1.5s infinite',
                        }}
                      />
                      Real-Time Overview
                    </CardTitle>
                    <small className="text-light-2">Updates every 30 seconds</small>
                  </div>
                  <Badge color="success" pill className="px-3">
                    <i className="fa fa-circle mr-2" style={{ fontSize: 8 }}></i>Live
                  </Badge>
                </CardHeader>
                <CardBody>
                  {realtimeLoading && !realtime ? <SectionLoader /> : realtime ? (
                    <Row>
                      <Col md="4" className="text-center border-right border-light-3">
                        <h1 className="text-success mb-0" style={{ fontSize: 56, fontWeight: 700 }}>
                          {realtime.activeUsers}
                        </h1>
                        <p className="text-light-2 mt-1">Active Users Right Now</p>
                      </Col>
                      <Col md="8">
                        <p className="text-light-2 mb-2">Top Active Pages</p>
                        {realtime.topActivePages.map((p, i) => (
                          <div key={i} className="d-flex justify-content-between align-items-center mb-2">
                            <code className="text-info">{p.page}</code>
                            <div className="d-flex align-items-center" style={{ gap: 10, minWidth: 200 }}>
                              <Progress
                                value={(p.users / realtime.activeUsers) * 100}
                                color="success"
                                style={{ flex: 1, height: 6 }}
                              />
                              <Badge color="success" pill>{p.users} users</Badge>
                            </div>
                          </div>
                        ))}
                      </Col>
                    </Row>
                  ) : <EmptyState text="No real-time data available" />}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* ── KPI Stat Cards ──────────────────────────────────────────────── */}
          <Row className="mb-4">
            <Col lg="3" md="6">
              <StatCard
                icon="fa-users" iconBg="bg-primary-light2" iconColor="text-primary"
                label="Sessions"
                value={overviewLoading ? '…' : fmtNum(overview?.sessions)}
                sub={overview?.sessionsChange} subIcon="fa-arrow-up"
              />
            </Col>
            <Col lg="3" md="6">
              <StatCard
                icon="fa-user" iconBg="bg-success-light2" iconColor="text-success"
                label="Users"
                value={overviewLoading ? '…' : fmtNum(overview?.users)}
                sub={overview?.usersChange} subIcon="fa-arrow-up"
              />
            </Col>
            <Col lg="3" md="6">
              <StatCard
                icon="fa-file-text" iconBg="bg-info-light2" iconColor="text-info"
                label="Pageviews"
                value={overviewLoading ? '…' : fmtNum(overview?.pageviews)}
                sub={overview?.pageviewsChange} subIcon="fa-arrow-up"
              />
            </Col>
            <Col lg="3" md="6">
              <StatCard
                icon="fa-sign-out" iconBg="bg-warning-light2" iconColor="text-warning"
                label="Bounce Rate"
                value={overviewLoading ? '…' : fmtPct(overview?.bounceRate)}
                sub={overview?.bounceChange} subIcon="fa-arrow-down"
                subColor="text-success"
              />
            </Col>
          </Row>

          {/* ── Secondary KPI row ───────────────────────────────────────────── */}
          <Row className="mb-4">
            <Col lg="6">
              <Card className="media-object">
                <CardHeader>
                  <CardTitle tag="h4" className="mb-0">
                    <i className="fa fa-line-chart mr-2"></i>Session & User Trend
                  </CardTitle>
                  <small className="text-light-2">
                    {DATE_RANGES.find(r => r.value === dateRange)?.label} performance
                  </small>
                </CardHeader>
                <CardBody>
                  {trafficLoading ? <SectionLoader /> : traffic.length ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={traffic}>
                        <defs>
                          <linearGradient id="gaSessions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#007bff" stopOpacity={0.7} />
                            <stop offset="95%" stopColor="#007bff" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gaUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#28a745" stopOpacity={0.7} />
                            <stop offset="95%" stopColor="#28a745" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="date" stroke="#999" />
                        <YAxis stroke="#999" />
                        <Tooltip {...CHART_TOOLTIP_STYLE} />
                        <Legend />
                        <Area type="monotone" dataKey="sessions" stroke="#007bff" fill="url(#gaSessions)" />
                        <Area type="monotone" dataKey="users" stroke="#28a745" fill="url(#gaUsers)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : <EmptyState />}
                </CardBody>
              </Card>
            </Col>

            <Col lg="3" md="6">
              <Card className="media-object" style={{ height: '100%' }}>
                <CardHeader>
                  <CardTitle tag="h4" className="mb-0">
                    <i className="fa fa-mobile mr-2"></i>Device Breakdown
                  </CardTitle>
                  <small className="text-light-2">Traffic by device type</small>
                </CardHeader>
                <CardBody>
                  {devicesLoading ? <SectionLoader /> : devices.length ? (
                    <>
                      <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                          <Pie
                            data={devices}
                            cx="50%" cy="50%"
                            outerRadius={65}
                            dataKey="value"
                            labelLine={false}
                            label={({ name, value }) => `${name} ${value}%`}
                          >
                            {devices.map((d, i) => <Cell key={i} fill={d.color} />)}
                          </Pie>
                          <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(v) => `${v}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-2">
                        {devices.map((d, i) => (
                          <div key={i} className="d-flex justify-content-between align-items-center mb-2">
                            <span className="d-flex align-items-center" style={{ gap: 8 }}>
                              <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, display: 'inline-block' }} />
                              <span className="text-light-1">{d.name}</span>
                            </span>
                            <Badge color="secondary" pill>{d.value}%</Badge>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : <EmptyState icon="fa-mobile" />}
                </CardBody>
              </Card>
            </Col>

            <Col lg="3" md="6">
              <Card className="media-object" style={{ height: '100%' }}>
                <CardHeader>
                  <CardTitle tag="h4" className="mb-0">
                    <i className="fa fa-line-chart mr-2"></i>Session Metrics
                  </CardTitle>
                  <small className="text-light-2">Engagement summary</small>
                </CardHeader>
                <CardBody>
                  {overviewLoading ? <SectionLoader /> : overview ? (
                    <>
                      <div className="mb-3 pb-3 border-bottom border-light-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-light-1">Avg. Session Duration</span>
                          <span className="text-info font-weight-bold">{fmtDur(overview.avgSessionDuration)}</span>
                        </div>
                      </div>
                      <div className="mb-3 pb-3 border-bottom border-light-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-light-1">New Users</span>
                          <span className="text-success font-weight-bold">{fmtNum(overview.newUsers)}</span>
                        </div>
                      </div>
                      <div className="mb-3 pb-3 border-bottom border-light-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-light-1">Returning Users</span>
                          <span className="text-white font-weight-bold">{fmtNum(overview.users - overview.newUsers)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-light-1">Pages / Session</span>
                          <span className="text-warning font-weight-bold">
                            {(overview.pageviews / overview.sessions).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : <EmptyState icon="fa-line-chart" />}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* ── Pageview bar chart + Geo table ──────────────────────────────── */}
          <Row className="mb-4">
            <Col lg="8">
              <Card className="media-object">
                <CardHeader>
                  <CardTitle tag="h4" className="mb-0">
                    <i className="fa fa-bar-chart mr-2"></i>Top Pages by Pageviews
                  </CardTitle>
                  <small className="text-light-2">Most visited pages in selected period</small>
                </CardHeader>
                <CardBody>
                  {pagesLoading ? <SectionLoader /> : topPages.length ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={topPages} layout="vertical" margin={{ left: 80 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" horizontal={false} />
                        <XAxis type="number" stroke="#999" />
                        <YAxis type="category" dataKey="page" stroke="#999" width={80} tick={{ fontSize: 11 }} />
                        <Tooltip {...CHART_TOOLTIP_STYLE} formatter={v => fmtNum(v)} />
                        <Bar dataKey="pageviews" fill="#007bff" radius={[0, 6, 6, 0]}>
                          {topPages.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <EmptyState />}
                </CardBody>
              </Card>
            </Col>

            <Col lg="4">
              <Card className="media-object">
                <CardHeader>
                  <CardTitle tag="h4" className="mb-0">
                    <i className="fa fa-globe mr-2"></i>Top Countries
                  </CardTitle>
                  <small className="text-light-2">Sessions by geography</small>
                </CardHeader>
                <CardBody>
                  {geoLoading ? <SectionLoader /> : geo.length ? (
                    geo.map((g, i) => (
                      <div key={i} className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="text-light-1" style={{ fontSize: 13 }}>{g.country}</span>
                          <div className="d-flex align-items-center" style={{ gap: 8 }}>
                            <span className="text-white font-weight-bold">{fmtNum(g.sessions)}</span>
                            <Badge color="secondary" pill style={{ fontSize: 10 }}>{g.pct}</Badge>
                          </div>
                        </div>
                        <Progress
                          value={parseFloat(g.pct)}
                          color={['primary', 'success', 'info', 'warning', 'danger', 'secondary', 'light'][i]}
                          style={{ height: 4, borderRadius: 2 }}
                        />
                      </div>
                    ))
                  ) : <EmptyState icon="fa-globe" />}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* ── Top Pages detail table ──────────────────────────────────────── */}
          <Row>
            <Col md="12">
              <Card className="media-object">
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <div>
                    <CardTitle tag="h4" className="mb-0">
                      <i className="fa fa-file-text mr-2"></i>Page Performance Detail
                    </CardTitle>
                    <small className="text-light-2">Pageviews, time on page, and bounce rate</small>
                  </div>
                  <Button color="secondary" size="sm" className="btn-round" onClick={loadTopPages} disabled={pagesLoading}>
                    <i className={`fa mr-1 ${pagesLoading ? 'fa-refresh fa-spin' : 'fa-refresh'}`}></i>Refresh
                  </Button>
                </CardHeader>
                <CardBody>
                  {pagesLoading ? <SectionLoader /> : topPages.length ? (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="bg-secondary text-white">
                          <tr>
                            <th>#</th>
                            <th>Page</th>
                            <th>Pageviews</th>
                            <th>Avg. Time on Page</th>
                            <th>Bounce Rate</th>
                            <th>Engagement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topPages.map((p, i) => {
                            const bounce = parseFloat(p.bounceRate);
                            return (
                              <tr key={i}>
                                <td><Badge color="secondary" pill>{i + 1}</Badge></td>
                                <td><code className="text-info">{p.page}</code></td>
                                <td><span className="text-white font-weight-bold">{fmtNum(p.pageviews)}</span></td>
                                <td><span className="text-light-1">{p.avgTime}</span></td>
                                <td>
                                  <Badge
                                    color={bounce < 30 ? 'success' : bounce < 50 ? 'warning' : 'danger'}
                                    pill className="px-3"
                                  >
                                    {p.bounceRate}
                                  </Badge>
                                </td>
                                <td style={{ minWidth: 120 }}>
                                  <Progress
                                    value={100 - bounce}
                                    color={bounce < 30 ? 'success' : bounce < 50 ? 'warning' : 'danger'}
                                    style={{ height: 6 }}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState icon="fa-file-text" text="No page data available" />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Pulse animation for realtime dot */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
};

export default GoogleAnalytics;