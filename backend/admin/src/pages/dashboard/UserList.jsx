import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Input,
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
  selectCurrentUser,
  selectUserLoading,
  selectUserError,
  selectUserSuccess,
  selectAllUsers,
  fetchUsers,
  register,
  deleteUser,
  updateUser,
  clearError,
  setSearchTerm,
  setViewMode,
  selectViewMode,
  selectSearchTerm,
  selectFilters,
  setFilters,
} from "../../features/user/slice.js";
import {
  Modal,
  Form,
  Input as RSInput,
  Button as RSButton,
  ButtonToolbar,
  SelectPicker,
  Toggle,
  Message,
  useToaster,
} from "rsuite";
import { CrudFactory } from "../../features/crud.js";

const { Group: FormGroup, Control: FormControl, ControlLabel } = Form;

const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "Moderator", value: "moderator" },
  { label: "User", value: "user" },
];

const UsersList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toaster = useToaster();

  // Redux state
  const error = useSelector(selectUserError);
  const loading = useSelector(selectUserLoading);
  const success = useSelector(selectUserSuccess);
  const users = useSelector(selectAllUsers);
  const searchTerm = useSelector(selectSearchTerm);
  const filters = useSelector(selectFilters);

  // Local state
  const [alert, setAlert] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setLocalViewMode] = useState("list");

  // Edit form state
  const [formValue, setFormValue] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
    isActive: true,
  });

  const USER_STATUS = {
    active: { color: "success", icon: "fa-check-circle", label: "Active" },
    inactive: { color: "danger", icon: "fa-times-circle", label: "Inactive" },
  };

  const columns = useMemo(() => [
    {
      Header: "Avatar",
      accessor: "avatar",
      sortable: false,
      filterable: false,
    },
    { Header: "User", accessor: "title", sortable: true },
    { Header: "Email", accessor: "email", sortable: true },
    { Header: "Role", accessor: "role", sortable: true },
    { Header: "Status", accessor: "status", sortable: true },
    { Header: "Verified", accessor: "verified", sortable: true },
    { Header: "Joined", accessor: "joined", sortable: true },
    {
      Header: "Actions",
      accessor: "actions",
      sortable: false,
      filterable: false,
    },
  ], []);

  useEffect(() => {
    dispatch(fetchUsers()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {};
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show error toasts
  useEffect(() => {
    if (error) {
      toaster.push(
        <Message showIcon type="error" closable>
          <strong>Error!</strong> {error}
        </Message>,
        { placement: "topEnd", duration: 5000 }
      );
      dispatch(clearError());
    }
  }, [error, toaster, dispatch]);

  // Close edit modal on success
  useEffect(() => {
    if (success && showEditModal) {
      toaster.push(
        <Message showIcon type="success" closable>
          <strong>Success!</strong> User updated successfully.
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
      handleCloseEditModal();
      dispatch(fetchUsers());
    }
  }, [success, showEditModal]);

  // ── Modal handlers ────────────────────────────────────────────────────────

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setFormValue({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: user.role || "user",
      isActive: user.isActive !== false,
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      await dispatch(updateUser({ id: selectedUser._id, data: formValue })).unwrap();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await dispatch(deleteUser(selectedUser._id)).unwrap();
      toaster.push(
        <Message showIcon type="success" closable>
          <strong>Deleted!</strong> User removed successfully.
        </Message>,
        { placement: "topEnd", duration: 3000 }
      );
      handleCloseDeleteModal();
      dispatch(fetchUsers());
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleViewUser = (id) => {
    navigate(`/admin/user/view/${id}`);
  };

  // ── Filters ───────────────────────────────────────────────────────────────

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    if (role !== "all") {
      dispatch(setFilters({ ...filters, role }));
    } else {
      dispatch(setFilters({ ...filters, role: null }));
    }
  };

  const getUserStatus = (isActive) => {
    return isActive !== false ? USER_STATUS.active : USER_STATUS.inactive;
  };

  const filteredUsers = useMemo(() => {
    if (!users || users.length === 0) return [];

    return users.filter((user) => {
      if (roleFilter !== "all" && user.role !== roleFilter) return false;

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          user.firstName?.toLowerCase().includes(searchLower) ||
          user.lastName?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.role?.toLowerCase().includes(searchLower) ||
          user._id?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [users, searchTerm, roleFilter]);

  const statistics = useMemo(() => {
    if (!users || users.length === 0) {
      return { totalUsers: 0, active: 0, inactive: 0, verified: 0 };
    }
    return {
      totalUsers: users.length,
      active: users.filter((u) => u.isActive !== false).length,
      inactive: users.filter((u) => u.isActive === false).length,
      verified: users.filter((u) => u.emailVerified === true).length,
    };
  }, [users]);

  const tableData = useMemo(() => {
    return filteredUsers.map((item) => {
      const status = getUserStatus(item.isActive);
      const fullName = `${item.firstName || ""} ${item.lastName || ""}`.trim();

      return {
        avatar: (
          <div className="position-relative">
            {item.avatar ? (
              <img
                src={item.avatar}
                alt={fullName}
                className="rounded-circle"
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  border: "2px solid rgba(255,255,255,0.2)",
                }}
              />
            ) : (
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center"
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: "#1a73e8",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "bold",
                  border: "2px solid rgba(255,255,255,0.2)",
                }}
              >
                {item.firstName?.[0]?.toUpperCase() ||
                  item.email?.[0]?.toUpperCase() ||
                  "?"}
              </div>
            )}
          </div>
        ),
        title: (
          <div className="d-flex flex-column">
            <span className="text-white font-weight-bold">
              {fullName || "N/A"}
            </span>
            {item.username && (
              <small className="text-light-2" style={{ fontSize: "11px" }}>
                @{item.username}
              </small>
            )}
          </div>
        ),
        email: <span className="text-light-1">{item.email}</span>,
        role: (
          <Badge
            color={
              item.role === "admin"
                ? "danger"
                : item.role === "editor"
                ? "warning"
                : "info"
            }
            pill
            className="px-3"
          >
            {item.role?.toUpperCase() || "USER"}
          </Badge>
        ),
        status: (
          <Badge color={status.color} pill className="px-3">
            <i className={`fa ${status.icon} mr-2`}></i>
            {status.label}
          </Badge>
        ),
        verified: (
          <Badge
            color={item.emailVerified ? "success" : "secondary"}
            pill
            className="px-3"
          >
            {item.emailVerified ? (
              <>
                <i className="fa fa-check-circle mr-2"></i>Verified
              </>
            ) : (
              <>
                <i className="fa fa-times-circle mr-2"></i>Unverified
              </>
            )}
          </Badge>
        ),
        joined: (
          <span className="text-light-2">
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        ),
        actions: (
          <div className="d-flex gap-2">
            <Button
              color="info"
              size="sm"
              className="btn-round"
              onClick={() => handleViewUser(item._id)}
              title="View User"
            >
              <i className="fa fa-eye"></i>
            </Button>
            <Button
              color="primary"
              size="sm"
              className="btn-round"
              onClick={() => handleOpenEditModal(item)}
              title="Edit User"
            >
              <i className="fa fa-edit"></i>
            </Button>
            <Button
              color="danger"
              size="sm"
              className="btn-round"
              onClick={() => confirmDelete(item)}
              title="Delete User"
            >
              <i className="fa fa-trash"></i>
            </Button>
          </div>
        ),
      };
    });
  }, [filteredUsers]);

  if (loading && (!users || users.length === 0)) {
    return <Loader />;
  }

  return (
    <>
      <div className="container-fluid">
        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col lg="3" md="6">
            <Card className="card-stats media-object">
              <CardBody>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center circle-1 bg-primary-light2">
                      <i className="fa fa-users text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category text-light-2">Total Users</p>
                      <CardTitle tag="h3" className="text-white">
                        {statistics.totalUsers}
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
                    <div className="icon-big text-center circle-1 bg-warning-light2">
                      <i className="fa fa-times-circle text-warning"></i>
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
                    <div className="icon-big text-center circle-1 bg-info-light2">
                      <i className="fa fa-shield text-info"></i>
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
        </Row>

        <Row>
          <Col md="12">
            <Card className="media-object">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <div>
                  <CardTitle tag="h4" className="mb-0">
                    <i className="fa fa-users mr-2"></i>
                    All Users
                  </CardTitle>
                  <small className="text-light-2">
                    Manage your user accounts
                  </small>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <div className="btn-group mr-2">
                    <Button
                      color={viewMode === "list" ? "info" : "secondary"}
                      size="sm"
                      onClick={() => setLocalViewMode("list")}
                      className="btn-round"
                    >
                      <i className="fa fa-list"></i>
                    </Button>
                    <Button
                      color={viewMode === "grid" ? "info" : "secondary"}
                      size="sm"
                      onClick={() => setLocalViewMode("grid")}
                      className="btn-round"
                    >
                      <i className="fa fa-th"></i>
                    </Button>
                  </div>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => navigate("/admin/user/new")}
                    className="btn-round"
                  >
                    <i className="fa fa-plus mr-2"></i>
                    Add User
                  </Button>
                </div>
              </CardHeader>

              <CardBody>
                {/* Search and Filter */}
                <Row className="mb-4">
                  <Col md="5">
                    <div className="position-relative">
                      <Input
                        type="text"
                        placeholder="Search users, emails..."
                        value={searchTerm}
                        onChange={(e) =>
                          dispatch(setSearchTerm(e.target.value))
                        }
                        className="form-control-rounded"
                        style={{ paddingLeft: "35px" }}
                      />
                      <i
                        className="fa fa-search"
                        style={{
                          position: "absolute",
                          left: "12px",
                          top: "12px",
                          color: "rgba(255,255,255,0.5)",
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
                        {roleFilter === "all"
                          ? "All Roles"
                          : roleFilter.charAt(0).toUpperCase() +
                            roleFilter.slice(1)}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => handleRoleFilter("all")}>
                          All Roles
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem
                          onClick={() => handleRoleFilter("admin")}
                        >
                          Admin
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => handleRoleFilter("editor")}
                        >
                          Editor
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => handleRoleFilter("moderator")}
                        >
                          Moderator
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => handleRoleFilter("user")}
                        >
                          User
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Col>
                  <Col md="4" className="text-right">
                    <div className="d-flex justify-content-end align-items-center gap-2">
                      <span className="text-light-2 small">
                        {filteredUsers.length} results
                      </span>
                      {(searchTerm || roleFilter !== "all") && (
                        <Button
                          color="secondary"
                          size="sm"
                          onClick={() => {
                            dispatch(setSearchTerm(""));
                            setRoleFilter("all");
                            dispatch(setFilters({ role: null }));
                          }}
                        >
                          <i className="fa fa-times mr-2"></i>
                          Clear
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>

                {/* Users Table / Grid */}
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
                      <i
                        className="fa fa-users"
                        style={{ fontSize: "64px", opacity: 0.3 }}
                      ></i>
                      <p className="text-light-2 mt-3">
                        {searchTerm || roleFilter !== "all"
                          ? "No users match your filters"
                          : "No users found. Create your first user!"}
                      </p>
                      {!searchTerm && roleFilter === "all" && (
                        <Button
                          color="primary"
                          onClick={() => navigate("/admin/user/new")}
                          className="btn-round mt-3"
                        >
                          <i className="fa fa-plus mr-2"></i>
                          Create First User
                        </Button>
                      )}
                    </div>
                  )
                ) : (
                  <Row>
                    {filteredUsers.map((user) => {
                      const status = getUserStatus(user.isActive);
                      const fullName =
                        `${user.firstName || ""} ${user.lastName || ""}`.trim();
                      return (
                        <Col md="3" lg="2" key={user._id} className="mb-4">
                          <Card className="product-card h-100">
                            <div className="text-center pt-4">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  className="rounded-circle"
                                  alt={fullName}
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <div
                                  className="rounded-circle d-inline-flex align-items-center justify-content-center"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    backgroundColor: "#1a73e8",
                                    color: "white",
                                    fontSize: "40px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {user.firstName?.[0]?.toUpperCase() ||
                                    user.email?.[0]?.toUpperCase() ||
                                    "?"}
                                </div>
                              )}
                              <Badge
                                color={status.color}
                                className="position-absolute"
                                style={{ top: "10px", right: "10px" }}
                              >
                                {status.label}
                              </Badge>
                            </div>
                            <CardBody>
                              <h6 className="text-white mb-2 text-center">
                                {fullName || "N/A"}
                              </h6>
                              <p className="text-light-2 small text-center mb-2">
                                {user.email}
                              </p>
                              <div className="d-flex justify-content-center align-items-center mb-2">
                                <Badge
                                  color={
                                    user.role === "admin"
                                      ? "danger"
                                      : user.role === "editor"
                                      ? "warning"
                                      : "info"
                                  }
                                  pill
                                >
                                  {user.role?.toUpperCase() || "USER"}
                                </Badge>
                              </div>
                              <div className="text-center mb-3">
                                <Badge
                                  color={
                                    user.emailVerified ? "success" : "secondary"
                                  }
                                  pill
                                >
                                  {user.emailVerified ? "Verified" : "Unverified"}
                                </Badge>
                              </div>
                              <div className="d-flex justify-content-between gap-2">
                                <Button
                                  color="info"
                                  size="sm"
                                  className="btn-round flex-fill"
                                  onClick={() => handleViewUser(user._id)}
                                >
                                  <i className="fa fa-eye"></i>
                                </Button>
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="btn-round flex-fill"
                                  onClick={() => handleOpenEditModal(user)}
                                >
                                  <i className="fa fa-edit"></i>
                                </Button>
                                <Button
                                  color="danger"
                                  size="sm"
                                  className="btn-round flex-fill"
                                  onClick={() => confirmDelete(user)}
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
                {loading && users && users.length > 0 && (
                  <div
                    className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{
                      top: 0,
                      left: 0,
                      background: "rgba(0,0,0,0.5)",
                      zIndex: 999,
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

      {/* ── Edit User Modal ─────────────────────────────────────────────────── */}
      <Modal
        open={showEditModal}
        onClose={handleCloseEditModal}
        size="md"
        className="rs-theme-dark"
      >
        <Modal.Header>
          <Modal.Title>
            <i className="fa fa-edit mr-2"></i>
            Edit User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid formValue={formValue} onChange={setFormValue}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <ControlLabel>First Name *</ControlLabel>
                  <FormControl
                    name="firstName"
                    placeholder="Enter first name..."
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <ControlLabel>Last Name</ControlLabel>
                  <FormControl
                    name="lastName"
                    placeholder="Enter last name..."
                  />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <ControlLabel>Email *</ControlLabel>
              <FormControl
                name="email"
                type="email"
                placeholder="Enter email address..."
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Role</ControlLabel>
              <FormControl
                name="role"
                accepter={SelectPicker}
                data={ROLE_OPTIONS}
                block
                placeholder="Select role"
                searchable={false}
                cleanable={false}
              />
            </FormGroup>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <ControlLabel>Active Status</ControlLabel>
                  <div className="mt-2">
                    <Toggle
                      checked={formValue.isActive}
                      onChange={(checked) =>
                        setFormValue({ ...formValue, isActive: checked })
                      }
                      checkedChildren="Active"
                      unCheckedChildren="Inactive"
                    />
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <RSButton onClick={handleUpdateUser} appearance="primary">
            <i className="fa fa-check mr-2"></i>
            Update User
          </RSButton>
          <RSButton onClick={handleCloseEditModal} appearance="subtle">
            Cancel
          </RSButton>
        </Modal.Footer>
      </Modal>

      {/* ── Delete Confirmation Modal ────────────────────────────────────────── */}
      <Modal
        open={showDeleteModal}
        onClose={handleCloseDeleteModal}
        size="xs"
        className="rs-theme-dark"
      >
        <Modal.Header>
          <Modal.Title>
            <i className="fa fa-exclamation-triangle mr-2 text-danger"></i>
            Delete User?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            Are you sure you want to delete "
            <strong style={{ color: "white" }}>
              {selectedUser
                ? `${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`.trim() ||
                  selectedUser.email
                : ""}
            </strong>
            "? This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <RSButton
            onClick={handleDeleteUser}
            appearance="primary"
            color="red"
          >
            <i className="fa fa-trash mr-2"></i>
            Yes, Delete It
          </RSButton>
          <RSButton onClick={handleCloseDeleteModal} appearance="subtle">
            Cancel
          </RSButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsersList;