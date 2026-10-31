import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Input, Button, Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { Modal, Form, Button as RSButton, SelectPicker, Toggle, Message, useToaster } from "rsuite";
import { useSelector, useDispatch } from "react-redux";
import ReactTable from "../../components/ReactTable/ReactTable";
import normalizeCells from "../../components/ReactTable/NormalizeCells";
import Loader from "../../components/Loader/Loading";
import StatCard from "../../components/common/StatCard";
import { selectUserLoading, selectUserError, selectAllUsers, fetchUsers, deleteUser, updateUser, clearError, setSearchTerm, selectSearchTerm, selectFilters, setFilters } from "../../features/user/slice.js";

const { Group: FormGroup, Control: FormControl, ControlLabel } = Form;

/* -------------------------------------------------------------------------
   Constants + helpers (outside the component so they are not rebuilt on render)
   ---------------------------------------------------------------------- */

const ROLE_OPTIONS = [
    { label: "Admin", value: "admin" },
    { label: "Editor", value: "editor" },
    { label: "Moderator", value: "moderator" },
    { label: "User", value: "user" },
];

const ROLE_COLORS = { admin: "danger", editor: "warning", moderator: "primary", user: "info" };

const USER_STATUS = {
    active: { color: "success", icon: "fa-check-circle", label: "Active" },
    inactive: { color: "danger", icon: "fa-times-circle", label: "Inactive" },
};

const EMPTY_FORM = { firstName: "", lastName: "", email: "", role: "user", isActive: true };

const GAP = { gap: 8 }; // Bootstrap 4 has no `gap-*` utilities

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const fullNameOf = (user) => `${user.firstName || ""} ${user.lastName || ""}`.trim();
const isUserActive = (user) => user.isActive !== false;
const getUserStatus = (user) => (isUserActive(user) ? USER_STATUS.active : USER_STATUS.inactive);
const roleOf = (user) => user.role || "user";
const avatarUrlOf = (user) => (user.avatar && typeof user.avatar === "object" ? user.avatar.url : user.avatar) || null;
const initialOf = (user) => user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?";
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const toTime = (value) => {
    const date = value ? new Date(value) : null;
    return date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
};
const formatJoined = (time) => (time ? new Date(time).toLocaleDateString() : "N/A");

// react-table v6 filters by exact match unless told otherwise
const includesFilter = (filter, row) => String(row[filter.id] ?? "").toLowerCase().includes(String(filter.value).toLowerCase());
const startsWithFilter = (filter, row) => String(row[filter.id] ?? "").toLowerCase().startsWith(String(filter.value).toLowerCase());
// The Joined column sorts on a timestamp but is searched by its displayed date
const joinedFilter = (filter, row) => formatJoined(row._original?.joined ?? row.joined).toLowerCase().includes(String(filter.value).toLowerCase());

/** Round avatar: the photo when there is one, otherwise the user's initial. */
const Avatar = ({ user, size = 50 }) => {
    const url = avatarUrlOf(user);
    const common = { width: size, height: size, border: "2px solid rgba(255,255,255,0.2)" };
    return url ? (
        <img src={url} alt={fullNameOf(user) || user.email} className="rounded-circle" style={{ ...common, objectFit: "cover" }} />
    ) : (
        <div className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{ ...common, backgroundColor: "var(--accent, #1a73e8)", color: "white", fontSize: size * 0.36, fontWeight: "bold" }}>
            {initialOf(user)}
        </div>
    );
};

/* -------------------------------------------------------------------------
   Page
   ---------------------------------------------------------------------- */

const UsersList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toaster = useToaster();

    // Redux state
    const error = useSelector(selectUserError);
    const loading = useSelector(selectUserLoading);
    const users = useSelector(selectAllUsers);
    const searchTerm = useSelector(selectSearchTerm);
    const filters = useSelector(selectFilters);

    // Local state
    const [roleFilter, setRoleFilter] = useState("all");
    const [viewMode, setViewMode] = useState("list");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formValue, setFormValue] = useState(EMPTY_FORM);

    const notify = useCallback(
        (type, content, placement = "topEnd") =>
            toaster.push(<Message showIcon type={type} closable>{content}</Message>, { placement, duration: 4000 }),
        [toaster]
    );

    // Initial load. Failures land in the slice's `error` state, which the effect below reports.
    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            notify("error", <><strong>Error!</strong> {error}</>);
            dispatch(clearError());
        }
    }, [error, notify, dispatch]);

    /* ----- Modal handlers ----- */

    const resetModals = useCallback(() => {
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedUser(null);
        setFormValue(EMPTY_FORM);
    }, []);

    const handleOpenEditModal = useCallback((user) => {
        setSelectedUser(user);
        setFormValue({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            role: roleOf(user),
            isActive: isUserActive(user),
        });
        setShowEditModal(true);
    }, []);

    const confirmDelete = useCallback((user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    }, []);

    const handleViewUser = useCallback((id) => navigate(`/admin/user/view/${id}`), [navigate]);

    /* ----- Update / delete ----- */

    // Closes only on success. The old version relied on a `success` flag in an effect, so a flag left
    // over from an earlier fetch could pop a fake "User updated" toast and shut the modal on open.
    const handleUpdateUser = async () => {
        if (!selectedUser) return;
        const data = {
            firstName: formValue.firstName?.trim(),
            lastName: formValue.lastName?.trim() || "",
            email: formValue.email?.trim(),
            role: formValue.role,
            isActive: formValue.isActive,
        };
        if (!data.firstName) return notify("warning", "First name is required.");
        if (!EMAIL_PATTERN.test(data.email || "")) return notify("warning", "Enter a valid email address.");

        try {
            await dispatch(updateUser({ id: selectedUser._id, data })).unwrap();
            notify("success", <><strong>Success!</strong> User updated successfully.</>);
            resetModals();
            dispatch(fetchUsers());
        } catch (err) {
            console.error("Error updating user:", err);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        try {
            await dispatch(deleteUser({ id: selectedUser._id })).unwrap();
            notify("success", <><strong>Deleted!</strong> User removed successfully.</>);
            resetModals();
            dispatch(fetchUsers());
        } catch (err) {
            console.error("Error deleting user:", err);
        }
    };

    /* ----- Filters ----- */

    const handleRoleFilter = (role) => {
        setRoleFilter(role);
        dispatch(setFilters({ ...filters, role: role === "all" ? null : role }));
    };

    const handleClearFilters = () => {
        dispatch(setSearchTerm(""));
        setRoleFilter("all");
        dispatch(setFilters({ ...filters, role: null })); // keep any other filters intact
    };

    /* ----- Derived data ----- */

    const filteredUsers = useMemo(() => {
        const term = searchTerm?.toLowerCase();
        return (users || []).filter((user) => {
            if (roleFilter !== "all" && roleOf(user) !== roleFilter) return false;
            if (!term) return true;
            return [user.firstName, user.lastName, user.email, user.role, user.username, user._id].some((field) => field?.toLowerCase().includes(term));
        });
    }, [users, searchTerm, roleFilter]);

    const statistics = useMemo(() => {
        const list = users || [];
        const active = list.filter(isUserActive).length;
        return { total: list.length, active, inactive: list.length - active, verified: list.filter((u) => u.emailVerified === true).length };
    }, [users]);

    /* ----- Table ----- */

    // Plain values here so ReactTable can sort and filter them; JSX lives in each column's Cell.
    const tableData = useMemo(
        () =>
            filteredUsers.map((user) => {
                const joined = toTime(user.createdAt);
                return {
                    id: user._id,
                    user,
                    fullName: fullNameOf(user) || "N/A",
                    username: user.username || "",
                    email: user.email || "",
                    role: roleOf(user),
                    status: getUserStatus(user).label,
                    verified: user.emailVerified ? "Verified" : "Unverified",
                    joined,
                };
            }),
        [filteredUsers]
    );

    const columns = useMemo(
        () => normalizeCells([
            {
                Header: "Avatar",
                id: "avatar",
                accessor: "id",
                sortable: false,
                filterable: false,
                width: 90,
                Cell: ({ original }) => <Avatar user={original.user} />,
            },
            {
                Header: "User",
                accessor: "fullName",
                filterMethod: includesFilter,
                Cell: ({ original }) => (
                    <div className="d-flex flex-column">
                        <span className="text-white font-weight-bold">{original.fullName}</span>
                        {original.username && <small className="text-light-2" style={{ fontSize: 11 }}>@{original.username}</small>}
                    </div>
                ),
            },
            {
                Header: "Email",
                accessor: "email",
                filterMethod: includesFilter,
                Cell: ({ value }) => <span className="text-light-1">{value}</span>,
            },
            {
                Header: "Role",
                accessor: "role",
                filterMethod: includesFilter,
                Cell: ({ value }) => <Badge color={ROLE_COLORS[value] || "info"} pill className="px-3">{value.toUpperCase()}</Badge>,
            },
            {
                Header: "Status",
                accessor: "status",
                filterMethod: startsWithFilter,
                Cell: ({ original }) => {
                    const status = getUserStatus(original.user);
                    return (
                        <Badge color={status.color} pill className="px-3">
                            <i className={`fa ${status.icon} mr-2`} aria-hidden="true"></i>
                            {status.label}
                        </Badge>
                    );
                },
            },
            {
                Header: "Verified",
                accessor: "verified",
                filterMethod: startsWithFilter,
                Cell: ({ value }) => (
                    <Badge color={value === "Verified" ? "success" : "secondary"} pill className="px-3">
                        <i className={`fa ${value === "Verified" ? "fa-check-circle" : "fa-times-circle"} mr-2`} aria-hidden="true"></i>
                        {value}
                    </Badge>
                ),
            },
            {
                Header: "Joined",
                accessor: "joined",
                filterMethod: joinedFilter,
                Cell: ({ value }) => <span className="text-light-2">{formatJoined(value)}</span>,
            },
            {
                Header: "Actions",
                id: "actions",
                accessor: (row) => row.user,
                sortable: false,
                filterable: false,
                Cell: ({ value: user }) => (
                    <div className="d-flex" style={GAP}>
                        <Button color="info" size="sm" className="btn-round" title="View user" aria-label={`View ${fullNameOf(user) || user.email}`} onClick={() => handleViewUser(user._id)}>
                            <i className="fa fa-eye" aria-hidden="true"></i>
                        </Button>
                        <Button color="primary" size="sm" className="btn-round" title="Edit user" aria-label={`Edit ${fullNameOf(user) || user.email}`} onClick={() => handleOpenEditModal(user)}>
                            <i className="fa fa-edit" aria-hidden="true"></i>
                        </Button>
                        <Button color="danger" size="sm" className="btn-round" title="Delete user" aria-label={`Delete ${fullNameOf(user) || user.email}`} onClick={() => confirmDelete(user)}>
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </Button>
                    </div>
                ),
            },
        ]),
        [handleViewUser, handleOpenEditModal, confirmDelete]
    );

    // Show loader only on the very first fetch
    if (loading && (!users || users.length === 0)) {
        return <Loader />;
    }

    const hasFilters = Boolean(searchTerm) || roleFilter !== "all";

    return (
        <>
            <div className="container-fluid">
                <Row className="mb-4">
                    <StatCard icon="fa-users" tone="primary" label="Total Users" value={statistics.total} />
                    <StatCard icon="fa-check-circle" tone="success" label="Active" value={statistics.active} />
                    <StatCard icon="fa-times-circle" tone="warning" label="Inactive" value={statistics.inactive} />
                    <StatCard icon="fa-shield" tone="info" label="Verified" value={statistics.verified} />
                </Row>

                <Row>
                    <Col md="12">
                        <Card className="media-object">
                            <CardHeader className="d-flex justify-content-between align-items-center">
                                <div>
                                    <CardTitle tag="h4" className="mb-0">
                                        <i className="fa fa-users mr-2" aria-hidden="true"></i>
                                        All Users
                                    </CardTitle>
                                    <small className="text-light-2">Manage your user accounts</small>
                                </div>
                                <div className="d-flex align-items-center" style={GAP}>
                                    <div className="btn-group mr-2">
                                        <Button color={viewMode === "list" ? "info" : "secondary"} size="sm" onClick={() => setViewMode("list")} className="btn-round" aria-label="List view">
                                            <i className="fa fa-list" aria-hidden="true"></i>
                                        </Button>
                                        <Button color={viewMode === "grid" ? "info" : "secondary"} size="sm" onClick={() => setViewMode("grid")} className="btn-round" aria-label="Grid view">
                                            <i className="fa fa-th" aria-hidden="true"></i>
                                        </Button>
                                    </div>
                                    <Button color="primary" size="sm" onClick={() => navigate("/admin/user/new")} className="btn-round">
                                        <i className="fa fa-plus mr-2" aria-hidden="true"></i>
                                        Add User
                                    </Button>
                                </div>
                            </CardHeader>

                            {/* position-relative so the loading overlay covers this card, not the page */}
                            <CardBody className="position-relative">
                                {/* Search and filter */}
                                <Row className="mb-4">
                                    <Col md="5">
                                        <div className="position-relative">
                                            <Input
                                                type="text"
                                                placeholder="Search users, emails..."
                                                value={searchTerm || ""}
                                                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                                                style={{ paddingLeft: 35 }}
                                                aria-label="Search users"
                                            />
                                            <i className="fa fa-search" aria-hidden="true" style={{ position: "absolute", left: 12, top: 12, color: "rgba(255,255,255,0.5)" }}></i>
                                        </div>
                                    </Col>
                                    <Col md="3">
                                        <UncontrolledDropdown>
                                            <DropdownToggle caret color="light" className="w-100 text-left">
                                                <i className="fa fa-filter mr-2" aria-hidden="true"></i>
                                                {roleFilter === "all" ? "All Roles" : capitalize(roleFilter)}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem onClick={() => handleRoleFilter("all")}>All Roles</DropdownItem>
                                                <DropdownItem divider />
                                                {ROLE_OPTIONS.map((option) => (
                                                    <DropdownItem key={option.value} onClick={() => handleRoleFilter(option.value)}>{option.label}</DropdownItem>
                                                ))}
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </Col>
                                    <Col md="4" className="text-right">
                                        <div className="d-flex justify-content-end align-items-center" style={GAP}>
                                            <span className="text-light-2 small">{filteredUsers.length} results</span>
                                            {hasFilters && (
                                                <Button color="secondary" size="sm" onClick={handleClearFilters}>
                                                    <i className="fa fa-times mr-2" aria-hidden="true"></i>
                                                    Clear
                                                </Button>
                                            )}
                                        </div>
                                    </Col>
                                </Row>

                                {/* Table or grid */}
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
                                                showPaginationBottom
                                                className="-striped -highlight"
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center py-5">
                                            <i className="fa fa-users" aria-hidden="true" style={{ fontSize: 64, opacity: 0.3 }}></i>
                                            <p className="text-light-2 mt-3">{hasFilters ? "No users match your filters" : "No users found. Create your first user!"}</p>
                                            {!hasFilters && (
                                                <Button color="primary" onClick={() => navigate("/admin/user/new")} className="btn-round mt-3">
                                                    <i className="fa fa-plus mr-2" aria-hidden="true"></i>
                                                    Create First User
                                                </Button>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    <Row>
                                        {filteredUsers.map((user) => {
                                            const status = getUserStatus(user);
                                            return (
                                                <Col md="3" lg="2" key={user._id} className="mb-4">
                                                    <Card className="product-card h-100">
                                                        <div className="position-relative text-center pt-4">
                                                            <Avatar user={user} size={100} />
                                                            <Badge color={status.color} className="position-absolute" style={{ top: 10, right: 10 }}>{status.label}</Badge>
                                                        </div>
                                                        <CardBody>
                                                            <h6 className="text-white mb-2 text-center">{fullNameOf(user) || "N/A"}</h6>
                                                            <p className="text-light-2 small text-center mb-2">{user.email}</p>
                                                            <div className="d-flex justify-content-center align-items-center mb-2">
                                                                <Badge color={ROLE_COLORS[roleOf(user)] || "info"} pill>{roleOf(user).toUpperCase()}</Badge>
                                                            </div>
                                                            <div className="text-center mb-3">
                                                                <Badge color={user.emailVerified ? "success" : "secondary"} pill>{user.emailVerified ? "Verified" : "Unverified"}</Badge>
                                                            </div>
                                                            <div className="d-flex justify-content-between" style={GAP}>
                                                                <Button color="info" size="sm" className="btn-round flex-fill" aria-label={`View ${fullNameOf(user) || user.email}`} onClick={() => handleViewUser(user._id)}>
                                                                    <i className="fa fa-eye" aria-hidden="true"></i>
                                                                </Button>
                                                                <Button color="primary" size="sm" className="btn-round flex-fill" aria-label={`Edit ${fullNameOf(user) || user.email}`} onClick={() => handleOpenEditModal(user)}>
                                                                    <i className="fa fa-edit" aria-hidden="true"></i>
                                                                </Button>
                                                                <Button color="danger" size="sm" className="btn-round flex-fill" aria-label={`Delete ${fullNameOf(user) || user.email}`} onClick={() => confirmDelete(user)}>
                                                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                                                </Button>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                )}

                                {/* Loading overlay for refetches */}
                                {loading && users && users.length > 0 && (
                                    <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center" style={{ top: 0, left: 0, background: "rgba(0,0,0,0.5)", zIndex: 999 }}>
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

            {/* Edit user */}
            <Modal open={showEditModal} onClose={resetModals} size="md" className="rs-theme-dark">
                <Modal.Header>
                    <Modal.Title>
                        <i className="fa fa-edit mr-2" aria-hidden="true"></i>
                        Edit User
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid formValue={formValue} onChange={setFormValue}>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <ControlLabel>First Name *</ControlLabel>
                                    <FormControl name="firstName" placeholder="Enter first name..." />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <ControlLabel>Last Name</ControlLabel>
                                    <FormControl name="lastName" placeholder="Enter last name..." />
                                </FormGroup>
                            </Col>
                        </Row>
                        <FormGroup>
                            <ControlLabel>Email *</ControlLabel>
                            <FormControl name="email" type="email" placeholder="Enter email address..." />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Role</ControlLabel>
                            <FormControl name="role" accepter={SelectPicker} data={ROLE_OPTIONS} block placeholder="Select role" searchable={false} cleanable={false} />
                        </FormGroup>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <ControlLabel>Active Status</ControlLabel>
                                    <div className="mt-2">
                                        <Toggle checked={formValue.isActive} onChange={(checked) => setFormValue((prev) => ({ ...prev, isActive: checked }))} checkedChildren="Active" unCheckedChildren="Inactive" />
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <RSButton onClick={handleUpdateUser} appearance="primary">
                        <i className="fa fa-check mr-2" aria-hidden="true"></i>
                        Update User
                    </RSButton>
                    <RSButton onClick={resetModals} appearance="subtle">Cancel</RSButton>
                </Modal.Footer>
            </Modal>

            {/* Delete confirmation */}
            <Modal open={showDeleteModal} onClose={resetModals} size="xs" className="rs-theme-dark">
                <Modal.Header>
                    <Modal.Title>
                        <i className="fa fa-exclamation-triangle mr-2 text-danger" aria-hidden="true"></i>
                        Delete User?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ color: "rgba(255,255,255,0.7)" }}>
                        Are you sure you want to delete &quot;<strong style={{ color: "white" }}>{selectedUser ? fullNameOf(selectedUser) || selectedUser.email : ""}</strong>&quot;? This action cannot be undone.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <RSButton onClick={handleDeleteUser} appearance="primary" color="red">
                        <i className="fa fa-trash mr-2" aria-hidden="true"></i>
                        Yes, Delete It
                    </RSButton>
                    <RSButton onClick={resetModals} appearance="subtle">Cancel</RSButton>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UsersList;