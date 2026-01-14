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
  Input,
  Badge,
} from "reactstrap";
import ReactBSAlert from "react-bootstrap-sweetalert";
import ReactTable from "../../components/ReactTable/ReactTable.js";
import ReactTableActions from "../../components/ReactTable/ReactTableActions.js";
import Loader from "../../components/Loader/Loading.js";
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
  selectProducts,
  selectCurrentProduct,
  selectLoading,
  selectError,
  selectSuccess,
  selectFilteredProducts,
  deleteProduct,
  setFilters,
  clearError,
} from "../../features/products/slice.js";
import {
  fetchCategories,
  selectAllCategories
} from "../../features/categories/slice.js";
/**
 * Modern ProductList Component
 * Uses React Router v6, FeatureFactory patterns, and App.css styling
 */
function ProductList() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading)
  const products = useSelector(selectSortedProducts);
  const viewMode = useSelector(selectViewMode);
  const searchTerm = useSelector(selectSearchTerm);
  const filters = useSelector(selectFilters);
  const [alert, setAlert] = useState(null);
  // Table column configuration
  const columns = useMemo(() => [
    {
      Header: "Cover",
      accessor: "avatar",
      sortable: false,
      filterable: false
    },
    { Header: "Title", accessor: "title" },
    { Header: "Category", accessor: "category" },
    { Header: "Price", accessor: "price" },
    { Header: "Available", accessor: "quantity" },
    { Header: "Brand", accessor: "brand" },
    { Header: "ID", accessor: "id" },
    {
      Header: "Actions",
      accessor: "actions",
      sortable: false,
      filterable: false
    }
  ], []);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle window resize for responsive behavior
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
   * Handle product deletion with confirmation
   */
  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      hideAlert();
      // Show success notification
      setAlert(
        <ReactBSAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Deleted!"
          onConfirm={hideAlert}
          confirmBtnBsStyle="success"
          btnSize=""
        >
          Product has been deleted successfully.
        </ReactBSAlert>
      );
    } catch (err) {
      hideAlert();
      // Show error notification
      setAlert(
        <ReactBSAlert
          danger
          style={{ display: "block", marginTop: "-100px" }}
          title="Error!"
          onConfirm={hideAlert}
          confirmBtnBsStyle="danger"
          btnSize=""
        >
          {err.message || "Failed to delete product"}
        </ReactBSAlert>
      );
    }
  };

  /**
   * Show delete confirmation dialog
   */
  const confirmDelete = (id, product) => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => handleDeleteProduct(id)}
        onCancel={hideAlert}
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""
      >
        Are you sure you want to delete "{product.title}"?
      </ReactBSAlert>
    );
  };

  /**
   * Hide alert dialog
   */
  const hideAlert = () => {
    setAlert(null);
  };

  /**
   * Get unique categories from products
   */
  const categories = useMemo(() => {
    if (!products || products.length === 0) return [];
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    return uniqueCategories.filter(Boolean);
  }, [products]);

  /**
   * Filter and search products
   */
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    return products.filter(product => {
      // Category filter
      /*
      if (filterCategory !== "all" && product.category !== filterCategory) {
        return false;
      }
*/
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          product.title?.toLowerCase().includes(searchLower) ||
          product.brand?.toLowerCase().includes(searchLower) ||
          product.category?.toLowerCase().includes(searchLower) ||
          product._id?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [products, searchTerm]);

  /**
   * Transform products data for table display
   */
  const tableData = useMemo(() => {
    return filteredProducts.map((item, index) => ({
      avatar: (
        <div className="position-relative">
          <img
            src={item.images?.[0]?.url || '/placeholder-product.png'}
            alt={item.title}
            className="product-img rounded"
            style={{
              width: '45px',
              height: '45px',
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
          {item.category || 'Uncategorized'}
        </Badge>
      ),
      price: (
        <span className="text-success font-weight-bold">
          ${item.price?.toFixed(2) || '0.00'}
        </span>
      ),
      quantity: (
        <Badge
          color={item.quantity > 10 ? "success" : item.quantity > 0 ? "warning" : "danger"}
          pill
        >
          {item.quantity || 0}
        </Badge>
      ),
      brand: (
        <span className="text-light-1">{item.brand || 'N/A'}</span>
      ),
      id: (
        <code className="text-info small">{item._id?.substring(0, 8)}...</code>
      ),
      actions: ReactTableActions(
        index,
        () => handleEditProduct(item._id),
        () => confirmDelete(item._id, item)
      )
    }));
  }, [filteredProducts]);

  // Show loader while fetching
  if (loading && (!products || products.length === 0)) {
    return <Loader />;
  }

  return (
    <>
      <div className="container-fluid">
        {alert}

        <Row>
          <Col md="12">
            <Card className="animated-border-box-glow">
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
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => navigate('/admin/product/new')}
                  className="btn-round"
                >
                  <i className="fa fa-plus mr-2"></i>
                  Add Product
                </Button>
                <div className="btn-group">
                  <Button
                    outline={viewMode !== "grid"}
                    color="info"
                    onClick={() => dispatch(setViewMode("grid"))}
                  >
                    <i className="fa fa-th"></i>
                  </Button>

                  <Button
                    outline={viewMode !== "list"}
                    color="info"
                    onClick={() => dispatch(setViewMode("list"))}
                  >
                    <i className="fa fa-list"></i>
                  </Button>
                </div>
              </CardHeader>

              {/* Separator Animation */}
              <div className="separator-animated-border animated-true"></div>

              <CardBody>
                {/* Search and Filter Section */}
                <Row className="mb-4">
                  <Col md="6" lg="4">
                    <div className="position-relative">
                      <Input
                        placeholder="Search products…"
                        value={searchTerm}
                        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                        className="form-control-rounded"
                      />

                      <Input
                        type="select"
                        value={filters.categoryId || "all"}
                        onChange={(e) =>
                          dispatch(
                            setFilters({
                              ...filters,
                              categoryId: e.target.value === "all" ? null : e.target.value
                            })
                          )
                        }
                      >
                        <option value="all">All Categories</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </Input>
                    </div>
                  </Col>

                  <Col md="12" lg="5" className="text-right">
                    <div className="d-flex justify-content-end align-items-center">
                      <Badge color="light" className="mr-2 px-3">
                        Total: {products?.length || 0}
                      </Badge>
                      <Badge color="info" className="px-3">
                        Filtered: {tableData.length}
                      </Badge>
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
                      onClick={clearError}
                    >
                      <span>&times;</span>
                    </button>
                  </div>
                )}

                {viewMode === "list" ? (
                  <ReactTable
                    data={tableData}
                    columns={columns}
                    defaultPageSize={10}
                    showPagination
                  />
                ) : (
                  <Row>
                    {products.map(p => (
                      <Col md="3" key={p.id}>
                        <Card className="product-card">
                          <img src={p.images?.[0]?.url} className="img-fluid rounded-top" />
                          <CardBody>
                            <h6>{p.title}</h6>
                            <Badge color="primary">{p.category}</Badge>
                            <div className="mt-2 text-success">${p.price}</div>

                            <div className="d-flex justify-content-between mt-3">
                              <Button size="sm" onClick={() => handleEditProduct(p.id)}>
                                Edit
                              </Button>
                              <Button size="sm" color="danger" onClick={() => confirmDelete(p.id, p)}>
                                Delete
                              </Button>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
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
    </>
  );
}

export default ProductList;