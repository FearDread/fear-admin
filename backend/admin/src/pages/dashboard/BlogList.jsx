// features/blog/BlogList.jsx
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
  selectSortedPosts,
  selectViewMode,
  selectSearchTerm,
  selectFilters,
  setSearchTerm,
  setViewMode,
  setSorting,
  fetchPosts,
  selectLoading,
  selectError,
  selectSuccess,
  selectFilteredPosts,
  deletePost,
  setFilters,
  clearError,
  togglePublished,
  toggleFeatured,
} from "../../features/blog/slice.js";
import {
  fetchCategories,
  selectAllCategories
} from "../../features/categories/slice.js";

const BlogList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Redux state
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading);
  const posts = useSelector(selectSortedPosts);
  const viewMode = useSelector(selectViewMode);
  const searchTerm = useSelector(selectSearchTerm);
  const filters = useSelector(selectFilters);
  const categories = useSelector(selectAllCategories);
  // Local state
  const [alert, setAlert] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const POST_STATUS = {
    published: { color: "success", icon: "fa-check-circle", label: "Published" },
    draft: { color: "warning", icon: "fa-edit", label: "Draft" },
    scheduled: { color: "info", icon: "fa-clock", label: "Scheduled" },
  };

  const columns = useMemo(() => [
    {
      Header: "Image",
      accessor: "featuredImage",
      sortable: false,
      filterable: false
    },
    { Header: "Title", accessor: "title", sortable: true },
    { Header: "Author", accessor: "author", sortable: true },
    { Header: "Category", accessor: "category", sortable: true },
    { Header: "Status", accessor: "status", sortable: true },
    { Header: "Views", accessor: "views", sortable: true },
    { Header: "Date", accessor: "date", sortable: true },
    {
      Header: "Actions",
      accessor: "actions",
      sortable: false,
      filterable: false
    }
  ], []);

  useEffect(() => {
    dispatch(fetchPosts()).unwrap();
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      // Add any resize logic if needed
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const handleEditPost = (id) => {
    navigate(`/admin/blog/edit/${id}`);
  };

  const handleDeletePost = async (id, postTitle) => {
    try {
      await dispatch(deletePost(id));
    } catch (err) {
      console.log('error deleting post ::', err);
    }
  };

  const confirmDelete = (id, post) => {
    // Add confirmation logic here
  };

  const hideAlert = () => {
    setAlert(null);
  };

  const handleCategoryFilter = (categoryId) => {
    setCategoryFilter(categoryId);
    if (categoryId !== "all") {
      dispatch(setFilters({ ...filters, categoryId }));
    } else {
      dispatch(setFilters({ ...filters, categoryId: null }));
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    if (status !== "all") {
      dispatch(setFilters({ ...filters, published: status === "published" }));
    } else {
      dispatch(setFilters({ ...filters, published: undefined }));
    }
  };

  const getPostStatus = (post) => {
    if (post.scheduledDate && new Date(post.scheduledDate) > new Date()) {
      return POST_STATUS.scheduled;
    }
    if (post.published) {
      return POST_STATUS.published;
    }
    return POST_STATUS.draft;
  };

  const handleTogglePublished = async (postId) => {
    try {
      await dispatch(togglePublished(postId));
    } catch (err) {
      console.log('error toggling published status ::', err);
    }
  };

  const handleToggleFeatured = async (postId) => {
    try {
      await dispatch(toggleFeatured(postId));
    } catch (err) {
      console.log('error toggling featured status ::', err);
    }
  };

  const filteredPosts = useMemo(() => {
    if (!posts || posts.length === 0) return [];

    return posts.filter(post => {
      // Category filter
      if (categoryFilter !== "all" && post.category?._id !== categoryFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all") {
        if (statusFilter === "published" && !post.published) return false;
        if (statusFilter === "draft" && post.published) return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          post.title?.toLowerCase().includes(searchLower) ||
          post.content?.toLowerCase().includes(searchLower) ||
          post.excerpt?.toLowerCase().includes(searchLower) ||
          post.author?.name?.toLowerCase().includes(searchLower) ||
          post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  }, [posts, searchTerm, categoryFilter, statusFilter]);

  const statistics = useMemo(() => {
    if (!posts || posts.length === 0) {
      return {
        totalPosts: 0,
        published: 0,
        drafts: 0,
        scheduled: 0,
        totalViews: 0,
      };
    }

    return {
      totalPosts: posts.length,
      published: posts.filter(p => p.published).length,
      drafts: posts.filter(p => !p.published).length,
      scheduled: posts.filter(p => p.scheduledDate && new Date(p.scheduledDate) > new Date()).length,
      totalViews: posts.reduce((sum, p) => sum + (p.views || 0), 0),
    };
  }, [posts]);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const tableData = useMemo(() => {
    return filteredPosts.map((item) => {
      const postStatus = getPostStatus(item);
      
      return {
        featuredImage: (
          <div className="position-relative">
            <img
              src={item.featuredImage?.url || '../../assets/images/placeholder.png'}
              alt={item.title}
              className="post-img rounded"
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'cover',
                border: '2px solid rgba(255,255,255,0.2)'
              }}
            />
            {item.featured && (
              <i 
                className="fa fa-star position-absolute text-warning"
                style={{ top: '-5px', right: '-5px', fontSize: '14px' }}
              ></i>
            )}
          </div>
        ),
        title: (
          <div className="d-flex flex-column">
            <span className="text-white font-weight-bold">{item.title}</span>
            {item.excerpt && (
              <small className="text-light-2" style={{ fontSize: '11px' }}>
                {item.excerpt.substring(0, 60)}...
              </small>
            )}
            {item.tags && item.tags.length > 0 && (
              <div className="mt-1">
                {item.tags.slice(0, 3).map((tag, idx) => (
                  <Badge key={idx} color="secondary" pill className="mr-1" style={{ fontSize: '10px' }}>
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ),
        author: (
          <div className="d-flex align-items-center">
            {item.author?.avatar && (
              <img
                src={item.author.avatar}
                alt={item.author.name}
                className="rounded-circle mr-2"
                style={{ width: '30px', height: '30px', objectFit: 'cover' }}
              />
            )}
            <span className="text-light-1">{item.author?.name || 'Unknown'}</span>
          </div>
        ),
        category: (
          <Badge color="primary" pill className="px-3">
            {item.category?.title || 'Uncategorized'}
          </Badge>
        ),
        status: (
          <Badge color={postStatus.color} pill className="px-3">
            <i className={`fa ${postStatus.icon} mr-2`}></i>
            {postStatus.label}
          </Badge>
        ),
        views: (
          <span className="text-light-1">
            <i className="fa fa-eye mr-2"></i>
            {item.views?.toLocaleString() || 0}
          </span>
        ),
        date: (
          <div className="d-flex flex-column">
            <small className="text-light-2">
              {formatDate(item.publishedAt || item.createdAt)}
            </small>
          </div>
        ),
        actions: (
          <div className="d-flex gap-2">
            <Button
              color="primary"
              size="sm"
              className="btn-round"
              onClick={() => handleEditPost(item._id)}
              title="Edit Post"
            >
              <i className="fa fa-edit"></i>
            </Button>
            <Button
              color={item.featured ? "warning" : "secondary"}
              size="sm"
              className="btn-round"
              onClick={() => handleToggleFeatured(item._id)}
              title="Toggle Featured"
            >
              <i className="fa fa-star"></i>
            </Button>
            <Button
              color={item.published ? "success" : "warning"}
              size="sm"
              className="btn-round"
              onClick={() => handleTogglePublished(item._id)}
              title={item.published ? "Unpublish" : "Publish"}
            >
              <i className={`fa ${item.published ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i>
            </Button>
            <Button
              color="danger"
              size="sm"
              className="btn-round"
              onClick={() => confirmDelete(item._id, item)}
              title="Delete Post"
            >
              <i className="fa fa-trash"></i>
            </Button>
          </div>
        )
      };
    });
  }, [filteredPosts]);

  // Show loader while fetching
  if (loading && (!posts || posts.length === 0)) {
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
                      <i className="fa fa-newspaper text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category text-light-2">Total Posts</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.totalPosts}
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
                      <p className="card-category text-light-2">Published</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.published}
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
                      <i className="fa fa-edit text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category text-light-2">Drafts</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.drafts}
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
                    <div className="icon-big text-center circle-1 bg-info-light2">
                      <i className="fa fa-eye text-info"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category text-light-2">Total Views</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.totalViews.toLocaleString()}
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
                    <i className="fa fa-newspaper mr-2"></i>
                    All Blog Posts
                  </CardTitle>
                  <small className="text-light-2">
                    Manage your blog content
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
                    onClick={() => navigate('/admin/blog/new')}
                    className="btn-round"
                  >
                    <i className="fa fa-plus mr-2"></i>
                    New Post
                  </Button>
                </div>
              </CardHeader>

              <CardBody>
                {/* Search and Filter Section */}
                <Row className="mb-4">
                  <Col md="4">
                    <div className="position-relative">
                      <Input
                        type="text"
                        placeholder="Search posts, authors, tags..."
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
                  <Col md="2">
                    <UncontrolledDropdown>
                      <DropdownToggle 
                        caret 
                        color="light" 
                        className="w-100 text-left"
                      >
                        <i className="fa fa-circle mr-2"></i>
                        {statusFilter === "all" ? "All Status" : statusFilter === "published" ? "Published" : "Drafts"}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => handleStatusFilter("all")}>
                          All Status
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={() => handleStatusFilter("published")}>
                          <i className="fa fa-check-circle text-success mr-2"></i>
                          Published
                        </DropdownItem>
                        <DropdownItem onClick={() => handleStatusFilter("draft")}>
                          <i className="fa fa-edit text-warning mr-2"></i>
                          Drafts
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Col>
                  <Col md="3" className="text-right">
                    <div className="d-flex justify-content-end align-items-center gap-2">
                      <Badge color="light" className="px-3">
                        Total: {posts?.length || 0}
                      </Badge>
                      <Badge color="info" className="px-3">
                        Filtered: {tableData.length}
                      </Badge>
                      {(searchTerm || categoryFilter !== "all" || statusFilter !== "all") && (
                        <Button
                          color="secondary"
                          size="sm"
                          onClick={() => {
                            dispatch(setSearchTerm(""));
                            setCategoryFilter("all");
                            setStatusFilter("all");
                            dispatch(setFilters({ categoryId: null, published: undefined }));
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

                {/* Posts Table/Grid */}
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
                      <i className="fa fa-newspaper" style={{ fontSize: '64px', opacity: 0.3 }}></i>
                      <p className="text-light-2 mt-3">
                        {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                          ? 'No posts match your filters' 
                          : 'No posts found. Create your first post!'}
                      </p>
                      {!searchTerm && categoryFilter === 'all' && statusFilter === 'all' && (
                        <Button 
                          color="primary" 
                          onClick={() => navigate('/admin/blog/new')}
                          className="btn-round mt-3"
                        >
                          <i className="fa fa-plus mr-2"></i>
                          Create First Post
                        </Button>
                      )}
                    </div>
                  )
                ) : (
                  <Row>
                    {filteredPosts.map(post => {
                      const postStatus = getPostStatus(post);
                      return (
                        <Col md="6" lg="4" key={post._id} className="mb-4">
                          <Card className="post-card h-100">
                            <div className="position-relative">
                              <img 
                                src={post.featuredImage?.url || '../../assets/images/placeholder.png'} 
                                className="card-img-top"
                                alt={post.title}
                                style={{ height: '200px', objectFit: 'cover' }}
                              />
                              <Badge 
                                color={postStatus.color} 
                                className="position-absolute"
                                style={{ top: '10px', right: '10px' }}
                              >
                                {postStatus.label}
                              </Badge>
                              {post.featured && (
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
                              <h6 className="text-white mb-2">{post.title}</h6>
                              {post.excerpt && (
                                <p className="text-light-2 mb-3" style={{ fontSize: '12px' }}>
                                  {post.excerpt.substring(0, 100)}...
                                </p>
                              )}
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <Badge color="primary" pill>{post.category?.title || 'Uncategorized'}</Badge>
                                <small className="text-light-2">
                                  <i className="fa fa-eye mr-1"></i>
                                  {post.views || 0}
                                </small>
                              </div>
                              {post.tags && post.tags.length > 0 && (
                                <div className="mb-3">
                                  {post.tags.slice(0, 3).map((tag, idx) => (
                                    <Badge key={idx} color="secondary" pill className="mr-1" style={{ fontSize: '10px' }}>
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              <div className="d-flex align-items-center mb-3">
                                {post.author?.avatar && (
                                  <img
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    className="rounded-circle mr-2"
                                    style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                                  />
                                )}
                                <small className="text-light-2">
                                  {post.author?.name || 'Unknown'} • {formatDate(post.publishedAt || post.createdAt)}
                                </small>
                              </div>
                              <div className="d-flex justify-content-between gap-2">
                                <Button 
                                  color="primary" 
                                  size="sm" 
                                  className="btn-round"
                                  onClick={() => handleEditPost(post._id)}
                                  title="Edit"
                                >
                                  <i className="fa fa-edit"></i>
                                </Button>
                                <Button 
                                  color={post.featured ? "warning" : "secondary"}
                                  size="sm" 
                                  className="btn-round"
                                  onClick={() => handleToggleFeatured(post._id)}
                                  title="Featured"
                                >
                                  <i className="fa fa-star"></i>
                                </Button>
                                <Button 
                                  color={post.published ? "success" : "warning"}
                                  size="sm" 
                                  className="btn-round"
                                  onClick={() => handleTogglePublished(post._id)}
                                  title="Publish"
                                >
                                  <i className={`fa ${post.published ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i>
                                </Button>
                                <Button 
                                  color="danger" 
                                  size="sm" 
                                  className="btn-round"
                                  onClick={() => confirmDelete(post._id, post)}
                                  title="Delete"
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
                {loading && posts && posts.length > 0 && (
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

export default BlogList;