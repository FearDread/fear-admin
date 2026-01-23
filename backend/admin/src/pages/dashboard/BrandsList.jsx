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
import {
  Modal,
  Form,
  Input as RSInput,
  Button as RSButton,
  useToaster,
  Message,
  SelectPicker,
  Toggle,
  Uploader
} from "rsuite";
import ReactTable from "../../components/ReactTable/ReactTable";
import Loader from "../../components/Loader/Loading";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSortedBrands,
  selectBrandsSearchTerm,
  selectBrandsFilters,
  setSearchTerm,
  fetchBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  selectBrandsLoading,
  selectBrandsError,
  selectBrandsSuccess,
  selectAllBrands,
  setFilters,
  clearError,
  selectFeaturedBrands,
  customCreateBrand
} from "../../features/brands/slice.js";

const { Group: FormGroup, Control: FormControl, ControlLabel } = Form;
const Textarea = React.forwardRef((props, ref) => <RSInput {...props} as="textarea" ref={ref} />);

const BrandList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toaster = useToaster();

  // Redux state
  const error = useSelector(selectBrandsError);
  const loading = useSelector(selectBrandsLoading);
  const success = useSelector(selectBrandsSuccess);
  const brands = useSelector(selectSortedBrands);
  const allBrands = useSelector(selectAllBrands);
  const searchTerm = useSelector(selectBrandsSearchTerm);
  const filters = useSelector(selectBrandsFilters);
  const featuredBrands = useSelector(selectFeaturedBrands);

  // Local State
  const [viewMode, setViewMode] = useState("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Form state
  const [formValue, setFormValue] = useState({
    name: '',
    slug: '',
    website: '',
    isActive: true,
    featured: false,
  });

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

  useEffect(() => {
    if (error) {
      toaster.push(
        <Message showIcon type="error" closable>
          <strong>Error!</strong> {error}
        </Message>,
        { placement: 'topEnd', duration: 5000 }
      );
      dispatch(clearError());
    }
  }, [error, toaster, dispatch]);

  useEffect(() => {
    if (success && (showAddModal || showEditModal)) {
      toaster.push(
        <Message showIcon type="success" closable>
          <strong>Success!</strong> Brand {showAddModal ? 'created' : 'updated'} successfully
        </Message>,
        { placement: 'topEnd', duration: 3000 }
      );
      handleCloseModals();
      dispatch(fetchBrands());
    }
  }, [success, showAddModal, showEditModal]);

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

  const getBrandStatus = (active) => {
    return active !== false ? BRAND_STATUS.active : BRAND_STATUS.inactive;
  };

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
          brand.slug?.toLowerCase().includes(searchLower) ||
          brand._id?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [brands, searchTerm, statusFilter]);

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

  const handleOpenAddModal = () => {
    setFormValue({
      name: '',
      slug: '',
      website: '',
      isActive: true,
      featured: false,
      verified: false
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (brand) => {
    setSelectedBrand(brand);
    setFormValue({
      name: brand.name || brand.title || '',
      slug: brand.slug || '',
      website: brand.website || brand.contactInfo?.website || '',
      isActive: brand.isActive !== false,
      featured: brand.isFeatured || false,
      verified: brand.verified || false
    });
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (brand) => {
    setSelectedBrand(brand);
    setShowDeleteModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedBrand(null);
  };

  const handleCreateBrand = async () => {
    if (!formValue.name || formValue.name.trim().length < 2) {
      toaster.push(
        <Message showIcon type="warning">
          Brand name must be at least 2 characters
        </Message>,
        { placement: 'topEnd' }
      );
      return;
    }

    const brandData = {
      name: formValue.name.trim(),
      slug: formValue.slug?.trim(),
      website: formValue.website?.trim() || '',
      isActive: formValue.isActive,
      isFeatured: formValue.featured,
      verified: formValue.verified
    };

    await dispatch(customCreateBrand(brandData))
      .unwrap()
      .then(() => setShowAddModal(false))
      .catch((err) => console.error("Failed to create brand:", err));

      setShowAddModal(false);
  };

  const handleUpdateBrand = async () => {
    if (!formValue.name || formValue.name.trim().length < 2) {
      toaster.push(
        <Message showIcon type="warning">
          Brand name must be at least 2 characters
        </Message>,
        { placement: 'topEnd' }
      );
      return;
    }

    try {
      const brandData = {
        name: formValue.name.trim(),
        slug: formValue.slug?.trim(),
        website: formValue.website?.trim() || '',
        isActive: formValue.isActive,
        isFeatured: formValue.featured,
        verified: formValue.verified
      };

      await dispatch(updateBrand({
        id: selectedBrand._id || selectedBrand.id,
        data: brandData
      })).unwrap();
    } catch (err) {
      console.error("Failed to update brand:", err);
    }
  };

  const handleDeleteBrand = async () => {
    try {
      await dispatch(deleteBrand(selectedBrand._id || selectedBrand.id)).unwrap();

      toaster.push(
        <Message showIcon type="success">
          Brand deleted successfully
        </Message>,
        { placement: 'topEnd' }
      );

      handleCloseModals();
      dispatch(fetchBrands());
    } catch (err) {
      console.error("Failed to delete brand:", err);
    }
  };

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
            {item.productCount || item.products?.length || item.stats?.productCount || 0} products
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
              color="primary"
              size="sm"
              className="btn-round"
              onClick={() => handleOpenEditModal(item)}
              title="Edit Brand"
            >
              <i className="fa fa-edit"></i>
            </Button>
            <Button
              color="danger"
              size="sm"
              className="btn-round"
              onClick={() => handleOpenDeleteModal(item)}
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
                      onClick={() => setViewMode("list")}
                      className="btn-round"
                    >
                      <i className="fa fa-list"></i>
                    </Button>
                    <Button
                      color={viewMode === "grid" ? "info" : "secondary"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="btn-round"
                    >
                      <i className="fa fa-th"></i>
                    </Button>
                  </div>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={handleOpenAddModal}
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
                          onClick={handleOpenAddModal}
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
                                  {brand.productCount || brand.products?.length || brand.stats?.productCount || 0}
                                </Badge>
                                {brand.slug && (
                                  <small className="text-light-2">/{brand.slug}</small>
                                )}
                              </div>
                              <div className="d-flex justify-content-between gap-2">
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="btn-round flex-fill"
                                  onClick={() => handleOpenEditModal(brand)}
                                >
                                  <i className="fa fa-edit"></i>
                                </Button>
                                <Button
                                  color="danger"
                                  size="sm"
                                  className="btn-round flex-fill"
                                  onClick={() => handleOpenDeleteModal(brand)}
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
      {/* Add Brand Modal */}
      <Modal
        open={showAddModal}
        onClose={handleCloseAddModal}
        size="md"
        className="rs-theme-dark"
      >
        <Modal.Header>
          <Modal.Title>
            <i className="fa fa-plus-circle mr-2"></i>
            Add New Brand
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid formValue={formValue} onChange={setFormValue}>
            <FormGroup>
              <ControlLabel>Brand Name *</ControlLabel>
              <FormControl name="name" placeholder="Enter brand name..." />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Tagline</ControlLabel>
              <FormControl
                name="tagline"
                placeholder="Brand tagline or slogan..."
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Website</ControlLabel>
              <FormControl
                name="website"
                placeholder="https://www.example.com"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Slug</ControlLabel>
              <FormControl
                name="slug"
                placeholder="brand-slug (leave empty for auto-generate)"
              />
            </FormGroup>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <ControlLabel>Active Status</ControlLabel>
                  <div className="mt-2">
                    <Toggle
                      checked={formValue.isActive}
                      onChange={(checked) => setFormValue({ ...formValue, isActive: checked, active: checked })}
                      checkedChildren="Active"
                      unCheckedChildren="Inactive"
                    />
                  </div>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <ControlLabel>Featured</ControlLabel>
                  <div className="mt-2">
                    <Toggle
                      checked={formValue.featured}
                      onChange={(checked) => setFormValue({ ...formValue, featured: checked })}
                      checkedChildren="Featured"
                      unCheckedChildren="Normal"
                    />
                  </div>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <ControlLabel>Verified</ControlLabel>
                  <div className="mt-2">
                    <Toggle
                      checked={formValue.verified}
                      onChange={(checked) => setFormValue({ ...formValue, verified: checked })}
                      checkedChildren="Verified"
                      unCheckedChildren="Unverified"
                    />
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <RSButton onClick={handleCreateBrand} appearance="primary">
            <i className="fa fa-check mr-2"></i>
            Create Brand
          </RSButton>
          <RSButton onClick={handleCloseAddModal} appearance="subtle">
            Cancel
          </RSButton>
        </Modal.Footer>
      </Modal>
      {/* Edit Brand Modal */}
      <Modal
        open={showEditModal}
        onClose={handleCloseModals}
        size="md"
        className="rs-theme-dark"
      >
        <Modal.Header>
          <Modal.Title>
            <i className="fa fa-edit mr-2"></i>
            Edit Brand
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid formValue={formValue} onChange={setFormValue}>
            <FormGroup>
              <ControlLabel>Brand Name *</ControlLabel>
              <FormControl name="name" placeholder="Enter brand name..." />
            </FormGroup>
            <Row>
              <FormGroup>
                <ControlLabel>Tagline</ControlLabel>
                <FormControl
                  name="tagline"
                  placeholder="Brand tagline or slogan..."
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Website</ControlLabel>
                <FormControl
                  name="website"
                  placeholder="https://www.example.com"
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Slug</ControlLabel>
                <FormControl
                  name="slug"
                  placeholder="brand-slug"
                />
              </FormGroup>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <ControlLabel>Active Status</ControlLabel>
                  <div className="mt-2">
                    <Toggle
                      checked={formValue.isActive}
                      onChange={(checked) => setFormValue({ ...formValue, isActive: checked, active: checked })}
                      checkedChildren="Active"
                      unCheckedChildren="Inactive"
                    />
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <ControlLabel>Featured</ControlLabel>
                  <div className="mt-2">
                    <Toggle
                      checked={formValue.featured}
                      onChange={(checked) => setFormValue({ ...formValue, featured: checked })}
                      checkedChildren="Featured"
                      unCheckedChildren="Normal"
                    />
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <ControlLabel>Verified</ControlLabel>
                  <div className="mt-2">
                    <Toggle
                      checked={formValue.verified}
                      onChange={(checked) => setFormValue({ ...formValue, verified: checked })}
                      checkedChildren="Verified"
                      unCheckedChildren="Unverified"
                    />
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <RSButton onClick={handleUpdateBrand} appearance="primary">
            <i className="fa fa-check mr-2"></i>
            Update Brand
          </RSButton>
          <RSButton onClick={handleCloseModals} appearance="subtle">
            Cancel
          </RSButton>
        </Modal.Footer>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        onClose={handleCloseModals}
        size="xs"
        className="rs-theme-dark"
      >
        <Modal.Header>
          <Modal.Title>
            <i className="fa fa-exclamation-triangle mr-2 text-danger"></i>
            Delete Brand?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            Are you sure you want to delete "<strong style={{ color: "white" }}>
              {selectedBrand?.name || selectedBrand?.title}
            </strong>"? This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <RSButton onClick={handleDeleteBrand} appearance="primary" color="red">
            <i className="fa fa-trash mr-2"></i>
            Yes, Delete It
          </RSButton>
          <RSButton onClick={handleCloseModals} appearance="subtle">
            Cancel
          </RSButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default BrandList;