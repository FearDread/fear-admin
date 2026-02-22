import React, { useState, useEffect, useCallback } from 'react';
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
  Input,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress,
  Alert,
} from 'reactstrap';
import {
  fetchProducts,
  selectProducts,
  selectLoading as selectProductsLoading,
} from "../../features/products/slice.js";

import Loader from '../../components/Loader/Loading';

const EBAY_API_BASE = 'http://localhost:4000/fear/api/ebay'; // production -> 'https://fear.dedyn.io/fear/api/ebay'; 
const ebayApi = {
  /** Kick off the eBay OAuth flow — your server should redirect to eBay's consent page */
  connect: () => window.open(`${EBAY_API_BASE}/auth/connect`, '_blank', 'width=600,height=700'),

  /** Check whether the stored eBay token is still valid */
  status: () => fetch(`${EBAY_API_BASE}/auth/status`).then((r) => r.json()),

  /** Disconnect / revoke the stored eBay token */
  disconnect: () => fetch(`${EBAY_API_BASE}/auth/disconnect`, { method: 'POST' }).then((r) => r.json()),

  /** Fetch the seller's active eBay listings */
  fetchListings: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${EBAY_API_BASE}/listings?${qs}`).then((r) => r.json());
  },

  /** Import selected eBay listings into your local catalogue */
  importListings: (listingIds) =>
    fetch(`${EBAY_API_BASE}/listings/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingIds }),
    }).then((r) => r.json()),

  /** Export local products to eBay as new / updated listings */
  exportProducts: (productIds) =>
    fetch(`${EBAY_API_BASE}/listings/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds }),
    }).then((r) => r.json()),

  /** Sync prices & stock between eBay and local catalogue */
  syncProduct: (productId) =>
    fetch(`${EBAY_API_BASE}/listings/sync/${productId}`, { method: 'POST' }).then((r) => r.json()),
};

const SYNC_STATUS = {
  synced:     { color: 'success', icon: 'fa-check-circle',      label: 'Synced'      },
  pending:    { color: 'warning', icon: 'fa-clock-o',           label: 'Pending'     },
  error:      { color: 'danger',  icon: 'fa-times-circle',      label: 'Error'       },
  not_listed: { color: 'secondary', icon: 'fa-minus-circle',    label: 'Not Listed'  },
  importing:  { color: 'info',    icon: 'fa-refresh fa-spin',   label: 'Importing'   },
  exporting:  { color: 'info',    icon: 'fa-refresh fa-spin',   label: 'Exporting'   },
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const Ebay = () => {
  const dispatch = useDispatch();
  const localProducts  = useSelector(selectProducts);
  const productsLoading = useSelector(selectProductsLoading);

  // ── Local state ──────────────────────────────────────────────────────────
  const [connected,        setConnected]        = useState(false);
  const [connectionLoading, setConnectionLoading] = useState(true);
  const [ebayListings,     setEbayListings]     = useState([]);
  const [listingsLoading,  setListingsLoading]  = useState(false);
  const [activeTab,        setActiveTab]        = useState('import');   // 'import' | 'export'
  const [selectedImport,   setSelectedImport]   = useState([]);         // eBay listing IDs
  const [selectedExport,   setSelectedExport]   = useState([]);         // local product IDs
  const [searchImport,     setSearchImport]     = useState('');
  const [searchExport,     setSearchExport]     = useState('');
  const [operationLoading, setOperationLoading] = useState(false);
  const [progress,         setProgress]         = useState(0);
  const [alert,            setAlert]            = useState(null);       // { type, message }
  const [syncStatuses,     setSyncStatuses]     = useState({});         // { [productId]: string }
  const [confirmModal,     setConfirmModal]     = useState(false);
  const [pendingAction,    setPendingAction]    = useState(null);       // 'import' | 'export'

  // ── Fake eBay listings for demo — replace with real API call ─────────────
  const MOCK_EBAY_LISTINGS = [
    { id: 'eb-001', title: 'Vintage Leather Wallet', price: 34.99, quantity: 12, condition: 'New',    category: 'Accessories', imageUrl: null, listedDate: '2025-11-01', views: 142 },
    { id: 'eb-002', title: 'Wireless Noise-Cancelling Headphones', price: 89.95, quantity: 5, condition: 'New', category: 'Electronics', imageUrl: null, listedDate: '2025-11-15', views: 378 },
    { id: 'eb-003', title: 'Stainless Steel Water Bottle 32oz', price: 24.99, quantity: 30, condition: 'New', category: 'Sports', imageUrl: null, listedDate: '2025-12-01', views: 210 },
    { id: 'eb-004', title: 'Men\'s Running Shoes Size 10', price: 64.00, quantity: 3, condition: 'New', category: 'Footwear', imageUrl: null, listedDate: '2025-12-10', views: 95  },
    { id: 'eb-005', title: 'Ceramic Pour-Over Coffee Dripper', price: 29.99, quantity: 8, condition: 'New', category: 'Kitchen', imageUrl: null, listedDate: '2026-01-05', views: 187 },
  ];

  // ── On mount ─────────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchProducts());
    checkConnectionStatus();
  }, [dispatch]);

  const checkConnectionStatus = async () => {
    setConnectionLoading(true);
    try {
      // const { connected: isConnected } = await ebayApi.status();
      // setConnected(isConnected);
      // ↑ Uncomment above and remove the line below when backend is ready
      setConnected(false); // default disconnected for demo
    } catch {
      setConnected(false);
    } finally {
      setConnectionLoading(false);
    }
  };

  // ── Connection handlers ───────────────────────────────────────────────────
  const handleConnect = () => {
    ebayApi.connect();
    // After OAuth redirect, your backend should call back and set the token.
    // Poll or listen for a message event to update status:
    const poll = setInterval(async () => {
      try {
        const { connected: ok } = await ebayApi.status();
        if (ok) {
          setConnected(true);
          showAlert('success', 'Successfully connected to eBay!');
          clearInterval(poll);
          loadEbayListings();
        }
      } catch { /* keep polling */ }
    }, 3000);
    // Stop polling after 3 minutes regardless
    setTimeout(() => clearInterval(poll), 180_000);
  };

  const handleDisconnect = async () => {
    try {
      await ebayApi.disconnect();
      setConnected(false);
      setEbayListings([]);
      showAlert('warning', 'Disconnected from eBay.');
    } catch {
      showAlert('danger', 'Failed to disconnect. Please try again.');
    }
  };

  // ── Load eBay listings ────────────────────────────────────────────────────
  const loadEbayListings = useCallback(async () => {
    setListingsLoading(true);
    try {
      // const data = await ebayApi.fetchListings({ limit: 50 });
      // setEbayListings(data.listings);
      // ↑ Replace mock below with real call when backend is ready
      await new Promise((r) => setTimeout(r, 800));
      setEbayListings(MOCK_EBAY_LISTINGS);
    } catch {
      showAlert('danger', 'Failed to load eBay listings.');
    } finally {
      setListingsLoading(false);
    }
  }, []);

  // ── Import ────────────────────────────────────────────────────────────────
  const handleImport = async () => {
    if (!selectedImport.length) return;
    setConfirmModal(false);
    setOperationLoading(true);
    setProgress(0);

    try {
      const step = 100 / selectedImport.length;
      for (let i = 0; i < selectedImport.length; i++) {
        // await ebayApi.importListings([selectedImport[i]]); // real call
        await new Promise((r) => setTimeout(r, 600)); // mock delay
        setProgress(Math.round((i + 1) * step));
      }
      showAlert('success', `${selectedImport.length} listing(s) imported successfully.`);
      setSelectedImport([]);
      dispatch(fetchProducts());
    } catch {
      showAlert('danger', 'Import failed. Please try again.');
    } finally {
      setOperationLoading(false);
      setProgress(0);
    }
  };

  // ── Export ────────────────────────────────────────────────────────────────
  const handleExport = async () => {
    if (!selectedExport.length) return;
    setConfirmModal(false);
    setOperationLoading(true);
    setProgress(0);

    try {
      const step = 100 / selectedExport.length;
      for (let i = 0; i < selectedExport.length; i++) {
        setSyncStatuses((prev) => ({ ...prev, [selectedExport[i]]: 'exporting' }));
        // await ebayApi.exportProducts([selectedExport[i]]); // real call
        await new Promise((r) => setTimeout(r, 700)); // mock delay
        setSyncStatuses((prev) => ({ ...prev, [selectedExport[i]]: 'synced' }));
        setProgress(Math.round((i + 1) * step));
      }
      showAlert('success', `${selectedExport.length} product(s) exported to eBay.`);
      setSelectedExport([]);
    } catch {
      showAlert('danger', 'Export failed. Please try again.');
    } finally {
      setOperationLoading(false);
      setProgress(0);
    }
  };

  // ── Sync individual product ───────────────────────────────────────────────
  const handleSyncProduct = async (productId) => {
    setSyncStatuses((prev) => ({ ...prev, [productId]: 'pending' }));
    try {
      // await ebayApi.syncProduct(productId); // real call
      await new Promise((r) => setTimeout(r, 900));
      setSyncStatuses((prev) => ({ ...prev, [productId]: 'synced' }));
      showAlert('success', 'Product synced successfully.');
    } catch {
      setSyncStatuses((prev) => ({ ...prev, [productId]: 'error' }));
      showAlert('danger', 'Sync failed for this product.');
    }
  };

  // ── Selection helpers ─────────────────────────────────────────────────────
  const toggleImportItem = (id) =>
    setSelectedImport((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const toggleExportItem = (id) =>
    setSelectedExport((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const toggleSelectAllImport = () => {
    const visible = filteredListings.map((l) => l.id);
    setSelectedImport(selectedImport.length === visible.length ? [] : visible);
  };

  const toggleSelectAllExport = () => {
    const visible = filteredLocalProducts.map((p) => p._id);
    setSelectedExport(selectedExport.length === visible.length ? [] : visible);
  };

  // ── Filter helpers ────────────────────────────────────────────────────────
  const filteredListings = ebayListings.filter((l) =>
    l.title.toLowerCase().includes(searchImport.toLowerCase())
  );

  const filteredLocalProducts = (localProducts || []).filter((p) =>
    p.name?.toLowerCase().includes(searchExport.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchExport.toLowerCase())
  );

  // ── Alert helper ──────────────────────────────────────────────────────────
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const openConfirm = (action) => {
    setPendingAction(action);
    setConfirmModal(true);
  };

  const executeConfirmedAction = () => {
    if (pendingAction === 'import') handleImport();
    if (pendingAction === 'export') handleExport();
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const syncedCount   = Object.values(syncStatuses).filter((s) => s === 'synced').length;
  const errorCount    = Object.values(syncStatuses).filter((s) => s === 'error').length;

  if (productsLoading && !localProducts?.length) return <Loader />;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="container-fluid">

      {/* Global Alert */}
      {alert && (
        <Alert color={alert.type} className="mb-4" toggle={() => setAlert(null)}>
          <i className={`fa mr-2 ${
            alert.type === 'success' ? 'fa-check-circle' :
            alert.type === 'danger'  ? 'fa-times-circle' :
            alert.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'
          }`} />
          {alert.message}
        </Alert>
      )}

      {/* ── Connection Card ─────────────────────────────────────────────────── */}
      <Row className="mb-4">
        <Col md="12">
          <Card className="media-object">
            <CardHeader className="d-flex justify-content-between align-items-center">
              <div>
                <CardTitle tag="h4" className="mb-0">
                  <i className="fa fa-plug mr-2"></i>
                  eBay Integration
                </CardTitle>
                <small className="text-light-2">Connect your eBay seller account to sync products</small>
              </div>

              {connectionLoading ? (
                <Badge color="secondary" pill className="px-3">
                  <i className="fa fa-refresh fa-spin mr-2"></i>Checking…
                </Badge>
              ) : connected ? (
                <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                  <Badge color="success" pill className="px-3">
                    <i className="fa fa-check-circle mr-2"></i>Connected to eBay
                  </Badge>
                  <Button color="danger" size="sm" className="btn-round" onClick={handleDisconnect}>
                    <i className="fa fa-unlink mr-2"></i>Disconnect
                  </Button>
                </div>
              ) : (
                <Button color="warning" className="btn-round" onClick={handleConnect}>
                  <i className="fa fa-link mr-2"></i>Connect eBay Account
                </Button>
              )}
            </CardHeader>

            {!connected && !connectionLoading && (
              <CardBody>
                <div className="text-center py-4">
                  <div
                    className="icon-big text-center circle-1 bg-warning-light2 mx-auto mb-3"
                    style={{ width: 80, height: 80 }}
                  >
                    <i className="fa fa-shopping-bag text-warning" style={{ fontSize: 32, lineHeight: '80px' }}></i>
                  </div>
                  <h5 className="text-white mb-2">No eBay Account Connected</h5>
                  <p className="text-light-2 mb-4" style={{ maxWidth: 480, margin: '0 auto' }}>
                    Connect your eBay seller account to import your existing listings or export
                    products from your local catalogue directly to eBay.
                  </p>
                  <Button color="warning" className="btn-round" size="lg" onClick={handleConnect}>
                    <i className="fa fa-link mr-2"></i>Connect eBay Account
                  </Button>
                </div>
              </CardBody>
            )}
          </Card>
        </Col>
      </Row>

      {/* ── Stats Cards (only when connected) ──────────────────────────────── */}
      {connected && (
        <>
          <Row className="mb-4">
            <Col lg="3" md="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col xs="5">
                      <div className="icon-big text-center circle-1 bg-warning-light2">
                        <i className="fa fa-shopping-bag text-warning"></i>
                      </div>
                    </Col>
                    <Col xs="7">
                      <div className="numbers">
                        <p className="card-category text-light-2">eBay Listings</p>
                        <CardTitle tag="h3" className="text-white">{ebayListings.length}</CardTitle>
                        <p className="mb-0">
                          <span className="text-info">
                            <i className="fa fa-info-circle mr-1"></i>Active listings
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
                        <p className="card-category text-light-2">Local Products</p>
                        <CardTitle tag="h3" className="text-white">{localProducts?.length || 0}</CardTitle>
                        <p className="mb-0">
                          <span className="text-light-2">
                            <i className="fa fa-database mr-1"></i>In catalogue
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
                        <i className="fa fa-check-circle text-success"></i>
                      </div>
                    </Col>
                    <Col xs="7">
                      <div className="numbers">
                        <p className="card-category text-light-2">Synced</p>
                        <CardTitle tag="h3" className="text-white">{syncedCount}</CardTitle>
                        <p className="mb-0">
                          <span className="text-success">
                            <i className="fa fa-arrow-up mr-1"></i>Up to date
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
                      <div className="icon-big text-center circle-1 bg-primary-light2">
                        <i className="fa fa-exclamation-triangle text-danger"></i>
                      </div>
                    </Col>
                    <Col xs="7">
                      <div className="numbers">
                        <p className="card-category text-light-2">Sync Errors</p>
                        <CardTitle tag="h3" className="text-white">{errorCount}</CardTitle>
                        <p className="mb-0">
                          <span className={errorCount > 0 ? 'text-danger' : 'text-success'}>
                            <i className={`fa mr-1 ${errorCount > 0 ? 'fa-times-circle' : 'fa-check'}`}></i>
                            {errorCount > 0 ? 'Needs attention' : 'No errors'}
                          </span>
                        </p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* ── Progress bar (during operations) ──────────────────────────── */}
          {operationLoading && (
            <Row className="mb-4">
              <Col md="12">
                <Card className="media-object">
                  <CardBody>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-white">
                        <i className="fa fa-refresh fa-spin mr-2"></i>
                        {pendingAction === 'import' ? 'Importing listings from eBay…' : 'Exporting products to eBay…'}
                      </span>
                      <span className="text-light-2">{progress}%</span>
                    </div>
                    <Progress value={progress} color="warning" style={{ height: 8, borderRadius: 4 }} />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}

          {/* ── Tab Switcher ───────────────────────────────────────────────── */}
          <Row className="mb-4">
            <Col md="12">
              <Card className="media-object">
                <CardHeader>
                  <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                    <Button
                      color={activeTab === 'import' ? 'warning' : 'secondary'}
                      className="btn-round"
                      onClick={() => setActiveTab('import')}
                    >
                      <i className="fa fa-download mr-2"></i>Import from eBay
                    </Button>
                    <Button
                      color={activeTab === 'export' ? 'primary' : 'secondary'}
                      className="btn-round"
                      onClick={() => setActiveTab('export')}
                    >
                      <i className="fa fa-upload mr-2"></i>Export to eBay
                    </Button>
                  </div>
                </CardHeader>

                <CardBody>
                  {/* ── IMPORT TAB ──────────────────────────────────────── */}
                  {activeTab === 'import' && (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <h5 className="text-white mb-0">eBay Listings</h5>
                          <small className="text-light-2">Select listings to import into your local catalogue</small>
                        </div>
                        <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                          <Button
                            color="secondary"
                            size="sm"
                            className="btn-round"
                            onClick={loadEbayListings}
                            disabled={listingsLoading}
                          >
                            <i className={`fa mr-2 ${listingsLoading ? 'fa-refresh fa-spin' : 'fa-refresh'}`}></i>
                            Refresh
                          </Button>
                          <Button
                            color="warning"
                            size="sm"
                            className="btn-round"
                            disabled={!selectedImport.length || operationLoading}
                            onClick={() => openConfirm('import')}
                          >
                            <i className="fa fa-download mr-2"></i>
                            Import Selected ({selectedImport.length})
                          </Button>
                        </div>
                      </div>

                      {/* Search */}
                      <FormGroup className="mb-3">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text bg-secondary border-0">
                              <i className="fa fa-search text-light-2"></i>
                            </span>
                          </div>
                          <Input
                            type="text"
                            placeholder="Search eBay listings…"
                            value={searchImport}
                            onChange={(e) => setSearchImport(e.target.value)}
                            className="border-0"
                          />
                        </div>
                      </FormGroup>

                      {listingsLoading ? (
                        <div className="text-center py-4">
                          <i className="fa fa-refresh fa-spin text-warning" style={{ fontSize: 32 }}></i>
                          <p className="text-light-2 mt-2">Loading eBay listings…</p>
                        </div>
                      ) : filteredListings.length === 0 ? (
                        <div className="text-center py-5">
                          <i className="fa fa-shopping-bag" style={{ fontSize: 64, opacity: 0.3 }}></i>
                          <p className="text-light-2 mt-3">No eBay listings found</p>
                          <Button color="warning" className="btn-round mt-2" onClick={loadEbayListings}>
                            <i className="fa fa-refresh mr-2"></i>Load Listings
                          </Button>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-hover mb-0">
                            <thead className="bg-secondary text-white">
                              <tr>
                                <th style={{ width: 40 }}>
                                  <Input
                                    type="checkbox"
                                    checked={selectedImport.length === filteredListings.length && filteredListings.length > 0}
                                    onChange={toggleSelectAllImport}
                                  />
                                </th>
                                <th>Listing</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Views</th>
                                <th>Listed</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredListings.map((listing) => (
                                <tr key={listing.id}>
                                  <td>
                                    <Input
                                      type="checkbox"
                                      checked={selectedImport.includes(listing.id)}
                                      onChange={() => toggleImportItem(listing.id)}
                                    />
                                  </td>
                                  <td>
                                    <div className="d-flex flex-column">
                                      <span className="text-white font-weight-bold">{listing.title}</span>
                                      <code className="text-info small">{listing.id}</code>
                                    </div>
                                  </td>
                                  <td>
                                    <Badge color="info" pill className="px-3">{listing.category}</Badge>
                                  </td>
                                  <td>
                                    <span className="text-success font-weight-bold">
                                      {formatCurrency(listing.price)}
                                    </span>
                                  </td>
                                  <td>
                                    <Badge color={listing.quantity < 5 ? 'warning' : 'success'} pill>
                                      {listing.quantity}
                                    </Badge>
                                  </td>
                                  <td>
                                    <span className="text-light-1">{listing.views}</span>
                                  </td>
                                  <td>
                                    <span className="text-light-1">{formatDate(listing.listedDate)}</span>
                                  </td>
                                  <td>
                                    <Button
                                      color="warning"
                                      size="sm"
                                      className="btn-round"
                                      onClick={() => {
                                        setSelectedImport([listing.id]);
                                        openConfirm('import');
                                      }}
                                      disabled={operationLoading}
                                    >
                                      <i className="fa fa-download"></i>
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  )}

                  {/* ── EXPORT TAB ──────────────────────────────────────── */}
                  {activeTab === 'export' && (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <h5 className="text-white mb-0">Local Products</h5>
                          <small className="text-light-2">Select products to push as eBay listings</small>
                        </div>
                        <Button
                          color="primary"
                          size="sm"
                          className="btn-round"
                          disabled={!selectedExport.length || operationLoading}
                          onClick={() => openConfirm('export')}
                        >
                          <i className="fa fa-upload mr-2"></i>
                          Export Selected ({selectedExport.length})
                        </Button>
                      </div>

                      {/* Search */}
                      <FormGroup className="mb-3">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text bg-secondary border-0">
                              <i className="fa fa-search text-light-2"></i>
                            </span>
                          </div>
                          <Input
                            type="text"
                            placeholder="Search by name or SKU…"
                            value={searchExport}
                            onChange={(e) => setSearchExport(e.target.value)}
                            className="border-0"
                          />
                        </div>
                      </FormGroup>

                      {filteredLocalProducts.length === 0 ? (
                        <div className="text-center py-5">
                          <i className="fa fa-shopping-bag" style={{ fontSize: 64, opacity: 0.3 }}></i>
                          <p className="text-light-2 mt-3">No local products found</p>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-hover mb-0">
                            <thead className="bg-secondary text-white">
                              <tr>
                                <th style={{ width: 40 }}>
                                  <Input
                                    type="checkbox"
                                    checked={selectedExport.length === filteredLocalProducts.length && filteredLocalProducts.length > 0}
                                    onChange={toggleSelectAllExport}
                                  />
                                </th>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>eBay Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredLocalProducts.map((product) => {
                                const status = syncStatuses[product._id] || 'not_listed';
                                const statusCfg = SYNC_STATUS[status] || SYNC_STATUS.not_listed;
                                return (
                                  <tr key={product._id}>
                                    <td>
                                      <Input
                                        type="checkbox"
                                        checked={selectedExport.includes(product._id)}
                                        onChange={() => toggleExportItem(product._id)}
                                      />
                                    </td>
                                    <td>
                                      <div className="d-flex flex-column">
                                        <span className="text-white font-weight-bold">{product.name}</span>
                                        <code className="text-info small">{product._id?.substring(0, 8)}</code>
                                      </div>
                                    </td>
                                    <td>
                                      <span className="text-light-1">{product.sku || '—'}</span>
                                    </td>
                                    <td>
                                      <span className="text-success font-weight-bold">
                                        {formatCurrency(product.price)}
                                      </span>
                                    </td>
                                    <td>
                                      <Badge color={product.quantity < 10 ? 'warning' : 'success'} pill>
                                        {product.quantity ?? 0}
                                      </Badge>
                                    </td>
                                    <td>
                                      <Badge color={statusCfg.color} pill className="px-3">
                                        <i className={`fa ${statusCfg.icon} mr-1`}></i>
                                        {statusCfg.label}
                                      </Badge>
                                    </td>
                                    <td>
                                      <div className="d-flex" style={{ gap: '6px' }}>
                                        <Button
                                          color="primary"
                                          size="sm"
                                          className="btn-round"
                                          title="Export to eBay"
                                          disabled={operationLoading}
                                          onClick={() => {
                                            setSelectedExport([product._id]);
                                            openConfirm('export');
                                          }}
                                        >
                                          <i className="fa fa-upload"></i>
                                        </Button>
                                        {status === 'synced' && (
                                          <Button
                                            color="info"
                                            size="sm"
                                            className="btn-round"
                                            title="Sync with eBay"
                                            disabled={operationLoading}
                                            onClick={() => handleSyncProduct(product._id)}
                                          >
                                            <i className="fa fa-refresh"></i>
                                          </Button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* ── Quick Stats Footer ─────────────────────────────────────────── */}
          <Row>
            <Col lg="4">
              <Card className="media-object">
                <CardHeader>
                  <CardTitle tag="h4" className="mb-0">
                    <i className="fa fa-line-chart mr-2"></i>Sync Overview
                  </CardTitle>
                  <small className="text-light-2">Current integration health</small>
                </CardHeader>
                <CardBody>
                  <div className="mb-3 pb-3 border-bottom border-light-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-light-1">eBay Listings</span>
                      <span className="text-warning font-weight-bold">{ebayListings.length}</span>
                    </div>
                  </div>
                  <div className="mb-3 pb-3 border-bottom border-light-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-light-1">Products Synced</span>
                      <span className="text-success font-weight-bold">{syncedCount}</span>
                    </div>
                  </div>
                  <div className="mb-3 pb-3 border-bottom border-light-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-light-1">Sync Errors</span>
                      <span className={`font-weight-bold ${errorCount > 0 ? 'text-danger' : 'text-success'}`}>
                        {errorCount}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-light-1">Not Listed</span>
                      <span className="text-light-2 font-weight-bold">
                        {(localProducts?.length || 0) - syncedCount}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg="8">
              <Card className="media-object">
                <CardHeader>
                  <CardTitle tag="h4" className="mb-0">
                    <i className="fa fa-info-circle mr-2"></i>Integration Notes
                  </CardTitle>
                  <small className="text-light-2">Important information about eBay sync</small>
                </CardHeader>
                <CardBody>
                  <ul className="list-unstyled mb-0" style={{ lineHeight: 2 }}>
                    {[
                      { icon: 'fa-download text-warning',  text: 'Importing pulls eBay listings into your local catalogue as new products.' },
                      { icon: 'fa-upload text-primary',    text: 'Exporting creates or updates live eBay listings from local products.' },
                      { icon: 'fa-refresh text-info',      text: 'Syncing updates prices and stock between eBay and your catalogue in real time.' },
                      { icon: 'fa-exclamation-triangle text-warning', text: 'Prices and stock are not automatically kept in sync — use the Sync button after changes.' },
                      { icon: 'fa-lock text-success',      text: 'Your eBay token is stored securely on the server; we never expose it client-side.' },
                    ].map(({ icon, text }, i) => (
                      <li key={i} className="d-flex align-items-start mb-2">
                        <i className={`fa ${icon} mr-3 mt-1`} style={{ minWidth: 16 }}></i>
                        <span className="text-light-1">{text}</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* ── Confirmation Modal ─────────────────────────────────────────────── */}
      <Modal isOpen={confirmModal} toggle={() => setConfirmModal(false)} centered>
        <ModalHeader toggle={() => setConfirmModal(false)}>
          <i className={`fa mr-2 ${pendingAction === 'import' ? 'fa-download text-warning' : 'fa-upload text-primary'}`}></i>
          Confirm {pendingAction === 'import' ? 'Import' : 'Export'}
        </ModalHeader>
        <ModalBody>
          {pendingAction === 'import' ? (
            <p>
              You are about to import{' '}
              <strong>{selectedImport.length} listing(s)</strong> from eBay into your local catalogue.
              Existing products with matching SKUs may be updated.
            </p>
          ) : (
            <p>
              You are about to export{' '}
              <strong>{selectedExport.length} product(s)</strong> to eBay. This will create or
              update live listings on your eBay seller account.
            </p>
          )}
          <Alert color="warning" className="mb-0">
            <i className="fa fa-exclamation-triangle mr-2"></i>
            This action cannot be undone automatically. Please review your selection before continuing.
          </Alert>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-round" onClick={() => setConfirmModal(false)}>
            Cancel
          </Button>
          <Button
            color={pendingAction === 'import' ? 'warning' : 'primary'}
            className="btn-round"
            onClick={executeConfirmedAction}
          >
            <i className={`fa mr-2 ${pendingAction === 'import' ? 'fa-download' : 'fa-upload'}`}></i>
            Confirm {pendingAction === 'import' ? 'Import' : 'Export'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Ebay;