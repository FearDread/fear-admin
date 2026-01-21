import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import ReactTable from "../../components/ReactTable/ReactTable";
import Loader from "../../components/Loader/Loading";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSortedProducts,
  selectViewMode,
  selectSearchTerm,
  selectFilters,
  setSearchTerm,
  setViewMode,
  setSorting,
  fetchProducts,
  selectLoading,
  selectError,
  selectSuccess,
  selectFilteredProducts,
  deleteProduct,
  setFilters,
  clearError,
} from "../../features/products/slice.js";
import { 
  Modal, 
  Form, 
  Input, 
  Button as RSButton,
  ButtonToolbar,
  SelectPicker,
  Message,
  useToaster
} from "rsuite";
import {
  fetchCategories,
  selectAllCategories
} from "../../features/categories/slice.js";


const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toaster = useToaster();
  
  // Redux state
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading);
  const products = useSelector(selectSortedProducts);
  const viewMode = useSelector(selectViewMode);
  const searchTerm = useSelector(selectSearchTerm);
  const filters = useSelector(selectFilters);
  const categories = useSelector(selectAllCategories);
  // Local state
  const [alert, setAlert] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const STOCK_STATUS = {
    inStock: { color: "success", icon: "fa-check-circle", label: "In Stock" },
    lowStock: { color: "warning", icon: "fa-exclamation-triangle", label: "Low Stock" },
    outOfStock: { color: "danger", icon: "fa-times-circle", label: "Out of Stock" },
  };

  const columns = useMemo(() => [
    {
      Header: "Image",
      accessor: "avatar",
      sortable: false,
      filterable: false
    },
    { Header: "Product", accessor: "title", sortable: true },
    { Header: "Category", accessor: "category", sortable: true },
    { Header: "Price", accessor: "price", sortable: true },
    { Header: "Stock", accessor: "stock", sortable: true },
    { Header: "Status", accessor: "status", sortable: true },
    { Header: "Brand", accessor: "brand", sortable: true },
    {
      Header: "Actions",
      accessor: "actions",
      sortable: false,
      filterable: false
    }
  ], []);

  useEffect(() => {

    dispatch(fetchProducts()).unwrap();
   
    dispatch(fetchCategories());

  }, [dispatch]);

  /**
   * Handle window resize for responsive behavior
   */
  useEffect(() => {
    const handleResize = () => {
      // Add any resize logic if needed
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * Handle product edit navigation
   */
  const handleEditProduct = (id) => {
    navigate(`/admin/product/edit/${id}`);
  };

  /**
   * Handle product view navigation
   */
  const handleViewProduct = (id) => {
    navigate(`/admin/product/view/${id}`);
  };

  /**
   * Handle product deletion with confirmation
   */
  const handleDeleteProduct = async (id, productTitle) => {
    try {
      await dispatch(deleteProduct(id));

    } catch (err) {
      console.log('error deleting product ::', err);
    }
  };

  /**
   * Show delete confirmation dialog
   */
  const confirmDelete = (id, product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  /**
   * Hide alert dialog
   */
  const hideAlert = () => {
    setAlert(null);
  };

  /**
   * Handle category filter
   */
  const handleCategoryFilter = (categoryId) => {
    setCategoryFilter(categoryId);
    if (categoryId !== "all") {
      dispatch(setFilters({ ...filters, categoryId }));
    } else {
      dispatch(setFilters({ ...filters, categoryId: null }));
    }
  };

  /**
   * Get stock status for product
   */
  const getStockStatus = (quantity) => {
    if (quantity === 0) return STOCK_STATUS.outOfStock;
    if (quantity < 10) return STOCK_STATUS.lowStock;
    return STOCK_STATUS.inStock;
  };

  /**
   * Filter and search products
   */
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    return products.filter(product => {
      // Category filter
      if (categoryFilter !== "all" && product.category?._id !== categoryFilter) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          product.title?.toLowerCase().includes(searchLower) ||
          product.brand?.toLowerCase().includes(searchLower) ||
          product.category?.title?.toLowerCase().includes(searchLower) ||
          product._id?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [products, searchTerm, categoryFilter]);

  /**
   * Calculate statistics
   */
  const statistics = useMemo(() => {
    if (!products || products.length === 0) {
      return {
        totalProducts: 0,
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
        totalValue: 0,
      };
    }

    return {
      totalProducts: products.length,
      inStock: products.filter(p => p.quantity > 10).length,
      lowStock: products.filter(p => p.quantity > 0 && p.quantity <= 10).length,
      outOfStock: products.filter(p => p.quantity === 0).length,
      totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity || 0), 0),
    };
  }, [products]);

  /**
   * Transform products data for table display
   */
  const tableData = useMemo(() => {
    return filteredProducts.map((item, index) => {
      const stockStatus = getStockStatus(item.quantity);
      
      return {
        avatar: (
          <div className="position-relative">
            <img
              src={item.images?.[0]?.url || '../../assets/images/placeholder.png'}
              alt={item.title}
              className="product-img rounded"
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'cover',
                border: '2px solid rgba(255,255,255,0.2)'
              }}
            />
          </div>
        ),
        title: (
          <div className="d-flex flex-column">
            <span className="text-white font-weight-bold">{item.title}</span>
            {item.description && (
              <small className="text-light-2" style={{ fontSize: '11px' }}>
                {item.description.substring(0, 50)}...
              </small>
            )}
          </div>
        ),
        category: (
          <Badge color="primary" pill className="px-3">
            {item.category?.title || 'Uncategorized'}
          </Badge>
        ),
        price: (
          <span className="text-success font-weight-bold">
            ${item.price?.toFixed(2) || '0.00'}
          </span>
        ),
        stock: (
          <div className="d-flex flex-column">
            <Badge
              color={stockStatus.color}
              pill
              className="mb-1"
            >
              {item.quantity || 0} units
            </Badge>
          </div>
        ),
        status: (
          <Badge color={stockStatus.color} pill className="px-3">
            <i className={`fa ${stockStatus.icon} mr-2`}></i>
            {stockStatus.label}
          </Badge>
        ),
        brand: (
          <span className="text-light-1">{item.brand || 'N/A'}</span>
        ),
        actions: (
          <div className="d-flex gap-2">
            <Button
              color="info"
              size="sm"
              className="btn-round"
              onClick={() => handleViewProduct(item._id)}
              title="View Product"
            >
              <i className="fa fa-eye"></i>
            </Button>
            <Button
              color="primary"
              size="sm"
              className="btn-round"
              onClick={() => handleEditProduct(item._id)}
              title="Edit Product"
            >
              <i className="fa fa-edit"></i>
            </Button>
            <Button
              color="danger"
              size="sm"
              className="btn-round"
              onClick={() => confirmDelete(item._id, item)}
              title="Delete Product"
            >
              <i className="fa fa-trash"></i>
            </Button>
          </div>
        )
      };
    });
  }, [filteredProducts]);

  // Show loader while fetching
  if (loading && (!products || products.length === 0)) {
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
                    <div className="icon-big text-center circle-1 bg-primary-light2">
                      <i className="fa fa-shopping-bag text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category text-light-2">Total Products</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.totalProducts}
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
                      <p className="card-category text-light-2">In Stock</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.inStock}
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
                    <div className="icon-big text-center circle-1 bg-warning-light2">
                      <i className="fa fa-exclamation-triangle text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category text-light-2">Low Stock</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.lowStock}
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
                    <div className="icon-big text-center circle-1 bg-danger-light2">
                      <i className="fa fa-times-circle text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category text-light-2">Out of Stock</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.outOfStock}
                      </CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card className="media-object">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <div>
                  <CardTitle tag="h4" className="mb-0">
                    <i className="fa fa-shopping-bag mr-2"></i>
                    All Products
                  </CardTitle>
                  <small className="text-light-2">
                    Manage your product inventory
                  </small>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <div className="btn-group mr-2">
                    <Button
                      color={viewMode === "list" ? "info" : "secondary"}
                      size="sm"
                      onClick={() => dispatch(setViewMode("list"))}
                      className="btn-round"
                    >
                      <i className="fa fa-list"></i>
                    </Button>
                    <Button
                      color={viewMode === "grid" ? "info" : "secondary"}
                      size="sm"
                      onClick={() => dispatch(setViewMode("grid"))}
                      className="btn-round"
                    >
                      <i className="fa fa-th"></i>
                    </Button>
                  </div>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => navigate('/admin/product/new')}
                    className="btn-round"
                  >
                    <i className="fa fa-plus mr-2"></i>
                    Add Product
                  </Button>
                </div>
              </CardHeader>

              <CardBody>
                {/* Search and Filter Section */}
                <Row className="mb-4">
                  <Col md="5">
                    <div className="position-relative">
                      <Input
                        type="text"
                        placeholder="Search products, brands..."
                        value={searchTerm}
                        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
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
                        {categoryFilter === "all" 
                          ? "All Categories" 
                          : categories?.find(c => c._id === categoryFilter)?.title || "Category"}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => handleCategoryFilter("all")}>
                          All Categories
                        </DropdownItem>
                        <DropdownItem divider />
                        {categories?.map(category => (
                          <DropdownItem 
                            key={category._id}
                            onClick={() => handleCategoryFilter(category._id)}
                          >
                            <i className="fa fa-tag mr-2"></i>
                            {category.title}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Col>
                  <Col md="4" className="text-right">
                    <div className="d-flex justify-content-end align-items-center gap-2">
                      <Badge color="light" className="px-3">
                        Total: {products?.length || 0}
                      </Badge>
                      <Badge color="info" className="px-3">
                        Filtered: {tableData.length}
                      </Badge>
                      {(searchTerm || categoryFilter !== "all") && (
                        <Button
                          color="secondary"
                          size="sm"
                          onClick={() => {
                            dispatch(setSearchTerm(""));
                            setCategoryFilter("all");
                            dispatch(setFilters({ categoryId: null }));
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

                {/* Products Table/Grid */}
                {viewMode === "list" ? (
                  tableData.length > 0 ? (
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
                      <i className="fa fa-shopping-bag" style={{ fontSize: '64px', opacity: 0.3 }}></i>
                      <p className="text-light-2 mt-3">
                        {searchTerm || categoryFilter !== 'all' 
                          ? 'No products match your filters' 
                          : 'No products found. Create your first product!'}
                      </p>
                      {!searchTerm && categoryFilter === 'all' && (
                        <Button 
                          color="primary" 
                          onClick={() => navigate('/admin/product/new')}
                          className="btn-round mt-3"
                        >
                          <i className="fa fa-plus mr-2"></i>
                          Create First Product
                        </Button>
                      )}
                    </div>
                  )
                ) : (
                  <Row>
                    {filteredProducts.map(product => {
                      const stockStatus = getStockStatus(product.quantity);
                      return (
                        <Col md="4" lg="3" key={product._id} className="mb-4">
                          <Card className="product-card h-100">
                            <div className="position-relative">
                              <img 
                                src={product.images?.[0]?.url || '../../assets/images/placeholder.png'} 
                                className="card-img-top"
                                alt={product.title}
                                style={{ height: '200px', objectFit: 'cover' }}
                              />
                              <Badge 
                                color={stockStatus.color} 
                                className="position-absolute"
                                style={{ top: '10px', right: '10px' }}
                              >
                                {stockStatus.label}
                              </Badge>
                            </div>
                            <CardBody>
                              <h6 className="text-white mb-2">{product.title}</h6>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <Badge color="primary" pill>{product.category?.title || 'Uncategorized'}</Badge>
                                <Badge color="light" pill>{product.quantity} units</Badge>
                              </div>
                              <div className="text-success font-weight-bold mb-3">
                                ${product.price?.toFixed(2)}
                              </div>
                              <div className="d-flex justify-content-between gap-2">
                                <Button 
                                  color="info" 
                                  size="sm" 
                                  className="btn-round flex-fill"
                                  onClick={() => handleViewProduct(product._id)}
                                >
                                  <i className="fa fa-eye"></i>
                                </Button>
                                <Button 
                                  color="primary" 
                                  size="sm" 
                                  className="btn-round flex-fill"
                                  onClick={() => handleEditProduct(product._id)}
                                >
                                  <i className="fa fa-edit"></i>
                                </Button>
                                <Button 
                                  color="danger" 
                                  size="sm" 
                                  className="btn-round flex-fill"
                                  onClick={() => confirmDelete(product._id, product)}
                                >
                                  <i className="fa fa-trash"></i>
                                </Button>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                )}

                {/* Loading Overlay */}
                {loading && products && products.length > 0 && (
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

            {/* Delete Confirmation Modal */}
            <Modal 
              open={showDeleteModal} 
              onClose={() => setShowDeleteModal(false)}
              size="xs"
                      className="rs-theme-dark"
            >
              <Modal.Header>
                <Modal.Title>
                  <i className="fa fa-exclamation-triangle mr-2 text-danger"></i>
                  Delete Product?
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p style={{ color: "rgba(255,255,255,0.7)" }}>
                  Are you sure you want to delete "<strong style={{ color: "white" }}>{selectedProduct?.title}</strong>"? 
                  This action cannot be undone.
                </p>
              </Modal.Body>
              <Modal.Footer>
                <RSButton onClick={handleDeleteProduct} appearance="primary" color="red">
                  <i className="fa fa-trash mr-2"></i>
                  Yes, Delete It
                </RSButton>
                <RSButton onClick={() => setShowDeleteModal(false)} appearance="subtle">
                  Cancel
                </RSButton>
              </Modal.Footer>
            </Modal>
    </>
  );
}

export default ProductList;