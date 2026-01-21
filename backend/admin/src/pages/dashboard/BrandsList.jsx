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
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import ReactTable from "../../components/ReactTable/ReactTable";
import Loader from "../../components/Loader/Loading";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSortedBrands,
  selectBrandViewType,
  selectBrandsSearchTerm,
  selectBrandsFilters,
  setSearchTerm,
  setBrandViewType,
  setSorting,
  fetchBrands,
  selectBrandsLoading,
  selectBrandsError,
  selectBrandsSuccess,
  selectFilteredBrands,
  selectAllBrands,
  setFilters,
  clearError,
  selectActiveBrands,
  selectFeaturedBrands,
} from "../../features/brands/slice.js";

const BrandList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const error = useSelector(selectBrandsError);
  const loading = useSelector(selectBrandsLoading);
  const brands = useSelector(selectSortedBrands);
  const allBrands = useSelector(selectAllBrands);
  const viewMode = useSelector(selectBrandViewType);
  const searchTerm = useSelector(selectBrandsSearchTerm);
  const filters = useSelector(selectBrandsFilters);
  const activeBrands = useSelector(selectActiveBrands);
  const featuredBrands = useSelector(selectFeaturedBrands);
  
  // Local state
  const [alert, setAlert] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const BRAND_STATUS = {
    active: { color: "success", icon: "fa-check-circle", label: "Active" },
    inactive: { color: "danger", icon: "fa-times-circle", label: "Inactive" },
  };

  const columns = useMemo(() => [
    {
      Header: "Logo",
      accessor: "logo",
      sortable: false,
      filterable: false
    },
    { Header: "Brand Name", accessor: "name", sortable: true },
    { Header: "Description", accessor: "description", sortable: false },
    { Header: "Status", accessor: "status", sortable: true },
    { Header: "Products", accessor: "products", sortable: true },
    { Header: "Featured", accessor: "featured", sortable: false },
    {
      Header: "Actions",
      accessor: "actions",
      sortable: false,
      filterable: false
    }
  ], []);

  useEffect(() => {
    dispatch(fetchBrands()).unwrap();
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
   * Handle brand edit navigation
   */
  const handleEditBrand = (id) => {
    navigate(`/admin/brand/edit/${id}`);
  };

  /**
   * Handle brand view navigation
   */
  const handleViewBrand = (id) => {
    navigate(`/admin/brand/view/${id}`);
  };

  /**
   * Handle brand deletion with confirmation
   */
  const handleDeleteBrand = async (id, brandName) => {
    try {
      // await dispatch(deleteBrand(id));
      console.log('Deleting brand:', id);
    } catch (err) {
      console.log('error deleting brand ::', err);
    }
  };

  /**
   * Show delete confirmation dialog
   */
  const confirmDelete = (id, brand) => {
    // Add confirmation logic here
  };

  /**
   * Hide alert dialog
   */
  const hideAlert = () => {
    setAlert(null);
  };

  /**
   * Handle status filter
   */
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    if (status === "active") {
      dispatch(setFilters({ ...filters, active: true }));
    } else if (status === "inactive") {
      dispatch(setFilters({ ...filters, active: false }));
    } else {
      dispatch(setFilters({ ...filters, active: undefined }));
    }
  };

  /**
   * Get brand status
   */
  const getBrandStatus = (active) => {
    return active !== false ? BRAND_STATUS.active : BRAND_STATUS.inactive;
  };

  /**
   * Filter and search brands
   */
  const filteredBrands = useMemo(() => {
    if (!brands || brands.length === 0) return [];

    return brands.filter(brand => {
      // Status filter
      if (statusFilter !== "all") {
        if (statusFilter === "active" && brand.active === false) return false;
        if (statusFilter === "inactive" && brand.active !== false) return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          brand.name?.toLowerCase().includes(searchLower) ||
          brand.description?.toLowerCase().includes(searchLower) ||
          brand.slug?.toLowerCase().includes(searchLower) ||
          brand._id?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [brands, searchTerm, statusFilter]);

  /**
   * Calculate statistics
   */
  const statistics = useMemo(() => {
    if (!allBrands || allBrands.length === 0) {
      return {
        totalBrands: 0,
        active: 0,
        inactive: 0,
        featured: 0,
      };
    }

    return {
      totalBrands: allBrands.length,
      active: allBrands.filter(b => b.active !== false).length,
      inactive: allBrands.filter(b => b.active === false).length,
      featured: featuredBrands.length || 0,
    };
  }, [allBrands, featuredBrands]);

  /**
   * Transform brands data for table display
   */
  const tableData = useMemo(() => {
    return filteredBrands.map((item) => {
      const brandStatus = getBrandStatus(item.active);
      
      return {
        logo: (
          <div className="position-relative">
            <img
              src={item.avatar?.url || item.logo?.url || '../../assets/images/placeholder.png'}
              alt={item.name || item.title}
              className="brand-img rounded"
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'contain',
                border: '2px solid rgba(255,255,255,0.2)',
                backgroundColor: 'white',
                padding: '5px'
              }}
            />
          </div>
        ),
        name: (
          <div className="d-flex flex-column">
            <span className="text-white font-weight-bold">{item.name || item.title}</span>
            {item.slug && (
              <small className="text-light-2" style={{ fontSize: '11px' }}>
                /{item.slug}
              </small>
            )}
          </div>
        ),
        description: (
          <div className="text-light-1" style={{ maxWidth: '300px' }}>
            {item.description ? (
              <span style={{ fontSize: '12px' }}>
                {item.description.substring(0, 80)}
                {item.description.length > 80 && '...'}
              </span>
            ) : (
              <span className="text-light-2">No description</span>
            )}
          </div>
        ),
        status: (
          <Badge color={brandStatus.color} pill className="px-3">
            <i className={`fa ${brandStatus.icon} mr-2`}></i>
            {brandStatus.label}
          </Badge>
        ),
        products: (
          <span className="text-light-1">
            <i className="fa fa-shopping-bag mr-2"></i>
            {item.productCount || item.products?.length || 0} products
          </span>
        ),
        featured: (
          <div>
            {item.featured || featuredBrands.includes(item.id || item._id) ? (
              <Badge color="warning" pill>
                <i className="fa fa-star mr-1"></i>
                Featured
              </Badge>
            ) : (
              <span className="text-light-2">-</span>
            )}
          </div>
        ),
        actions: (
          <div className="d-flex gap-2">
            <Button
              color="info"
              size="sm"
              className="btn-round"
              onClick={() => handleViewBrand(item._id || item.id)}
              title="View Brand"
            >
              <i className="fa fa-eye"></i>
            </Button>
            <Button
              color="primary"
              size="sm"
              className="btn-round"
              onClick={() => handleEditBrand(item._id || item.id)}
              title="Edit Brand"
            >
              <i className="fa fa-edit"></i>
            </Button>
            <Button
              color="danger"
              size="sm"
              className="btn-round"
              onClick={() => confirmDelete(item._id || item.id, item)}
              title="Delete Brand"
            >
              <i className="fa fa-trash"></i>
            </Button>
          </div>
        )
      };
    });
  }, [filteredBrands, featuredBrands]);

  // Show loader while fetching
  if (loading && (!brands || brands.length === 0)) {
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
                      <i className="fa fa-tag text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category text-light-2">Total Brands</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.totalBrands}
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
                      <p className="card-category text-light-2">Active</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.active}
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
                      <p className="card-category text-light-2">Inactive</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.inactive}
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
                      <i className="fa fa-star text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category text-light-2">Featured</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.featured}
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
                    <i className="fa fa-tag mr-2"></i>
                    All Brands
                  </CardTitle>
                  <small className="text-light-2">
                    Manage your store brands
                  </small>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <div className="btn-group mr-2">
                    <Button
                      color={viewMode === "list" ? "info" : "secondary"}
                      size="sm"
                      onClick={() => dispatch(setBrandViewType("list"))}
                      className="btn-round"
                    >
                      <i className="fa fa-list"></i>
                    </Button>
                    <Button
                      color={viewMode === "grid" ? "info" : "secondary"}
                      size="sm"
                      onClick={() => dispatch(setBrandViewType("grid"))}
                      className="btn-round"
                    >
                      <i className="fa fa-th"></i>
                    </Button>
                  </div>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => navigate('/admin/brand/new')}
                    className="btn-round"
                  >
                    <i className="fa fa-plus mr-2"></i>
                    Add Brand
                  </Button>
                </div>
              </CardHeader>

              <CardBody>
                {/* Search and Filter Section */}
                <Row className="mb-4">
                  <Col md="6">
                    <div className="position-relative">
                      <Input
                        type="text"
                        placeholder="Search brands..."
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
                        {statusFilter === "all" 
                          ? "All Status" 
                          : statusFilter === "active" ? "Active" : "Inactive"}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => handleStatusFilter("all")}>
                          All Status
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={() => handleStatusFilter("active")}>
                          <i className="fa fa-check-circle text-success mr-2"></i>
                          Active
                        </DropdownItem>
                        <DropdownItem onClick={() => handleStatusFilter("inactive")}>
                          <i className="fa fa-times-circle text-danger mr-2"></i>
                          Inactive
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Col>
                  <Col md="3" className="text-right">
                    <div className="d-flex justify-content-end align-items-center gap-2">
                      <Badge color="light" className="px-3">
                        Total: {allBrands?.length || 0}
                      </Badge>
                      <Badge color="info" className="px-3">
                        Filtered: {tableData.length}
                      </Badge>
                      {(searchTerm || statusFilter !== "all") && (
                        <Button
                          color="secondary"
                          size="sm"
                          onClick={() => {
                            dispatch(setSearchTerm(""));
                            setStatusFilter("all");
                            dispatch(setFilters({ active: undefined }));
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

                {/* Brands Table/Grid */}
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
                      <i className="fa fa-tag" style={{ fontSize: '64px', opacity: 0.3 }}></i>
                      <p className="text-light-2 mt-3">
                        {searchTerm || statusFilter !== 'all'
                          ? 'No brands match your filters' 
                          : 'No brands found. Create your first brand!'}
                      </p>
                      {!searchTerm && statusFilter === 'all' && (
                        <Button 
                          color="primary" 
                          onClick={() => navigate('/admin/brand/new')}
                          className="btn-round mt-3"
                        >
                          <i className="fa fa-plus mr-2"></i>
                          Create First Brand
                        </Button>
                      )}
                    </div>
                  )
                ) : (
                  <Row>
                    {filteredBrands.map(brand => {
                      const brandStatus = getBrandStatus(brand.active);
                      const isFeatured = brand.featured || featuredBrands.includes(brand.id || brand._id);
                      
                      return (
                        <Col md="4" lg="3" key={brand._id || brand.id} className="mb-4">
                          <Card className="brand-card h-100">
                            <div className="position-relative" style={{ padding: '20px', backgroundColor: 'white' }}>
                              <img 
                                src={brand.avatar?.url || brand.logo?.url || '../../assets/images/placeholder.png'} 
                                className="card-img-top"
                                alt={brand.name || brand.title}
                                style={{ height: '120px', objectFit: 'contain' }}
                              />
                              <Badge 
                                color={brandStatus.color} 
                                className="position-absolute"
                                style={{ top: '10px', right: '10px' }}
                              >
                                {brandStatus.label}
                              </Badge>
                              {isFeatured && (
                                <Badge 
                                  color="warning" 
                                  className="position-absolute"
                                  style={{ top: '10px', left: '10px' }}
                                >
                                  <i className="fa fa-star mr-1"></i>
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <CardBody>
                              <h6 className="text-white mb-2">{brand.name || brand.title}</h6>
                              {brand.description && (
                                <p className="text-light-2 mb-3" style={{ fontSize: '12px', minHeight: '40px' }}>
                                  {brand.description.substring(0, 80)}
                                  {brand.description.length > 80 && '...'}
                                </p>
                              )}
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <Badge color="light" pill>
                                  <i className="fa fa-shopping-bag mr-1"></i>
                                  {brand.productCount || brand.products?.length || 0}
                                </Badge>
                                {brand.slug && (
                                  <small className="text-light-2">/{brand.slug}</small>
                                )}
                              </div>
                              <div className="d-flex justify-content-between gap-2">
                                <Button 
                                  color="info" 
                                  size="sm" 
                                  className="btn-round flex-fill"
                                  onClick={() => handleViewBrand(brand._id || brand.id)}
                                >
                                  <i className="fa fa-eye"></i>
                                </Button>
                                <Button 
                                  color="primary" 
                                  size="sm" 
                                  className="btn-round flex-fill"
                                  onClick={() => handleEditBrand(brand._id || brand.id)}
                                >
                                  <i className="fa fa-edit"></i>
                                </Button>
                                <Button 
                                  color="danger" 
                                  size="sm" 
                                  className="btn-round flex-fill"
                                  onClick={() => confirmDelete(brand._id || brand.id, brand)}
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
                {loading && brands && brands.length > 0 && (
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

export default BrandList;