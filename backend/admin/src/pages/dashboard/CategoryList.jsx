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
  Toggle
} from "rsuite";
import ReactTable from "../../components/ReactTable/ReactTable";
import Loader from "../../components/Loader/Loading";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  selectAllCategories,
  selectLoading,
  selectError,
  selectSuccess,
  setSearchTerm,
  selectSearchTerm,
  selectFilters,
  setFilters,
  clearError,
  createCustomCat,
} from "../../features/categories/slice.js";

const { Group: FormGroup, Control: FormControl, ControlLabel } = Form;
const Textarea = React.forwardRef((props, ref) => <RSInput {...props} as="textarea" ref={ref} />);

const CategoryList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toaster = useToaster();

  // Redux state
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading);
  const success = useSelector(selectSuccess);
  const categories = useSelector(selectAllCategories);
  const searchTerm = useSelector(selectSearchTerm);
  const filters = useSelector(selectFilters);

  // Local state
  const [viewMode, setViewMode] = useState("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Form state
  const [formValue, setFormValue] = useState({
    title: '',
    description: '',
    slug: '',
    parent: '',
    isActive: true,
    featured: false,
    icon: 'fa-tag',
    color: '#7934f3'
  });

  const CATEGORY_STATUS = {
    active: { color: "success", icon: "fa-check-circle", label: "Active" },
    inactive: { color: "danger", icon: "fa-times-circle", label: "Inactive" },
  };

  const ICON_OPTIONS = [
    { label: 'Tag', value: 'fa-tag' },
    { label: 'Folder', value: 'fa-folder' },
    { label: 'Star', value: 'fa-star' },
    { label: 'Heart', value: 'fa-heart' },
    { label: 'Bookmark', value: 'fa-bookmark' },
    { label: 'Shopping Bag', value: 'fa-shopping-bag' },
    { label: 'Laptop', value: 'fa-laptop' },
    { label: 'Mobile', value: 'fa-mobile' },
    { label: 'Camera', value: 'fa-camera' },
    { label: 'Book', value: 'fa-book' },
    { label: 'Music', value: 'fa-music' },
    { label: 'Film', value: 'fa-film' },
    { label: 'Gamepad', value: 'fa-gamepad' },
    { label: 'Coffee', value: 'fa-coffee' }
  ];

  const COLOR_OPTIONS = [
    { label: 'Purple', value: '#7934f3', color: '#7934f3' },
    { label: 'Cyan', value: '#00bcd4', color: '#00bcd4' },
    { label: 'Green', value: '#4caf50', color: '#4caf50' },
    { label: 'Orange', value: '#ff9800', color: '#ff9800' },
    { label: 'Red', value: '#f44336', color: '#f44336' },
    { label: 'Pink', value: '#e91e63', color: '#e91e63' },
    { label: 'Deep Purple', value: '#9c27b0', color: '#9c27b0' },
    { label: 'Indigo', value: '#3f51b5', color: '#3f51b5' },
    { label: 'Teal', value: '#009688', color: '#009688' },
    { label: 'Brown', value: '#795548', color: '#795548' }
  ];

  const columns = useMemo(() => [
    {
      Header: "Icon",
      accessor: "icon",
      sortable: false,
      filterable: false
    },
    { Header: "Category", accessor: "name", sortable: true },
    { Header: "Description", accessor: "description", sortable: false },
    { Header: "Status", accessor: "status", sortable: true },
    { Header: "Items", accessor: "items", sortable: true },
    { Header: "Featured", accessor: "featured", sortable: false },
    {
      Header: "Actions",
      accessor: "actions",
      sortable: false,
      filterable: false
    }
  ], []);

  useEffect(() => {
    dispatch(fetchCategories()).unwrap();
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
          <strong>Success!</strong> Category {showAddModal ? 'created' : 'updated'} successfully
        </Message>,
        { placement: 'topEnd', duration: 3000 }
      );
      handleCloseModals();
      dispatch(fetchCategories());
    }
  }, [success, showAddModal, showEditModal]);

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    if (status === "active") {
      dispatch(setFilters({ ...filters, isActive: true }));
    } else if (status === "inactive") {
      dispatch(setFilters({ ...filters, isActive: false }));
    } else {
      dispatch(setFilters({ ...filters, isActive: undefined }));
    }
  };

  const getCategoryStatus = (isActive) => {
    return isActive !== false ? CATEGORY_STATUS.active : CATEGORY_STATUS.inactive;
  };

  const filteredCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];

    return categories.filter(category => {
      // Status filter
      if (statusFilter !== "all") {
        if (statusFilter === "active" && category.isActive === false) return false;
        if (statusFilter === "inactive" && category.isActive !== false) return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          category.title?.toLowerCase().includes(searchLower) ||
          category.name?.toLowerCase().includes(searchLower) ||
          category.description?.toLowerCase().includes(searchLower) ||
          category.slug?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [categories, searchTerm, statusFilter]);

  const statistics = useMemo(() => {
    if (!categories || categories.length === 0) {
      return {
        totalCategories: 0,
        active: 0,
        inactive: 0,
        featured: 0,
      };
    }

    return {
      totalCategories: categories.length,
      active: categories.filter(c => c.isActive !== false).length,
      inactive: categories.filter(c => c.isActive === false).length,
      featured: categories.filter(c => c.featured === true).length,
    };
  }, [categories]);

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleOpenEditModal = (category) => {

    setSelectedCategory(category);
    setFormValue({
      title: category.title || category.name,
      description: category.description || '',
      slug: category.slug || '',
      parent: category.parent || '',
      isActive: category.isActive !== false,
      featured: category.featured || false,
      icon: category.icon || 'fa-tag',
      color: category.color || '#7934f3'
    });
    console.log('edit');
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  }

  const handleCloseModals = () => {
    setShowDeleteModal(false);
    setFormValue({
      title: '',
      description: '',
      slug: '',
      parent: '',
      isActive: true,
      featured: false,
      icon: 'fa-tag',
      color: '#7934f3'
    });
  };

  const handleCreateCategory = async () => {
    if (!formValue.title || formValue.title.trim().length < 2) {
      toaster.push(
        <Message showIcon type="warning">
          Category title must be at least 2 characters
        </Message>,
        { placement: 'topEnd' }
      );
      return;
    }

    try {
      const categoryData = {
        title: formValue.title.trim(),
        name: formValue.title.trim(),
        description: formValue.description?.trim() || '',
        slug: formValue.slug?.trim() || formValue.title.toLowerCase().replace(/\s+/g, '-'),
        parent: formValue.parent || null,
        isActive: formValue.isActive,
        featured: formValue.featured,
        icon: formValue.icon,
        color: formValue.color
      };

      await dispatch(createCustomCat(categoryData)).unwrap();
    } catch (err) {
      console.error("Failed to create category:", err);
    }
  };

  const handleUpdateCategory = async () => {
    if (!formValue.title || formValue.title.trim().length < 2) {
      toaster.push(
        <Message showIcon type="warning">
          Category title must be at least 2 characters
        </Message>,
        { placement: 'topEnd' }
      );
      return;
    }

    try {
      const categoryData = {
        title: formValue.title.trim(),
        name: formValue.title.trim(),
        description: formValue.description?.trim() || '',
        slug: formValue.slug?.trim(),
        parent: formValue.parent || null,
        isActive: formValue.isActive,
        featured: formValue.featured,
        icon: formValue.icon,
        color: formValue.color
      };

      await dispatch(updateCategory({
        id: selectedCategory._id || selectedCategory.id,
        data: categoryData
      })).unwrap();
    } catch (err) {
      console.error("Failed to update category:", err);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await dispatch(deleteCategory(selectedCategory._id || selectedCategory.id)).unwrap();

      toaster.push(
        <Message showIcon type="success">
          Category deleted successfully
        </Message>,
        { placement: 'topEnd' }
      );

      handleCloseModals();
      dispatch(fetchCategories());
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const parentCategoryOptions = useMemo(() => {
    if (!categories) return [];

    return categories
      .filter(cat => !selectedCategory || cat._id !== selectedCategory._id)
      .map(cat => ({
        label: cat.title || cat.name,
        value: cat._id || cat.id
      }));
  }, [categories, selectedCategory]);

  const tableData = useMemo(() => {
    return filteredCategories.map((item) => {
      const categoryStatus = getCategoryStatus(item.isActive);

      return {
        icon: (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: item.color || '#7934f3'
            }}
          >
            <i
              className={`fa ${item.icon || 'fa-tag'}`}
              style={{ fontSize: '20px', color: 'white' }}
            ></i>
          </div>
        ),
        name: (
          <div className="d-flex flex-column">
            <span className="text-white font-weight-bold">{item.title || item.name}</span>
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
                {item.description.substring(0, 60)}
                {item.description.length > 60 && '...'}
              </span>
            ) : (
              <span className="text-light-2">No description</span>
            )}
          </div>
        ),
        status: (
          <Badge color={categoryStatus.color} pill className="px-3">
            <i className={`fa ${categoryStatus.icon} mr-2`}></i>
            {categoryStatus.label}
          </Badge>
        ),
        items: (
          <span className="text-light-1">
            <i className="fa fa-folder-open mr-2"></i>
            {item.itemCount || item.productCount || 0} items
          </span>
        ),
        featured: (
          <div>
            {item.featured ? (
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
              title="Edit Category"
            >
              <i className="fa fa-edit"></i>
            </Button>
            <Button
              color="danger"
              size="sm"
              className="btn-round"
              onClick={() => handleOpenDeleteModal(item)}
              title="Delete Category"
            >
              <i className="fa fa-trash"></i>
            </Button>
          </div>
        )
      };
    });
  }, [filteredCategories]);

  // Show loader while fetching
  if (loading && (!categories || categories.length === 0)) {
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
                      <i className="fa fa-folder text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category text-light-2">Total Categories</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.totalCategories}
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
                    <i className="fa fa-folder mr-2"></i>
                    All Categories
                  </CardTitle>
                  <small className="text-light-2">
                    Manage your content categories
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
                    Add Category
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
                        placeholder="Search categories..."
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
                        Total: {categories?.length || 0}
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
                            dispatch(setFilters({ isActive: undefined }));
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

                {/* Categories Table/Grid */}
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
                      <i className="fa fa-folder" style={{ fontSize: '64px', opacity: 0.3 }}></i>
                      <p className="text-light-2 mt-3">
                        {searchTerm || statusFilter !== 'all'
                          ? 'No categories match your filters'
                          : 'No categories found. Create your first category!'}
                      </p>
                      {!searchTerm && statusFilter === 'all' && (
                        <Button
                          color="primary"
                          onClick={handleOpenAddModal}
                          className="btn-round mt-3"
                        >
                          <i className="fa fa-plus mr-2"></i>
                          Create First Category
                        </Button>
                      )}
                    </div>
                  )
                ) : (
                  <Row>
                    {filteredCategories.map(category => {
                      const categoryStatus = getCategoryStatus(category.isActive);

                      return (
                        <Col md="4" lg="3" key={category._id || category.id} className="mb-4">
                          <Card className="category-card h-100">
                            <CardBody className="text-center">
                              <div
                                className="category-icon-wrapper mx-auto mb-3"
                                style={{
                                  width: '80px',
                                  height: '80px',
                                  borderRadius: '16px',
                                  backgroundColor: category.color || '#7934f3',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <i
                                  className={`fa ${category.icon || 'fa-tag'}`}
                                  style={{ fontSize: '36px', color: 'white' }}
                                ></i>
                              </div>

                              <h6 className="text-white mb-2">{category.title || category.name}</h6>

                              {category.description && (
                                <p className="text-light-2 mb-3" style={{ fontSize: '12px', minHeight: '40px' }}>
                                  {category.description.substring(0, 60)}
                                  {category.description.length > 60 && '...'}
                                </p>
                              )}

                              <div className="d-flex justify-content-center align-items-center mb-3 gap-2">
                                <Badge color={categoryStatus.color} pill>
                                  {categoryStatus.label}
                                </Badge>
                                {category.featured && (
                                  <Badge color="warning" pill>
                                    <i className="fa fa-star mr-1"></i>
                                    Featured
                                  </Badge>
                                )}
                              </div>

                              <div className="mb-3">
                                <Badge color="light" pill>
                                  <i className="fa fa-folder-open mr-1"></i>
                                  {category.itemCount || category.productCount || 0} items
                                </Badge>
                              </div>

                              <div className="d-flex justify-content-between gap-2">
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="btn-round flex-fill"
                                  onClick={() => handleOpenEditModal(category)}
                                >
                                  <i className="fa fa-edit"></i>
                                </Button>
                                <Button
                                  color="danger"
                                  size="sm"
                                  className="btn-round flex-fill"
                                  onClick={() => handleOpenDeleteModal(category)}
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
                {loading && categories && categories.length > 0 && (
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

      {/* Add Category Modal */}
      <Modal
        open={showAddModal}
        onClose={() => handleCloseAddModal()}
        size="md"
        className="rs-theme-dark"
      >
        <Modal.Header>
          <Modal.Title>
            <i className="fa fa-plus-circle mr-2"></i>
            Add New Category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid formValue={formValue} onChange={setFormValue}>
            <FormGroup>
              <ControlLabel>Category Name *</ControlLabel>
              <FormControl name="title" placeholder="Enter category name..." />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                name="description"
                rows={3}
                accepter={Textarea}
                placeholder="Enter category description..."
              />
            </FormGroup>
                <FormGroup>
                  <ControlLabel>Slug</ControlLabel>
                  <FormControl
                    name="slug"
                    placeholder="category-slug (leave empty for auto-generate)"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Parent Category</ControlLabel>
                  <FormControl
                    name="parent"
                    accepter={SelectPicker}
                    data={parentCategoryOptions}
                    block
                    placeholder="Select parent category (optional)"
                    searchable
                  />
                </FormGroup>
                <FormGroup>
                  <FormGroup>
                  <ControlLabel>Icon</ControlLabel>
                  <FormControl
                    name="icon"
                    accepter={SelectPicker}
                    data={ICON_OPTIONS}
                    block
                    placeholder="Select icon"
                    renderMenuItem={(label, item) => (
                      <div className="d-flex align-items-center">
                        <i className={`fa ${item.value} mr-2`}></i>
                        {label}`
                      </div>
                    )}
                    renderValue={(value, item) => (
                      <div className="d-flex align-items-center">
                        <i className={`fa ${value} mr-2`}></i>
                        {item?.label}
                      </div>
                    )}
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Color</ControlLabel>
                  <FormControl
                    name="color"
                    accepter={SelectPicker}
                    data={COLOR_OPTIONS}
                    block
                    placeholder="Select color"
                    renderMenuItem={(label, item) => (
                      <div className="d-flex align-items-center">
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: item.color,
                            borderRadius: '3px',
                            marginRight: '8px'
                          }}
                        />
                        {label}
                      </div>
                    )}
                    renderValue={(value, item) => (
                      <div className="d-flex align-items-center">
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: value,
                            borderRadius: '3px',
                            marginRight: '8px'
                          }}
                        />
                        {item?.label}
                      </div>
                    )}
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Active Status</ControlLabel>
                  <div className="mt-2">
                    <Toggle
                      checked={formValue.isActive}
                      onChange={(checked) => setFormValue({ ...formValue, isActive: checked })}
                      checkedChildren="Active"
                      unCheckedChildren="Inactive"
                    />
                  </div>
                </FormGroup>
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
            </FormGroup>

          </Form>
        </Modal.Body >
        <Modal.Footer>
          <RSButton onClick={handleCreateCategory} appearance="primary">
            <i className="fa fa-check mr-2"></i>
            Create Category
          </RSButton>
          <RSButton onClick={() => handleCloseAddModal()} appearance="subtle">
            Cancel
          </RSButton>
        </Modal.Footer>
      </Modal >

      {/* Edit Category Modal */}

      < Modal
        open={showEditModal}
        onClose={handleCloseEditModal}
        size="md"
        className="rs-theme-dark"
      >
        <Modal.Header>
          <Modal.Title>
            <i className="fa fa-edit mr-2"></i>
            Edit Category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid formValue={formValue} onChange={setFormValue}>
            <FormGroup>
              <ControlLabel>Category Name *</ControlLabel>
              <FormControl name="title" value={(selectedCategory) ? selectedCategory.title : formValue.title} placeholder="Enter category name..." />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                name="description"
                rows={3}
                value={(selectedCategory) ? selectedCategory.description : formValue.description}
                accepter={Textarea}
                placeholder="Enter category description..."
              />
            </FormGroup>

            <Row>
              <Col md={12}>
                <FormGroup>
                  <ControlLabel>Slug</ControlLabel>
                  <FormControl
                    name="slug"
                    value={(selectedCategory) ? selectedCategory.slug : "category-slug"}
                    placeholder="category-slug"
                  />
                </FormGroup>
              </Col>

              <Col md={12}>
                <FormGroup>
                  <ControlLabel>Parent Category</ControlLabel>
                  <FormControl
                    name="parent"
                    accepter={SelectPicker}
                    data={parentCategoryOptions}
                    block
                    placeholder="Select parent category (optional)"
                    searchable
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <ControlLabel>Icon</ControlLabel>
                  <FormControl
                    name="icon"
                    accepter={SelectPicker}
                    data={ICON_OPTIONS}
                    block
                    placeholder="Select icon"
                    renderMenuItem={(label, item) => (
                      <div className="d-flex align-items-center">
                        <i className={`fa ${item.value} mr-2`}></i>
                        {label}
                      </div>
                    )}
                    renderValue={(value, item) => (
                      <div className="d-flex align-items-center">
                        <i className={`fa ${value} mr-2`}></i>
                        {item?.label}
                      </div>
                    )}
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <ControlLabel>Color</ControlLabel>
                  <FormControl
                    name="color"
                    accepter={SelectPicker}
                    data={COLOR_OPTIONS}
                    block
                    placeholder="Select color"
                    renderMenuItem={(label, item) => (
                      <div className="d-flex align-items-center">
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: item.color,
                            borderRadius: '3px',
                            marginRight: '8px'
                          }}
                        />
                        {label}
                      </div>
                    )}
                    renderValue={(value, item) => (
                      <div className="d-flex align-items-center">
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: value,
                            borderRadius: '3px',
                            marginRight: '8px'
                          }}
                        />
                        {item?.label}
                      </div>
                    )}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <ControlLabel>Active Status</ControlLabel>
                  <div className="mt-2">
                    <Toggle
                      checked={formValue.isActive}
                      onChange={(checked) => setFormValue({ ...formValue, isActive: checked })}
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
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <RSButton onClick={handleUpdateCategory} appearance="primary">
            <i className="fa fa-check mr-2"></i>
            Update Category
          </RSButton>
          <RSButton onClick={handleCloseEditModal} appearance="subtle">
            Cancel
          </RSButton>
        </Modal.Footer>
      </Modal >


      {/* Delete Confirmation Modal */}
      < Modal
        open={showDeleteModal}
        onClose={handleCloseModals}
        className="rs-theme-dark"
        size="xs"
      >
        <Modal.Header>
          <Modal.Title>
            <i className="fa fa-exclamation-triangle mr-2 text-danger"></i>
            Delete Category?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            Are you sure you want to delete "<strong style={{ color: "white" }}>
              {selectedCategory?.title || selectedCategory?.name}
            </strong>"? This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <RSButton onClick={handleDeleteCategory} appearance="primary" color="red">
            <i className="fa fa-trash mr-2"></i>
            Yes, Delete It
          </RSButton>
          <RSButton onClick={handleCloseModals} appearance="subtle">
            Cancel
          </RSButton>
        </Modal.Footer>
      </Modal >
    </>
  );
}
export default CategoryList;