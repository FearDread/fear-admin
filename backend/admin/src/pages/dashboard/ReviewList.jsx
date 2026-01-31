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
  Rate
} from "rsuite";
import ReactTable from "../../components/ReactTable/ReactTable";
import Loader from "../../components/Loader/Loading";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSortedReviews,
  selectReviewsSearchTerm,
  selectReviewsFilters,
  setSearchTerm,
  fetchReviews,
  submitReview,
  updateReview,
  deleteReview,
  selectReviewsLoading,
  selectReviewsError,
  selectReviewsSuccess,
  selectAllReviews,
  setFilters,
  clearError,
  selectVerifiedReviews,
  selectHighRatedReviews,
  selectHelpfulReviews,
  toggleHelpful,
  toggleVerified,
  markAsReported,
} from "../../features/review/slice.js";

const { Group: FormGroup, Control: FormControl, ControlLabel } = Form;
const Textarea = React.forwardRef((props, ref) => <RSInput {...props} as="textarea" ref={ref} />);

const ReviewList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toaster = useToaster();

  // Redux state
  const error = useSelector(selectReviewsError);
  const loading = useSelector(selectReviewsLoading);
  const success = useSelector(selectReviewsSuccess);
  const reviews = useSelector(selectSortedReviews);
  const allReviews = useSelector(selectAllReviews);
  const searchTerm = useSelector(selectReviewsSearchTerm);
  const filters = useSelector(selectReviewsFilters);
  const verifiedReviews = useSelector(selectVerifiedReviews);
  const highRatedReviews = useSelector(selectHighRatedReviews);
  const helpfulReviews = useSelector(selectHelpfulReviews);

  // Local State
  const [viewMode, setViewMode] = useState("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // Form state
  const [formValue, setFormValue] = useState({
    title: '',
    content: '',
    rating: 5,
    productId: '',
    userName: '',
    verified: false,
    featured: false,
  });

  const REVIEW_STATUS = {
    verified: { color: "success", icon: "fa-check-circle", label: "Verified" },
    unverified: { color: "danger", icon: "fa-times-circle", label: "Unverified" },
  };

  const columns = useMemo(() => [
    {
      Header: "Rating",
      accessor: "rating",
      sortable: false,
      filterable: false
    },
    { Header: "User", accessor: "username", sortable: true },
    { Header: "Email", accessor: "email", sortable: true },
    { Header: "Status", accessor: "verified", sortable: true },
    { Header: "Content", accessor: "comment", sortable: true },
    { Header: "Featured", accessor: "featured", sortable: false },
    {
      Header: "Actions",
      accessor: "actions",
      sortable: false,
      filterable: false
    }
  ], []);

  useEffect(() => {
    dispatch(fetchReviews()).unwrap();
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
    if (success && (showAddModal)) {
      toaster.push(
        <Message showIcon type="success" closable>
          <strong>Success!</strong> Review {showAddModal ? 'created' : 'updated'} successfully
        </Message>,
        { placement: 'topCenter', duration: 3000 }
      );
      handleCloseModals();

    }
    if (!reviews || reviews.length === 0) {
      dispatch(fetchReviews());
    }
  }, [success, showAddModal]);

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    if (status === "verified") {
      dispatch(setFilters({ ...filters, verified: true }));
    } else if (status === "unverified") {
      dispatch(setFilters({ ...filters, verified: false }));
    } else {
      dispatch(setFilters({ ...filters, verified: undefined }));
    }
  };

  const getReviewStatus = (verified) => {
    return verified !== false ? REVIEW_STATUS.verified : REVIEW_STATUS.unverified;
  };

  const filteredReviews = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];

    return reviews.filter(review => {
      // Status filter
      if (statusFilter !== "all") {
        if (statusFilter === "verified" && review.verified === false) return false;
        if (statusFilter === "unverified" && review.verified !== false) return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          review.title?.toLowerCase().includes(searchLower) ||
          review.content?.toLowerCase().includes(searchLower) ||
          review.userName?.toLowerCase().includes(searchLower) ||
          review.productId?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [reviews, searchTerm, statusFilter]);

  const statistics = useMemo(() => {
    if (!allReviews || allReviews.length === 0) {
      return {
        totalReviews: 0,
        verified: 0,
        unverified: 0,
        helpful: 0,
      };
    }

    return {
      totalReviews: allReviews.length,
      verified: verifiedReviews.length,
      unverified: allReviews.filter(r => !r.verified).length,
      helpful: helpfulReviews.length,
    };
  }, [allReviews, verifiedReviews, helpfulReviews]);

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleOpenEditModal = (review) => {
    setSelectedReview(review);
    setFormValue({
      content: review.comment || '',
      rating: review.rating || 5,
      productId: review.productId || '',
      userName: review.username || '',
      verified: review.verified || false,
      featured: review.featured || false,
    });
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (review) => {
    setSelectedReview(review);
    setShowDeleteModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  }

  const handleCloseModals = () => {
    setShowDeleteModal(false);
    setFormValue({
      title: '',
      content: '',
      rating: 5,
      productId: '',
      userName: '',
      verified: false,
      featured: false,
    })
    setSelectedReview(null);
  };

  const handleReview = (method) => {
    const reviewData = {
      title: formValue.title?.trim(),
      content: formValue.content?.trim(),
      rating: formValue.rating,
      productId: formValue.productId?.trim() || '',
      userName: formValue.userName?.trim(),
      verified: formValue.verified,
      featured: formValue.featured,
    };

    if (method === 'CREATE' && showAddModal) {
        setShowAddModal(false)
        dispatch(submitReview(reviewData))
          .unwrap()
          .then(() => setShowAddModal(false))
          .finally(() => dispatch(fetchReviews()))
          .catch((err) => console.error("Failed to create review:", err));

    } else if (method === 'UPDATE' && showEditModal && selectedReview) {
          dispatch(updateReview({ id: selectedReview._id, data: reviewData }))
            .unwrap()
            .then(() => setShowEditModal(false))
            .finally(() => dispatch(fetchReviews()))
            .catch((err) => console.log('Error updating review : ', err));

    } else if (method === 'DELETE' && showDeleteModal && selectedReview) {
          dispatch(deleteReview({ id: selectedReview._id }))
            .unwrap()
            .then(() => {
              toaster.push(
                <Message showIcon type="success" closable>
                  <strong>Review Removed Successfully!</strong>
                </Message>,
                { placement: 'topCenter', duration: 3000 }
              );
            })
            .finally(() => dispatch(fetchReviews()))
            .catch((err) => console.log('Error removing review : ', err));
          setShowDeleteModal(false);
    }
  }

  const tableData = useMemo(() => {
    return filteredReviews.map((item) => {
      const reviewStatus = getReviewStatus(item.verified);

      return {
        rating: (
          <div className="position-relative">
            <Rate 
              value={item.rating || 0} 
              readOnly 
              size="xs"
              style={{ color: '#f5a623' }}
            />
          </div>
        ),
        username: (
          <div className="d-flex flex-column">
            {item.username ? (
              <small className="text-light-2" style={{ fontSize: '11px' }}>
                by {item.username}
              </small>
            ) : (
                <span>No User</span>
            )}
          </div>
        ),
        email: (
          <div className="text-light-1" style={{ maxWidth: '300px' }}>
            {item.email ? (
              <span style={{ fontSize: '12px' }}>
                {item.email}
              </span>
            ) : (
              <span className="text-light-2">No Email</span>
            )}
          </div>
        ),
        verified: (
          <Badge color={reviewStatus.color} pill className="px-3">
            <i className={`fa ${reviewStatus.icon} mr-2`}></i>
            {reviewStatus.label}
          </Badge>
        ),
        comment: (
          <span className="text-light-1">
            <i className="fa fa-thumbs-up mr-2"></i>
                {item.comment.substring(0, 80)}
                {item.comment.length > 80 && '...'}
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
              onClick={(e) => {
                e.preventDefault();
                handleOpenEditModal(item)
              }}
              title="Edit Review"
            >
              <i className="fa fa-edit"></i>
            </Button>
            <Button
              color="danger"
              size="sm"
              className="btn-round"
              onClick={(e) => {
                e.preventDefault();
                handleOpenDeleteModal(item)
              }}
              title="Delete Review"
            >
              <i className="fa fa-trash"></i>
            </Button>
          </div>
        )
      };
    });
  }, [filteredReviews]);

  // Show loader while fetching
  if (loading && (!reviews || reviews.length === 0)) {
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
                      <i className="fa fa-star text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category text-light-2">Total Reviews</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.totalReviews}
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
                      <p className="card-category text-light-2">Verified</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.verified}
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
                      <p className="card-category text-light-2">Unverified</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.unverified}
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
                      <i className="fa fa-thumbs-up text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category text-light-2">Helpful</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.helpful}
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
                    <i className="fa fa-star mr-2"></i>
                    All Reviews
                  </CardTitle>
                  <small className="text-light-2">
                    Manage customer reviews
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
                    Add Review
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
                        placeholder="Search reviews..."
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
                          : statusFilter === "verified" ? "Verified" : "Unverified"}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => handleStatusFilter("all")}>
                          All Status
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={() => handleStatusFilter("verified")}>
                          <i className="fa fa-check-circle text-success mr-2"></i>
                          Verified
                        </DropdownItem>
                        <DropdownItem onClick={() => handleStatusFilter("unverified")}>
                          <i className="fa fa-times-circle text-danger mr-2"></i>
                          Unverified
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Col>
                  <Col md="3" className="text-right">
                    <div className="d-flex justify-content-end align-items-center gap-2">
                      <Badge color="light" className="px-3">
                        Total: {allReviews?.length || 0}
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
                            dispatch(setFilters({ verified: undefined }));
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

                {/* Reviews Table/Grid */}
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
                      <i className="fa fa-star" style={{ fontSize: '64px', opacity: 0.3 }}></i>
                      <p className="text-light-2 mt-3">
                        {searchTerm || statusFilter !== 'all'
                          ? 'No reviews match your filters'
                          : 'No reviews found. Create your first review!'}
                      </p>
                      {!searchTerm && statusFilter === 'all' && (
                        <Button
                          color="primary"
                          onClick={handleOpenAddModal}
                          className="btn-round mt-3"
                        >
                          <i className="fa fa-plus mr-2"></i>
                          Create First Review
                        </Button>
                      )}
                    </div>
                  )
                ) : (
                  <Row>
                    {filteredReviews.map(review => {
                      const reviewStatus = getReviewStatus(review.verified);
                      const isFeatured = review.featured;

                      return (
                        <Col md="4" lg="3" key={review._id || review.id} className="mb-4">
                          <Card className="brand-card h-100">
                            <div className="position-relative" style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                              <div className="text-center">
                                <Rate 
                                  value={review.rating || 0} 
                                  readOnly 
                                  size="sm"
                                  style={{ color: '#f5a623' }}
                                />
                              </div>
                              <Badge
                                color={reviewStatus.color}
                                className="position-absolute"
                                style={{ top: '10px', right: '10px' }}
                              >
                                {reviewStatus.label}
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
                              <h6 className="text-white mb-2">{review.title || 'No Title'}</h6>
                              {review.content && (
                                <p className="text-light-2 mb-3" style={{ fontSize: '12px', minHeight: '40px' }}>
                                  {review.content.substring(0, 80)}
                                  {review.content.length > 80 && '...'}
                                </p>
                              )}
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <Badge color="light" pill>
                                  <i className="fa fa-thumbs-up mr-1"></i>
                                  {review.helpfulCount || 0}
                                </Badge>
                                {review.userName && (
                                  <small className="text-light-2">by {review.userName}</small>
                                )}
                              </div>
                              <div className="d-flex justify-content-between gap-2">
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="btn-round flex-fill"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    console.log('edit review', review);
                                    handleOpenEditModal(review)
                                  }}
                                >
                                  <i className="fa fa-edit"></i>
                                </Button>
                                <Button
                                  color="danger"
                                  size="sm"
                                  className="btn-round flex-fill"
                                  onClick={() => handleOpenDeleteModal(review)}
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
                {loading && reviews && reviews.length > 0 && (
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
      {/* Add Review Modal */}
      <Modal
        open={showAddModal}
        onClose={handleCloseAddModal}
        size="md"
        className="rs-theme-dark"
      >
        <Modal.Header>
          <Modal.Title>
            <i className="fa fa-plus-circle mr-2"></i>
            Add New Review
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid formValue={formValue} onChange={setFormValue}>
            <FormGroup>
              <ControlLabel>Review Title *</ControlLabel>
              <FormControl name="title" placeholder="Enter review title..." />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Review Content</ControlLabel>
              <FormControl
                name="content"
                accepter={Textarea}
                rows={5}
                placeholder="Write your review..."
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Rating *</ControlLabel>
              <div className="mt-2">
                <Rate
                  value={formValue.rating}
                  onChange={(value) => setFormValue({ ...formValue, rating: value })}
                  size="md"
                />
              </div>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Product ID</ControlLabel>
              <FormControl
                name="productId"
                placeholder="Enter product ID..."
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>User Name</ControlLabel>
              <FormControl
                name="userName"
                placeholder="Enter user name..."
              />
            </FormGroup>
            <FormGroup className="button-flex-row">
              <Col md={3}>
                <FormGroup>
                  <ControlLabel>Verified Status</ControlLabel>
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

              <Col md={3}>
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
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <RSButton onClick={() => handleReview('CREATE')} appearance="primary">
            <i className="fa fa-check mr-2"></i>
            Create Review
          </RSButton>
          <RSButton onClick={handleCloseAddModal} appearance="subtle">
            Cancel
          </RSButton>
        </Modal.Footer>
      </Modal>
      {/* Edit Review Modal */}
      <Modal
        open={showEditModal}
        onClose={handleCloseEditModal}
        size="md"
        className="rs-theme-dark"
      >
        <Modal.Header>
          <Modal.Title>
            <i className="fa fa-edit mr-2"></i>
            Edit Review
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid formValue={formValue} onChange={setFormValue}>
            <FormGroup>
              <ControlLabel>Review Title *</ControlLabel>
              <FormControl name="title" placeholder="Enter review title..." />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Review Content</ControlLabel>
              <FormControl
                name="content"
                accepter={Textarea}
                rows={5}
                placeholder="Write your review..."
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Rating *</ControlLabel>
              <div className="mt-2">
                <Rate
                  value={formValue.rating}
                  onChange={(value) => setFormValue({ ...formValue, rating: value })}
                  size="md"
                />
              </div>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Product ID</ControlLabel>
              <FormControl
                name="productId"
                placeholder="Enter product ID..."
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>User Name</ControlLabel>
              <FormControl
                name="userName"
                placeholder="Enter user name..."
              />
            </FormGroup>
            <FormGroup className="button-flex-row">
              <Col md={3}>
                <FormGroup>
                  <ControlLabel>Verified Status</ControlLabel>
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
              <Col md={3}>
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
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <RSButton onClick={() => handleReview('UPDATE')} appearance="primary">
            <i className="fa fa-check mr-2"></i>
            Update Review
          </RSButton>
          <RSButton onClick={handleCloseEditModal} appearance="subtle">
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
            Delete Review?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            Are you sure you want to delete "<strong style={{ color: "white" }}>
              {selectedReview?.title || 'this review'}
            </strong>"? This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <RSButton onClick={() => handleReview("DELETE")} appearance="primary" color="red">
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
export default ReviewList;