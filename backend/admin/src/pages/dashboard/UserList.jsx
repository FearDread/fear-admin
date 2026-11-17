import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Input, Button, Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { Message, useToaster } from "rsuite";
import { useSelector, useDispatch } from "react-redux";
import ReactTable from "../../components/ReactTable/ReactTable";
import normalizeCells from "../../components/ReactTable/NormalizeCells";
import Loader from "../../components/Loader/Loading";
import StatCard from "../../components/common/StatCard";
import FormModal from "../../components/Modal/Form";
import ConfirmModal from "../../components/Modal/Confirm";
import { selectUserLoading, selectUserError, selectAllUsers, fetchUsers, createUser, deleteUser, updateUser, clearError, setSearchTerm, selectSearchTerm, selectFilters, setFilters } from "../../features/user/slice.js";

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

const EMPTY_FORM = { firstName: "", lastName: "", email: "", password: "", role: "user", isActive: true };

const MIN_PASSWORD_LENGTH = 8;

// Passed to <FormModal>. `addOnly` fields are left out of the edit form.
const USER_FIELDS = [
    { name: "firstName", label: "First Name", required: true, col: 6, placeholder: "Enter first name..." },
    { name: "lastName", label: "Last Name", col: 6, placeholder: "Enter last name..." },
    { name: "email", label: "Email", type: "email", required: true, placeholder: "Enter email address..." },
    { name: "password", label: "Password", type: "password", required: true, addOnly: true, placeholder: `At least ${MIN_PASSWORD_LENGTH} characters` },
    { name: "role", label: "Role", type: "select", placeholder: "Select role", props: { data: ROLE_OPTIONS, searchable: false, cleanable: false } },
    { name: "isActive", label: "Active Status", type: "toggle", col: 6, props: { checkedChildren: "Active", unCheckedChildren: "Inactive" } },
];
const ADD_USER_FIELDS = USER_FIELDS;
const EDIT_USER_FIELDS = USER_FIELDS.filter((field) => !field.addOnly);

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
    const [showAddModal, setShowAddModal] = useState(false);
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
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedUser(null);
        setFormValue(EMPTY_FORM);
    }, []);

    const handleOpenAddModal = useCallback(() => {
        setSelectedUser(null);
        setFormValue(EMPTY_FORM); // never reuse values left over from an edit
        setShowAddModal(true);
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

    /* ----- Create / update / delete ----- */

    // Shared by create and update. Returns null (after warning the user) when the form is invalid.
    const buildUserData = () => {

        const data = {
            firstName: formValue.firstName?.trim(),
            lastName: formValue.lastName?.trim() || "",
            email: formValue.email?.trim(),
            role: formValue.role,
            isActive: formValue.isActive,
        };
        if (!data.firstName) {
            notify("warning", "First name is required.");
            return null;
        }
        if (!EMAIL_PATTERN.test(data.email || "")) {
            notify("warning", "Enter a valid email address.");
            return null;
        }
        return data;
    };

    // Each handler closes its modal only on success, so a failed request keeps the user's input.
    const handleCreateUser = async () => {
        const data = buildUserData();
        if (!data) return;
        if ((formValue.password || "").length < MIN_PASSWORD_LENGTH) {
            return notify("warning", `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
        }
        try {
            await dispatch(createUser({ ...data, password: formValue.password })).unwrap();
            notify("success", <><strong>Success!</strong> User created successfully.</>);
            resetModals();
            dispatch(fetchUsers());
        } catch (err) {
            console.error("Error creating user:", err);
        }
    };

    // Closes only on success. The old version relied on a `success` flag in an effect, so a flag left
    // over from an earlier fetch could pop a fake "User updated" toast and shut the modal on open.
    const handleUpdateUser = async () => {
        if (!selectedUser) return;
        const data = buildUserData();
        if (!data) return;

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
                                    <Button color="primary" size="sm" onClick={handleOpenAddModal} className="btn-round">
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
                                                <Button color="primary" onClick={handleOpenAddModal} className="btn-round mt-3">
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

            {/* Add user */}
            <FormModal
                open={showAddModal}
                onClose={resetModals}
                onSubmit={handleCreateUser}
                title="Add New User"
                icon="fa-user-plus"
                submitLabel="Create User"
                formValue={formValue}
                onChange={setFormValue}
                fields={ADD_USER_FIELDS}
            />

            {/* Edit user */}
            <FormModal
                open={showEditModal}
                onClose={resetModals}
                onSubmit={handleUpdateUser}
                title="Edit User"
                icon="fa-edit"
                submitLabel="Update User"
                formValue={formValue}
                onChange={setFormValue}
                fields={EDIT_USER_FIELDS}
            />

            {/* Delete confirmation */}
            <ConfirmModal
                open={showDeleteModal}
                onClose={resetModals}
                onConfirm={handleDeleteUser}
                title="Delete User?"
                itemName={selectedUser ? fullNameOf(selectedUser) || selectedUser.email : ""}
            />
        </>
    );
};

export default UsersList;